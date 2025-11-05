import { AppStringEng } from "../../utils/appStrings";
// const User = require("../../users/models/userModel");
const Role = require("./roleModel");
import { NextFunction, query, Request, Response } from "express";
import commonUtils, { fileFilter, fileStorage } from "../../utils/commonUtils";
const User = require("../users/userModel");
const mongoose = require("mongoose");
const _ = require("underscore");
const Permission = require("../permission/permissionModel");
async function roleAdd(req: Request, res: Response) {
    try {
        let { name, permission }: any = req.body;
        let permissionNames = await Permission.find({ status: 1 }).select("name");
        let pnames = _.pluck(permissionNames, "name");
        await pnames.forEach((element: any) => {
            if (typeof permission[element] == "undefined") {
                permission[element] = "00000"
            }
        });
        let role = await new Role({
            name: name,
            permission: permission
        })

        await role.save();
        return commonUtils.sendSuccess(req, res, { id: role._id }, 200);
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function roleEdit(req: Request, res: Response) {
    try {
        let { _id }: any = req.body;

        let role = await Role.findById(_id);

        if (role) {
            return commonUtils.sendSuccess(req, res, role, 200);
        }
        else {
            return commonUtils.sendError(req, res, { message: "role not exist" }, 409);
        }
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function roleUpdate(req: Request, res: Response) {
    try {
        let { _id } = req.params;
        let sub_admin_id = req.headers.userid;
        // console.log("admin role", _id)
        // console.log("sub_admin_id", sub_admin_id)

        let { name, permission }: any = req.body;

        let permissionNames = await Permission.find({ status: 1 }).select("name");
        let pnames = _.pluck(permissionNames, "name");
        await pnames.forEach((element: any) => {
            if (typeof permission[element] == "undefined") {
                permission[element] = "00000"
            }
        });
        let role = await Role.findById({ _id });
        if (!role) return commonUtils.sendError(req, res, { message: "role not exist!" }, 409);
        let SuperAdmin = await User.findOne({ adminrole: _id });
        // console.log("SuperAdmin",SuperAdmin._id.toString())

        if (name == "super_admin") {
            if (SuperAdmin._id.toString() == sub_admin_id) {
                role.name = name ? name : role.name;
                role.permission = permission ? permission : role.permission;
                await role.save();
                return commonUtils.sendSuccess(req, res, role, 200);
            }
            else {
                return commonUtils.sendError(req, res, { message: "Only super admin can changes this role permission" }, 409);
            }
        } else {
            role.name = name ? name : role.name;
            role.permission = permission ? permission : role.permission;
            await role.save();
            return commonUtils.sendSuccess(req, res, role, 200);
        }

    }
    catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function getRole(req: Request, res: Response) {
    try {
        var roles;
        if (req.query.type) {
            roles = await Role.find({ name: { $ne: "super_admin" }, status: 1 }).sort({ createdAt: -1 });
        } else {
            roles = await Role.find({ name: { $ne: "super_admin" } }).sort({ createdAt: -1 });
        }
        return commonUtils.sendSuccess(req, res, roles, 200);
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function deleteRole(req: Request, res: Response) {
    try {
        const { _id } = req.params;
        const role = await Role.findByIdAndDelete({ _id })
        if (role) {
            const default_role = await Role.findOne({ name: "default" }).select("_id").limit(1);
            let default_role_id = default_role ? default_role._id : "";
            const admin = await User.update({ adminrole: mongoose.Types.ObjectId(_id) }, { $set: { adminrole: default_role_id } }, { multi: true });
            return commonUtils.sendSuccess(req, res, { message: "role deleted successfully!" }, 200)
        }
        else {
            return commonUtils.sendSuccess(req, res, { message: "role not exist!" }, 200)
        }
    }
    catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

const activeInactiveRole = async function (req: Request, res: Response) {
    try {
        const _id = req.params._id;
        const role = await Role.findById({ _id: _id });
        if (!role) return commonUtils.sendError(req, res, { message: "Role not exist" });
        role.status = role.status ? 0 : 1;
        let msg = role.status ? "Active" : "De-Active";
        await role.save();
        // await mainCategory.updateMany({ main_category_id: main_category._id }, { status: main_category.status });
        return commonUtils.sendSuccess(req, res, { message: "Role status " + msg + " succesfully" }, 200);
    }
    catch (err: any) {
        return commonUtils.sendSuccess(req, res, { message: err.message });
    }
}
export default {
    roleAdd,
    roleEdit,
    roleUpdate,
    getRole,
    deleteRole,
    activeInactiveRole
}