import { AppConstants } from "../../utils/appConstants";
import mongoose, { Schema } from "mongoose";

const SymptomsSchema = new mongoose.Schema({
    ename: {
        type: String,
        required: false
    },
    jname: {
        type: String,
        required: false
    },
    order: {
        type: Number,
        default:1,
        required: false
    }
    
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_SYMPTOMS, SymptomsSchema)