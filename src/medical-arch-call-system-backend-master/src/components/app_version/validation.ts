import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
const AppVersion = require("./appVersionModel");
import commonUtils from "../../utils/commonUtils";

async function appVersionValidation(req: Request, res: Response, next: NextFunction) {
    const count = await AppVersion.find({}).countDocuments();

    let ValidationRule: any = {
        "android_version": "required|numeric|min:1|max:255",
        "ios_version": "required|numeric|min:1|max:255",
        "phone": "required|min:8|max:15",
        "email": "required|string|email|max:255"
    }
    if (count == 0) {
        validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
    } else {
        return commonUtils.sendError(req, res, { message: "App version already added!" }, 404);
    }
}
async function appVersionUpdateValidation(req: Request, res: Response, next: NextFunction) {

    let ValidationRule: any = {
        "android_version": "required|numeric|min:1|max:255",
        "ios_version": "required|numeric|min:1|max:255"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

export default {
    appVersionValidation,
    appVersionUpdateValidation
}