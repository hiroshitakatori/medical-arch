import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";
const mongoose_ = require('mongoose');

const AppVersionSchema = new mongoose_.Schema({
    android_version: {
        type: Number,
        required: true,
    },
    ios_version: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        require: true,
        min: 10,
        max: 10
    },
    email: {
        default: null,
        type: String,
        require: true,
        lowercase: true,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose_.model(AppConstants.MODEL_APP_VERSION, AppVersionSchema);