import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import {  UserType, } from "../../utils/enum";
import { AppStringEng,AppStringJapan } from "../../utils/appStrings";


async function addFacilityValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        "name": "required|string|min:1|max:255",
        "email": "required|string|email|max:255|check_email:Facility,email," + req.body.email + "|exist_with_type:Facility,email," + req.body.email,
        "mobile": "required|min:8|exist_with_type:Users,mobile," + req.body.mobile,
        "address":"required|string|max:500",
        "yomi":"required|string|max:500",
        "cost":"required|numeric|min:1",
        "amount":"required|numeric|min:1",
        "managerName":"required|string|max:150",
        // "facilityManagerName":"required|string|max:150",
        "contractDetails":"required|string|max:150",
        "capacity":"required|string|max:150",
        "businessType":"required",
        "plan":"required",
        "affiliatedFacility":"required",
        // "memoForFacility":"required",
        // "memoForStaff":"required",
        "contractStartDate":"required",
        "contract":"required",
        // "contractEndDate":"required",
        "subscriberRegistrant":"required",
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function updateStaffValidation(req: Request, res: Response, next: NextFunction) {
    let _id = req.body._id;
    const validationRule = {
        "_id": "required",
        "name": "required|string|min:1|max:255",
        "email": "required|string|email|max:255|exist_value_admin:Facility,email," + _id,
        "mobile": "required|numeric|min:8|exist_value_admin:Facility,mobile," + _id,
        "address":"required|string|max:500",
        "yomi":"required|string|max:500",
        "managerName":"required|string|max:150",
        "contractDetails":"required|string|max:150",
        "capacity":"required|string|max:150",
        "businessType":"required",
        "plan":"required",
        "affiliatedFacility":"required",
        // "memoForFacility":"required",
        // "memoForStaff":"required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function changePasswordValidation(req: any, res: any, next: NextFunction) {
    if (req.headers.userid === undefined)
        return commonUtils.sendError(req, res, { message: AppStringEng.USERID_MISSING }, 409);
    // "confirmPassword": "required|min:6|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/|same:newPassword",
        var validationRule :any={
            "newPassword": "required|different:oldPassword",
            "confirmPassword": "required|same:newPassword",
        }
        if(req?.body?.passReset || req?.body?.passReset==1){
            validationRule = {

                "oldPassword": "required|max:50",
                ...validationRule
            }
        }else{
            validationRule ={
                "newPassword": "required",
                "confirmPassword": "required|same:newPassword",
            }
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
async function updateFacilityValidation(req: Request, res: Response, next: NextFunction) {

    console.log(req.body)

    let _id = req.body._id;
    var validationRule :any={};
    if(!req?.body?.isFacility || req?.body?.isFacility==false){
        validationRule = {
            "_id": "required",
            "name": "required|string|min:1|max:255",
            "email": "required|string|email|max:255|exist_value_admin:Facility,email," + _id,
            "mobile": "required|numeric|min:8|exist_value_admin:Facility,mobile," + _id,
            "address":"required|string|max:500",
            "yomi":"required|string|max:500",
            "facilityManagerName":"required|string|max:150",
            "contractDetails":"required|string|max:150",
            "capacity":"required|string|max:150",
            "businessType":"required",
            "plan":"required",
            // "affiliatedFacility":"required",
            // "memoForFacility":"required",
            // "memoForStaff":"required",
        }
    }else{
        validationRule = {
            "_id": "required",
            "memoForFacility":"required"
        }
    }
   
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
export default {

    addFacilityValidation,
    updateStaffValidation,
    changePasswordValidation,
    verifyOTPValidation,
    OTPValidation,
    updateFacilityValidation
}