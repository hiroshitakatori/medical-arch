import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import {  UserType, } from "../../utils/enum";
import { AppStringEng,AppStringJapan } from "../../utils/appStrings";


async function addReportValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        // "facilityId": "required",
        // "nameOfFacility": "required",
        // "staffId": "required",
        // "respondentId": "required",
        // "respondentDate": "required",
        // "residentName": "required",
        // "temperature": "required",
        // "pulse": "required",
        // "sp02": "required",
        // "projectType": "required",
        // "amountOfStool": "required",
        // "respiratory": "required",
        // "cyanosis": "required",
        // "reportType": "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function updateReportValidation(req: Request, res: Response, next: NextFunction) {
    let _id = req.body._id;
    const validationRule = {
        "_id": "required",
        // "facilityId": "required",
        // "nameOfFacility": "required",
        // "staffId": "required",
        // "respondentId": "required",
        // "respondentDate": "required",
        // "residentName": "required",
        // "temperature": "required",
        // "pulse": "required",
        // "sp02": "required",
        // "projectType": "required",
        // "amountOfStool": "required",
        // "respiratory": "required",
        // "cyanosis": "required",
        // "reportType": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {

    addReportValidation,
    updateReportValidation
}