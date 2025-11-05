import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const adminSchema = new mongoose.Schema({
   name: {
      type: String,
      default:null
   },
   uniqeId: {
      type: String,
      default:null
   },
   email: {
      type: String,
      require: false,
      lowercase: true,
      trim: true,
   },
   mobile: {
      type: String,
      require: false,
      default:null,
      min: 10,
      max: 15
   },
   profilePic: {
      type: String,
      default:null
   },
   password: {
      type: String,
      require: true
   },
   password2: {
      type: String,
      require: true
   },
   role:{
      type: mongoose.Schema.Types.ObjectId,
      ref: AppConstants.MODEL_ROLE,
      default : null
   },
   address: {
      type: String,      
      default : null
   },
   yomi: {
      type: String,
      default : null
   },
   frigana: {
      type: String,
      default : null
   },
   contract: {
      type: String,
      default : null
   },
   license: {
      default : null,
      type: String
   },
   status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  },
}, { timestamps: true });

// adminSchema.index({
//    "location": "2dsphere"
// })

module.exports = mongoose.model(AppConstants.MODEL_USER, adminSchema);