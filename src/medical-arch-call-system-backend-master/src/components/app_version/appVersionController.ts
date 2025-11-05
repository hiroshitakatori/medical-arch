
const AppVersion = require("./appVersionModel");
import { Request, Response } from "express";
import commonUtils, { fileFilter, categoryFileStorage } from "../../utils/commonUtils";

const _ = require("underscore");

async function appVersionAdd(req: Request, res: Response) {
    try {
        let { android_version, ios_version, phone, email }: any = req.body;
        let appVersion = await new AppVersion({
            android_version: android_version,
            ios_version: ios_version,
            email: email,
            phone: phone
        })
        await appVersion.save();
        return commonUtils.sendSuccess(req, res, { message: "Setting save succesfully!" }, 200);
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function appVersionUpdate(req: Request, res: Response) {
    try {
        let { _id } = req.params;
        let { android_version, ios_version, email, phone }: any = req.body;

        let appVersion = await AppVersion.findById({ _id });
        if (appVersion) {
            appVersion.android_version = android_version ? android_version : appVersion.android_version;
            appVersion.ios_version = ios_version ? ios_version : appVersion.ios_version;
            appVersion.email = email ? email : appVersion.email;
            appVersion.phone = phone ? phone : appVersion.phone;

            await appVersion.save();
            return commonUtils.sendSuccess(req, res, { message: "Setting updated successfully!" }, 200);
        }
        else {
            return commonUtils.sendError(req, res, { message: "Setting not exist!" }, 409);
        }
    }
    catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function getAppVersion(req: Request, res: Response) {
    try {
        const app_version_details = await AppVersion.findOne({}).select("_id android_version ios_version phone email").limit(1);
        return commonUtils.sendAdminSuccess(req, res, app_version_details, 200);
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

export default {
    appVersionAdd,
    appVersionUpdate,
    getAppVersion,

}