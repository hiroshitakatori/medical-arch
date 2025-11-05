import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const StaffShiftSchema = new mongoose.Schema({
   shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: AppConstants.MODEL_SHIFT,
      default:null
   },
   staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: AppConstants.MODEL_USER,
    default:null
   },
   onShift: {
    type: Number,
    default: 1,
    comment: '1 In Shift 0 Not In Shift'
   },
   callCount: {
      type: Number,
      default:0,
      comment: 'For call forward one by one'
     },
   // day: {
   //  type: Number,
   //  default: 0,
   // //  comment: '1 In Shift 0 Not In Shift'
   // },
   startDay: {
      type: String,
      default: null,
     //  comment: '1 In Shift 0 Not In Shift'
     },
   //   endDay: {
   //    type: String,
   //    default: null,
   //   //  comment: '1 In Shift 0 Not In Shift'
   //   },
   startDate: {
    type: Date,
    default:null,
   //  get: function (value:any) {
   //    return value.toISOString().split('T')[0];
   //  }
   },
   endDate: {
    type: Date,
    default:null
   },
   isResponder :{
    type: Number,
    default: 0,
    comment: '1 is Responder 0 Not Responder'
   },
   status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_STAFF_SHIFT, StaffShiftSchema);