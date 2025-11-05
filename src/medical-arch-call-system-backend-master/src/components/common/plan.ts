import { AppConstants } from "../../utils/appConstants";
import mongoose, { Schema } from "mongoose";

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    jname: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default:15,
        required: false
    },
    order: {
        type: String,
        default:1,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_PLAN, PlanSchema)