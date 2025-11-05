import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { UserType } from "../../utils/enum";
import { AppStringEng } from "../../utils/appStrings";
const mongoose = require("mongoose");

async function roleValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "name": "required|string|max:255|exist:Role,name"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function roleUpdateValidation(req: Request, res: Response, next: NextFunction) {
    // let _id = mongoose.Types.ObjectId(req.params._id);
    let ValidationRule: any = {
        "name": "required|string|max:255|exist_value_admin:Role,name," + req.params._id
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
export default {
    roleValidation,
    roleUpdateValidation
}