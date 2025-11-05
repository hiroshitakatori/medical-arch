import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";
import { timeStamp } from "console";

const StaffShiftSchema = new mongoose.Schema({
//    shiftId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: AppConstants.MODEL_SHIFT,
//       default:null
//    },

   staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: AppConstants.MODEL_USER,
    default:null
   },

   responderInShift: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: AppConstants.MODEL_SHIFT,
      default:null
   },
   shiftId:[ {
    type: mongoose.Types.ObjectId,
      ref: AppConstants.MODEL_SHIFT,

    default: [], //restrunt type or grocery type
   }],
   day: {
    type: String,
    default:null
   },

}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_STAFF_SHIFT1, StaffShiftSchema);