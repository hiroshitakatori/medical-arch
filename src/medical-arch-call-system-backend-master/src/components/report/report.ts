import mongoose, { SchemaType, SchemaTypes } from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const ReportSchema = new mongoose.Schema({
    uniqeId: {//facility Name
         type:String,
        default: null
    },
    facilityId: {//facility Name
        type: mongoose.Schema.Types.ObjectId,
        ref: AppConstants.MODEL_FACILITY,
        default: null
    },
    nameOfFacility: { // doctor name, manager name
        type: String,
       default: null
    },
    address: { 
        type: String,
       default: null
    },
    mobile: { 
        type: String,
       default: null
    },
    email: { 
        type: String,
       default: null
    },
    staffId: {
        // ref: AppConstants.MODEL_USER,
        // type: mongoose.Schema.Types.ObjectId,
        type:String,
        default: null
   },
    respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: AppConstants.MODEL_USER,
    // type:String,
    default: null
    },
    respondentDate: {
        type: Date,
        default: null
    },
    residentName: {
        type: String,
        default: null
    },
    temperature:{
        type: String,
        default: null
    },
    bp:{
        type: String,
        default: null
    },
    pulse:{
        type: String,
        default: null
    },
    sp02:{
        type: String,
        default: null
    },
    // projectType:{
    //     type: String,
    //     default: null
    // },
    amountOfStool:{
        type: String,
        default: null
    },
  
    respiratory:{//Deterioration Of Respiratory Condition
        type: Number,
        required: false,
        default: 0,
        comment: '0 NO 1 YES'
    },
    cyanosis:{//Cyanosis
        type: Number,
        required: false,
        default: 0,
        comment: '0 NO 1 YES'
    },
    reportType:{//Emergency Recue 
        type: Number,
        // required: false,
        default: 1,
        comment: '0 NO 1 YES'
    },
    // firstAid:{//
    //     type: Number,
    //     // required: false,
    //     default: 1,
    //     comment: '0 NO 1 YES'
    // },
    memo:{
        type:String,
        default:null
    },
    comment:{
        type:String,
        default:null
    },
    facilityStaff:{
        type:String,
        default:null
    },
    symptomsId:[{

        type: mongoose.Schema.Types.ObjectId,
        ref: AppConstants.MODEL_SYMPTOMS,
        default: null
    }],
    symptomsData:{
        // type:mongoose.Schema.Types.JSON,
        type : Array ,
        default:null
    },
    dependentField:{
        // type:mongoose.Schema.Types.JSON,
        type : Array ,
        default:null
    },
    status: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 Canceled/Un Confrimed 1 is Under Contract /In preperation , 2 Completed/Confrimed'
    },
}, { timestamps: true });
const ReportSubSchema = new mongoose.Schema({

})
module.exports = mongoose.model(AppConstants.MODEL_REPORT, ReportSchema);