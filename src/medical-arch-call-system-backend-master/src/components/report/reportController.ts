import { AppStringEng, AppStringJapan } from "../../utils/appStrings";
import { Request, Response } from "express";
import commonUtils, { deleteSingleFile, deleteMultipleFile } from "../../utils/commonUtils";
import moment from 'moment';
import 'moment/locale/ja'; 

const Symptoms = require("../common/symptoms");

const mongoose = require("mongoose");
const _ = require("underscore")
const lodash = require("lodash")
const Token = require("../common/tokenModel");
const FacilityModel = require('../facility/facilityModel');
const Report = require("./report");
async function addReport(req: Request, res: Response) {
   try {
      let lang = req.headers.lang ?? "en";
      // console.log(req.body)
      // return false;
      let { facilityId, nameOfFacility, staffName, respondentId, respondentDate, residentName, temperature, pulse, sp02, projectType, amountOfStool, respiratory, cyanosis, reportType,bp,firstAid,address,mobile,email,symptomsId,symptomsData,memo,status,dependentField } = req.body;

      const formattedDate = moment(respondentDate, 'YYYY-MM-DD HH:mm A');
      
      let uniqeId = "RID" + Date.now();
      var report = new Report();
      report.uniqeId = uniqeId;
      report.facilityId = facilityId;
      report.nameOfFacility = nameOfFacility;
      report.staffId = staffName;
      report.respondentId = respondentId;
      report.residentName = residentName;
      report.temperature = temperature;
      report.bp = bp;
      report.pulse = pulse;
      report.sp02 = sp02;
      report.amountOfStool = amountOfStool;
      report.respiratory = respiratory;
      report.cyanosis = cyanosis;
      // report.projectType = 1;
      report.respondentDate =formattedDate;
      report.reportType = reportType;
      report.firstAid = firstAid;
      report.address = address;
      report.mobile=mobile;
      report.email=email;
      report.symptomsData=symptomsData;
      report.dependentField=dependentField;
      report.memo=memo;
      report.status=status; // 1 in preparation
      // report.symptomsId = await getSymptopmsId(symptomsId);
      await report.save();
      let msg = status==1 ?  lang == "en" ?  AppStringEng.REPORT_DRAF_SUCCESS : AppStringJapan.REPORT_DRAF_SUCCESS: lang == "en" ?  AppStringEng.REPORT_ADD_SUCCESS : AppStringJapan.REPORT_ADD_SUCCESS
      return commonUtils.sendSuccess(req, res, { message:  msg}, 200);

   }
   catch (error: any) {
      console.log(error)
      return commonUtils.sendError(req, res, { message: error.message }, 409);
   }
}
async function getSymptopmsId(symptomsId:any){
   // if(symptomsId){
   //    symptomsId.toArray();
   // }
   // console.log(symptomsId,"..")
   return new Promise(async (resolve,reject)=>{
      let sym = await Symptoms.find({ename:symptomsId})
      let ids =await _.pluck(sym,"_id");
      // console.log(ids)
      resolve(ids)
   })

}
async function updateReport(req: Request, res: Response) {
   try {
      let lang = req.headers.lang ?? "en";
      let { _id,facilityId, nameOfFacility, staffName, respondentId, respondentDate, residentName, temperature,bp, pulse, sp02, projectType, amountOfStool, respiratory, cyanosis, reportType,address,mobile,email,firstAid,symptomsId,symptomsData,memo,status,dependentField } = req.body;

      var report = await Report.findById({_id});
      if(!report) return commonUtils.sendError(req,res,{message:lang=="en" ? AppStringEng?.REPORT_NOT_EXISTS : AppStringJapan?.REPORT_NOT_EXISTS},409);

      report.facilityId = facilityId ? facilityId : report?.facilityId;
      report.nameOfFacility = nameOfFacility ? nameOfFacility : report?.facility;
      report.staffId = staffName ?staffName : report?.staffId;
      report.respondentId = respondentId ? respondentId : report?.respondentId;
      report.residentName = residentName || report?.residentName;
      report.temperature = temperature ;
      report.pulse = pulse;
      report.bp = bp ;
      report.sp02 = sp02 ;
      report.amountOfStool = amountOfStool ;
      report.respiratory = respiratory ?respiratory : report?.respiratory;
      report.cyanosis = cyanosis ?cyanosis : report?.cyanosis;
      report.symptomsData = symptomsData || report?.symptomsData;
      report.dependentField = dependentField || report?.dependentField;
      // report.projectType = projectType;
      // report.projectType = 1;
      report.reportType = reportType;
      report.address = address || report?.address;
      report.mobile=mobile || report?.mobile;
      report.email=email || report?.email
      report.firstAid=firstAid
      report.memo=memo
      report.status=status
      
      // report.symptomsId = symptomsId;
      // console.log(symptomsId)
      report.symptomsId = await getSymptopmsId(symptomsId);

      await report.save();

      return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.REPORT_UPDATE_SUCCESS : AppStringJapan.REPORT_UPDATE_SUCCESS }, 200);

   }
   catch (error: any) {
      return commonUtils.sendError(req, res, { message: error.message }, 409);
   }
}
async function commentOnReport(req: Request, res: Response) {
   try {
      let lang = req.headers.lang ?? "en";

      let { _id,comment,status,facilityStaff } = req.body;
      if(!comment){
         return commonUtils.sendError(req,res,{errors:{"comment":"comment field is required"}},409);
      }
      var report = await Report.findById(_id);
      if(!report) return commonUtils.sendError(req,res,{message:lang=="en" ? AppStringEng?.REPORT_NOT_EXISTS : AppStringJapan?.REPORT_NOT_EXISTS},409);

      report.comment = comment;
      report.facilityStaff = facilityStaff;
      report.status = status;
      // console.log(status)
      await report.save();
      return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.REPORT_UPDATE_SUCCESS : AppStringJapan.REPORT_UPDATE_SUCCESS }, 200);

   }
   catch (error: any) {
      return commonUtils.sendError(req, res, { message: error.message }, 409);
   }
}

async function getReport(req: Request, res: Response) {
   try {
      let role = req.headers?.role;
      let id = req.headers?.userid;
      let { search, page }: any = req.query;
      var limit = parseInt(req.query.limit as string) || 5;
      // console.log({search})
      page = page || 1;
      let filter: any = {};
      var skip = (page - 1) * limit;
      if(role==="facility"){
         filter={facilityId :mongoose.Types.ObjectId(id)}
      }

      if (search && search != "") {
         filter = {
            ...filter,
            $or: [
               { "createDate": { $regex: search.toString(), $options: 'i' } },
               { "facility_data.name": { $regex: search, $options: 'i' } },
               { "respondent_data.name": { $regex: search, $options: 'i' } },
               // { "facility_data.name": { $regex: search, $options: 'i' } },
            
            ],
         }
      }
      let total__ = await Report.aggregate([
         {
            $addFields: {
                createDate: {
                  $dateToString:  { format: "%Y-%m-%d", date:"$createdAt" }
                },
               //  created_at:{$dateFromString:{dateString:'$created_at'}}
            },
        },
        
         {
            $lookup: {
               from: "facilities",
               localField: "facilityId",
               foreignField: "_id",
               as: "facility_data"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "respondentId",
               foreignField: "_id",
               as: "respondent_data"
            }
         },
         { $unwind: { path: "$facility_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$respondent_data", preserveNullAndEmptyArrays: true } },
         { $match: filter },

         {
            $group: {
               _id: null, total: { $sum: 1 }
            }
         }, {
            $project: {
               _id: 1, total: 1
            }
         }

      ])
      var total_ = total__[0]?.total || 0;
      // console.log(total_)
      var ReportList = await Report.aggregate([
         {
            $addFields: {
                createDate: {
                    $dateToString:  { format: "%Y-%m-%d", date:"$createdAt" }  ,
                }
            },
        },
      //   {
      //       $lookup: {
      //          from: "symptoms",
      //          let:{sid :"$symptomsId"},
      //          pipeline:[
      //             {
      //                '$match':{
      //                   '$expr':{
      //                      $and:[
      //                         {$in:["_id",'$$sid']}
      //                      ]
      //                   }
      //             }
      //          },
      //          {$project:{
      //             _id:1,ename:1,jname:1
      //          }}
      //          ],
      //          as: "symptoms_data"
      //       }
      //    },
      {
         $lookup: {
             from: "symptoms",
             let: { 'subcategories': '$symptomsId' },
             pipeline: [
                 {
                     '$match': {
                         '$expr': {
                             '$and': [
                                 {
                                     '$in': [
                                         '$_id', '$$subcategories'
                                     ]
                                 },
                             ]
                         }
                     }

                 },
                 { $project: { ename:1,jname:1, _id: 1 } }
             ],
             as: "symptoms_data",
         }
     },
         {
            $lookup: {
               from: "facilities",
               localField: "facilityId",
               foreignField: "_id",
               as: "facility_data"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "respondentId",
               foreignField: "_id",
               as: "respondent_data"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "staffId",
               foreignField: "_id",
               as: "staff_data"
            }
         },
         {
            $lookup: {
               from: 'roles',
               localField: 'role',
               foreignField: '_id',
               as: 'role_data'
            }
         },

         // {
         //    $match: {
         //       "role_data.name": { $ne: "superAdmin" },
         //    }
         // },
         // { $unwind: { path: "$role_data", preserveNullAndEmptyArrays: true } },

         { $unwind: { path: "$facility_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$respondent_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$staff_data", preserveNullAndEmptyArrays: true } },
         { $match: filter },
         { $sort: { createdAt: -1 } },
         {
            $lookup: {
               from: 'plans',
               localField: 'facility_data.plan',
               foreignField: '_id',
               as: 'plan_data'
            }
         },
         { $unwind: { path: "$plan_data", preserveNullAndEmptyArrays: true } },
         {
            $facet: {
               metadata: [
                  { $count: "total" },
                  {
                     $addFields: {
                        page: page,
                        limit: limit,
                        total: total_,
                        hasMoreData: total_ > page * limit ? true : false
                     }
                  }
               ],
               data: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: 1,
                        uniqueId: 1,
                        facilityId: 1,
                        nameOfFacility: 1,
                        staffId: 1,
                        firstAid: 1,
                        respondentId: 1,
                        respondentDate: 1,
                        residentName: 1,
                        temperature: 1,
                        bp: 1,
                        pulse: 1,
                        sp02: 1,
                        projectType: 1,
                        amountOfStool: 1,
                        respiratory: 1,
                        cyanosis: 1,
                        reportType: 1,
                        comment:1,
                        status: 1,
                        address:1,
                        email:1,
                        mobile:1,
                        createdAt: 1,
                        createDate:1,
                        symptomsId:1,
                        symptomsData:1,
                        dependentField:1,
                        facilityStaff:1,
                        memo:1,
                        facility_data:{
                           _id:1,
                           name: 1,
                           email: 1,
                           mobile: 1,
                           uniqeId: 1,
                           address: 1,
                           yomi: 1,
                           contract: 1,
                           managerName: 1,
                           facilityManagerName: 1,
                           contractDetails: 1,
                           contractStartDate: 1,
                           // contractEndDate: 1,
                           capacity: 1,
                           businessType: 1,
                           plan: 1,
                           amount: 1,
                           cost: 1,
                           affiliatedFacility: 1,
                           memoForFacility: 1,
                           memoForStaff: 1,
                           subscriberRegistrant: 1,
                           terminationDate:1,entryBy:1,
                           status: 1,
                           createdAt: 1
                        },
                        respondent_data:{
                           _id:1,
                           name: 1,
                           email: 1,
                           mobile: 1,
                           uniqeId: 1,
                           password2:1,
                           yomi: 1,
                           address:1,
                           frigana: 1,
                           contract: 1,
                           license: 1
                        },
                        staff_data:{
                           _id:1,
                           name: 1,
                           email: 1,
                           mobile: 1,
                           uniqeId: 1,
                           password2:1,
                           yomi: 1,
                           address:1,
                           frigana: 1,
                           contract: 1,
                           license: 1
                        },
                        symptoms_e_name:"$symptoms_data.ename",
                        symptoms_j_name:"$symptoms_data.jname",
                        plan_data:1
                     }
                  }
               ]
            }
         },
      ])
      return commonUtils.sendSuccess(req, res, ReportList, 200);
   }
   catch (err: any) {
      return commonUtils.sendError(req, res, { message: err.message }, 409);
   }

}
async function reportByFacilityId(req: Request, res: Response) {
   try {
      let lang = req.headers.lang ?? "en";

      let { search, page,facilityId }: any = req.query;
      if(!facilityId) return commonUtils.sendError(req,res,{message:lang == "en" ? AppStringEng.FACILITY_ID_REQURIED : AppStringJapan.FACILITY_ID_REQURIED})
      var limit = parseInt(req.query.limit as string) || 5;
      page = page || 1;
      let filter: any = {};
      var skip = (page - 1) * limit;
      if(facilityId && facilityId!=""){
         filter={facilityId :mongoose.Types.ObjectId(facilityId)}
      }
      // if (search && search !== "") {
      //    filter = {
      //       ...filter,
      //       $or: [
      //          { facilityId: { $regex: search, $options: 'i' } },
      //          { nameOfFacility: { $regex: search, $options: 'i' } },
      //          { staffId: { $regex: search, $options: 'i' } },
      //          { uniqueId: { $regex: search, $options: 'i' } },
      //          { respondentId: { $regex: search, $options: 'i' } },
      //          { residentName: { $regex: search, $options: 'i' } },
      //       ]
      //    }
      // }
      // let total__ = await Report.aggregate([
      //    {
      //       $lookup: {
      //          from: "facilities",
      //          localField: "facilityId",
      //          foreignField: "_id",
      //          as: "facility_data"
      //       }
      //    },
      //    {
      //       $lookup: {
      //          from: "users",
      //          localField: "respondentId",
      //          foreignField: "_id",
      //          as: "respondent_data"
      //       }
      //    },
      //    { $unwind: { path: "$facility_data", preserveNullAndEmptyArrays: true } },
      //    { $unwind: { path: "$respondent_data", preserveNullAndEmptyArrays: true } },
      //    { $match: filter },

      //    {
      //       $group: {
      //          _id: null, total: { $sum: 1 }
      //       }
      //    }, {
      //       $project: {
      //          _id: 1, total: 1
      //       }
      //    }

      // ])
      // const total_ = total__[0]?.total || 0;
      // var ReportList = await Report.aggregate([
      //    { $sort: { createdAt: -1 } },
      //    {
      //       $lookup: {
      //          from: "facilities",
      //          localField: "facilityId",
      //          foreignField: "_id",
      //          as: "facility_data"
      //       }
      //    },
      //    { $unwind: { path: "$facility_data", preserveNullAndEmptyArrays: true } },
      //    {
      //       $lookup: {
      //          from: "users",
      //          localField: "respondentId",
      //          foreignField: "_id",
      //          as: "respondent_data"
      //       }
      //    },
      //    { $unwind: { path: "$respondent_data", preserveNullAndEmptyArrays: true } },
      //    { $match: filter },
      //    {
      //       $lookup: {
      //          from: 'plans',
      //          localField: 'facility_data.plan',
      //          foreignField: '_id',
      //          as: 'plan_data'
      //       }
      //    },
      //    { $unwind: { path: "$plan_data", preserveNullAndEmptyArrays: true } },
      //    {
      //       $facet: {
      //          metadata: [
      //             { $count: "total" },
      //             {
      //                $addFields: {
      //                   page: page,
      //                   limit: limit,
      //                   total: total_,
      //                   hasMoreData: total_ > page * limit ? true : false
      //                }
      //             }
      //          ],
      //          data: [
      //             { $skip: skip },
      //             { $limit: limit },
      //             {
      //                $project: {
      //                   _id: 1,
      //                   uniqueId: 1,
      //                   facilityId: 1,
      //                   nameOfFacility: 1,
      //                   staffId: 1,
      //                   firstAid: 1,
      //                   respondentId: 1,
      //                   respondentDate: 1,
      //                   residentName: 1,
      //                   temperature: 1,
      //                   bp: 1,
      //                   pulse: 1,
      //                   sp02: 1,
      //                   projectType: 1,
      //                   amountOfStool: 1,
      //                   respiratory: 1,
      //                   cyanosis: 1,
      //                   reportType: 1,
      //                   comment:1,
      //                   status: 1,
      //                   address:1,
      //                   email:1,
      //                   mobile:1,
      //                   createdAt: 1,
      //                   facility_data:{
      //                      _id:1,
      //                      name: 1,
      //                      email: 1,
      //                      mobile: 1,
      //                      uniqeId: 1,
      //                      address: 1,
      //                      yomi: 1,
      //                      contract: 1,
      //                      managerName: 1,
      //                      facilityManagerName: 1,
      //                      contractDetails: 1,
      //                      contractStartDate: 1,
      //                      // contractEndDate: 1,
      //                      capacity: 1,
      //                      businessType: 1,
      //                      plan: 1,
      //                      amount: 1,
      //                      cost: 1,
      //                      affiliatedFacility: 1,
      //                      memoForFacility: 1,
      //                      memoForStaff: 1,
      //                      subscriberRegistrant: 1,
      //                      terminationDate:1,entryBy:1,
      //                      status: 1,
      //                      createdAt: 1
      //                   },
      //                   respondent_data:{
      //                      _id:1,
      //                      name: 1,
      //                      email: 1,
      //                      mobile: 1,
      //                      uniqeId: 1,
      //                      yomi: 1,
      //                      address:1,
      //                      frigana: 1,
      //                      contract: 1,
      //                      license: 1
      //                   },
      //                   plan_data:{
      //                      name:1
      //                   }
      //                }
      //             }
      //          ]
      //       }
      //    },
      // ])

      if (search && search != "") {
         filter = {
            ...filter,
            $or: [
               { "createDate": { $regex: search.toString(), $options: 'i' } },
               { "facility_data.name": { $regex: search, $options: 'i' } },
               { "respondent_data.name": { $regex: search, $options: 'i' } },
               // { "facility_data.name": { $regex: search, $options: 'i' } },
            
            ],
         }
      }
      let total__ = await Report.aggregate([
         {
            $addFields: {
                createDate: {
                  $dateToString:  { format: "%Y-%m-%d", date:"$createdAt" }
                },
               //  created_at:{$dateFromString:{dateString:'$created_at'}}
            },
        },
        
         {
            $lookup: {
               from: "facilities",
               localField: "facilityId",
               foreignField: "_id",
               as: "facility_data"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "respondentId",
               foreignField: "_id",
               as: "respondent_data"
            }
         },
         { $unwind: { path: "$facility_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$respondent_data", preserveNullAndEmptyArrays: true } },
         { $match: filter },

         {
            $group: {
               _id: null, total: { $sum: 1 }
            }
         }, {
            $project: {
               _id: 1, total: 1
            }
         }

      ])
      var total_ = total__[0]?.total || 0;
      // console.log(total_)
      var ReportList = await Report.aggregate([
         {
            $addFields: {
                createDate: {
                    $dateToString:  { format: "%Y-%m-%d", date:"$createdAt" }  ,
                }
            },
        },
      //   {
      //       $lookup: {
      //          from: "symptoms",
      //          let:{sid :"$symptomsId"},
      //          pipeline:[
      //             {
      //                '$match':{
      //                   '$expr':{
      //                      $and:[
      //                         {$in:["_id",'$$sid']}
      //                      ]
      //                   }
      //             }
      //          },
      //          {$project:{
      //             _id:1,ename:1,jname:1
      //          }}
      //          ],
      //          as: "symptoms_data"
      //       }
      //    },
      {
         $lookup: {
             from: "symptoms",
             let: { 'subcategories': '$symptomsId' },
             pipeline: [
                 {
                     '$match': {
                         '$expr': {
                             '$and': [
                                 {
                                     '$in': [
                                         '$_id', '$$subcategories'
                                     ]
                                 },
                             ]
                         }
                     }

                 },
                 { $project: { ename:1,jname:1, _id: 1 } }
             ],
             as: "symptoms_data",
         }
     },
         {
            $lookup: {
               from: "facilities",
               localField: "facilityId",
               foreignField: "_id",
               as: "facility_data"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "respondentId",
               foreignField: "_id",
               as: "respondent_data"
            }
         },
         {
            $lookup: {
               from: "users",
               localField: "staffId",
               foreignField: "_id",
               as: "staff_data"
            }
         },
         {
            $lookup: {
               from: 'roles',
               localField: 'role',
               foreignField: '_id',
               as: 'role_data'
            }
         },

         // {
         //    $match: {
         //       "role_data.name": { $ne: "superAdmin" },
         //    }
         // },
         // { $unwind: { path: "$role_data", preserveNullAndEmptyArrays: true } },

         { $unwind: { path: "$facility_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$respondent_data", preserveNullAndEmptyArrays: true } },
         { $unwind: { path: "$staff_data", preserveNullAndEmptyArrays: true } },
         { $match: filter },
         { $sort: { createdAt: -1 } },
         {
            $lookup: {
               from: 'plans',
               localField: 'facility_data.plan',
               foreignField: '_id',
               as: 'plan_data'
            }
         },
         { $unwind: { path: "$plan_data", preserveNullAndEmptyArrays: true } },
         {
            $facet: {
               metadata: [
                  { $count: "total" },
                  {
                     $addFields: {
                        page: page,
                        limit: limit,
                        total: total_,
                        hasMoreData: total_ > page * limit ? true : false
                     }
                  }
               ],
               data: [
                  { $skip: skip },
                  { $limit: limit },
                  {
                     $project: {
                        _id: 1,
                        uniqueId: 1,
                        facilityId: 1,
                        nameOfFacility: 1,
                        staffId: 1,
                        firstAid: 1,
                        respondentId: 1,
                        respondentDate: 1,
                        residentName: 1,
                        temperature: 1,
                        bp: 1,
                        pulse: 1,
                        sp02: 1,
                        projectType: 1,
                        amountOfStool: 1,
                        respiratory: 1,
                        cyanosis: 1,
                        reportType: 1,
                        comment:1,
                        status: 1,
                        address:1,
                        email:1,
                        mobile:1,
                        createdAt: 1,
                        createDate:1,
                        symptomsId:1,
                        symptomsData:1,
                        dependentField:1,
                        facilityStaff:1,
                        memo:1,
                        facility_data:{
                           _id:1,
                           name: 1,
                           email: 1,
                           mobile: 1,
                           uniqeId: 1,
                           address: 1,
                           yomi: 1,
                           contract: 1,
                           managerName: 1,
                           facilityManagerName: 1,
                           contractDetails: 1,
                           contractStartDate: 1,
                           // contractEndDate: 1,
                           capacity: 1,
                           businessType: 1,
                           plan: 1,
                           amount: 1,
                           cost: 1,
                           affiliatedFacility: 1,
                           memoForFacility: 1,
                           memoForStaff: 1,
                           subscriberRegistrant: 1,
                           terminationDate:1,entryBy:1,
                           status: 1,
                           createdAt: 1
                        },
                        respondent_data:{
                           _id:1,
                           name: 1,
                           email: 1,
                           mobile: 1,
                           uniqeId: 1,
                           password2:1,
                           yomi: 1,
                           address:1,
                           frigana: 1,
                           contract: 1,
                           license: 1
                        },
                        staff_data:{
                           _id:1,
                           name: 1,
                           email: 1,
                           mobile: 1,
                           uniqeId: 1,
                           password2:1,
                           yomi: 1,
                           address:1,
                           frigana: 1,
                           contract: 1,
                           license: 1
                        },
                        symptoms_e_name:"$symptoms_data.ename",
                        symptoms_j_name:"$symptoms_data.jname",
                        plan_data:1
                     }
                  }
               ]
            }
         },
      ])
      return commonUtils.sendSuccess(req, res, ReportList, 200);
   }
   catch (err: any) {
      return commonUtils.sendError(req, res, { message: err.message }, 409);
   }

}
export default
   {
      addReport,
      updateReport,
      commentOnReport,
      getReport,
      reportByFacilityId
   }