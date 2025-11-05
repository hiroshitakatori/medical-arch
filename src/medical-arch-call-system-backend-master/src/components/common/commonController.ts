import { AppStringEng,AppStringJapan } from "../../utils/appStrings";
// const User = require("../../users/models/userModel");
import { NextFunction, query, Request, Response } from "express";
import commonUtils, { fileFilter, commonFileStorage, fileFilterPdf, fileStoragePdf, deleteSingleFile } from "../../utils/commonUtils";
import { AppConstants } from "../../utils/appConstants";
const _ = require("underscore");
const multer = require("multer");
const mongoose = require("mongoose");

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    var { type } = req.params;
    let destination = "./uploads/images";
    if (type == "profile") {
        destination = "./uploads/profile"
    } else if (type == "contract") {
        destination = "./uploads/contract"
    } else if (type == "license") {
        destination = "./uploads/license"
    }else if (type == "report") {
        destination = "./uploads/report"
    }
    const image_ = multer({
        storage: commonFileStorage(destination),
        // fileFilter: fileFilter,
    }).single("file");

    image_(req, res, async (err: any) => {
        if (err) return commonUtils.sendError(req, res, { message: err.message }, 409);
        if (!req.file) return commonUtils.sendError(req, res, { message: AppStringEng.IMAGE_NOT_FOUND }, 409);
        const image_name = req.file.filename;
        return commonUtils.sendSuccess(req, res, {
            file_name: image_name
        }, 200);
    });
}
async function uploadPdf(req: Request, res: Response, next: NextFunction) {
    const file = multer({
        storage: fileStoragePdf,
        fileFilter: fileFilterPdf,
        limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }
    }).single("pdf");

    file(req, res, async (err: any) => {

        if (err) {

            return commonUtils.sendError(req, res, { message: "Pdf not uploaded" }, 409);
        }
        if (!req.file) return commonUtils.sendError(req, res, { message: "Pdf not found" }, 404);
        const image_name = req.file.filename;
        return commonUtils.sendSuccess(req, res, {
            message:"file upload success",file_name: image_name,
        }, 200);
    });
}
async function deleteImage(req: Request, res: Response, next: NextFunction) {
    var {type,file} = req.body;
    if (type && type !="") {
        await deleteSingleFile(file, type=="contract" ? AppConstants.CONTRACT_PATH : type=="profilePic" ? AppConstants.PROFILE_PATH : AppConstants.LICENSE_PATH)
        return commonUtils.sendSuccess(req, res, {
            message:"file delete success",
        }, 200);
    }
    
}
export default {
    uploadImage,
    uploadPdf,
    deleteImage
}