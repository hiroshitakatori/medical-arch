import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import {  UserType, } from "../../utils/enum";
import { AppStringEng,AppStringJapan } from "../../utils/appStrings";

async function registerValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        // "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "required|string|email|max:255|check_email:Users,email," + req.body.email + "|exist_with_type:Users,email," + req.body.email,
        // "mobile": "required|numeric|min:8|exist_with_type:Users,mobile," + req.body.mobile,
        "password": "required|min:8|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/",
        "confirmPassword": "required|min:8|max:50|same:password",
        // "role": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function verifySignupOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "otp": "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function addStaffValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        "name": "required|string|min:1|max:255",
        "email": "required|string|email|max:255|check_email:Users,email," + req.body.email + "|exist_with_type:Users,email," + req.body.email,
        "mobile": "required|numeric|min:8|exist_with_type:Users,mobile," + req.body.mobile,
        // "role": "required",
        // "yomi":"required|string|max:500",
        "frigana":"required|string|max:500",
        "address":"required|string|max:500",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function updateStaffValidation(req: Request, res: Response, next: NextFunction) {
    let _id = req.body._id;
    const validationRule = {
        "_id": "required",
        "name": "required|string|min:1|max:255",
        "email": "required|string|email|max:255|exist_value_admin:Users,email," + _id,
        "mobile": "required|numeric|min:8|exist_value_admin:Users,mobile," + _id,
        // "role": "required",
        // "yomi":"required|string|max:500",
        "frigana":"required|string|max:500",
        "address":"required|string|max:500",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function profileValidation(req: Request, res: Response, next: NextFunction) {

    const userId = req.headers?.userid as string;

    const ValidationRule = {
        // "name": "required|string|min:3|max:255",
        "email": "string|email|max:255|exist_value_admin:Users,email," + userId,
        "mobile": "numeric|min:8|exist_value_admin:Users,mobile," + userId,
    }

    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function changePasswordValidation(req: any, res: any, next: NextFunction) {
    if (req.headers.userid === undefined)
        return commonUtils.sendError(req, res, { message: AppStringEng.USERID_MISSING }, 409);

    const validationRule = {
        "oldPassword": "required|max:50",
        "newPassword": "required|min:8|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/|different:oldPassword",
        "confirmPassword": "required|min:8|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/|same:newPassword",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function userProfileValidation(req: Request, res: Response, next: NextFunction) {

    const userId = req.body.user_id;
    const ValidationRule = {
        "name": "required|string|min:1|max:255",
        "email": "string|email|max:255|exist_value_admin:Users,email," + userId,
        "mobile": "numeric|min:8|mobile_lenght:15|exist_value_admin:Users,mobile," + userId,
        "yomi": "required"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function updateUserValidation(req: Request, res: Response, next: NextFunction) {

    let ValidationRule: any = {
        "firstname": "required|string|min:1|max:255",
        "mobile" :"numeric|min:8|exist_value_admin:Users,mobile," + req.body.user_id
    }
    if (!req.body.email) {
        ValidationRule.mobile = "required|numeric|min:8|exist_value_admin:Users,mobile," + req.body.user_id;
    }
    else {

        ValidationRule.email = "required|string|email|max:255|exist_value_admin:Users,email," + req.body.user_id;
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function updateSubAdminValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "name": "required|string|min:1|max:255",
        "email": "required|string|email|max:255|exist_value_admin:Admin,email," + req.body.Admin_id,
        "mobile": "required|min:8|exist_value_admin:Admin,mobile," + req.body.Admin_id,
        "adminrole" :"required"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function addVendorValidation(req: Request, res: Response, next: NextFunction) {
    const validationRule = {
        "name": "required|min:1|max:255",
        "email": "required|string|email|max:255|check_email:Vendor,email," + req.body.email + "|exist_with_type:Vendor,email," + req.body.email,
        "category_type": "required",
        "businessName": "required|string|min:1|max:255",
        "businessAddress": "required",
        "businessPhone": "required|numeric|min:8|exist_with_type:Vendor,businessPhone," + req.body.businessPhone,
        "businessEmail": "required|string|email|max:255|check_email:Vendor,businessEmail," + req.body.businessEmail + "|exist_with_type:Vendor,businessEmail," + req.body.businessEmail,
        "longitude" : "required|numeric|min:-180|max:180",
        "latitude" : "required|numeric|min:-90|max:90",
        "image" :"required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function updateVendorValidation(req: Request, res: Response, next: NextFunction) {
    const vendor_id = req.params.vendor_id;
    const validationRule = {
        "name": "required|string|min:1|max:255",
        "email": "string|email|max:255|exist_value_admin:Vendor,email," + vendor_id,
        "category_type": "required",
        "businessName": "required|string|min:3|max:255",
        "businessAddress": "required",
        "businessPhone": "required|numeric|min:8|exist_value_admin:Vendor,businessPhone," + vendor_id,
        "businessEmail": "string|email|max:255|exist_value_admin:Vendor,businessEmail," + vendor_id,
        "longitude" : "required|numeric|min:-180|max:180",
        "latitude" : "required|numeric|min:-90|max:90",
        // "image" :"required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function OTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {"uniqueId":"required"}
    if (!req.body.email) {
        validationRule.mobile = "required"
    }
    else {
        validationRule.email = "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function verifyOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "otp": "required",
        "token":"required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function addFacilityValidation(req: Request, res: Response, next: NextFunction) {
    const validationRule = {
        "name": "required|string|min:1|max:255",
        "email": "required|exist_with_type_facility:Facility,email," + req.body.email,
        "mobile": "required|min:8|exist_with_type:Facility,mobile," + req.body.mobile,
        "address":"required|string|max:500",
        "yomi":"required|string|max:500",
        "cost":"required|numeric|min:0",
        "amount":"required|numeric|min:0",
        "managerName":"required|string|max:150",
        // "facilityManagerName":"required|string|max:150",
        "contractDetails":"required|string|max:150",
        "capacity":"required|string|max:150",
        "businessType":"required",
        "plan":"required",
        // "affiliatedFacility":"required",
        // "memoForFacility":"required",
        // "memoForStaff":"required",
        "contractStartDate":"required",
        // "contract":"required",
        "subscriberRegistrant":"required",
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function updateFacilityValidation(req: Request, res: Response, next: NextFunction) {

    console.log(req.body)

    let _id = req.body._id;
    // console.log("update facility validation",_id)
    const validationRule = {
        "_id": "required",
        "name": "required|string|min:1|max:255",
        "email": "required|string|email|max:255|exist_value_admin_facility:Facility,email," + _id,
        "mobile": "required|min:8",//exist_value_admin:Facility,mobile," + _id
        "address":"required|string|max:500",
        "yomi":"required|string|max:500",
        "managerName":"required|string|max:150",
        "contractDetails":"required|string|max:150",
        "capacity":"required|string|max:150",
        "businessType":"required",
        "plan":"required",
        // "affiliatedFacility":"required",
        // "memoForFacility":"required",
        // "memoForStaff":"required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
export default {
    registerValidation,
    verifySignupOTPValidation,
    profileValidation,

    addStaffValidation,
    updateStaffValidation,
    
    changePasswordValidation,
    userProfileValidation,
    updateUserValidation,
    updateSubAdminValidation,
    addVendorValidation,
    updateVendorValidation,
    verifyOTPValidation,
    OTPValidation,
    addFacilityValidation,
    updateFacilityValidation
}