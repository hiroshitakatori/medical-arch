import mongoose, { SchemaType, SchemaTypes } from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const FacilitySchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    uniqeId: {
        type: String,
        default: null
    },
    email: {
        type: String,
        require: false,
        lowercase: true,
        trim: true,
        index: true,
    },
    mobile: {
        type: String,
        require: false,
        default: null,
        min: 10,
        max: 15
    },
    mobile2: {
        type: String,
        require: false,
        default: null,
        min: 10,
        max: 15
    },
    password: {
        type: String,
        require: true
    },

    address: {
        type: String,
        default: null
    },
    yomi: {
        type: String,
        default: null
    },
    managerName: {
        type: String,
        default: null
    },
    facilityManagerName: {
        type: String,
        default: null
    },
    contractDetails: { 
        type: String,
        default: null
    },
    contract: { //file
        type: String,
        default: null
    },
    contractStartDate :{
        type: Date,
        required: true,
        default: null
    },
    contractRenewDate :{
        type: Date,
        default: null
    },
    capacity: {
        default: null,
        type: String
    },
    businessType: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: AppConstants.MODEL_BUSINESS_TYPE,
        default : null
    },
    plan: {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: AppConstants.MODEL_PLAN,
        // default: null
    },
    amount: {

        type: Number,
        default: 0
    },
    cost: {

        type: Number,
        default: 0
    },
    affiliatedFacility: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        default: null,
        ref: AppConstants.MODEL_AFFILIATED_FACILITY
    },
    memoForFacility: {
        type: String,
        default: null,
    },
    memoForStaff: {
        type: String,
        default: null,
    },
    subscriberRegistrant: {
        type: String,
        default: null,
    },
    terminationDate: {
        type: Date,
        default: null,
    },
    entryBy: {
        type: String,
        default: null,
    },
    allowLogin: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 Not Allowed 1 Allowed '
    },
    passReset:{
        type: Number,
        required: false,
        default: 0,
        comment: '0 Password is not reset 1 Password is reset'

    },
    status: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 Canceled 1 is Under Contract '
    },
}, { timestamps: true });

// adminSchema.index({
//    "location": "2dsphere"
// })

module.exports = mongoose.model(AppConstants.MODEL_FACILITY, FacilitySchema);