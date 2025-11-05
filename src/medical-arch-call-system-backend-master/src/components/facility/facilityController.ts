import { AppStringEng, AppStringJapan } from "../../utils/appStrings";
import { Request, Response } from "express";
import commonUtils, { deleteSingleFile, deleteMultipleFile } from "../../utils/commonUtils";
import Auth from "../../auth";
import aes from "../../utils/aes";
import redisClient from "../../utils/redisHelper";
import eventEmitter from "../../utils/event";
import { AppConstants } from "../../utils/appConstants";
import { unique } from "agenda/dist/job/unique";
const moment = require('moment');
const Role = require("../role/roleModel");
const User = require('../users/userModel');
const Facility = require('../facility/facilityModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require("config");
const mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const _ = require("underscore")
const lodash = require("lodash")
const Token = require("../common/tokenModel");
const crypto = require("crypto");

async function userExist(userId: any) {
   return new Promise(async (resolve, reject) => {
      let user = await Facility.findById(userId);
      user ? resolve(user) : resolve(false);
   })
}


const sendVerifyEmail = async (username: string, credential: any, median: string, message: any, otp: any, uniqeId: any, host: any) => {
   try {
      if (median == "mobile") {
         eventEmitter.emit("send_mobile_otp", { subject: message, from: "Medical Arch", to: credential })
      }
      else if (median == "email") {

         eventEmitter.emit("send_email_otp", {
            username: username,
            to: credential,
            subject: message,
            data: {
               otp: otp,
               uniqeId: uniqeId,
               message: "Your email has been verified!"
            },
            sender: config.MAIL_SENDER_NO_REPLY,
            host: host
         });
      }
      else {
         return [null, 'not valid type']
      }
   }
   catch (err: any) {
      console.log("send verify otp : ", err)
   }
}

async function resend(req: Request, res: Response) {
   try {
      let lang = req.headers.lang ?? "en";

      let otp = Number((Math.random() * (999999 - 100000) + 100000).toFixed());
      const { token, reason } = req.body;

      if (!['forSignUp', 'forForgetPassword', 'forChange'].includes(reason)) return commonUtils.sendError(req, res, { message: "reason is invalid." }, 409);
      if (reason == "forSignUp") {

         return await getJWTOken(req, res, otp);
      }
      let token_: any = {};
      if (reason == "forForgetPassword") {
         token_ = await Token.findOne({ token: token });
         token_.otp = otp;
         token_.save();
      }
      let host = req.headers.host;

      if (!token_) return commonUtils.sendError(req, res, { message: "Token is Invalid" }, 409);

      const user = await Facility.findOne({ _id: token_.userId });
      if (!user) return commonUtils.sendError(req, res, { message: "user not exist!" }, 409);

      const email = (reason === "forChange" ? token_.email : user.email);
      // const mobile = (reason === "forChange" ? token_.mobile : user.mobile);
      let reason_text = "";
      if (reason == "forForgetPassword") {
         reason_text = "forgot password";
      } 
      if (email) {
         await sendVerifyOTP(user.name, user._id, email, "email", reason, "Email Verification - Medical Arch", "Dear User, Your Medical Arch " + reason_text + " verification otp is " + otp + " Please do not share the otp or your email with anyone including Medical Arch personnel.", host, otp,lang);
         return commonUtils.sendSuccess(req, res, { message: "check your email for otp.", token: token_.token, otp: otp });
      }
   }
   catch (err: any) {
      console.log(err)
      return commonUtils.sendSuccess(req, res, { message: err.message }, 409);
   }
}
async function getJWTOken(req: any, res: any, otp: any) {
   let lang = req.headers.lang ?? "en";
   let tokens_ = req.headers?.authorization?.split(' ') ?? []
   // console.log(tokens_)
   if (tokens_.length <= 1) {
      return commonUtils.sendError(req, res, { message: AppStringEng.INVALID_TOKEN }, 409);
   }
   const token = tokens_[1];
   await new Promise((resolve, reject) => {

      jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
         if (err) {
            console.log('err', err)
            if (err.name == "TokenExpiredError") {
               return commonUtils.sendError(req, res, { message: AppStringEng.TOKEN_EXPIRED }, 409);
            } else {
               return commonUtils.sendError(req, res, { message: AppStringEng.INVALID_SESSION }, 409);
            }
         } else {
            let midLayer = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))
            var userData = JSON.parse(aes.decrypt(midLayer.toString(), config.get("OUTER_KEY_USER")));
            let tokens: [] = await redisClient.lrange(midLayer.toString(), 0, -1)
            let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())
            // remove the refresh token
            await redisClient.lrem(midLayer.toString(), 1, await redisClient.lindex(midLayer.toString(), index));
            // blacklist current access token
            await redisClient.lpush('BL_' + midLayer.toString(), token);
            userData.otp = otp;
            var userDataObj = userData.userData;
            var response_ = await Auth.register(userDataObj, "user", otp);
            let host = req.headers.host;
            await sendVerifyEmail(userDataObj?.name, userDataObj.email, "email", lang == "en" ? AppStringEng.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringEng.DO_NOT_SHARE_OTP_MSG2 : AppStringJapan.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringJapan.DO_NOT_SHARE_OTP_MSG2, otp, userDataObj?.uniqueId, host);
            return commonUtils.sendSuccess(req, res, { token: response_?.accessToken, otp: otp }, 200);
         }
      })
   }).then((userObj: any) => {
      req.headers.userid = userObj.userid;
      req.headers.usertype = userObj.usertype;
      //next();
   }).catch((err: any) => {
      return commonUtils.sendError(req, res, { message: err }, 401);
   })
}
async function login(req: Request, res: Response) {
   let lang = req.headers.lang ?? "en";
   
   let { email, password } = req.body;
   if (!email) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.EMAIL_MOBILE_REQUIRED : AppStringJapan.EMAIL_MOBILE_REQUIRED }, 400);
   
   var admin = await Facility.findOne({ email: email });
   if (!admin) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.USER_CREDENTIAL_DOES_NOT_MATCH : AppStringJapan.USER_CREDENTIAL_DOES_NOT_MATCH }, 409);
   // if (!admin.status) return commonUtils.sendAdminError(req, res, { message: lang == "en" ? AppStringEng.ACCOUNT_INACTIVE : AppStringJapan.ACCOUNT_INACTIVE }, 400);
   if (!admin.status && (admin.terminationDate && new Date(admin.terminationDate) < new Date())) {
      return commonUtils.sendError(req, res, { message: AppStringJapan.ACCOUNT_INACTIVE }, 409);
   }
   if (!admin.allowLogin) return commonUtils.sendAdminError(req, res, { message: lang == "en" ? AppStringEng.NOT_ALLOWED : AppStringJapan.NOT_ALLOWED }, 400);

   var valid_password = await bcrypt.compare(password, admin.password);
   if (!valid_password) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return commonUtils.sendError(req, res, { message: AppStringEng.INVALID_PASSWORD }, 409);
   }
   
   var response_ = await Auth.login(admin._id, admin.adminrole, admin.createdAt);
   await Facility.findByIdAndUpdate(admin._id, { $set: { lastLogin: new Date() } }).exec();

   res.cookie("accessToken", response_.accessToken, { maxAge: 900000, httpOnly: true });
   res.cookie("refreshToken", response_.refreshToken, { maxAge: 900000, httpOnly: true });
   var responseObject = {

      name: admin.name,
      email: admin.email,
      user: admin,
      accessToken: response_.accessToken,
      refreshToken: response_.refreshToken
   }

   return commonUtils.sendSuccess(req, res, responseObject);
}
const logout = async (req: any, res: Response) => {
   let lang = req.headers.lang ?? "en";
   const tokens_ = req.headers?.authorization?.split(' ') ?? []
   if (tokens_.length <= 1) {
      return commonUtils.sendError(req, res, { message: AppStringEng.INVALID_TOKEN }, 401);
   }
   const token = tokens_[1];

   jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
      if (err) {
         return commonUtils.sendError(req, res, { message: AppStringEng.INVALID_TOKEN }, 401);
      } else {
         const uniqueUserKey = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))
         let tokens: [] = await redisClient.lrange(uniqueUserKey.toString(), 0, -1)
         let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())
         // remove the refresh token
         await redisClient.lrem(uniqueUserKey.toString(), 1, await redisClient.lindex(uniqueUserKey.toString(), index));
         // blacklist current access token
         await redisClient.lpush('BL_' + uniqueUserKey.toString(), token);
         
         return commonUtils.sendSuccess(req, res, {message:lang == "en" ? AppStringEng.LOGOUT_SUCCESS : AppStringJapan.LOGOUT_SUCCESS}, 200);
      }
   })
}
const updateProfile = async (req: any, res: Response) => {
   let lang = req.headers.lang ?? "en";

   var user_id = req.headers.userid;
   let { name, email, mobile, yomi, frigana, address, contract, profilePic, license } = req.body;
   var user: any = await userExist(user_id)
   if (!user) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.USER_NOT_FOUND : AppStringJapan.USER_NOT_FOUND }, 409);
   user.name = name || user.name;
   user.email = email || user.email;
   user.mobile = mobile || user.mobile;
   user.yomi = yomi || user.yomi;
   user.address = address || user.address;

   if (contract && user.contract && contract != user.contract) {
      await deleteSingleFile(user.contract, AppConstants.CONTRACT_PATH)
      user.contract = contract
   }
   if (profilePic && user.profilePic && profilePic != user.profilePic) {
      await deleteSingleFile(user.profilePic, AppConstants.PROFILE_PATH)
      user.profilePic = profilePic
   }
   if (license && user.license && license != user.license) {
      await deleteSingleFile(user.license, AppConstants.LICENSE_PATH)
      user.license = license
   }

   await user.save();
   return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.PROFILE_UPDATED : AppStringJapan.PROFILE_UPDATED }, 200);
}
async function getProfile(req: Request, res: Response) {
   try {
      let _id: any = req.headers.userid;
      if (!_id) return commonUtils.sendError(req, res, { message: "Please login" }, 409);
      let userId = req.query.userId;
      if (userId) {
         _id = userId
      }
      const adminExist = await Facility.aggregate([
         { $match: { _id: mongoose.Types.ObjectId(_id) } },
         {
            $lookup: {
               from: "roles",
               localField: "role",
               foreignField: "_id",
               as: "role_data"
            }
         },
         {
            $lookup: {
               from: "facilities",
               localField: "affiliatedFacility",
               foreignField: "_id",
               as: "affiliatedFacility_data"
            }
         },
         { $unwind: { path: "$role_data", preserveNullAndEmptyArrays: true } },
         {
            $lookup: {
               from: 'plans',
               localField: 'plan',
               foreignField: '_id',
               as: 'plan_data'
            }
         },
         { $unwind: { path: "$plan_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$affiliatedFacility_data", preserveNullAndEmptyArrays: true } },
         {
            $project: {
               _id: 1,
               uniqeId: 1,
               name: 1,
               email: 1,
               address: 1,
               mobile: 1,
               profilePic: 1,
               managerName: 1,
               facilityManagerName: 1,
               contractDetails: 1,
               contract: 1,
               capacity: 1,
               license: 1,
               businessType: 1,
               plan: 1,
               amount:1,
               cost:1,affiliatedFacility:1,memoForFacility:1,memoForStaff:1,
               yomi: 1,
               frigana: 1,
               role_data: {
                  _id: 1,
                  name: 1
               },
               affiliatedFacility_data:{
                  name:1
               },
               status: 1,
               createdAt: 1,
               plan_data:1
            }
         }
      ]);
      if (!adminExist) return commonUtils.sendError(req, res, { message: "User not exist" }, 409);
      return commonUtils.sendSuccess(req, res, adminExist[0], 200)
   }
   catch (err: any) {
      console.log(err)
      return commonUtils.sendError(req, res, { message: err.message }, 409);
   }
}
function generatePassword() {
   var length = 12,
      charset = "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
      password = "";
   for (var i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
   }
   return password;
}

/* Forget password */

const sendVerifyOTP = async (username: string, userId: any, credential: any, device: any, median: string, reason: any, subject: any, host: any, otp: any,lang:any) => {
   try {
      //console.log(median)
      if (!otp) {

         otp = Number((Math.random() * (999999 - 100000) + 100000).toFixed());
      }
      if (median == "mobile") {
         // eventEmitter.emit("send_mobile_otp", { to: credential })
      }
      else if (median == "email") {

         eventEmitter.emit("send_email_otp", {
            user_name: username,
            to: credential,
            subject: subject,
            data: {
               otp: otp,
               message: lang == "en" ? AppStringEng.EMAIL_VERIFIED  :AppStringJapan.EMAIL_VERIFIED
            },
            sender: config.MAIL_USER,
            host: host
         });
      }
      else {
         return [null, 'not valid type']
      }

      // let resetToken = crypto.randomBytes(64).toString("hex");
      // resetToken = await generateUniqueToken(resetToken);
      // const hash_ = await bcrypt.hash(resetToken, Number(config.get('saltRounds')))
      // await Token.deleteOne({ userId });
      // const tokenData = new Token({
      //    userId: userId,
      //    otp: otp,
      //    token: hash_,
      //    device: device,
      //    reason: reason ? reason : "forSignUp"
      // });
      // await tokenData.save();

   }
   catch (err: any) {
      console.log("send verify otp : ", err)
   }
}

async function getOtp(req: Request, res: Response) {
   try {
      let lang = req.headers.lang ?? "en";
      let { email, mobile, uniqueId }: any = req.body;

      let otp = Number(Math.random() * (999999 - 100000) + 100000).toFixed();
      let host = req.headers.host;
      let query: any = {};
      if (email) {
         query.email = email;
         query.uniqeId = uniqueId;
      } else {
         query.mobile = mobile;
         query.uniqeId = uniqueId;
      }
      var userExist = await Facility.findOne(query);
      if (!userExist) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.FACILITY_NOT_EXISTS : AppStringJapan.FACILITY_NOT_EXISTS });

      let resetToken = crypto.randomBytes(64).toString("hex");
      resetToken = await generateUniqueToken(resetToken);
      const hash_ = await bcrypt.hash(resetToken, Number(config.get('saltRounds')))

      await Token.deleteOne({ userId: new mongoose.Types.ObjectId(userExist._id) });
      var d = new Date();
      d.setSeconds(d.getSeconds() + 120);

      const tokenData = new Token({
         userId: new mongoose.Types.ObjectId(userExist._id),
         otp: otp,
         token: hash_,
         end_time: d,
         reason: "forForgetPassword"
      });
      await tokenData.save();

      if (email) {
         await sendVerifyOTP(userExist.name, userExist._id, email, 0, "email", "forForgetPassword", "your OTP has been verified!", host, otp,lang);
         return commonUtils.sendSuccess(req, res, { message: "check your email for otp", token: tokenData.token, otp: otp });
      }
   }
   catch (err: any) {
      console.log(err)
      return commonUtils.sendError(req, res, { message: err.message });
   }
}
const verifyOtp = async function (req: Request, res: Response) {
   try {
      let { otp, token } = req.body;
      let host = req.headers.host;

      var tokenData = await Token.findOne({
         otp: otp,
         token: token
      });
      if (!tokenData) return commonUtils.sendError(req, res, { message: "Incorrect OTP." })

      if (tokenData.requestCount > 3) return commonUtils.sendError(req, res, { message: "OTP request limit reached." });
      if (tokenData.isVerified) return commonUtils.sendError(req, res, { message: "OTP already verified." });
      if (tokenData.otp != otp) return commonUtils.sendError(req, res, { message: "OTP is invalid." })

      tokenData.isVerified = true;
      tokenData.requestCount = tokenData.requestCount + 1;
      await tokenData.save();
      return commonUtils.sendSuccess(req, res, { token: tokenData.token }, 200)
   }
   catch (err: any) {
      return commonUtils.sendError(req, res, { message: err.message }, 409)
   }
}
async function forgotPassword(req: Request, res: Response) {
   try {
      const { token, password } = req.body;
      if (!token) return commonUtils.sendError(req, res, { message: "token is required" }, 409);
      const token_ = await Token.findOne({ token: token, isVerified: true });
      if (!token_) return commonUtils.sendError(req, res, { message: "Token is invalid" }, 409);

      const Adminexist = await Facility.findOne({ _id: token_.userId });
      if (!Adminexist) return commonUtils.sendError(req, res, { message: "Admin not exist!" }, 409);

      const salt = await bcrypt.genSalt(10);
      Adminexist.password = await bcrypt.hash(password, salt);
      await Adminexist.updateOne({ password: Adminexist.password });

      await Token.deleteOne({ token: token });
      return commonUtils.sendError(req, res, { message: "パスワードは正常に変更されました!" }, 200);
   }
   catch (err: any) {
      return commonUtils.sendError(req, res, { message: err.message }, 409);
   }
}
const changePassword = async (req: any, res: Response) => {
   const user_id = req.headers.userid;
   const old_password = req.body.oldPassword;
   const new_password = req.body.newPassword;

   const user = await Facility.findById(user_id);
   if (!user)
      return commonUtils.sendError(req, res, { message: AppStringEng.USER_NOT_FOUND }, 409);

   if(req?.body?.passReset || req?.body?.passReset==1){ 
      const valid_password = await bcrypt.compare(old_password, user.password);
      if (!valid_password)
         return commonUtils.sendError(req, res, { message: AppStringEng.OLD_PASSWORD_INVALID }, 409);   
   }
   
   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(new_password, salt);
   await user.updateOne({ password: user.password,passReset:1 }).exec();

   return commonUtils.sendSuccess(req, res, { message: AppStringEng.PASSWORD_CHANGED, }, 200);
}
async function generateUniqueToken(token_: string) {
   let token = token_;
   let count = 0;
   while (true) {
      const token_ = await Token.findOne({ token: token });
      if (!token_) break;
      count += 1;
      token = token_ + count;
   }
   return token;
}


export default
   {
    
      resend,
      login,
      logout,
      updateProfile,
      getProfile,
      //..................Password
      getOtp,
      verifyOtp,
      forgotPassword,
      changePassword,
      //...................Password
   }