import { AppConstants } from "../../utils/appConstants";
import mongoose, { Schema } from "mongoose";

const DeletedCallHistorySchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: AppConstants.MODEL_USER,
        default: null
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_DELETED_CALL, DeletedCallHistorySchema)