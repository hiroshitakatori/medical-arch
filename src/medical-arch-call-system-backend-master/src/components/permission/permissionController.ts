import { AppStringEng,AppStringJapan } from "../../utils/appStrings";
// const User = require("../../users/models/userModel");
const Permission = require("./permissionModel");
import { NextFunction, query, Request, Response } from "express";
import commonUtils, { fileFilter, fileStorage } from "../../utils/commonUtils";
const mongoose = require("mongoose");
const Role = require("../role/roleModel");
const _ = require("underscore");
async function permissionAdd(req: Request, res: Response) {
    try {
        //console.log("add")
        let permission = await new Permission({
            name: req.body.name
        });
        const role = await Role.findOne({ name: "super_admin" });
        //console.log(role);
        if (role) {
            let new_permission = role.permission;
            new_permission[req.body.name] = "11111";
            await Role.updateOne({ name: "super_admin" }, { $set: { permission: new_permission } })
        }

        await permission.save();
        //console.log(permission)
        return commonUtils.sendSuccess(req, res, { permission, role });
    }
    catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function permissionUpdate(req: Request, res: Response) {
    try {
        let { _id } = req.params;
        const { name, status } = req.body;
        const exist = await Permission.findById({ _id: _id });
        if (exist) {
            let old_name = "permission." + exist.name;
            let new_name = "permission." + name;
            
            await Role.update({}, { $unset: { [old_name]: 1 } }, { multi: true });
            await Role.update({old_name : exist.name}, { $set: { [new_name]: "11111" } }, { multi: true });

            exist.name = name ? name : exist.name;
            exist.status = status ? status : exist.status;
            await exist.save();
            return commonUtils.sendSuccess(req, res, { message: "Permission name updated successfully!" });
        }
        else {
            return commonUtils.sendError(req, res, { message: "Permission not exist!" }, 409);
        }
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function getPermission(req: Request, res: Response) {
    try {
        
        const permission = await Permission.find({}).select("name status").sort({createdAt:-1});
        if (permission) {
            let permission_object: any = {};
            const names = _.pluck(permission, "name");
            await names.forEach((n: any) => {
                permission_object[n] = "00000";
            })
            return commonUtils.sendSuccess(req, res, { permission: permission, permission_name: names, permission_object: permission_object }, 200);
        }
        else {
            return commonUtils.sendError(req, res, { message: "Permission not exist!" }, 409);
        }
    }
    catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function deletePermission(req: Request, res: Response) {
    try {
        const { _id } = req.params;
        const exist = await Permission.findOneAndDelete({ _id });
        if (exist) {
            let p_name = "permission." + exist.name;
            const Roles = await Role.update({}, { $unset: { [p_name]: 1 } }, { multi: true });
            return commonUtils.sendSuccess(req, res, { message: "permission deleted succesfully" }, 200);
        }
        else {
            return commonUtils.sendError(req, res, { message: "permission not exist!" }, 409);
        }
    }
    catch (err: any) {
        console.log(err);
        return commonUtils.sendError(req, res, { message: err.message });
    }
}

const activeInactivePermission = async function (req: Request, res: Response) {
    try {
        const _id = req.params._id;
        const permission = await Permission.findById({ _id: _id });
        if (!permission) return commonUtils.sendError(req, res, { message: "Permission not exist" });
        permission.status = permission.status ? 0 : 1;
        let msg = permission.status ? "Active" : "De-Active";
        await permission.save();
        // await mainCategory.updateMany({ main_category_id: main_category._id }, { status: main_category.status });
        return commonUtils.sendSuccess(req, res, { message: "Permission status " + msg + " succesfully" }, 200);
    }
    catch (err: any) {
        return commonUtils.sendSuccess(req, res, { message: err.message });
    }
}

export default {
    permissionAdd,
    permissionUpdate,
    getPermission,
    deletePermission,
    activeInactivePermission
}