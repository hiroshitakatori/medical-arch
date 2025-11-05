import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { UserType } from "../../utils/enum";
import { AppStringEng } from "../../utils/appStrings";
const mongoose = require("mongoose");

async function shiftAddValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "name": "required|string|max:255|exist:Shift,name",
        "startTime": "required|string|max:255",
        "endTime": "required|string|max:255",
        "order": "required|numeric|min:1|max:4"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function addShiftValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        // "shiftId": "required",
        "staffId": "required"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function symptomsAddValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "jname": "required|exist:Symptoms,jname",
        "ename": "required|exist:Symptoms,ename"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function shiftUpdateValidation(req: Request, res: Response, next: NextFunction) {
    // let _id = mongoose.Types.ObjectId(req.params._id);
    let ValidationRule: any = {
        "name": "required|string|max:255|exist_value_admin:Shift,name,"+ req.params._id,
        // "startTime": "required|string|max:255",
        // "endTime": "required|string|max:255",
        // "order": "required|numeric|min:1|max:4"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
export default {
    shiftAddValidation,
    shiftUpdateValidation,
    addShiftValidation,
    symptomsAddValidation
}