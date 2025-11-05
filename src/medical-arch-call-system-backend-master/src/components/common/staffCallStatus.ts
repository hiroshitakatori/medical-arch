import { AppConstants } from "../../utils/appConstants";
import mongoose, { Schema } from "mongoose";

const StaffCallStatusSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: AppConstants.MODEL_USER,
        required: false,
        default: null
    },
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:AppConstants.MODEL_SHIFT,
        required: false,
        default:null
    },
    callStatus:{
        type:Number,
        required:true,
        default:0 // 0=> canceled 1=>busy 2=> no-answer 3=> failed
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     expires: AppConstants.TOKEN_EXPIRY_TIME
    // },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_STAFF_CALL_STATUS, StaffCallStatusSchema)