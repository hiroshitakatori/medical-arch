import { AppConstants } from "../../utils/appConstants";
import mongoose, { Schema } from "mongoose";

const TokenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: AppConstants.TOKEN_EXPIRY_TIME
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_TOKEN, TokenSchema)