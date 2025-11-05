import mongoose, { Mongoose } from "mongoose";
import { AppConstants } from "../../utils/appConstants";
const mongoose_ = require('mongoose');

const ShiftSchema = new mongoose_.Schema({
    name:{
        type: String,
        required: true,
    },
    startTime:{
        type:String,
        default:null
    },
    endTime:{
        type:String,
        default:null
    },
    order:{
        type:Number,
        default:1
    },
    status: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 is Deactive 1 is Active'
    },
}, { timestamps: true });

module.exports = mongoose_.model(AppConstants.MODEL_SHIFT, ShiftSchema);