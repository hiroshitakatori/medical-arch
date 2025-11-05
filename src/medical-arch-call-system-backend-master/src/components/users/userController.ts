import { AppStringEng, AppStringJapan } from "../../utils/appStrings";
import { Request, Response } from "express";
import commonUtils, {
    deleteSingleFile,
    deleteMultipleFile,
    fileFilter,
    commonFileStorage,
    fileFilterPdf,
    fileStoragePdf
} from "../../utils/commonUtils";
import Auth from "../../auth";
import aes from "../../utils/aes";
import redisClient from "../../utils/redisHelper";
import eventEmitter from "../../utils/event";
import { AppConstants } from "../../utils/appConstants";

const moment = require('moment');
const Role = require("../role/roleModel");
const User = require('../users/userModel');
const FacilityModel = require("../facility/facilityModel")
const Plan = require("../common/plan");
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
const twilio = require('twilio');
const multer = require("multer");

const accountSid = config.get('ACCOUNTSID');
const authToken = config.get('AUTHTOKEN');
const client = twilio(accountSid, authToken);
const DeletedCall = require("../common/deletedCallHistory")

async function superAdminExist(role: any) {
    return new Promise(async (resolve, reject) => {
        let roleData = await Role.findById({ _id: mongoose.Types.ObjectId(role) });
        if (roleData?.name == "superAdmin") {
            let exist = await User.findOne({ role: roleData._id })
            if (exist) {
                return resolve({ isAdmin: true, role: roleData.name });
            } else {
                return resolve({ isAdmin: false, role: roleData.name })
            }
        } else {
            return resolve({ isAdmin: false, role: roleData?.name || "staff" })
        }

    })
}

async function userExist(userId: any) {
    return new Promise(async (resolve, reject) => {
        let user = await User.findById(userId);
        user ? resolve(user) : resolve(false);
    })
}

// async function generateUniqueId() {
//    return new Promise(async (resolve, reject) => {

//       let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
//       var result = '';
//       for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

//       if (result) {
//           const exist = await User.findOne({ uniqeId: result })
//           if (!exist) {
//               return result;
//           } else {
//             generateUniqueId();
//           }
//       }
//    })
// }
async function saveRegData(role: any, name: any, email: any, mobile: any, password: any, uniqueId: any, yomi = null, frigana = null, address = null, contract = null, license = null, profilePic = null) {
    return new Promise(async (resolve, reject) => {
        var user = new User();
        user.role = role;
        user.name = name;
        user.email = email;
        user.mobile = mobile;
        user.yomi = yomi;
        user.frigana = frigana;
        user.contract = contract;
        user.license = license;
        user.address = address;
        user.profilePic = profilePic;
        user.uniqeId = uniqueId;
        user.password2 = password;
        // hash password
        var salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        if (user) {
            return resolve(user._id)
        } else {
            reject(false)
        }
    })
}

async function register(req: Request, res: Response) {
    try {

        let lang = req.headers.lang ?? "en";
        let { role, name, email, mobile, password } = req.body;
        let uniqeId = "ID" + Date.now();

        if (role) {
            let superAdminExists: any = await superAdminExist(role);
            if (superAdminExists?.isAdmin) {
                return commonUtils.sendError(req, res, { message: lang === "en" ? AppStringEng.SUPER_ADMIN_ALREADY_EXISTS : AppStringJapan.SUPER_ADMIN_ALREADY_EXISTS }, 409);
            } else if (superAdminExists?.role == "superAdmin") {
                //direct reg

                let reg = await saveRegData(role, name, email, mobile, password, uniqeId);
                return commonUtils.sendSuccess(req, res, {
                    message: lang === "en" ? AppStringEng.REGISTER_SUCCESS : AppStringJapan.REGISTER_SUCCESS,
                    id: reg
                }, 200);
            } else {
                let userData = {
                    role: role,
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: password,
                    uniqeId: uniqeId
                }

                let otp = Number((Math.random() * (999999 - 100000) + 100000).toFixed());
                //staft reg // do not save data without otp varification
                var response_ = await Auth.register(userData, "user", otp);
                var host = req.headers.host;
                let message = "";
                if (lang == "en") {

                    await sendVerifyEmail(name, email, "email", AppStringEng.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringEng.DO_NOT_SHARE_OTP_MSG2, otp, uniqeId, host, lang);
                    message = "Register Successfully. Verification OTP is sended on registered email , please verify it before login. Thank you!"
                    message = message = AppStringEng.REG_OTP_VERIFY_MSG1 + otp + AppStringEng.REG_OTP_VERIFY_MSG2
                } else {
                    await sendVerifyEmail(name, email, "email", AppStringJapan.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringJapan.DO_NOT_SHARE_OTP_MSG2, otp, uniqeId, host, lang);
                    message = AppStringJapan.REG_OTP_VERIFY_MSG1 + AppStringJapan.REG_OTP_VERIFY_MSG2
                }
                return commonUtils.sendSuccess(req, res, {
                    message: message,
                    token: response_?.accessToken,
                    otp: otp
                }, 200);
            }
        } else {
            let staff = await Role.findOne({ name: "staff" }, { _id: 1 });
            if (staff) {
                role = staff._id
                let userData = {
                    role: role,
                    // name: name,
                    email: email,
                    // mobile: mobile,
                    password: password,
                    uniqeId: uniqeId
                }

                let otp = Number((Math.random() * (999999 - 100000) + 100000).toFixed());
                //staft reg // do not save data without otp varification
                var response_ = await Auth.register(userData, "user", otp);
                var host = req.headers.host;

                let message = "";
                if (lang == "en") {

                    await sendVerifyEmail(name, email, "email", AppStringEng.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringEng.DO_NOT_SHARE_OTP_MSG2, otp, uniqeId, host, lang);
                    message = message = AppStringEng.REG_OTP_VERIFY_MSG1 + AppStringEng.REG_OTP_VERIFY_MSG2
                } else {
                    await sendVerifyEmail(name, email, "email", AppStringJapan.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringJapan.DO_NOT_SHARE_OTP_MSG2, otp, uniqeId, host, lang);
                    message = AppStringJapan.REG_OTP_VERIFY_MSG1 + AppStringJapan.REG_OTP_VERIFY_MSG2;
                }
                return commonUtils.sendSuccess(req, res, {
                    message: message,
                    token: response_?.accessToken,
                    otp: otp
                }, 200);
            } else {
                return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.SUPER_ADMIN_ALREADY_EXISTS : AppStringJapan.SUPER_ADMIN_ALREADY_EXISTS }, 409);

            }
        }
    } catch (error: any) {
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

const sendVerifyEmail = async (username: string, credential: any, median: string, message: any, otp: any, uniqeId: any, host: any, lang: any) => {
    try {
        if (median == "mobile") {
            eventEmitter.emit("send_mobile_otp", { subject: message, from: "Medical Arch", to: credential })
        } else if (median == "email") {

            eventEmitter.emit("send_email_otp", {
                username: username,
                to: credential,
                subject: message,
                data: {
                    otp: otp,
                    uniqeId: uniqeId,
                    lang: lang,
                    message: lang == "en" ? "Your email has been verified!" : "あなたのメールアドレスが確認されました!"
                },
                sender: config.MAIL_SENDER_NO_REPLY,
                host: host
            });
        } else {
            return [null, 'not valid type']
        }
    } catch (err: any) {
        console.log("send verify otp : ", err)
    }
}

async function signupVerifyOtp(req: Request, res: Response) {
    try {
        const { otp } = req.body;
        let lang = req.headers.lang ?? "en";

        let tokens_ = req.headers?.authorization?.split(' ') ?? []
        if (tokens_.length <= 1) {
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_TOKEN : AppStringJapan.INVALID_TOKEN }, 409);
        }
        const token = tokens_[1];

        await new Promise((resolve, reject) => {

            jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
                if (err) {
                    console.log(err)
                    if (err.name == "TokenExpiredError") {
                        return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.TOKEN_EXPIRED : AppStringJapan.TOKEN_EXPIRED }, 409);
                    } else {
                        return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_SESSION : AppStringJapan.INVALID_TOKEN }, 409);
                    }
                } else {
                    let midLayer = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))
                    const userData = JSON.parse(aes.decrypt(midLayer.toString(), config.get("OUTER_KEY_USER")));
                    if (userData?.otp != otp) return commonUtils.sendError(req, res, { message: "Invalid OTP!" }, 409);

                    var userId: any = await saveRegData(userData?.userData.role, userData?.userData.name, userData?.userData.email, userData?.userData.mobile, userData?.userData.password, userData?.userData.uniqeId)

                    const userDatas = await User.findById({ _id: userId });
                    const userDatat = {
                        email: userData?.userData.email,
                        mobile: userData?.userData.mobile,
                        name: userData?.userData.name,
                        uniqeId: userData?.userData.uniqeId,
                    }
                    const response_ = await Auth.login(userId, userData?.userData?.userrole, new Date());
                    res.cookie("accessToken", response_.accessToken, { maxAge: 900000, httpOnly: true });
                    res.cookie("refreshToken", response_.refreshToken, { maxAge: 900000, httpOnly: true });
                    return commonUtils.sendSuccess(req, res, {
                        accessToken: response_.accessToken,
                        refreshToken: response_.refreshToken,
                        tokenType: 'auth',
                        userData: userDatat
                    }, 200);
                }
            })
        }).then((userObj: any) => {
            req.headers.userid = userObj.userid;
            req.headers.usertype = userObj.usertype;
            //next();
        }).catch((err: any) => {
            return commonUtils.sendError(req, res, { message: err }, 401);
        })


    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function resend(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";

        let otp = Number((Math.random() * (999999 - 100000) + 100000).toFixed());
        const { token, reason } = req.body;

        if (!['forSignUp', 'forForgetPassword', 'forChange'].includes(reason)) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_REASON : AppStringJapan.INVALID_REASON }, 409);
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

        if (!token_) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_TOKEN : AppStringJapan.INVALID_TOKEN }, 409);

        const user = await User.findOne({ _id: token_.userId });
        if (!user) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.USER_NOT_EXIST : AppStringJapan.USER_NOT_EXIST }, 409);

        const email = (reason === "forChange" ? token_.email : user.email);
        // const mobile = (reason === "forChange" ? token_.mobile : user.mobile);
        let reason_text = "";
        if (reason == "forForgetPassword") {
            reason_text = "forgot password";
        }
        if (email) {
            await sendVerifyOTP(user.name, user._id, email, "email", reason, "Email Verification - Medical Arch", "Dear User, Your Medical Arch " + reason_text + " verification otp is " + otp + " Please do not share the otp or your email with anyone including Medical Arch personnel.", host, otp, lang);
            return commonUtils.sendSuccess(req, res, {
                message: lang == "en" ? AppStringEng.CHECK_EMAIL_FOR_OTP : AppStringJapan.CHECK_EMAIL_FOR_OTP,
                token: token_.token,
                otp: otp
            });
        }
    } catch (err: any) {
        console.log(err)
        return commonUtils.sendSuccess(req, res, { message: err.message }, 409);
    }
}

async function getJWTOken(req: any, res: any, otp: any) {
    let lang = req.headers.lang ?? "en";
    let tokens_ = req.headers?.authorization?.split(' ') ?? []
    // console.log(tokens_)
    if (tokens_.length <= 1) {
        return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_TOKEN : AppStringJapan.INVALID_TOKEN }, 409);
    }
    const token = tokens_[1];
    await new Promise((resolve, reject) => {

        jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
            if (err) {
                console.log('err', err)
                if (err.name == "TokenExpiredError") {
                    return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.TOKEN_EXPIRED : AppStringJapan.TOKEN_EXPIRED }, 409);
                } else {
                    return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_SESSION : AppStringJapan.INVALID_TOKEN }, 409);
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
                await sendVerifyEmail(userDataObj?.name, userDataObj.email, "email", lang == "en" ? AppStringEng.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringEng.DO_NOT_SHARE_OTP_MSG2 : AppStringJapan.DO_NOT_SHARE_OTP_MSG1 + otp + AppStringJapan.DO_NOT_SHARE_OTP_MSG2, otp, userDataObj?.uniqueId, host, lang);
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

    var admin = await User.findOne({ email: email });
    if (!admin) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.USER_CREDENTIAL_DOES_NOT_MATCH : AppStringJapan.USER_CREDENTIAL_DOES_NOT_MATCH }, 409);
    if (!admin.status) return commonUtils.sendAdminError(req, res, { message: lang == "en" ? AppStringEng.ACCOUNT_INACTIVE : AppStringJapan.ACCOUNT_INACTIVE }, 400);
    // if (!admin.status && (admin.terminationDate && new Date(admin.terminationDate) < new Date())) {
    //     return commonUtils.sendError(req, res, { message: AppStringJapan.ACCOUNT_INACTIVE }, 409);
    //   }
    var role = await Role.findOne({ _id: admin.role });
    if (!role) return commonUtils.sendAdminError(req, res, { message: lang == "en" ? AppStringEng.ROLE_NOT_EXIST : AppStringJapan.ROLE_NOT_EXIST }, 400);

    var valid_password = await bcrypt.compare(password, admin.password);
    if (!valid_password) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return commonUtils.sendError(req, res, { message: AppStringEng.INVALID_PASSWORD }, 409);
    }

    var response_ = await Auth.login(admin._id, admin.adminrole, admin.createdAt);
    await User.findByIdAndUpdate(admin._id, { $set: { lastLogin: new Date() } }).exec();

    res.cookie("accessToken", response_.accessToken, { maxAge: 900000, httpOnly: true });
    res.cookie("refreshToken", response_.refreshToken, { maxAge: 900000, httpOnly: true });
    var responseObject = {
        role: role.name,
        permission: role.permission,
        name: admin.name,
        email: admin.email,
        user: { name: admin?.name, email: admin?.email, _id: admin?._id },
        accessToken: response_.accessToken,
        refreshToken: response_.refreshToken
    }

    return commonUtils.sendSuccess(req, res, responseObject);
}

const logout = async (req: any, res: Response) => {
    let lang = req.headers.lang ?? "en";
    const tokens_ = req.headers?.authorization?.split(' ') ?? []
    if (tokens_.length <= 1) {
        return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_TOKEN : AppStringJapan.INVALID_TOKEN }, 401);
    }
    const token = tokens_[1];

    jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
        if (err) {
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.INVALID_TOKEN : AppStringJapan.INVALID_TOKEN }, 401);
        } else {
            const uniqueUserKey = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))
            let tokens: [] = await redisClient.lrange(uniqueUserKey.toString(), 0, -1)
            let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())
            // remove the refresh token
            await redisClient.lrem(uniqueUserKey.toString(), 1, await redisClient.lindex(uniqueUserKey.toString(), index));
            // blacklist current access token
            await redisClient.lpush('BL_' + uniqueUserKey.toString(), token);

            return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.LOGOUT_SUCCESS : AppStringJapan.LOGOUT_SUCCESS }, 200);
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
        let lang = req.headers.lang ?? "en";
        let _id: any = req.headers.userid;
        if (!_id) return commonUtils.sendError(req, res, { message: "Please login" }, 409);
        let userId = req.query.userId;
        if (userId) {
            _id = userId
        }
        const adminExist = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
            {
                $lookup: {
                    from: "roles",
                    localField: "role",
                    foreignField: "_id",
                    as: "role_data"
                }
            },
            { $unwind: { path: "$role_data", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    uniqeId: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    profilePic: 1,
                    contract: 1,
                    license: 1,
                    address: 1,
                    yomi: 1,
                    frigana: 1,
                    password2: 1,
                    role_data: {
                        _id: 1,
                        name: 1
                    },
                    status: 1,
                    createdAt: 1
                }
            }
        ]);
        if (!adminExist) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.USER_NOT_EXIST : AppStringJapan.USER_NOT_EXIST }, 409);
        return commonUtils.sendSuccess(req, res, adminExist[0], 200)
    } catch (err: any) {
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

/* Admin Add staff */

async function addStaff(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";

        let {
            name,
            email,
            mobile,
            yomi,
            frigana,
            address,
            contract,
            license,
            profilePic,
            password,
            authority
        } = req.body;
        let role: any;
        if (authority && authority == true || authority == 1) {
            let roleData = await Role.findOne({ name: "superAdmin" });
            role = roleData?._id;
        } else {
            let roleData = await Role.findOne({ name: "staff" });
            role = roleData?._id;
        }
        let uniqueId = "ID" + Date.now();
        // let password = await generatePassword();
        let reg = await saveRegData(role, name, email, mobile, password, uniqueId, yomi, frigana, address, contract, license, profilePic);

        var host = req.headers.host;
        if (email) {
            eventEmitter.emit("send_email_with_password", {
                uniqueId: uniqueId,
                username: name,
                to: email,
                subject: lang == "en" ? AppStringEng.EMAIL_ACCOUNT_INFO : AppStringJapan.EMAIL_ACCOUNT_INFO,
                password: password,
                message: lang == "en" ? AppStringEng.EMAIL_ACCOUNT_INFO_TITLE : AppStringJapan.EMAIL_ACCOUNT_INFO_TITLE,
                host: host,
                lang: lang,
                url: config.STAFF_URL + "login"
            });
            // await sendVerificationEmail(email, name, random_password, host);
        }

        return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.STAFT_ADD_SUCCESS : AppStringJapan.STAFT_ADD_SUCCESS }, 200);
        // }

    } catch (error: any) {
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function updateStaff(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {
            _id,
            name,
            email,
            mobile,
            yomi,
            frigana,
            address,
            contract,
            profilePic,
            license,
            password,
            password2,
            authority
        } = req.body;
        // authority = authority ? authority :false;
        let role: any;
        if (authority && authority == 1 && authority == true) {
            let roleData = await Role.findOne({ name: "superAdmin" });
            role = roleData?._id;
        } else {
            let roleData = await Role.findOne({ name: "staff" });
            role = roleData?._id;
        }
        // let superAdminExists: any = await superAdminExist(role);
        // if (superAdminExists?.isAdmin) {
        //    return commonUtils.sendError(req, res, { message: AppStringEng.SUPER_ADMIN_ALREADY_EXISTS }, 409);
        //} else {

        let staffExist = await User.findById(_id);
        if (!staffExist) return commonUtils.sendError(req, res, { message: AppStringEng.STAFF_NOT_EXISTS }, 409);

        if (staffExist.email != email) {
            var salt = await bcrypt.genSalt(10);
            staffExist.password2 = password2;
            staffExist.password = await bcrypt.hash(password2, salt);
            var host = req.headers.host;
            if (email) {
                eventEmitter.emit("send_email_with_password", {
                    uniqueId: staffExist?.uniqeId,
                    username: name,
                    to: email,
                    subject: lang == "en" ? AppStringEng.EMAIL_ACCOUNT_INFO : AppStringJapan.EMAIL_ACCOUNT_INFO,
                    password: password2,
                    message: lang == "en" ? AppStringEng.EMAIL_ACCOUNT_INFO_TITLE : AppStringJapan.EMAIL_ACCOUNT_INFO_TITLE,
                    host: host,
                    lang: lang,
                    url: config.FACILITY_URL + "login"
                });
                // await sendVerificationEmail(email, name, random_password, host);
            }
        }
        staffExist.role = role;
        staffExist.name = name || staffExist.name;
        staffExist.email = email || staffExist.email;
        staffExist.mobile = mobile || staffExist.mobile;
        staffExist.yomi = yomi || staffExist.yomi;
        staffExist.frigana = frigana || staffExist.frigana;
        staffExist.address = address || staffExist.address;
        if (contract && staffExist.contract && contract != staffExist.contract) {
            await deleteSingleFile(staffExist.contract, AppConstants.CONTRACT_PATH)
            staffExist.contract = contract
        }
        if (profilePic && staffExist.profilePic && profilePic != staffExist.profilePic) {
            await deleteSingleFile(staffExist.profilePic, AppConstants.PROFILE_PATH)
            staffExist.profilePic = profilePic
        }
        if (license && staffExist.license && license != staffExist.license) {
            await deleteSingleFile(staffExist.license, AppConstants.LICENSE_PATH)
            staffExist.license = license
        }
        await staffExist.save();
        return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.STAFT_UPDATE_SUCCESS : AppStringJapan.STAFT_UPDATE_SUCCESS }, 200);
        //}
    } catch (error: any) {
        console.log("UPDATE STAFF ERR", error)
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function deleteStaff(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        // console.log(req.query,req.params)
        var { _id } = req.params;
        var staffExist = await User.findById(_id);
        if (staffExist) {
            if (staffExist.contract) {
                await deleteSingleFile(staffExist.contract, AppConstants.CONTRACT_PATH)
            }
            if (staffExist.profilePic) {
                await deleteSingleFile(staffExist.profilePic, AppConstants.PROFILE_PATH)
            }
            if (staffExist.license) {
                await deleteSingleFile(staffExist.license, AppConstants.LICENSE_PATH)
            }
            staffExist.remove();
            return commonUtils.sendSuccess(req, res, { message: "staff deleted success!" }, 200);
        } else {
            return commonUtils.sendError(req, res, { message: "Staff not exist!" }, 409);
        }
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function changeStatusStaff(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";

        var { _id } = req.params;
        var adminExist = await User.findById(_id);
        if (adminExist) {
            let status = adminExist.status == true ? false : true;
            let status_msg = adminExist.status == true ? lang == "en" ? AppStringEng.DEACTIVETED : AppStringJapan.DEACTIVETED : lang == "en" ? AppStringEng.ACTIVETED : AppStringJapan.ACTIVETED;
            adminExist.status = status;
            await adminExist.save();
            let msg1E = "Admin status";
            let msg1J = "管理者のステータス";
            let msg2E = "successfully";
            let msg2J = "無事に";
            let message = lang == "en" ? msg1E + " " + status_msg + " " + msg2E : msg1J + " " + status_msg + " " + msg2J
            return commonUtils.sendSuccess(req, res, { message: message }, 200);
        } else {
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng?.USER_NOT_EXIST : AppStringJapan?.USER_NOT_EXIST }, 409);
        }
    } catch (error: any) {
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function getStaff(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let { search, page, _id }: any = req.query;
        let userId = req.headers.userid;
        if (_id && _id != "") {
            let AdminList = await User.findById(_id)
            if (!AdminList) {
                return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng?.USER_NOT_EXIST : AppStringJapan?.USER_NOT_EXIST }, 409);
            }
            return commonUtils.sendSuccess(req, res, AdminList, 200);

        }
        var limit = parseInt(req.query.limit as string) || 5;
        page = page || 1;
        let filter: any = {
            _id: { $ne: mongoose.Types.ObjectId(userId) }
        };
        var skip = (page - 1) * limit;
        if (search && search !== "") {
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } },
                    { uniqueId: { $regex: search, $options: 'i' } }
                ]
            }
        }
        let total__ = await User.aggregate([
            { $match: filter },

            // {
            //    $lookup: {
            //       from: 'roles',
            //       localField: 'role',
            //       foreignField: '_id',
            //       as: 'role_data'
            //    }
            // },
            // {
            //    $match: {
            //       "role_data.name": { $ne: "superAdmin" },
            //    }
            // },
            {
                $group: {
                    _id: null, total: { $sum: 1 }
                }
            }, {
                $project: {
                    _id: 1, total: 1
                }
            }

        ])
        var total_ = total__[0]?.total || 0;
        let AdminList = await User.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role_data'
                }
            },

            // {
            //    $match: {
            //       "role_data.name": { $ne: "superAdmin" },
            //    }
            // },
            { $unwind: { path: "$role_data", preserveNullAndEmptyArrays: true } },

            {
                $facet: {
                    metadata: [
                        { $count: "total" },
                        {
                            $addFields: {
                                page: page,
                                limit: limit,
                                total: total_,
                                hasMoreData: total_ > page * limit ? true : false
                            }
                        }
                    ],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                mobile: 1,
                                uniqeId: 1,
                                role: 1,
                                yomi: 1,
                                address: 1,
                                frigana: 1,
                                contract: 1,
                                license: 1,
                                status: 1,
                                password2: 1,
                                createdAt: 1,
                                role_data: {
                                    _id: 1,
                                    name: 1,
                                    // permission: 1
                                }
                            }
                        }
                    ]
                }
            },
        ])

        return commonUtils.sendSuccess(req, res, AdminList, 200);
    } catch (err: any) {
        console.log("GET STAFF LIST ERROR", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

/* Forget password */


const sendVerifyOTP = async (username: string, userId: any, credential: any, device: any, median: string, reason: any, subject: any, host: any, otp: any, lang: any) => {
    try {
        //console.log(median)
        if (!otp) {

            otp = Number((Math.random() * (999999 - 100000) + 100000).toFixed());
        }
        if (median == "mobile") {
            // eventEmitter.emit("send_mobile_otp", { to: credential })
        } else if (median == "email") {

            eventEmitter.emit("send_email_otp", {
                user_name: username,
                to: credential,
                subject: subject,
                data: {
                    otp: otp,
                    message: lang == "en" ? AppStringEng.EMAIL_VERIFIED : AppStringJapan.EMAIL_VERIFIED
                },
                sender: config.MAIL_USER,
                host: host
            });
        } else {
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

    } catch (err: any) {
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
        const userExist = await User.findOne(query);
        if (!userExist) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.USER_NOT_EXIST : AppStringJapan.USER_NOT_EXIST });

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
            await sendVerifyOTP(userExist.name, userExist._id, email, 0, "email", "forForgetPassword", "your OTP has been verified!", host, otp, lang);
            return commonUtils.sendSuccess(req, res, {
                message: "OTP のメールをチェックしてください",//"check your email for otp",
                token: tokenData.token,
                otp: otp
            });
        }
    } catch (err: any) {
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
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409)
    }
}

async function forgotPassword(req: Request, res: Response) {
    try {
        const { token, password } = req.body;

        if (!token) return commonUtils.sendError(req, res, { message: "token is required" }, 409);
        const token_ = await Token.findOne({ token: token, isVerified: true });
        if (!token_) return commonUtils.sendError(req, res, { message: "Token is invalid" }, 409);

        const Adminexist = await User.findOne({ _id: token_.userId });
        if (!Adminexist) return commonUtils.sendError(req, res, { message: "Admin not exist!" }, 409);

        const salt = await bcrypt.genSalt(10);
        Adminexist.password = await bcrypt.hash(password, salt);
        await Adminexist.updateOne({ password: Adminexist.password, password2: password });

        await Token.deleteOne({ token: token });
        return commonUtils.sendError(req, res, { message: "パスワードは正常に変更されました!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

const changePassword = async (req: any, res: Response) => {
    const user_id = req.headers.userid;
    const old_password = req.body.oldPassword;
    const new_password = req.body.newPassword;

    const user = await User.findById(user_id);
    if (!user)
        return commonUtils.sendError(req, res, { message: AppStringEng.USER_NOT_FOUND }, 409);

    const valid_password = await bcrypt.compare(old_password, user.password);
    if (!valid_password)
        return commonUtils.sendError(req, res, { message: AppStringEng.OLD_PASSWORD_INVALID }, 409);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.updateOne({ password: user.password, password2: new_password }).exec();

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

async function plans(req: Request, res: Response) {
    try {

        let planData = await Plan.aggregate([
            {
                $project: {
                    _id: 1, total: 1, name: 1, duration: 1, jname: 1
                }
            },
            { $sort: { order: 1 } }
        ]);

        return commonUtils.sendSuccess(req, res, planData, 200);
    } catch (error: any) {
        console.log("plan err", error)
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function getRenewDate(plan: any, contractStartDate: any) {
    // console.log(contractStartDate)
    let dt = new Date(contractStartDate);
    if (contractStartDate) {
        dt.setDate(dt.getDate())
        dt.setMonth(dt.getMonth())
        dt.setFullYear(dt.getFullYear())
    }

    return new Promise(async function (resolve, reject) {
        //_id: mongoose.Types.ObjectId(plan) 
        let planData = await Plan.findById(mongoose.Types.ObjectId(plan));
        if (!planData) {
            dt.setDate(dt.getDate() + 10);
            return resolve(dt);
        } else {
            dt.setDate(dt.getDate() + planData.duration);
            return resolve(dt);
        }
    })
}

/* Facility Management */
async function getFacilityUniqId() {
    return new Promise(async (resolve, reject) => {
        let total_facility = await FacilityModel.count();
        total_facility = total_facility + 1;
        let id = "000000"
        let generatedId = (id + total_facility).slice(-id.length);
        return resolve(generatedId)
    })
}

async function addFacility(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let loginId = req.headers.userid;
        var adminExist = await User.findById(loginId);
        if (!adminExist) commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.ADMIN_NOT_FOUND : AppStringJapan.ADMIN_NOT_FOUND }, 409);
        let {
            name,
            email,
            mobile,
            address,
            contract,
            yomi,
            managerName,
            contractStartDate,
            facilityManagerName,
            contractDetails,
            capacity,
            businessType,
            plan,
            affiliatedFacility,
            memoForFacility,
            memoForStaff,
            subscriberRegistrant,
            cost,
            amount,
            allowLogin,
            mobile2
        } = req.body;
        contractStartDate = new Date(contractStartDate);
        // var CurrentDate = new Date();
        // if (contractStartDate < CurrentDate) {
        //    return commonUtils.sendError(req, res, { errors:{contractStartDate: lang=="en" ? "Contract start  date must be greater than the current date." :"契約終了日が現在の日付より後になっています。"} }, 422);
        // }

        // console.log(managerName || adminExist?.name,facilityManagerName)
        let uniqeId: any = await getFacilityUniqId()//"FID" + Date.now();
        var facility = new FacilityModel();
        facility.name = name;
        facility.uniqeId = uniqeId;
        facility.email = email;
        facility.mobile = mobile;
        facility.mobile2 = mobile2;
        facility.address = address;
        facility.contract = contract;
        facility.yomi = yomi;
        facility.managerName = managerName || adminExist?.name;
        facility.facilityManagerName = facilityManagerName;
        facility.contractDetails = contractDetails;
        facility.contract = contract;
        facility.capacity = capacity;
        facility.businessType = businessType;
        facility.plan = plan;
        facility.affiliatedFacility = affiliatedFacility;
        facility.memoForFacility = memoForFacility;
        facility.memoForStaff = memoForStaff;
        facility.contractStartDate = contractStartDate;
        facility.contractRenewDate = await getRenewDate(plan, contractStartDate);

        facility.cost = cost;
        facility.amount = amount;
        facility.allowLogin = allowLogin;
        // facility.contractEndDate = contractEndDate;
        facility.subscriberRegistrant = subscriberRegistrant;

        /* password */
        let password = await generatePassword();
        var salt = await bcrypt.genSalt(10);
        facility.password = await bcrypt.hash(password, salt);

        await facility.save();

        var host = req.headers.host;
        if (email && allowLogin) {
            eventEmitter.emit("send_email_with_password", {
                // uniqeId:uniqeId,
                uniqueId: uniqeId,
                username: name,
                to: email,
                subject: lang == "en" ? AppStringEng.FACILITY_EMAIL_SUBJECT : AppStringJapan.FACILITY_EMAIL_SUBJECT,
                password: password,
                message: lang == "en" ? AppStringEng.FACILITY_EMAIL_CONTENT : AppStringJapan.FACILITY_EMAIL_CONTENT,
                host: host,
                lang: lang,
                url: config.FACILITY_URL + "login"
            });
        }
        //  else {
        //     eventEmitter.emit("send_welcome_email", {
        //         // uniqeId:uniqeId,
        //         uniqueId: uniqeId,
        //         username: name,
        //         to: email,
        //         subject: lang == "en" ? AppStringEng.FACILITY_EMAIL_SUBJECT : AppStringJapan.FACILITY_EMAIL_SUBJECT,
        //         message: lang == "en" ? AppStringEng.FACILITY_EMAIL_CONTENT : AppStringJapan.FACILITY_EMAIL_CONTENT,
        //         host: host,
        //         lang: lang,
        //         url: config.FACILITY_URL + "login"
        //     });
        // }

        return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.FACILITY_ADD_SUCCESS : AppStringJapan.FACILITY_ADD_SUCCESS }, 200);

    } catch (error: any) {
        console.log(error, 123);

        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function updateFacility(req: Request, res: Response) {
    try {

        console.log("update facility", req.body)

        let lang = req.headers.lang ?? "en";
        let {
            _id,
            name,
            email,
            mobile,
            address,
            contract,
            yomi,
            managerName,
            facilityManagerName,
            contractDetails,
            capacity,
            businessType,
            plan,
            affiliatedFacility,
            memoForFacility,
            memoForStaff,
            allowLogin,
            amount,
            cost,
            contractStartDate,
            mobile2,
            isFacility
        } = req.body;



        let facilityExist = await FacilityModel.findById(_id);
        if (!facilityExist) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.FACILITY_NOT_EXISTS : AppStringJapan.FACILITY_NOT_EXISTS }, 409);

        if ((facilityExist.email != email && allowLogin) || (facilityExist.allowLogin == 0 && allowLogin)) {

            let password = await generatePassword();
            var salt = await bcrypt.genSalt(10);
            facilityExist.password = await bcrypt.hash(password, salt);
            var host = req.headers.host;
            if (email) {
                eventEmitter.emit("send_email_with_password", {
                    uniqueId: facilityExist?.uniqeId,
                    username: name,
                    to: email,
                    subject: lang == "en" ? AppStringEng.FACILITY_EMAIL_SUBJECT : AppStringJapan.FACILITY_EMAIL_SUBJECT,
                    password: password,
                    message: lang == "en" ? AppStringEng.FACILITY_EMAIL_CONTENT : AppStringJapan.FACILITY_EMAIL_CONTENT,
                    host: host,
                    lang: lang,
                    url: config.FACILITY_URL + "login"
                });
                // await sendVerificationEmail(email, name, random_password, host);
            }
        }

        facilityExist.name = name || facilityExist.name;
        facilityExist.email = email || facilityExist.email;
        facilityExist.mobile = mobile || facilityExist.mobile;
        facilityExist.mobile2 = mobile2 || facilityExist.mobile2;
        facilityExist.yomi = yomi || facilityExist.yomi;
        facilityExist.address = address || facilityExist.address;
        facilityExist.managerName = managerName || facilityExist.managerName;
        facilityExist.facilityManagerName = facilityManagerName || facilityExist.facilityManagerName;
        facilityExist.contractDetails = contractDetails || facilityExist.contractDetails;
        facilityExist.contract = contract || facilityExist.contract;
        facilityExist.capacity = capacity || facilityExist.capacity;
        facilityExist.businessType = businessType || facilityExist.businessType;
        facilityExist.plan = plan || facilityExist.plan;
        facilityExist.affiliatedFacility = affiliatedFacility || facilityExist.affiliatedFacility;
        facilityExist.memoForFacility = memoForFacility || facilityExist.memoForFacility;
        facilityExist.memoForStaff = memoForStaff || facilityExist.memoForStaff;
        facilityExist.allowLogin = isFacility ? facilityExist?.allowLogin : allowLogin;
        facilityExist.amount = amount || facilityExist.amount;
        facilityExist.cost = cost;
        facilityExist.contractStartDate = contractStartDate || facilityExist.contractStartDate;

        facilityExist.contractRenewDate = await getRenewDate(plan, facilityExist.contractStartDate);

        if (contract && facilityExist.contract && contract != facilityExist.contract) {
            await deleteSingleFile(facilityExist.contract, AppConstants.CONTRACT_PATH)
            facilityExist.contract = contract
        }

        await facilityExist.save();
        return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.FACILITY_UPDATE_SUCCESS : AppStringJapan.FACILITY_UPDATE_SUCCESS }, 200);
    } catch (error: any) {
        console.log("update facility", error)
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function deleteFacility(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        // console.log(req.query,req.params)
        var { _id } = req.params;
        var facilityExist = await FacilityModel.findById(_id);
        if (facilityExist) {
            if (facilityExist.contract) {
                await deleteSingleFile(facilityExist.contract, AppConstants.CONTRACT_PATH)
            }

            facilityExist.remove();
            return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng?.FACILITY_REMOVE_SUCCESS : AppStringJapan?.FACILITY_REMOVE_SUCCESS }, 200);
        } else {
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng?.FACILITY_NOT_EXISTS : AppStringJapan?.FACILITY_NOT_EXISTS }, 409);
        }
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function changeStatusFacility(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";

        var { _id } = req.params;
        var facilityExist = await FacilityModel.findById(_id);
        if (facilityExist) {
            let status = facilityExist.status == true ? false : true;
            let status_msg = facilityExist.status == true ? lang == "en" ? AppStringEng.DEACTIVETED : AppStringJapan.DEACTIVETED : lang == "en" ? AppStringEng.ACTIVETED : AppStringJapan.ACTIVETED;
            facilityExist.status = status;
            await facilityExist.save();
            let msg1E = "Admin status";
            let msg1J = "管理者のステータス";
            let msg2E = "successfully";
            let msg2J = "無事に";
            let message = lang == "en" ? msg1E + " " + status_msg + " " + msg2E : msg1J + " " + status_msg + " " + msg2J
            return commonUtils.sendSuccess(req, res, { message: message }, 200);
        } else {
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng?.FACILITY_NOT_EXISTS : AppStringJapan?.FACILITY_NOT_EXISTS }, 409);
        }
    } catch (error: any) {
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function cancelFacilityContract(req: Request, res: Response) {
    try {
        // console.log("cancelFacilityContract")
        let lang = req.headers.lang ?? "en";

        var { _id, terminationDate, entryBy } = req.body;
        var facilityExist = await FacilityModel.findById(_id);
        if (facilityExist) {
            let status = facilityExist.status == true ? false : false;
            let status_msg = facilityExist.status == true ? lang == "en" ? AppStringEng.CANCELED : AppStringJapan.CANCELED : lang == "en" ? AppStringEng.UNDER_CONTRACT : AppStringJapan.UNDER_CONTRACT;
            facilityExist.entryBy = entryBy || "Super Admin";
            facilityExist.terminationDate = terminationDate ? new Date(terminationDate) : new Date();
            facilityExist.status = status;
            await facilityExist.save();
            let msg1E = "Facility status";
            let msg1J = "設備状況";
            let msg2E = "successfully";
            let msg2J = "無事に";
            let message = lang == "en" ? msg1E + " " + status_msg + " " + msg2E : msg1J + " " + status_msg + " " + msg2J
            return commonUtils.sendSuccess(req, res, { message: message }, 200);
        } else {
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng?.FACILITY_NOT_EXISTS : AppStringJapan?.FACILITY_NOT_EXISTS }, 409);
        }
    } catch (error: any) {
        console.log("cancelFacilityContract", error)
        return commonUtils.sendError(req, res, { message: error.message }, 409);
    }
}

async function getFacility(req: Request, res: Response) {
    try {
        let { search, page, flag }: any = req.query;

        var limit = parseInt(req.query.limit as string) || 5;
        page = page || 1;
        let filter: any = {};
        var skip = (page - 1) * limit;
        // if(flag=="cancel"){
        //  filter={status:{$ne:0}}
        // }

        if (search && search !== "") {
            filter = {
                ...filter,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { uniqeId: { $regex: search, $options: 'i' } },
                    // { yomi: { $regex: search, $options: 'i' } },
                    // { facilityManagerName: { $regex: search, $options: 'i' } },
                    // { email: { $regex: search, $options: 'i' } },
                    // { mobile: { $regex: search, $options: 'i' } },
                    // { managerName: { $regex: search, $options: 'i' } },
                ]
            }
        }
        let total__ = await FacilityModel.aggregate([
            { $match: filter },

            {
                $group: {
                    _id: null, total: { $sum: 1 }
                }
            }, {
                $project: {
                    _id: 1, total: 1
                }
            }

        ])
        var total_ = total__[0]?.total || 0;
        const AdminList = await FacilityModel.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'plans',
                    localField: 'plan',
                    foreignField: '_id',
                    as: 'plan_data'
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
            { $unwind: { path: "$plan_data", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$affiliatedFacility_data", preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } },

            {
                $facet: {
                    metadata: [
                        { $count: "total" },
                        {
                            $addFields: {
                                page: page,
                                limit: limit,
                                total: total_,
                                hasMoreData: total_ > page * limit ? true : false
                            }
                        }
                    ],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                mobile: 1, mobile2: 1,
                                uniqeId: 1,
                                address: 1,
                                yomi: 1,
                                contract: 1,
                                managerName: 1,
                                facilityManagerName: 1,
                                contractDetails: 1,
                                contractStartDate: 1,
                                contractRenewDate: 1,
                                capacity: 1,
                                businessType: 1,
                                plan: 1,
                                amount: 1,
                                cost: 1,
                                affiliatedFacility: 1,
                                memoForFacility: 1,
                                memoForStaff: 1,
                                subscriberRegistrant: 1,
                                terminationDate: 1, entryBy: 1,
                                status: 1,
                                createdAt: 1,
                                allowLogin: 1,
                                plan_data: {
                                    name: 1,
                                    jname: 1,
                                    duration: 1
                                },
                                affiliatedFacility_data: {
                                    name: 1,
                                }

                            }
                        }
                    ]
                }
            },
        ])
        return commonUtils.sendSuccess(req, res, AdminList, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

async function facilityList(req: Request, res: Response) {
    try {

        let lang = req.headers.lang ?? "en";

        let { search, page, flag, type }: any = req.query;

        const limit = parseInt(req.query.limit as string) || 5;
        page = page || 1;
        let filter: any = {};
        const skip = (page - 1) * limit;
        // if(flag=="cancel"){
        //  filter={status:{$ne:0}}
        // }
        console.log(type)
        if (type && search && search != "" && type == "email" || type == "mobile" || type == "mobile2") {
            type == "email" ? filter = { email: search } : filter = {
                $or: [
                    { mobile: { $regex: search, $options: 'i' } },
                    { mobile2: { $regex: search, $options: 'i' } }
                ]
            }
        } else if (search && search !== "") {

            filter = {
                ...filter,
                $or: [
                    { name: { $regex: search, $options: 'i' } }
                ]
            }
        }
        // console.log(filter)
        var facilityList = await FacilityModel.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },

            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    mobile2: 1,
                    uniqeId: 1,
                    contractStartDate: 1,
                    contractRenewDate: 1,
                    status: 1,
                    createdAt: 1

                }
            }
        ])
        if (facilityList && !type) {

            return commonUtils.sendSuccess(req, res, facilityList, 200);
        } else if (facilityList && facilityList.length > 0) {
            const filteredFacilityList = facilityList.filter((facility: any) => facility.status === 0 || facility.email === search);
            return commonUtils.sendSuccess(req, res, filteredFacilityList, 200);

        } else if (facilityList && facilityList.length > 0 && type == "mobile") {

            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.MOBILE_EXISTS : AppStringJapan.MOBILE_EXISTS }, 200);
        } else if (facilityList && facilityList.length > 0 && type == "mobile2") {

            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.MOBILE_EXISTS : AppStringJapan.MOBILE_EXISTS }, 200);
        } else {
            return commonUtils.sendSuccess(req, res, { message: "" }, 200);
        }

        // return commonUtils.sendSuccess(req, res, facilityList, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}



const uploadImage = async (req: Request, res: Response) => {
    const { type } = req.params;
    let destination = "./uploads/images";
    if (type == "profile") {
        destination = "./uploads/profile"
    } else if (type == "contract") {
        destination = "./uploads/contract"
    } else if (type == "license") {
        destination = "./uploads/license"
    } else if (type == "report") {
        destination = "./uploads/report"
    }
    const image_ = multer({
        storage: commonFileStorage(destination),
        fileFilter: fileFilter,
    }).single("file");

    image_(req, res, async (err: any) => {
        console.log(err);
        if (err) return commonUtils.sendError(req, res, { message: err.message }, 409);
        if (!req.file) return commonUtils.sendError(req, res, { message: AppStringEng.IMAGE_NOT_FOUND }, 409);
        const image_name = req.file.filename;
        return commonUtils.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    });
}

async function StaffList(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let _id = req.headers.userid;
        let { search, type }: any = req.query;
        let filter: any = {
            name: { $exists: true, $ne: null }
        };
        if (type && search && search != "" && type == "email" || type == "mobile") {
            type == "email" ? filter = { ...filter, email: search } : filter = { ...filter, mobile: search }
        } else if (search && search !== "") {
            // var decoded = decodeURIComponent(search);
            // var utf8Buffer =await Buffer.from(decoded, 'hex');
            // var utf8String = utf8Buffer.toString('utf-8');
            // console.log(utf8String)
            // filter = {
            //    $or: [
            //       { name: { $regex: utf8String, $options: 'i' } },
            //       // { email: { $regex: search, $options: 'i' } },
            //       { mobile: { $regex: utf8String, $options: 'i' } },
            //       // { uniqueId: { $regex: search, $options: 'i' } }
            //    ]
            // }
            filter = { ...filter, _id: mongoose.Types.ObjectId(search) }
        }
        // console.log(filter)
        let StaffList = await User.aggregate([

            { $match: filter },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role_data'
                }
            },
            // {
            //    $match: {
            //       "role_data.name": { $ne: "superAdmin" },
            //    }
            // },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    uniqeId: 1,
                    status: 1,
                    createdAt: 1

                }
            }
        ])
        if (StaffList && !type) {

            return commonUtils.sendSuccess(req, res, StaffList, 200);
        } else if (StaffList && StaffList.length > 0 && type == "email") {
            // console.log("hdehde")
            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.EMAIL_EXISTS : AppStringJapan.EMAIL_EXISTS }, 200);
        } else if (StaffList && StaffList.length > 0 && type == "mobile") {

            return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.MOBILE_EXISTS : AppStringJapan.MOBILE_EXISTS }, 200);
        } else {
            return commonUtils.sendSuccess(req, res, { message: "" }, 200);
        }
    } catch (err: any) {
        // console.log("hiiidewdew")
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

async function callHistory(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let { page, limit, pageToken, to }: any = req.query;
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 10;
        // console.log({page})
        // if(pageToken){
        client.calls.page({
            pageSize: limit,
            pageNumber: page,
            pageToken: pageToken ?? "",
            status: "completed",
            from: "+815018085051"
        }).then(async (calls: any) => {
            let callData = calls.instances;
            // console.log("calllog", callData)
            // console.log(calls.parentCallSid ?? 'not available')
            // const parentCall = await client.calls(callData.parentCallSid ?? "").fetch()
            // callData = await callData.filter((item: any) => {
            //     return item.to != "+815018085051"
            // });
            // console.log(callData.length)
            let facilityNumbers = _.pluck(callData, "from")//facility
            let staffNumbers = _.pluck(callData, "to")//staff
            // console.log(staffNumbers)
            // console.log(facilityNumbers)
            // console.log(staffNumbers)
            // let filterStaffNumber = await staffNumbers.filter((i:any)=>{return i!= "+815018085051"});
            // console.log(filterStaffNumber)
            let facilityData = await FacilityModel.find({ mobile: facilityNumbers }, { createdAt: 0, updatedAt: 0 });
            let staffData = await User.find({ mobile: staffNumbers }, { createdAt: 0, updatedAt: 0 });
            for await (const call of callData) {
                // var mobileNumber = callData[i].from;
                var mobileNumber2 = call.to;
                // var facilityInstance = facilityData.find((f: any) => f.mobile === mobileNumber);
                var staffInstance = staffData.find((f: any) => f.mobile === mobileNumber2);


                const parentCall = await client.calls(call.parentCallSid).fetch()

                var mobileNumber = parentCall?.from;
                // console.log(mobileNumber)
                // console.log(facilityData)
                //let facilityData = await FacilityModel.find(filter, {createdAt: 0, updatedAt: 0});
                var facilityInstance = await FacilityModel.findOne({ $or: [{ mobile: mobileNumber }, { mobile2: mobileNumber }] });
                // console.log(facilityInstance)

                call["facility_data"] = facilityInstance ?? {
                    "mobile": mobileNumber,
                    "name": mobileNumber,
                    "dateCreated": call.dateCreated
                }; //facilityInstance;
                call["respondent_data"] = staffInstance ?? {
                    "mobile": mobileNumber2,
                    "name": mobileNumber2,
                    "dateCreated": call.dateCreated
                };
            }
            calls.instances = callData//facilityData.length == 0 ? [] : callData
            // console.log(calls)
            // calls.instances = callData

            commonUtils.sendSuccess(req, res, { data: calls }, 200)
        }
            //commonUtils.sendSuccess(req, res, { data: calls }, 200)
        );
        // }else{
        //    commonUtils.sendSuccess(req, res, { data: [] }, 200)
        // }
    } catch (err: any) {
        console.log("call history", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}


async function downloadCallRecording(req: Request, res: Response) {
    try {
        let { callId }: any = req.query;

        client.calls(callId).recordings.list().then((logs: any) => {
            if (logs.length > 0) {
                const recording = logs[0].toJSON();
                recording["media_url"] = ("https://api.twilio.com" + recording["uri"]).replace(".json", ".mp3")
                res.send(recording)
                commonUtils.sendSuccess(req, res, { data: recording }, 200)
            } else {
                return commonUtils.sendError(req, res, { message: "Recoding not found" }, 409);
            }
        })

    } catch (err: any) {
        console.log("call history", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

async function missedCallHistory(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let { page, limit, pageToken, to, search }: any = req.query;
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 5;

        let filter: any = {};
        if (search && search != "") {
            filter = { name: { $regex: search, $options: 'i' } }
        }

        return new Promise((resolve, reject) => {
            client.calls.page({
                pageSize: limit,
                pageNumber: page,
                pageToken: pageToken ?? "",
                status: "no-answer",
                from: "+815018085051"
            }).then(async (calls: any) => {

                // setTimeout(async function(){
                let callData = calls.instances;
                // console.log("misscalled", callData)

                // const parentCall = await client.calls(callData.parentCallSid).fetch()

                // callData = await callData.filter((item: any) => {
                //     return item.to != "+815018085051"
                // });
                let sid = await _.pluck(callData, 'sid');
                let exist = await DeletedCall.find({ sid: sid });
                let sidExist = await _.pluck(exist, 'sid');
                callData = await callData.filter((item: any) => !sidExist.includes(item.sid));

                // let facilityNumbers = await _.pluck(callData, "from")//facility
                //
                // filter = {...filter, mobile: facilityNumbers}

                // console.log(filter)
                // let facilityData = await FacilityModel.find(filter, {createdAt: 0, updatedAt: 0});
                for await (const call of callData) {

                    // console.log("missedcall", call?.parentCallSid)
                    const parentCall = await client.calls(call.parentCallSid).fetch()

                    var mobileNumber = parentCall?.from;
                    // console.log(mobileNumber)
                    // console.log(facilityData)
                    //let facilityData = await FacilityModel.find(filter, {createdAt: 0, updatedAt: 0});
                    // var facilityInstance = await FacilityModel.findOne({mobile: mobileNumber});
                    var facilityInstance = await FacilityModel.findOne({ $or: [{ mobile: mobileNumber }, { mobile2: mobileNumber }] });
                    // console.log(facilityInstance)

                    call["facility_data"] = facilityInstance ?? {
                        "mobile": mobileNumber,
                        "name": mobileNumber,
                        "dateCreated": call.dateCreated
                    };
                    // console.log(call)
                }

                // console.log(callData)
                console.log(calls)

                calls.instances = callData//  || facilityData.length == 0 ? [] : callData
                // calls.instances = facilityData.length == 0 ? [] : callData
                commonUtils.sendSuccess(req, res, { data: calls }, 200)
                // },500)
            }
            )
        })
            ;
    } catch (err: any) {
        console.log("missed call history", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

async function callHistoryByFacilityId(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let { page, limit, pageToken, facilityId, to, from }: any = req.query;
        if (!facilityId) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.FACILITY_ID_REQURIED : AppStringJapan.FACILITY_ID_REQURIED })
        page = page ? Number(page) : 1;
        limit = limit ? Number(limit) : 10;
        // console.log({page})
        let from2 = await FacilityModel.findOne({ _id: mongoose.Types.ObjectId(facilityId) });
        // console.log(from2?.mobile)
        // client.calls.page({
        //     pageSize: limit,
        //     pageNumber: page,
        //     pageToken: pageToken ?? "",
        //     from: from ?? "",
        //     to: from2?.mobile ?? ""
        // }).then(async (calls: any) => {
        //     // let callData = calls.instances;
        //     // callData = await callData.filter((item: any) => {
        //     //     return item.to != "+815018085051"
        //     // });
        //     commonUtils.sendSuccess(req, res, {data: calls}, 200)
        // });
        from = from2?.mobile.toString() ?? "";
        // console.log(from, to)
        client.calls.page({
            pageSize: limit,
            pageNumber: page,
            pageToken: pageToken ?? "",
            to: "+815018085051",
            from: from,
            status: "completed"
        }).then(async (calls: any) => {
            let callData = calls.instances;
            // console.log(callData)
            // console.log(callData.length)
            // callData = await callData.filter((item: any) => {
            //     return item.to != "+815018085051"
            // });
            // let facilityNumbers = _.pluck(callData, "from")//facility
            let staffNumbers = _.pluck(callData, "to")//staff
            // console.log(staffNumbers)
            // console.log(facilityNumbers)
            // console.log(staffNumbers)
            // let filterStaffNumber = await staffNumbers.filter((i:any)=>{return i!= "+815018085051"});
            // console.log(filterStaffNumber)
            // let facilityData = await FacilityModel.find({mobile: facilityNumbers}, {createdAt: 0, updatedAt: 0});
            // let staffData = await User.find({mobile: staffNumbers}, {createdAt: 0, updatedAt: 0});
            for await (const call of callData) {
                var mobileNumber = call.from;
                // var mobileNumber2 = call.to;
                var facilityInstance = await FacilityModel.findOne({ mobile: mobileNumber });

                console.log("parent Call", call?.sid)
                const parentCall = await client.calls.list({
                    limit: 1,
                    parentCallSid: call?.sid
                });
                // console.log(parentCall[0].to);
                var mobileNumber2 = parentCall.length > 0 ? parentCall[0].to : "";

                var staffInstance = await User.findOne({ mobile: mobileNumber2 });

                call["facility_data"] = facilityInstance ?? {
                    "mobile": mobileNumber,
                    "name": mobileNumber,
                    "dateCreated": call.dateCreated
                };
                call["respondent_data"] = staffInstance ?? {
                    "mobile": mobileNumber2,
                    "name": mobileNumber2,
                    "dateCreated": call.dateCreated
                };
                ;
            }
            calls.instances = callData//facilityData.length == 0 ? [] : callData
            // console.log(calls.instances.length)
            // calls.instances = callData

            commonUtils.sendSuccess(req, res, { data: calls }, 200)
        }
            //commonUtils.sendSuccess(req, res, { data: calls }, 200)
        );
    } catch (err: any) {
        console.log("call history", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

async function testChanges(req: Request, res: Response) {
    try {
        // let changes = await User.deleteMany({email:{$ne:"admin@gmail.com"}})
        let callData = [
            {
                sid: 'CA3800ea13dad156c881f42c98ee34461a',
                dateCreated: "2023-06-09T13:04:09.000Z",
                dateUpdated: "2023-06-09T13:05:06.000Z",
                parentCallSid: 'CA523de119bd283f34ff9513d1425f4c76',
                accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                to: '+917405249551',
                toFormatted: '+917405249551',
                from: '+16472280694',
                fromFormatted: '(647) 228-0694',
                phoneNumberSid: 'PN6e037bc72efbf2298fce1abaa10c52db',
                status: 'completed',
                startTime: "2023-06-09T13:04:14.000Z",
                endTime: "2023-06-09T13:05:06.000Z",
                duration: '52',
                price: '-0.04730',
                priceUnit: 'USD',
                direction: 'outbound-dial',
                answeredBy: null,
                apiVersion: '2010-04-01',
                forwardedFrom: '+17787184245',
                groupSid: null,
                callerName: null,
                queueTime: '0',
                trunkSid: '',
                uri: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a.json',
                subresourceUris: {
                    feedback: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Feedback.json',
                    user_defined_messages: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/UserDefinedMessages.json',
                    notifications: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Notifications.json',
                    recordings: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Recordings.json',
                    streams: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Streams.json',
                    payments: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Payments.json',
                    user_defined_message_subscriptions: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/UserDefinedMessageSubscriptions.json',
                    siprec: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Siprec.json',
                    events: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA3800ea13dad156c881f42c98ee34461a/Events.json',
                    feedback_summaries: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/FeedbackSummary.json'
                }
            },
            {
                sid: 'CA523de119bd283f34ff9513d1425f4c76',
                dateCreated: "2023-06-09T13:03:41.000Z",
                dateUpdated: "2023-06-09T13:05:06.000Z",
                parentCallSid: null,
                accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                to: '+17787184245',
                toFormatted: '(778) 718-4245',
                from: '+16472280694',
                fromFormatted: '(647) 228-0694',
                phoneNumberSid: 'PN6e037bc72efbf2298fce1abaa10c52db',
                status: 'completed',
                startTime: "2023-06-09T13:03:52.000Z",
                endTime: "2023-06-09T13:05:06.000Z",
                duration: '74',
                price: '-0.01700',
                priceUnit: 'USD',
                direction: 'inbound',
                answeredBy: null,
                apiVersion: '2010-04-01',
                forwardedFrom: '+17787184245',
                groupSid: null,
                callerName: null,
                queueTime: '0',
                trunkSid: '',
                uri: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76.json',
                subresourceUris: {
                    feedback: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Feedback.json',
                    user_defined_messages: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/UserDefinedMessages.json',
                    notifications: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Notifications.json',
                    recordings: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Recordings.json',
                    streams: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Streams.json',
                    payments: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Payments.json',
                    user_defined_message_subscriptions: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/UserDefinedMessageSubscriptions.json',
                    siprec: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Siprec.json',
                    events: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA523de119bd283f34ff9513d1425f4c76/Events.json',
                    feedback_summaries: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/FeedbackSummary.json'
                }
            },
            {
                sid: 'CAaf31bbdb06cb7748597ac1880b4af021',
                dateCreated: "2023-06-09T12:36:22.000Z",
                dateUpdated: "2023-06-09T12:36:53.000Z",
                parentCallSid: null,
                accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                to: '+17787184245',
                toFormatted: '(778) 718-4245',
                from: '+16472280694',
                fromFormatted: '(647) 228-0694',
                phoneNumberSid: 'PN6e037bc72efbf2298fce1abaa10c52db',
                status: 'completed',
                startTime: "2023-06-09T12:36:37.000Z",
                endTime: "2023-06-09T12:36:53.000Z",
                duration: '16',
                price: '-0.00850',
                priceUnit: 'USD',
                direction: 'inbound',
                answeredBy: null,
                apiVersion: '2010-04-01',
                forwardedFrom: '+17787184245',
                groupSid: null,
                callerName: null,
                queueTime: '0',
                trunkSid: '',
                uri: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021.json',
                subresourceUris: {
                    feedback: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Feedback.json',
                    user_defined_messages: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/UserDefinedMessages.json',
                    notifications: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Notifications.json',
                    recordings: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Recordings.json',
                    streams: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Streams.json',
                    payments: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Payments.json',
                    user_defined_message_subscriptions: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/UserDefinedMessageSubscriptions.json',
                    siprec: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Siprec.json',
                    events: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAaf31bbdb06cb7748597ac1880b4af021/Events.json',
                    feedback_summaries: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/FeedbackSummary.json'
                }
            },
            {
                sid: 'CA4d411ba29bc5fbbc8fa50b4c13df1b8b',
                dateCreated: "2023-06-09T12:35:44.000Z",
                dateUpdated: "2023-06-09T12:36:14.000Z",
                parentCallSid: null,
                accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                to: '+17787184245',
                toFormatted: '(778) 718-4245',
                from: '+16472280694',
                fromFormatted: '(647) 228-0694',
                phoneNumberSid: 'PN6e037bc72efbf2298fce1abaa10c52db',
                status: 'completed',
                startTime: "2023-06-09T12:35:55.000Z",
                endTime: "2023-06-09T12:36:14.000Z",
                duration: '19',
                price: '-0.00850',
                priceUnit: 'USD',
                direction: 'inbound',
                answeredBy: null,
                apiVersion: '2010-04-01',
                forwardedFrom: '+17787184245',
                groupSid: null,
                callerName: null,
                queueTime: '0',
                trunkSid: '',
                uri: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b.json',
                subresourceUris: {
                    feedback: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Feedback.json',
                    user_defined_messages: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/UserDefinedMessages.json',
                    notifications: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Notifications.json',
                    recordings: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Recordings.json',
                    streams: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Streams.json',
                    payments: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Payments.json',
                    user_defined_message_subscriptions: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/UserDefinedMessageSubscriptions.json',
                    siprec: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Siprec.json',
                    events: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CA4d411ba29bc5fbbc8fa50b4c13df1b8b/Events.json',
                    feedback_summaries: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/FeedbackSummary.json'
                }
            },
            {
                sid: 'CAd5fe20f42abba869a6c1b328f1d6c942',
                dateCreated: "2023-06-09T12:22:14.000Z",
                dateUpdated: "2023-06-09T12:22:45.000Z",
                parentCallSid: null,
                accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                to: '+17787184245',
                toFormatted: '(778) 718-4245',
                from: '+16472280694',
                fromFormatted: '(647) 228-0694',
                phoneNumberSid: 'PN6e037bc72efbf2298fce1abaa10c52db',
                status: 'completed',
                startTime: "2023-06-09T12:22:28.000Z",
                endTime: "2023-06-09T12:22:45.000Z",
                duration: '17',
                price: '-0.00850',
                priceUnit: 'USD',
                direction: 'inbound',
                answeredBy: null,
                apiVersion: '2010-04-01',
                forwardedFrom: '+17787184245',
                groupSid: null,
                callerName: null,
                queueTime: '0',
                trunkSid: '',
                uri: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942.json',
                subresourceUris: {
                    feedback: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Feedback.json',
                    user_defined_messages: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/UserDefinedMessages.json',
                    notifications: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Notifications.json',
                    recordings: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Recordings.json',
                    streams: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Streams.json',
                    payments: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Payments.json',
                    user_defined_message_subscriptions: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/UserDefinedMessageSubscriptions.json',
                    siprec: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Siprec.json',
                    events: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/CAd5fe20f42abba869a6c1b328f1d6c942/Events.json',
                    feedback_summaries: '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Calls/FeedbackSummary.json'
                }
            }
        ];
        //  console.log(callData.length)
        let sid = _.pluck(callData, 'sid');
        let exist = await DeletedCall.find({ sid: sid });
        let sidExist = _.pluck(exist, 'sid');
        callData = callData.filter(item => !sidExist.includes(item.sid));

        // let changes = await FacilityModel.updateMany({allowLogin:{$exists:false}},{$set:{allowLogin:true}});
        return commonUtils.sendSuccess(req, res, { message: "success", changes: callData }, 409);
    } catch (err: any) {
        console.log("TEST CHANGES", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function allfacilityList(req: Request, res: Response) {
    try {

        let lang = req.headers.lang ?? "en";

        let { search }: any = req.query;


        let filter: any = { status: 1 };

        if (search && search !== "") {

            filter = {
                ...filter,
                $or: [
                    { name: { $regex: search, $options: 'i' } }
                ]
            }
        }

        var facilityList = await FacilityModel.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },

            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    mobile: 1, mobile2: 1,
                    uniqeId: 1,
                    status: 1,
                    createdAt: 1

                }
            }
        ])
        return commonUtils.sendSuccess(req, res, facilityList, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }

}

async function deleteMissCall(req: Request, res: Response) {
    try {

        let lang = req.headers.lang ?? "en";
        let userId = req.headers.userid;
        // console.log("body",req.body)
        let { sid } = req.body;
        // console.log(sid)

        if (!sid) return commonUtils.sendError(req, res, { message: lang == "en" ? AppStringEng.SID_REQUIRED : AppStringJapan.SID_REQUIRED }, 409);
        let del = new DeletedCall();
        del.sid = sid;
        del.userId = userId
        await del.save();
        return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.CALL_DELETE_SUCCESS : AppStringJapan.CALL_DELETE_SUCCESS }, 200);

    } catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

export default {
    register,
    signupVerifyOtp,
    resend,
    login,
    logout,
    updateProfile,
    getProfile,

    addStaff,
    updateStaff,
    deleteStaff,
    changeStatusStaff,
    getStaff,
    //..................Password
    getOtp,
    verifyOtp,
    forgotPassword,
    changePassword,
    //...................Password

    /* Facility */
    addFacility,
    updateFacility,
    deleteFacility,
    changeStatusFacility,
    cancelFacilityContract,
    getFacility,
    facilityList,
    StaffList,
    /* upload */
    uploadImage,
    callHistory,
    downloadCallRecording,
    callHistoryByFacilityId,
    missedCallHistory,
    plans,
    testChanges,
    allfacilityList,
    deleteMissCall
}