import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";
const mongoose_ = require('mongoose');

const PermissionSchema = new mongoose_.Schema({
    name:{
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 is Deactive 1 is Active'
    },
}, { timestamps: true });

module.exports = mongoose_.model(AppConstants.MODEL_PERMISSION, PermissionSchema);