import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { UserType } from "../../utils/enum";
import { AppStringEng } from "../../utils/appStrings";

async function permissionValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {

        "name": "required|string|max:255|exist:Permission,name"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function permissionUpdateValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "name": "required|string|max:255|exist_value_admin:Permission,name," + req.params._id
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
export default {
    permissionValidation,
    permissionUpdateValidation
}