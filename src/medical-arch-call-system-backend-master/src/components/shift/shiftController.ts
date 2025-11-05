import {AppStringEng, AppStringJapan} from "../../utils/appStrings";
// const User = require("../../users/models/userModel");
import {NextFunction, query, Request, Response} from "express";
import commonUtils, {fileFilter, fileStorage} from "../../utils/commonUtils";
import moment from "moment";

const twilio = require('twilio');
const User = require("../users/userModel");
const mongoose = require("mongoose");
const _ = require("underscore");
const __ = require("lodash");
const Shift = require("./shift")
const StaffShift = require("./staffShift")
const Symptoms = require("../common/symptoms");

const config = require("config");
const twilioAccountSid = config.get('ACCOUNTSID');
const twilioApiKey = config.get('AUTHKEY');
const twilioApiSecret = config.get('AUTHTOKEN');
const client = twilio(twilioAccountSid, twilioApiSecret);
const StaffCallStatus = require("./../common/staffCallStatus");

async function shiftAdd(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {name, startTime, endTime, order}: any = req.body;

        let shift = await new Shift({
            name: name,
            startTime: startTime,
            endTime: endTime,
            order: order
        })

        await shift.save();
        return commonUtils.sendSuccess(req, res, {id: shift._id}, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function shiftUpdate(req: Request, res: Response) {
    try {
        let {_id} = req.params;

        let {name, startTime, endTime, order}: any = req.body;

        let shift = await Shift.findById(_id);

        if (!shift) return commonUtils.sendError(req, res, {message: "shift not exist!"}, 409);
        shift.name = name || shift.name;
        shift.startTime = startTime || shift.startTime;
        shift.endTime = endTime || shift.endTime;
        shift.order = order || shift.order;
        await shift.save();
        return commonUtils.sendSuccess(req, res, {message: "Shift update sucess!"}, 200);

    } catch (err: any) {
        console.log("SHIFT UPDATE ", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function getShift(req: Request, res: Response) {
    try {

        var shiftList = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        // let shiftListNew = [,...shiftList]
        return commonUtils.sendSuccess(req, res, shiftList, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function deleteShift(req: Request, res: Response) {
    try {
        const {_id} = req.params;
        const shift = await Shift.findByIdAndDelete({_id})
        if (shift) {
            return commonUtils.sendSuccess(req, res, {message: "shift deleted successfully!"}, 200)
        } else {
            return commonUtils.sendSuccess(req, res, {message: "shift not exist!"}, 200)
        }
    } catch (err: any) {
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

const activeInactiveShift = async function (req: Request, res: Response) {
    try {
        var _id = req.params._id;
        var shift = await Shift.findById({_id: _id});
        if (!shift) return commonUtils.sendError(req, res, {message: "Shift not exist"});
        shift.status = shift.status ? 0 : 1;
        let msg = shift.status ? "Active" : "De-Active";
        await shift.save();
        // await mainCategory.updateMany({ main_category_id: main_category._id }, { status: main_category.status });
        return commonUtils.sendSuccess(req, res, {message: "Shift status " + msg + " succesfully"}, 200);
    } catch (err: any) {
        return commonUtils.sendSuccess(req, res, {message: err.message});
    }
}

async function addShift(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let data2 = req.body;

        // console.log(data2)
        // return false;
        let staffId = data2?.staffId;
        // console.log(staffId)
        if (!staffId) {
            let checkStaffExist = await User.findById(staffId);
            if (!checkStaffExist) return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_NOT_EXISTS : AppStringJapan?.STAFF_NOT_EXISTS}, 409);
        }
        let reponder: any = data2?.responder ?? {};
        let result: any = Object.entries(data2).reduce((acc: any, [key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                acc[key] = value;
            }
            return acc;
        }, {});
        let days: any = [];
        let startDay = data2?.startDay;

        let startDate = data2?.startDate;
        let endDate = data2?.startDate;

        // console.log(startDate,endDate)
        // return true;
        let shift = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        // await shift.forEach(async (e: any) => {
        for (var sh = 0; sh < shift.length; sh++) {
            let e = shift[sh];

            for (let i = 0; i <= 6; i++) {
                var fieldName = e.name + 'D' + i;
                if (reponder[i] && reponder[i] == "Responder" + [e.name]) {
                    if (!days['day' + i]) {
                        days['day' + i] = {
                            ...days['day' + i]
                        };
                    }

                    days['day' + i][e.name] = {
                        ...days['day' + i][e.name],
                        isResponder: 1,
                        shiftId: e._id.toString(),
                        startDay: await getNewDate(i, startDate, ""),
                        endDay: await getNewDate(i, "", endDate),
                        // startDate: await getDate(startDay + i, e.startTime, null),//i + startDay
                        // endDate: await getDate(endDay - i, null, e.endTime)//i + startDay
                        startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay

                    };

                }
                if (result[fieldName] && result[fieldName][0] === fieldName) {

                    if (!result['day' + i]) {
                        days['day' + i] = {
                            ...days['day' + i]
                        };
                    }

                    days['day' + i][e.name] = {
                        ...days['day' + i][e.name],
                        isShift: 1,
                        shiftId: e._id.toString(),
                        startDay: await getNewDate(i, startDate, ""),
                        endDay: await getNewDate(i, "", endDate),
                        // startDate: await getDate(startDay + i, e.startTime, null),//i + startDay
                        // endDate: await getDate(endDay - i, null, e.endTime)//i + startDay
                        startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                    };
                    // console.log(days['day' + i][e.name])
                    let s = await new StaffShift({
                        ...days['day' + i][e.name],
                        isShift: 1,
                        shiftId: mongoose.Types.ObjectId(e._id),
                        staffId: mongoose.Types.ObjectId(staffId),
                        // day: startDay + i,
                        startDay: await getNewDate(i, startDate, ""),
                        endDay: await getNewDate(i, "", endDate),

                        startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                    })
                    await s.save();
                    // console.log(s?._id)
                }

            }
        }
        // console.log(days)
        return commonUtils.sendSuccess(req, res, {message: lang == "en" ? AppStringEng.SHIFT_ADD_SUCCESS : AppStringJapan.SHIFT_ADD_SUCCESS}, 200);
    } catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

function getDate(i: any, startDate: any, startTime: any, endDate: any, endTime: any) {
    // i, startDate,e.startTime, null,null
    // console.log(i,startDate,startTime,endTime)
    let dt = new Date();
    // dt.setHours(dt.getHours()+5)
    // dt.setMinutes(dt.getMinutes()+30)
    return new Promise(async function (resolve, reject) {

        if (startDate && startDate != "") {
            dt = new Date(startDate);
            dt.setDate(dt.getDate() + i);
            if (i == 3) {
                console.log(dt), 211
            }
        } else {
            dt = new Date(endDate);
            dt.setDate(dt.getDate() - i);
        }

        if (startTime) {
            let time = startTime.split(":");
            if (time[0] == "6") {
                console.log({i, dt, time})
            }
            // console.log(time)
            // dt.setMilliseconds(0)
            // dt.setSeconds(0)
            // dt.setMinutes(time[1] ?? 0)
            if (i == 0 && time[0] == 0) {
                console.log(time)
                console.log(time[0], "start")
                // dt.setHours(1)
                console.log(dt)
            } else {
                dt.setMilliseconds(0)
                dt.setSeconds(0)
                dt.setMinutes(time[1] ?? 0)
                dt.setHours(time[0] ?? 0)
                dt.setDate(dt.getDate())
                if (i == 0 && time[0] == 6) {
                    dt.setDate(dt.getDate() + 1)
                    console.log(dt, 234)
                }
            }
        } else {
            let time = endTime.split(":");
            dt.setMilliseconds(0)
            dt.setSeconds(0)
            dt.setMinutes(time[1] ?? 0)
            dt.setHours(time[0] ?? 0)
            dt.setDate(dt.getDate())
            if (i == 0) {
                console.log(dt, 245)
            }
        }
        // console.log({dt})
        return resolve(dt)
    })

}

function getNewDate(i: any, startDate: any, endDate: any) {
    // console.log(i,startTime,endTime)
    let dt = new Date();
    if (startDate && startDate != "") {
        dt = new Date(startDate);
        dt.setDate(dt.getDate() + i);

    } else {
        dt = new Date(endDate);
        dt.setDate(dt.getDate() - i);
    }
    // console.log(moment(dt).format('YYYY-MM-DD'))
    return moment(dt).format('YYYY-MM-DD');
}

async function staffShift(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {search, type, page, startDay, endDay, staffId}: any = req.query;
        // console.log(startDay,endDay)
        var limit = parseInt(req.query.limit as string) || 15;
        page = page || 1;
        var skip = (page - 1) * limit;
        let startDate = new Date(startDay);
        let endDate = new Date(endDay)

        endDate.setDate(endDate.getDate() + 1)
        // console.log(startDate,endDate)


        let filter: any = {
            startDate: {$gte: startDate, $lte: endDate}
        };
        if (staffId) {
            filter = {...filter, staffId: mongoose.Types.ObjectId(staffId)}
        }
        if (type && search && search != "" && type == "email" || type == "mobile") {
            type == "email" ? filter = {email: search} : filter = {mobile: search}
        } else if (search && search !== "") {
            filter = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    // { email: { $regex: search, $options: 'i' } },
                    {mobile: {$regex: search, $options: 'i'}},
                    // { uniqueId: { $regex: search, $options: 'i' } }
                ]
            }
        }
        let StaffList = await StaffShift.aggregate([

            {$match: filter},
            {
                '$group': {
                    '_id': {"staffId": "$staffId"},
                    shiftId: {$push: {shiftId: "$shiftId", startDay: "$startDay", startDate: "$startDate"}},

                }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: '_id.staffId',
                    foreignField: '_id',
                    as: 'staff_data'
                }
            },
            {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},

            {
                $project: {
                    _id: 1,
                    staffId: 1,
                    name: "$staff_data.name",
                    startDate: 1,
                    endDate: 1,
                    status: 1

                },

            },
            {$sort: {_id: -1}},


        ])
        if (staffId && staffId != "" && StaffList[0]) {
            let hash = await getShiftWiseDay(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].responderData = await getResponderData(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].shiftData = hash;
            return commonUtils.sendSuccess(req, res, StaffList, 200);
        }
        for (var i = 0; i < StaffList.length; i++) {
            let hash = await getDayWiseShift(StaffList[i]._id?.staffId, startDate, endDate);
            StaffList[i].shiftData = hash;
            StaffList[i].responderData = await getResponderData(StaffList[i]._id?.staffId, startDate, endDate);

        }


        if (StaffList) {

            return commonUtils.sendSuccess(req, res, StaffList, 200);
        }
    } catch (err: any) {
        console.log("STAFF SHIFT", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }

}

async function getDayWiseShift(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {
        // let filter: any = {
        //     startDate:{$gte: startDate,$lt:endDate}
        // };
        let AllShiftBYDay = await StaffShift.aggregate([
            {$match: {staffId: mongoose.Types.ObjectId(staffId), startDate: {$gte: startDate, $lte: endDate}}},
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {$push: {shiftId: "$shiftId", startDay: "$startDay", startDate: "$startDate"}},
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    name: "$shift_data.name",
                    shift_data: 1,
                    startDate: 1,
                    // day:1
                },

            },
            {$sort: {_id: 1}}

        ])
        // console.log(AllShiftBYDay)
        let hash: any = {};
        let name = await _.pluck(AllShiftBYDay, "name");
        let day = await _.pluck(AllShiftBYDay, "_id");
        let keys = await _.pluck(day, "startDay");

        // let finalObj = 

        for (var j = 0; j < name.length; j++) {

            // console.log(hash[keys[j]] = name[j],".................")
            let newName = ["", "", "", ""];

            for (var jk = 0; jk < name[j].length; jk++) {
                if (name[j][jk] == "A") {
                    newName[0] = "A";
                } else if (name[j][jk] == "B") {
                    newName[1] = "B";
                } else if (name[j][jk] == "C") {
                    newName[2] = "C";
                } else if (name[j][jk] == "D") {
                    newName[3] = "D";
                }
            }
            hash[keys[j]] = newName;
        }

        return resolve(hash);
    })
}

async function getResponderData(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {
        // let filter: any = {
        //     startDate:{$gte: startDate,$lt:endDate}
        // };
        // console.log(staffId)
        let AllShiftBYDay = await StaffShift.aggregate([
            {
                $match: {
                    isResponder: 1,
                    staffId: mongoose.Types.ObjectId(staffId),
                    startDate: {$gt: startDate, $lt: endDate}
                }
            },
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {$push: {shiftId: "$shiftId", isResponder: "$isResponder", startDate: "$startDate"}},
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {$unwind: {path: "$shift_data", preserveNullAndEmptyArrays: true}},

            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    isResponder: 1,
                    name: "$shift_data.name",
                    // shift_data:1
                },

            },
            {$sort: {_id: 1}}

        ])

        let day = await _.pluck(AllShiftBYDay, "_id");
        let keys = await _.pluck(day, "startDay");

        let responder: any = {}

        for (var j = 0; j < 7; j++) {
            let responder2: any = "";

            if (AllShiftBYDay[j]?.shiftId[0]?.isResponder) {

                responder2 = "Responder" + AllShiftBYDay[j]?.name;
            }
            responder[keys[j]] = responder2;
        }


        return resolve([responder]);
    })
}

//shift by staff idd
async function getShiftWiseDay(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {

        // console.log(staffId)
        let AllShiftBYDay = await StaffShift.aggregate([
            {$match: {staffId: mongoose.Types.ObjectId(staffId), startDate: {$gte: startDate, $lte: endDate}}},
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {$push: {shiftId: "$shiftId", startDay: "$startDay", startDate: "$startDate"}},
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    name: "$shift_data.name",
                    startDate: 1,
                    // shift_data:1
                },

            },
            {$sort: {_id: 1}}

        ])

        let hash: { [key: string]: string[] } = {};
        let name = await _.pluck(AllShiftBYDay, "name");
        let day = await _.pluck(AllShiftBYDay, "_id");
        let keys = _.pluck(day, "startDay");

        // console.log({name})
        // console.log(keys)
        for (var j = 0; j < name.length; j++) {

            // console.log(hash[keys[j]] = name[j],".................")
            let newName = ["", "", "", ""];

            for (var jk = 0; jk < name[j].length; jk++) {
                if (name[j][jk] == "A") {
                    newName[0] = "A";
                } else if (name[j][jk] == "B") {
                    newName[1] = "B";
                } else if (name[j][jk] == "C") {
                    newName[2] = "C";
                } else if (name[j][jk] == "D") {
                    newName[3] = "D";
                } else {
                    newName[j] = "*";
                }
            }
            hash[keys[j]] = newName;
        }
        var valuesData = Object.values(hash);

        var horizontalArray: any = valuesData[0].map((_, colIndex) =>
            valuesData.map(row => row[colIndex])
        );
        resolve(horizontalArray)

    })
}

async function shiftByStaffId(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {search, type, page, staffId, startDay, endDay}: any = req.query;
        var limit = parseInt(req.query.limit as string) || 5;
        page = page || 1;
        var skip = (page - 1) * limit;
        let startDate = new Date(startDay);
        let endDate = new Date(startDay)
        // console.log(endDate)
        endDate.setDate(endDate.getDate() + 6)
        let filter: any = {
            // name: { $ne: null }
            staffId: mongoose.Types.ObjectId(staffId),
            startDate: {$gte: startDate, $lte: endDate}

        };
        if (type && search && search != "" && type == "email" || type == "mobile") {
            type == "email" ? filter = {email: search} : filter = {mobile: search}
        } else if (search && search !== "") {
            filter = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    // { email: { $regex: search, $options: 'i' } },
                    {mobile: {$regex: search, $options: 'i'}},
                    // { uniqueId: { $regex: search, $options: 'i' } }
                ]
            }
        }
        let StaffList = await StaffShift.aggregate([
            {$match: filter},
            {
                '$group': {
                    '_id': {"staffId": "$staffId"},
                    shiftId: {$push: {shiftId: "$shiftId", startDate: "$startDate"}},

                }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: '_id.staffId',
                    foreignField: '_id',
                    as: 'staff_data'
                }
            },
            {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},

            {
                $project: {
                    _id: 1,
                    staffId: 1,
                    name: "$staff_data.name",
                    startDate: 1,
                    endDate: 1,
                    status: 1,
                    createdAt: 1,

                },

            },
        ])

        if (StaffList[0]) {
            let hash = await getShiftWiseDay(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].responderData = await getResponderData(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].shiftData = hash;
            return commonUtils.sendSuccess(req, res, StaffList, 200);
        } else {
            // StaffList[0].shiftData = { "1": ["","","","","","",""],
            // "2": ["","","","","","",""],
            // "3": ["","","","","","",""],
            // "4": ["","","","","","",""]
            // };  
            return commonUtils.sendSuccess(req, res, StaffList, 200);
        }
    } catch (err: any) {
        console.log("SHIFT BY STAFF ID", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }

}

async function updateShift(req: Request, res: Response) {
    try {

        // await StaffShift.remove({staffId:mongoose.Types.ObjectId('6492a5540f9b156e5008d09f')})
        let lang = req.headers.lang ?? "en";
        let data2 = req.body;

        let staffId = data2?.staffId;
        // console.log("UPDATE SHIFT ================START")
        // console.log(data2)
        // console.log("UPDATE SHIFT ================END")
        if (!staffId) {
            let checkStaffExist = await User.findById(staffId);
            if (!checkStaffExist) return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_NOT_EXISTS : AppStringJapan?.STAFF_NOT_EXISTS}, 409);
        }
        let reponder: any = data2?.responder ?? {};
        let result: any = Object.entries(data2).reduce((acc: any, [key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                acc[key] = value;
            }
            return acc;
        }, {});
        let days: any = [];

        let startDay = data2?.startDay;

        let startDate = data2?.startDate;
        let endDate = data2?.startDate;

        // console.log(startDate,endDate)

        let shift = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        // await shift.forEach(async (e: any) => {
        return new Promise(async function (resolve, reject) {
            for (var sh = 0; sh < shift.length; sh++) {
                let e = shift[sh];
                let shiftId = e._id;

                for (let i = 0; i <= 6; i++) {
                    var fieldName = e.name + 'D' + i;
                    if (reponder[i] && reponder[i] == "Responder" + [e.name]) {
                        if (!days['day' + i]) {
                            days['day' + i] = {
                                ...days['day' + i]
                            };
                        }
                        days['day' + i][e.name] = {
                            ...days['day' + i][e.name],
                            isResponder: 1,
                            shiftId: shiftId.toString(),
                            startDay: await getNewDate(i, startDate, ""),
                            startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                            endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay

                        };

                    }
                    if (result[fieldName] && result[fieldName][0] === fieldName) {

                        if (!result['day' + i]) {
                            days['day' + i] = {
                                ...days['day' + i]
                            };
                        }

                        days['day' + i][e.name] = {
                            ...days['day' + i][e.name],
                            isShift: 1,
                            shiftId: shiftId.toString(),
                            startDay: await getNewDate(i, startDate, ""),
                            startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                            endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                        };
                        // if(e.name=="D"){
                        //     console.log(".....",shift[sh].startTime,shift[sh].endTime);
                        // }
                        // console.log(days['day' + i][e.name])
                        let date = await getNewDate(i, startDate, "");
                        let existShift = await StaffShift.findOne({
                            shiftId: mongoose.Types.ObjectId(shiftId),
                            staffId: mongoose.Types.ObjectId(staffId),
                            startDay: date
                            //day: startDay + i
                        });
                        if (!existShift) {
                            let s = await new StaffShift({
                                ...days['day' + i][e.name],
                                isShift: 1,
                                shiftId: mongoose.Types.ObjectId(shiftId),
                                staffId: mongoose.Types.ObjectId(staffId),
                                //day: startDay + i,
                                startDay: date,//await getNewDate(i,startDate,""),
                                startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                                endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                            })
                            await s.save();
                        } else {

                            //console.log("exist and update")
                            await StaffShift.findByIdAndUpdate(existShift?._id, {
                                ...days['day' + i][e.name],
                                isShift: 1,
                                shiftId: mongoose.Types.ObjectId(shiftId),
                                staffId: mongoose.Types.ObjectId(staffId),
                                // day: startDay + i,
                                startDay: await getNewDate(i, startDate, ""),
                                startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                                endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                            })
                        }

                    } else {
                        //delete
                        // console.log("delete",startDay + i);
                        let date = await getNewDate(i, startDate, "");
                        await StaffShift.deleteMany({
                            shiftId: mongoose.Types.ObjectId(e._id),
                            staffId: mongoose.Types.ObjectId(staffId),
                            startDay: date
                        })
                    }

                }
            }
            return commonUtils.sendSuccess(req, res, {message: lang == "en" ? AppStringEng.SHIFT_ADD_SUCCESS : AppStringJapan.SHIFT_ADD_SUCCESS}, 200);

        })

        // console.log(days)
    } catch (err: any) {
        console.log("UPDATE SHIFT ", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function addStaffShift(req: Request, res: Response) {
    try {

        // await StaffShift.remove({staffId:mongoose.Types.ObjectId('6492a5540f9b156e5008d09f')})
        let lang = req.headers.lang ?? "en";
        let data2 = req.body;
        // console.log(data2)
        // return true;
        // let data2 = 
        // {
        //     StaffId: 'tina',
        //     shiftsData: [
        //       { day: '0', shift: ['AD0', 'DD0'] },
        //       { day: '1', shift: ['AD1', 'DD1', 'BD1', 'CD1'] },
        //       { day: '2', shift: ['AD2', 'DD2', 'BD2', 'CD2'] },
        //       { day: '3', shift:  ['AD3','CD3'] },
        //       { day: '4', shift: ['AD4', 'CD4']},
        //       { day: '5', shift: ['DD5', 'AD5', 'CD5','BD5'] },
        //       { day: '6', shift: ['AD6', 'DD6']}
        //     ],
        //     staffId: '64ae97a061006ff3442ffef3',
        //     startDate: '2023-07-17',
        //     endDate: '2023-07-23',
        //     startDay: '17',
        //     endDay: '23'
        //   }
        let staffId = data2?.staffId;
        let shiftData = data2?.shiftsData;
        let days: any = [];

        let startDay = data2?.startDay;

        let startDate = data2?.startDate;
        let endDate = data2?.startDate;
        // console.log("UPDATE SHIFT ================START")
        // console.log(data2)
        // console.log("UPDATE SHIFT ================END")
        if (!staffId) {
            let checkStaffExist = await User.findById(staffId);
            if (!checkStaffExist) return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_NOT_EXISTS : AppStringJapan?.STAFF_NOT_EXISTS}, 409);
        }
        let shift = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        await shift.forEach(async (e: any) => {

            for (var i = 0; i < shiftData.length; i++) {

                // let d = shiftData[i].day;
                let shift = shiftData[i].shift;

                for (var j = 0; j < shift.length; j++) {
                    let shiftId = e._id;
                    let name = e.name;
                    let n = shift[j][0];
                    let date = await getNewDate(i, startDate, "");

                    // console.log({date})
                    // console.log(name,n);
                    if (name == n) {
                        let data: any = {
                            onShift: 1,
                            isResponder: 0
                        }
                        if (j == 0 && shift[j]) {
                            data.isResponder = 1
                        }
                        data.shiftId = shiftId;
                        data.staffId = staffId;
                        data.startDay = date,
                            data.startDate = await getDate(i, startDate, e.startTime, null, null),//i + startDay
                            data.endDate = await getDate(i, null, null, endDate, e.endTime)//i + startDay

                        let existShift = await StaffShift.findOne({
                            shiftId: mongoose.Types.ObjectId(shiftId),
                            staffId: mongoose.Types.ObjectId(staffId),
                            startDay: date
                        });
                        if (!existShift) {
                            let insertD = await new StaffShift(data);
                            await insertD.save()
                            // console.log(insertD._id)
                        } else {
                            // console.log("update...",name,n,date)
                            await StaffShift.findByIdAndUpdate(existShift?._id, data)
                        }

                    } else {
                        // console.log("delete...",name,n,date)
                        // await StaffShift.deleteMany({ shiftId: mongoose.Types.ObjectId(shiftId),staffId: mongoose.Types.ObjectId(staffId),startDay: date})
                    }

                }


            }
        })

        // let reponder: any = data2?.responder ?? {};
        // let result: any = Object.entries(data2).reduce((acc: any, [key, value]) => {
        //     if (Array.isArray(value) && value.length > 0) {
        //         acc[key] = value;
        //     }
        //     return acc;
        // }, {});


        // console.log(startDate,endDate)

        // let shift = await Shift.find({}, { createdAt: 0, updatedAt: 0 }).sort({ order: 1 });
        // // await shift.forEach(async (e: any) => {
        //     return new Promise(async function(resolve,reject){
        //         for (var sh = 0; sh < shift.length; sh++) {
        //             let e = shift[sh];
        //             let shiftId = e._id;

        //             for (let i = 0; i <= 6; i++) {
        //                 var fieldName = e.name + 'D' + i;
        //                 if (reponder[i] && reponder[i] == "Responder" + [e.name]) {
        //                     if (!days['day' + i]) {
        //                         days['day' + i] = {
        //                             ...days['day' + i]
        //                         };
        //                     }
        //                     days['day' + i][e.name] = {
        //                         ...days['day' + i][e.name],
        //                         isResponder: 1,
        //                         shiftId: shiftId.toString(),
        //                         startDay: await getNewDate(i,startDate,""),
        //                         startDate: await getDate(i,startDate, e.startTime,null, null),//i + startDay
        //                         endDate: await getDate(i, null,null, endDate,e.endTime)//i + startDay

        //                     };

        //                 }
        //                 if (result[fieldName] && result[fieldName][0] === fieldName) {

        //                     if (!result['day' + i]) {
        //                         days['day' + i] = {
        //                             ...days['day' + i]
        //                         };
        //                     }

        //                     days['day' + i][e.name] = {
        //                         ...days['day' + i][e.name],
        //                         isShift: 1,
        //                         shiftId: shiftId.toString(),
        //                         startDay: await getNewDate(i,startDate,""),
        //                         startDate: await getDate(i,startDate, e.startTime,null, null),//i + startDay
        //                         endDate: await getDate(i, null,null, endDate,e.endTime)//i + startDay
        //                     };
        //                     // if(e.name=="D"){
        //                     //     console.log(".....",shift[sh].startTime,shift[sh].endTime);
        //                     // }
        //                     // console.log(days['day' + i][e.name])
        //                     let date = await getNewDate(i,startDate,"");
        //                     let existShift = await StaffShift.findOne({
        //                         shiftId: mongoose.Types.ObjectId(shiftId),
        //                         staffId: mongoose.Types.ObjectId(staffId),
        //                         startDay:date
        //                         //day: startDay + i
        //                     });
        //                     if (!existShift) {
        //                         let s = await new StaffShift({
        //                             ...days['day' + i][e.name],
        //                             isShift: 1,
        //                             shiftId: mongoose.Types.ObjectId(shiftId),
        //                             staffId: mongoose.Types.ObjectId(staffId),
        //                             //day: startDay + i,
        //                             startDay: date,//await getNewDate(i,startDate,""),
        //                             startDate: await getDate(i,startDate, e.startTime,null, null),//i + startDay
        //                             endDate: await getDate(i, null,null, endDate,e.endTime)//i + startDay
        //                         })
        //                         await s.save();
        //                     } 
        //                     else {

        //                         //console.log("exist and update")
        //                         await StaffShift.findByIdAndUpdate(existShift?._id,{
        //                             ...days['day' + i][e.name],
        //                             isShift: 1,
        //                             shiftId: mongoose.Types.ObjectId(shiftId),
        //                             staffId: mongoose.Types.ObjectId(staffId),
        //                            // day: startDay + i,
        //                            startDay: await getNewDate(i,startDate,""),
        //                             startDate: await getDate(i,startDate, e.startTime,null, null),//i + startDay
        //                             endDate: await getDate(i, null,null, endDate,e.endTime)//i + startDay
        //                         })
        //                     }

        //                 } else {
        //                     //delete
        //                     // console.log("delete",startDay + i);
        //                     let date = await getNewDate(i,startDate,"");
        //                     await StaffShift.deleteMany({ shiftId: mongoose.Types.ObjectId(e._id),staffId: mongoose.Types.ObjectId(staffId),    startDay: date})
        //                 }

        //             }
        //         }
        //         return commonUtils.sendSuccess(req, res, { message: lang == "en" ? AppStringEng.SHIFT_ADD_SUCCESS : AppStringJapan.SHIFT_ADD_SUCCESS }, 200);

        //     })

        // console.log(days)
        return commonUtils.sendSuccess(req, res, {message: lang == "en" ? AppStringEng.SHIFT_ADD_SUCCESS : AppStringJapan.SHIFT_ADD_SUCCESS}, 200);

    } catch (err: any) {
        console.log("UPDATE SHIFT ", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function updateStaffShift(req: Request, res: Response) {
    try {

        // await StaffShift.remove({staffId:mongoose.Types.ObjectId('6492a5540f9b156e5008d09f')})
        let lang = req.headers.lang ?? "en";
        let data2 = req.body;
        // let data2={
        //     StaffId: 'tina',
        //     shiftsData: [
        //       [
        //         'AD0', 'AD1',
        //         'AD2', 'AD3',
        //         'AD4', 'AD5',
        //         'AD6'
        //       ],
        //       [
        //         '', '', 'BD2',
        //         '', '',    'BD5',
        //         ''
        //       ],
        //       [
        //         '',    '',
        //         'CD2', 'CD3',
        //         'CD4', 'CD5',
        //         ''
        //       ],
        //       [
        //         'DD0', 'DD1',
        //         'DD2', '',
        //         '',    'DD5',
        //         'DD6'
        //       ]
        //     ],
        //     responderData: {
        //       '0': 'DD0',
        //       '1': 'CD1',
        //       '2': 'AD2',
        //       '3': 'AD3',
        //       '4': 'AD4',
        //       '5': 'DD5',
        //       '6': 'AD6'
        //     },
        //     staffId: '64ae97a061006ff3442ffef3',
        //     startDate: '2023-07-17',
        //     endDate: '2023-07-23',
        //     startDay: '17',
        //     endDay: '23'
        //   }
        let staffId = data2?.staffId;
        let shiftData = data2?.shiftsData;
        let responderData: any = data2?.responderData;
        //   console.log(responderData,"Responder")

        let startDate = data2?.startDate;
        let endDate = data2?.startDate;
        // console.log("UPDATE SHIFT ================START")
        // console.log(data2)
        // console.log("UPDATE SHIFT ================END")
        if (!staffId) {
            let checkStaffExist = await User.findById(staffId);
            if (!checkStaffExist) return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_NOT_EXISTS : AppStringJapan?.STAFF_NOT_EXISTS}, 409);
        }
        let shift = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        // await shift.forEach(async (e: any,ind:any) => {
        for (var ind = 0; ind < shift.length; ind++) {
            let e = shift[ind];
            let shiftId = e._id;
            let name = e.name;
            // console.log(shiftData[ind].length)
            for (var i = 0; i < shiftData[ind].length; i++) {
                let shift = shiftData[ind][i];
                // console.log({shift})
                let d = shift.length - 1;
                let date = await getNewDate(i, startDate, "");
                // console.log({d,date})
                if (name == shift[0]) {
                    let data: any = {
                        onShift: 1,
                        // isResponder:(d>0 && responderData[d] ==shift) ? 1:0
                    }
                    // console.log(responderData[i],"RESPONDER...")
                    // console.log( d,shift,1107)
                    if (d > 0 && (responderData[i] == shift)) {
                        // console.log("IS RESPONDER")
                        data.isResponder = 1
                    }
                    data.shiftId = shiftId;
                    data.staffId = staffId;
                    data.startDay = date,
                        data.startDate = await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        data.endDate = await getDate(i, null, null, endDate, e.endTime)//i + startDay

                    let existShift = await StaffShift.findOne({
                        shiftId: mongoose.Types.ObjectId(shiftId),
                        staffId: mongoose.Types.ObjectId(staffId),
                        startDay: date
                    });
                    if (!existShift) {
                        let insertD = await new StaffShift(data);
                        await insertD.save()
                        // console.log(insertD._id)
                    } else {
                        // console.log("edit update")
                        await StaffShift.findByIdAndUpdate(existShift?._id, data)
                    }

                }
                if (!shift[0]) {
                    // console.log("what are u doing",name,date)
                    await StaffShift.deleteMany({
                        shiftId: mongoose.Types.ObjectId(shiftId),
                        staffId: mongoose.Types.ObjectId(staffId),
                        startDay: date
                    })

                }

            }
        }

        // })

        return commonUtils.sendSuccess(req, res, {message: lang == "en" ? AppStringEng.SHIFT_UPDATE_SUCCESS : AppStringJapan.SHIFT_UPDATE_SUCCESS}, 200);

    } catch (err: any) {
        console.log("UPDATE SHIFT ", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function responderShift(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {search, type, page, staffId, startDay, endDay}: any = req.query;
       
        let filter: any = {
            startDay: startDay
        };
       
        if (type && search && search != "" && type == "email" || type == "mobile") {
            type == "email" ? filter = {email: search} : filter = {mobile: search}
        } else if (search && search !== "") {
            filter = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    // { email: { $regex: search, $options: 'i' } },
                    {mobile: {$regex: search, $options: 'i'}},
                    // { uniqueId: { $regex: search, $options: 'i' } }
                ]
            }

        }
        let StaffList  = await StaffShift.aggregate([
           
            {
                $facet: {
                    isResponderGroup: [
                        {
                            $match: {
                                isResponder: 1,startDay:startDay
                            }
                        },
                        {
                            $group: {
                                _id: "$shiftId",
                                shiftId: { $first: "$shiftId" },
                                staffInfo: {
                                    $push: {
                                        shiftId: "$shiftId",
                                        staffId: "$staffId",
                                        startDate: "$startDate",
                                        isResponder: "$isResponder",
                                        onShift: "$onShift",
                                        createdAt:"$createdAt"
                                    }
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "shifts",
                                localField :"_id",
                                foreignField:"_id",
                                as: "shift_data",
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: {'stafusers': '$staffInfo.staffId'},
                                pipeline: [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    {
                                                        '$in': [
                                                            '$_id', '$$stafusers'
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
            
                                    },
                                    {
                                        $project: {
                                            name: 1, _id: 1,
                                            email: 1,
                                            mobile: 1,
                                            uniqeId: 1,
                                            yomi: 1,
                                            address: 1,
                                            frigana: 1,
                                            contract: 1,
                                            license: 1
                                        }
                                    }
                                ],
                                as: "staff_data",
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                shiftId: 1,
                                staffInfo: 1,
                                shift_data:1,
                                staff_data:1,
                                shiftName :"$shift_data.name" 
                            }
                        }
                    ],
                    onShiftGroup: [
                        {
                            $match: {
                                onShift: 1,startDay:startDay
                            }
                        },
                        {
                            $group: {
                                _id: "$shiftId",
                                shiftId: { $first: "$shiftId" },
                                staffInfo: {
                                    $push: {
                                        staffId: "$staffId",
                                        startDate: "$startDate",
                                        isResponder: "$isResponder",
                                        onShift: "$onShift",
                                        createdAt:"$createdAt"
                                    }
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "shifts",
                                localField :"_id",
                                foreignField:"_id",
                               
                                as: "shift_data",
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: {'stafusers': '$staffInfo.staffId'},
                                pipeline: [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    {
                                                        '$in': [
                                                            '$_id', '$$stafusers'
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
            
                                    },
                                    {
                                        $project: {
                                            name: 1, _id: 1,
                                            email: 1,
                                            mobile: 1,
                                            uniqeId: 1,
                                            yomi: 1,
                                            address: 1,
                                            frigana: 1,
                                            contract: 1,
                                            license: 1
                                        }
                                    }
                                ],
                                
                                as: "staff_data",
                            }
                        },
                        // {$sort:{createdAt:1}},
                        {
                            $project: {
                                _id: 0,
                                shiftId: 1,
                                staffInfo: 1,
                                shift_data: 1,
                                staff_data:1,
                                shiftName :"$shift_data.name" 
                            }
                        },
                        {$sort:{"staffInfo.createdAt":1}}
                    ]
                }
            },
            
        ])
        // res.json(StaffList);

        // let StaffList  = await StaffShift.aggregate([
        //                 {
        //                     $match: {
        //                         startDay:startDay,
        //                         onShift:1
        //                         // $or:[{isResponder: 1},{onShift:1}]
                                
        //                     }
        //                 },
        //                 {
        //                     $group: {
        //                         _id: "$shiftId",
        //                         shiftId: { $first: "$shiftId" },
        //                         staffInfo: {
        //                             $push: {
        //                                 shiftId: "$shiftId",
        //                                 staffId: "$staffId",
        //                                 startDate: "$startDate",
        //                                 isResponder: "$isResponder",
        //                                 onShift: "$onShift"
        //                             }
        //                         }
        //                     }
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "shifts",
        //                         localField :"_id",
        //                         foreignField:"_id",
        //                         as: "shift_data",
        //                     }
        //                 },
        //                 {
        //                     $addFields: {
        //                         staffInfo: {
        //                             $map: {
        //                                 input: "$staffInfo",
        //                                 as: "staff",
        //                                 in: {
        //                                     $mergeObjects: [
        //                                         "$$staff",
        //                                         {
        //                                             isResponder: {
        //                                                 $cond: {
        //                                                     if: { $eq: ["$$staff.isResponder", 1] },
        //                                                     then: 1,
        //                                                     else: 0
        //                                                 }
        //                                             }
        //                                         }
        //                                     ]
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "users",
        //                         let: {'stafusers': '$staffInfo.staffId',"isResponder":"$staffInfo.isResponder","onShift":"$staffInfo.onShift"},
        //                         pipeline: [
        //                             {
        //                                 '$match': {
        //                                     '$expr': {
        //                                         '$and': [
        //                                             {
        //                                                 '$in': [
        //                                                     '$_id', '$$stafusers'
        //                                                 ]
        //                                             },
        //                                         ]
        //                                     }
        //                                 }
            
        //                             },
        //                             // {
        //                             //     $addFields:{
        //                             //         isResponder:
        //                             //         {
        //                             //             $cond: {
        //                             //                 if: { $eq: ["$_id",,"$$staffInfo.isResponder", 1] },
        //                             //                 // if: { $eq: ["$$staffInfo.isResponder", 1] },
        //                             //                 then: 1,
        //                             //                 else: 0
        //                             //             }
        //                             //         },
                                            
        //                             //         // "$$isResponder",
        //                             //         onShift:"$$onShift"
                                        
                                        
        //                             //     }
        //                             // },
        //                             {
        //                                 $project: {
        //                                     name: 1, _id: 1,
        //                                     email: 1,
        //                                     mobile: 1,
        //                                     uniqeId: 1,
        //                                     yomi: 1,
        //                                     address: 1,
        //                                     frigana: 1,
        //                                     contract: 1,
        //                                     license: 1,
        //                                     isResponder:1,
        //                                     onShift:1

        //                                 }
        //                             }
        //                         ],
        //                         as: "staff_data",
        //                     }
        //                 },
        //                 // {
        //                 //     $addFields: {
        //                 //         staff_data: {
        //                 //             $map: {
        //                 //                 input: "$staff_data",
        //                 //                 as: "staff",
        //                 //                 in: {
        //                 //                     $mergeObjects: [
        //                 //                         "$$staff",
        //                 //                         {
        //                 //                             isResponder: {
        //                 //                                 $cond: {
        //                 //                                     if: { $eq: ["$$staff.isResponder", 1] },
        //                 //                                     then: 1,
        //                 //                                     else: 0
        //                 //                                 }
        //                 //                             }
        //                 //                         }
        //                 //                     ]
        //                 //                 }
        //                 //             }
        //                 //         }
        //                 //     }
        //                 // },
        //                 {
        //                     $project: {
        //                         _id: 0,
        //                         shiftId: 1,
        //                         staffInfo: 1,
        //                         shift_data:1,
        //                         staff_data:1,
        //                         shiftName :"$shift_data.name" 
        //                     }
        //                 },
                        
                
        // ])
        let shiftName = await Shift.find({}).sort({order:1});
        let finalData :any = [];
        
        for(var i=0;i<shiftName.length;i++){

            let Responderstaff = StaffList[0]?.isResponderGroup.find((item:any) => item?.shiftName[0] === shiftName[i]?.name) //StaffList.find((item:any) => item?.shiftName[0] === shitName[i].name);
            // let Shiftstaff = StaffList?.find((item:any) => item?.shiftName[0] === shiftName[i]?.name) //
            let Shiftstaff = StaffList[0]?.onShiftGroup.find((item:any) => item?.shiftName[0] === shiftName[i].name);
        
            // finalData.push({shift_data : shiftName[i],shiftName :shiftName[i].name})
            let ResponderData:any=[];
            if(Responderstaff){
                // finalData[i] = {
                //     ...finalData[i],
                //     shift_staff_data : Responderstaff?.staff_data
                // }
                ResponderData = Responderstaff?.staff_data
            }
            // console.log(i,ResponderData.length)
            if(Shiftstaff){
                if(ResponderData && ResponderData.length==1){

                    let checkExist = Shiftstaff?.staff_data?.filter((items:any)=>{ return items?._id?.toString() !==  ResponderData[0]?._id?.toString()});
                    finalData[i] = {
                        shift_data : shiftName[i],shiftName :shiftName[i].name,
                        shift_staff_data : [ResponderData[0],...checkExist],
                    }
                    // console.log( "Shift",Shiftstaff?.staff_data)

                }else{
                    finalData[i] = {
                        shift_data : shiftName[i],shiftName :shiftName[i].name,
                        shift_staff_data : [{_id:"-",name:"-"},...Shiftstaff?.staff_data],
                    }
                }
        
            }

        }
        // res.json(StaffList);

//        res.json(finalData)
        return commonUtils.sendSuccess(req, res, finalData, 200);

    } catch (err: any) {
        console.log("SHIFT BY STAFF ID", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }

}

async function symptomsAdd(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {ename, jname, endTime, order}: any = req.body;
        console.log(req.body)
        let symp = await new Symptoms({
            ename: ename,
            jname: jname
        })

        await symp.save();
        return commonUtils.sendSuccess(req, res, {id: symp._id}, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function symptoms(req: Request, res: Response) {
    try {

        var shiftList = await Symptoms.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        return commonUtils.sendSuccess(req, res, shiftList, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function addShift2(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let data2 = req.body;
        console.log(data2)
        return
        // console.log(data2)
        // return false;
        let staffId = data2?.staffId;
        // console.log(staffId)
        if (!staffId) {
            let checkStaffExist = await User.findById(staffId);
            if (!checkStaffExist) return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_NOT_EXISTS : AppStringJapan?.STAFF_NOT_EXISTS}, 409);
        }
        let reponder: any = data2?.responder ?? {};
        let result: any = Object.entries(data2).reduce((acc: any, [key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                acc[key] = value;
            }
            return acc;
        }, {});
        let days: any = [];
        let startDay = data2?.startDay;

        let startDate = data2?.startDate;
        let endDate = data2?.startDate;

        // console.log(startDate,endDate)
        // return true;
        let shift = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});
        // await shift.forEach(async (e: any) => {
        for (var sh = 0; sh < shift.length; sh++) {
            let e = shift[sh];

            for (let i = 0; i <= 6; i++) {
                var fieldName = e.name + 'D' + i;
                if (reponder[i] && reponder[i] == "Responder" + [e.name]) {
                    if (!days['day' + i]) {
                        days['day' + i] = {
                            ...days['day' + i]
                        };
                    }

                    days['day' + i][e.name] = {
                        ...days['day' + i][e.name],
                        isResponder: 1,
                        shiftId: e._id.toString(),
                        startDay: await getNewDate(i, startDate, ""),
                        endDay: await getNewDate(i, "", endDate),
                        // startDate: await getDate(startDay + i, e.startTime, null),//i + startDay
                        // endDate: await getDate(endDay - i, null, e.endTime)//i + startDay
                        startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay

                    };

                }
                if (result[fieldName] && result[fieldName][0] === fieldName) {

                    if (!result['day' + i]) {
                        days['day' + i] = {
                            ...days['day' + i]
                        };
                    }

                    days['day' + i][e.name] = {
                        ...days['day' + i][e.name],
                        isShift: 1,
                        shiftId: e._id.toString(),
                        startDay: await getNewDate(i, startDate, ""),
                        endDay: await getNewDate(i, "", endDate),
                        // startDate: await getDate(startDay + i, e.startTime, null),//i + startDay
                        // endDate: await getDate(endDay - i, null, e.endTime)//i + startDay
                        startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                    };
                    // console.log(days['day' + i][e.name])
                    let s = await new StaffShift({
                        ...days['day' + i][e.name],
                        isShift: 1,
                        shiftId: mongoose.Types.ObjectId(e._id),
                        staffId: mongoose.Types.ObjectId(staffId),
                        // day: startDay + i,
                        startDay: await getNewDate(i, startDate, ""),
                        endDay: await getNewDate(i, "", endDate),

                        startDate: await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        endDate: await getDate(i, null, null, endDate, e.endTime)//i + startDay
                    })
                    await s.save();
                    // console.log(s?._id)
                }

            }
        }
        // console.log(days)
        return commonUtils.sendSuccess(req, res, {message: lang == "en" ? AppStringEng.SHIFT_ADD_SUCCESS : AppStringJapan.SHIFT_ADD_SUCCESS}, 200);
    } catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function shiftByStaffId2(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let {search, type, page, staffId, startDay, endDay}: any = req.query;
        var limit = parseInt(req.query.limit as string) || 5;
        page = page || 1;
        var skip = (page - 1) * limit;
        let startDate = new Date(startDay);
        let endDate = new Date(startDay)
        if (!staffId) {
            // let checkStaffExist = await User.findById(staffId);
            //if (!checkStaffExist) 
            return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_ID_REQUIRED : AppStringJapan?.STAFF_ID_REQUIRED}, 409);
        }
        endDate.setDate(endDate.getDate() + 7)
        // console.log("eheheeh",startDay,endDate)
        let filter: any = {
            // name: { $ne: null }
            staffId: mongoose.Types.ObjectId(staffId),
            startDate: {$gte: startDate, $lte: endDate}

        };
        if (type && search && search != "" && type == "email" || type == "mobile") {
            type == "email" ? filter = {email: search} : filter = {mobile: search}
        } else if (search && search !== "") {
            filter = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    // { email: { $regex: search, $options: 'i' } },
                    {mobile: {$regex: search, $options: 'i'}},
                    // { uniqueId: { $regex: search, $options: 'i' } }
                ]
            }
        }
        let StaffList = await StaffShift.aggregate([
            {$match: filter},
            {
                '$group': {
                    '_id': {"staffId": "$staffId"},
                    shiftId: {$push: {shiftId: "$shiftId", startDate: "$startDate"}},

                }
            },

            {
                $lookup: {
                    from: 'users',
                    localField: '_id.staffId',
                    foreignField: '_id',
                    as: 'staff_data'
                }
            },
            {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},

            {
                $project: {
                    _id: 1,
                    staffId: 1,
                    name: "$staff_data.name",
                    startDate: 1,
                    endDate: 1,
                    status: 1,
                    createdAt: 1,

                },

            },
        ])
        console.log(StaffList)
        console.log(StaffList[0])
        if (StaffList[0]) {
            console.log("HIIIIII")
            let hash = await getShiftData3(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].responderData = await getResponderData3(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].shiftData = hash;
            let leaderExistData = await leaderExist(StaffList[0]._id?.staffId, startDate, endDate);
            StaffList[0].leaderExist = leaderExistData;
            return commonUtils.sendSuccess(req, res, StaffList, 200);
        } else {

            // StaffList[0].shiftData = { "1": ["","","","","","",""],
            // "2": ["","","","","","",""],
            // "3": ["","","","","","",""],
            // "4": ["","","","","","",""]
            // };  

            let leaderExistData: any = await leaderExist(staffId, startDate, endDate);
            return commonUtils.sendSuccess(req, res, {leaderExist: leaderExistData}, 200);
        }
    } catch (err: any) {
        console.log("SHIFT BY STAFF ID", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }

}

async function getShiftData2(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {
        // let filter: any = {
        //     startDate:{$gte: startDate,$lt:endDate}
        // };
        // console.log(startDate,endDate)
        let AllShiftBYDay = await StaffShift.aggregate([
            {$match: {staffId: mongoose.Types.ObjectId(staffId), startDate: {$gte: startDate, $lte: endDate}}},
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {$push: {shiftId: "$shiftId", startDay: "$startDay", startDate: "$startDate"}},
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    name: "$shift_data.name",
                    shift_data: 1,
                    startDate: 1,
                    // day:1
                },

            },
            {$sort: {_id: 1}}
        ])
        // console.log(AllShiftBYDay.length)
        let hash: any = [];
        // let name    =  await _.pluck(AllShiftBYDay, "name");
        let day = []
        for (var i = 0; i < 7; i++) {
            day.push(await getNewDate(i, startDate, ""))
        }
        for (var j = 0; j < 7; j++) {
            let newName = ["", "", "", ""];
            if (AllShiftBYDay[j]?._id.startDay == day[j]) {

                let name = AllShiftBYDay[j].name;

                for (var jk = 0; jk < name.length; jk++) {
                    // console.log(name[j])
                    if (name[jk] == "A") {
                        newName[0] = "A";
                    } else if (name[jk] == "B") {
                        newName[1] = "B";
                    } else if (name[jk] == "C") {
                        newName[2] = "C";
                    } else if (name[jk] == "D") {
                        newName[3] = "D";
                    }
                }
            }

            hash[j] = newName;
        }
        // console.log(hash)
        let transposedArray = await transposeArrayWithIndices(hash)
        // console.log(transposedArray)
        return resolve(transposedArray);
    })
}

async function getShiftData3(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {
        // let filter: any = {
        //     startDate:{$gte: startDate,$lt:endDate}
        // };
        // console.log("ShidtData3",startDate,endDate)
        let AllShiftBYDay = await StaffShift.aggregate([
            {$match: {staffId: mongoose.Types.ObjectId(staffId), startDate: {$gte: startDate, $lte: endDate}}},
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {$push: {shiftId: "$shiftId", startDay: "$startDay", startDate: "$startDate"}},
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    name: "$shift_data.name",
                    shift_data: 1,
                    startDate: 1,
                    // day:1
                },

            },
            {$sort: {_id: 1}}
        ])
        // console.log(AllShiftBYDay.length)
        let hash: any = [
            {day: 0, shift: []},
            {day: 1, shift: []},
            {day: 2, shift: []},
            {day: 3, shift: []},
            {day: 4, shift: []},
            {day: 5, shift: []},
            {day: 6, shift: []},
        ];
        // let name    =  await _.pluck(AllShiftBYDay, "name");
        let day = []
        for (var i = 0; i < 7; i++) {
            day.push(await getNewDate(i, startDate, ""))
        }

        // console.log(AllShiftBYDay)

        // console.log(AllShiftBYDay.length)

        for(var kk = 0; kk < AllShiftBYDay.length; kk++) {
            for (var j = 0; j < 7; j++) {
                let newName = ["", "", "", ""];
                // console.log(AllShiftBYDay[kk]?._id.startDay, day[j])
                if (AllShiftBYDay[kk]?._id.startDay == day[j]) {

                    // console.log(AllShiftBYDay[kk],j)
                    let name = AllShiftBYDay[kk].name;

                    for (var jk = 0; jk < 4; jk++) {
                        // console.log(name[jk])
                        if (name[jk] == "A") {
                            newName[0] = "AD" + j;
                        } else if (name[jk] == "B") {
                            newName[1] = "BD" + j;
                        } else if (name[jk] == "C") {
                            newName[2] = "CD" + j;
                        } else if (name[jk] == "D") {
                            newName[3] = "DD" + j;
                        }
                    }
                    hash[j].shift = newName;
                }

            }
        }


        // console.log(hash)
        // let transposedArray = await transposeArrayWithIndices(hash)
        // console.log(transposedArray)
        // return resolve(transposedArray);
        return resolve(hash);
    })
}

function transposeArrayWithIndices(horizontalArray: any) {
    const maxLength = Math.max(...horizontalArray.map((row: any) => row.length));
    const verticalArray = [];

    for (let i = 0; i < maxLength; i++) {
        const col = [];
        for (let j = 0; j < horizontalArray.length; j++) {
            if (i < horizontalArray[j].length) {
                if (horizontalArray[j][i]) {
                    // console.log(horizontalArray[j][i])
                    col.push(horizontalArray[j][i] + "D" + j);
                } else {
                    col.push("")
                }
            }
        }
        //   console.log(col)
        verticalArray.push(col);
    }

    return verticalArray;

}

async function getResponderData3(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {
        // let filter: any = {
        //     startDate:{$gte: startDate,$lt:endDate}
        // };
        // console.log("REsponder3",startDate,endDate,staffId)
        // console.log(startDate,endDate)

        let AllShiftBYDay = await StaffShift.aggregate([
            {
                $match: {
                    isResponder: 1,
                    staffId: mongoose.Types.ObjectId(staffId),
                    startDate: {$gte: startDate, $lte: endDate}
                }
            },
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {
                        $push: {
                            shiftId: "$shiftId",
                            isResponder: "$isResponder",
                            startDay: "$startDay",
                            startDate: "$startDate"
                        }
                    },
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    name: "$shift_data.name",
                    shift_data: 1,
                    startDate: 1,
                    isResponder: 1,
                },

            },
            {$sort: {_id: 1}}

        ])
        // console.log(AllShiftBYDay)
        let hash: any = [
            {day: 0, shift: [],},
            {day: 1, shift: []},
            {day: 2, shift: []},
            {day: 3, shift: []},
            {day: 4, shift: []},
            {day: 5, shift: []},
            {day: 6, shift: []},
        ];

        // let name    =  await _.pluck(AllShiftBYDay, "name");
        let day :any= []
        for (var i = 0; i < 7; i++) {
            day.push(await getNewDate(i, startDate, ""))
        }

        // console.log(AllShiftBYDay.length)
        for (var j = 0; j < 7; j++) {
            let newName = ["", "", "", ""];
            let data =    await AllShiftBYDay.find((item:any)=>item?._id?.startDay == day[j]);
            if (data && data?._id.startDay == day[j]) {

                let name = data.name;

                for (var jk = 0; jk < 4; jk++) {

                    if (name[jk] == "A") {
                        newName[0] = "AD" + j;
                    } else if (name[jk] == "B") {
                        newName[1] = "BD" + j;
                    } else if (name[jk] == "C") {
                        newName[2] = "CD" + j;
                    } else if (name[jk] == "D") {
                        newName[3] = "DD" + j;
                    }
                    // else{
                    //     newName[jk] = "";
                    // }
                }
                hash[j].shift = newName;

            }

        }
        // console.log(AllShiftBYDay)
        // console.log(hash)
        // let transposedArray = await transposeArrayWithIndices(hash)
        // console.log(transposedArray)
        // return resolve(transposedArray);
        return resolve(hash);
    })
}

async function leaderExist(staffId: any, startDate: any, endDate: any) {
    // console.log({staffId},1887)
    return new Promise(async (resolve, reject) => {
        let filter: any = {isResponder: 1, startDate: {$gte: startDate, $lte: endDate}};
        if (staffId && staffId != "") {
            filter = {...filter, staffId: {$ne: mongoose.Types.ObjectId(staffId)}}
        }
        // console.log(filter)
        // console.log("leaderExist",startDate,endDate)
        let AllShiftBYDay = await StaffShift.aggregate([
            {$match: filter},
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {
                        $push: {
                            shiftId: "$shiftId",
                            isResponder: "$isResponder",
                            startDay: "$startDay",
                            startDate: "$startDate"
                        }
                    },
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    name: "$shift_data.name",
                    shift_data: 1,
                    startDate: 1,
                    isResponder: 1,
                },

            },
            {$sort: {_id: 1}}

        ])
        let hash: any = [
            {day: 0, shift: [],},
            {day: 1, shift: []},
            {day: 2, shift: []},
            {day: 3, shift: []},
            {day: 4, shift: []},
            {day: 5, shift: []},
            {day: 6, shift: []},
        ];
        // let name    =  await _.pluck(AllShiftBYDay, "name");
        let day :any= []
        for (var i = 0; i < 7; i++) {
            day.push(await getNewDate(i, startDate, ""))
        }

        // console.log(AllShiftBYDay.length)
        for (var j = 0; j < 7; j++) {
            let newName = ["", "", "", ""];
            // console.log(AllShiftBYDay[j]?._id.startDay, day[j],1851)
            let data = await AllShiftBYDay.find((item:any)=>item?._id?.startDay == day[j]);
            if (data && data?._id?.startDay == day[j]) {

                // console.log(AllShiftBYDay[j],j)
                let name = data.name;
                // console.log({name},1856)
                for (var jk = 0; jk < 4; jk++) {
                    // console.log(name[j])
                    if (name[jk] == "A") {
                        newName[0] = "AD" + j;
                    } else if (name[jk] == "B") {
                        newName[1] = "BD" + j;
                    } else if (name[jk] == "C") {
                        newName[2] = "CD" + j;
                    } else if (name[jk] == "D") {
                        newName[3] = "DD" + j;
                    }
                    // else{
                    //     newName[jk] = "";
                    // }
                }
                hash[j].shift = newName;

            }

        }
        // console.log(hash)
        return resolve(hash);
    })
}

async function getResponderData2(staffId: any, startDate: any, endDate: any) {
    return new Promise(async (resolve, reject) => {
        // let filter: any = {
        //     startDate:{$gte: startDate,$lt:endDate}
        // };
        // console.log(staffId)
        let AllShiftBYDay = await StaffShift.aggregate([
            {
                $match: {
                    isResponder: 1,
                    staffId: mongoose.Types.ObjectId(staffId),
                    startDate: {$gt: startDate, $lt: endDate}
                }
            },
            {
                '$group': {
                    '_id': {"startDay": "$startDay"},
                    shiftId: {$push: {shiftId: "$shiftId", isResponder: "$isResponder", startDate: "$startDate"}},
                }
            },
            {
                $lookup: {
                    from: "shifts",
                    let: {'subcategories': '$shiftId.shiftId'},
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
                        {$project: {name: 1, _id: 1}}
                    ],
                    as: "shift_data",
                }
            },
            {$unwind: {path: "$shift_data", preserveNullAndEmptyArrays: true}},

            {
                $project: {
                    _id: 1,
                    shiftId: 1,
                    isResponder: 1,
                    name: "$shift_data.name",
                    // shift_data:1
                },

            },
            {$sort: {_id: 1}}

        ])

        let day = await _.pluck(AllShiftBYDay, "_id");
        let keys = await _.pluck(day, "startDay");

        let responder: any = {}

        for (var j = 0; j < 7; j++) {
            let responder2: any = "";

            if (AllShiftBYDay[j]?.shiftId[0]?.isResponder) {

                responder2 = AllShiftBYDay[j]?.name + "D" + j;
            }
            responder[j] = responder2;
        }


        return resolve([responder]);
    })
}

async function addStaffShift2(req: Request, res: Response) {
    try {

        // await StaffShift.remove({staffId:mongoose.Types.ObjectId('6492a5540f9b156e5008d09f')})
        let lang = req.headers.lang ?? "en";
        let data2 = req.body;
        // console.log(data2)
        // return true;
        // let data2={
        //     StaffId: 'Adam Brewer',
        //     shiftsData: [

        //             {
        //                 "day": 0,
        //                 "shift": [
        //                     "AD0",
        //                     "BD0",
        //                     "CD0",
        //                     "DD0"
        //                 ]
        //             },
        //             {
        //                 "day": 1,
        //                 "shift": [
        //                     "",
        //                     "BD1",
        //                     "CD1",
        //                     ""
        //                 ]
        //             },
        //             {
        //                 "day": 2,
        //                 "shift": [
        //                     "AD2",
        //                     "BD2",
        //                     "CD2",
        //                     "DD2"
        //                 ]
        //             },
        //             {
        //                 "day": 3,
        //                 "shift": [
        //                     "AD3",
        //                     "BD3",
        //                     "CD3",
        //                     "DD3"
        //                 ]
        //             },
        //             {
        //                 "day": 4,
        //                 "shift": [
        //                     "",
        //                     "BD4",
        //                     "CD4",
        //                     ""
        //                 ]
        //             },
        //             {
        //                 "day": 5,
        //                 "shift": [
        //                     "AD5",
        //                     "BD5",
        //                     "CD5",
        //                     "DD5"
        //                 ]
        //             },
        //             {
        //                 "day": 6,
        //                 "shift": [
        //                     "AD6",
        //                     "BD6",
        //                     "CD6",
        //                     "DD6"
        //                 ]
        //             }

        //     ],
        //     responderData: [
        //         {
        //             "day": 0,
        //             "shift": [
        //                 "",
        //                 "BD0",
        //                 "CD0",
        //                 ""
        //             ]
        //         },
        //         {
        //             "day": 1,
        //             "shift": [
        //                 "",
        //                 "",
        //                 "CD1",
        //                 ""
        //             ]
        //         },
        //         {
        //             "day": 2,
        //             "shift": [
        //                 "AD2",
        //                 "",
        //                 "",
        //                 ""
        //             ]
        //         },
        //         {
        //             "day": 3,
        //             "shift": [
        //                 "",
        //                 "",
        //                 "",
        //                 "DD3"
        //             ]
        //         },
        //         {
        //             "day": 4,
        //             "shift": [
        //                 "",
        //                 "",
        //                 "",
        //                 ""
        //             ]
        //         },
        //         {
        //             "day": 5,
        //             "shift": [
        //                 "",
        //                 "",
        //                 "CD5",
        //                 ""
        //             ]
        //         },
        //         {
        //             "day": 6,
        //             "shift": [
        //                 "",
        //                 "BD6",
        //                 "",
        //                 ""
        //             ]
        //         }
        //     ],
        //     staffId: '64c0cbf7e1b67cf88099c0e0',
        //     startDate: '2023-07-24',
        //     endDate: '2023-07-30',
        //     startDay: '24',
        //     endDay: '30'
        //   }
        //   let staffId = "64c0cbf7e1b67cf88099c0e0"//data2?.staffId;
        let staffId = data2?.staffId;
        let shiftData = await data2?.shiftsData.map((s: any) => s.shift);
        let responderData: any = await data2?.responderData.map((r: any) => r.shift);
        // let shiftData=[
        //     [ 'AD0', 'BD0', 'CD0', 'DD0' ],
        //     [ '', 'BD1', 'CD1', '' ],
        //     [ 'AD2', 'BD2', '', 'DD2' ],
        //     [ 'AD3', '', '', 'DD3' ],
        //     [ 'AD4', '', 'CD3', 'DD4' ],
        //     [ 'AD5', '', '', 'DD5' ],
        //     [ 'AD6', '', '', 'DD6' ]
        // ];
        // let responderData = [
        //     [ '', 'BD0', 'CD0', 'DD0' ],
        //     [ '', 'BD1', '', '' ],
        //     [ '', '', '', 'DD2' ],
        //     [ 'AD3', '', '', '' ],
        //     [ '', '', '', 'DD4' ],
        //     [ 'AD5', '', '', 'DD5' ],
        //     [ '', '', '', 'DD6' ]
        // ]
        // console.log({shiftData,responderData})

        // let startDate = "2023-07-24"||data2?.startDate;
        let startDate = data2?.startDate;
        let endDate = "2023-07-30" || data2?.startDate;

        if (!staffId) {
            let checkStaffExist = await User.findById(staffId);
            if (!checkStaffExist) return commonUtils.sendError(req, res, {message: lang == "en" ? AppStringEng.STAFF_NOT_EXISTS : AppStringJapan?.STAFF_NOT_EXISTS}, 409);
        }
        let shiftMain = await Shift.find({}, {createdAt: 0, updatedAt: 0}).sort({order: 1});

        for (var i = 0; i < shiftData.length; i++) {

            for (var j = 0; j < 4; j++) {
                let e = shiftMain[j];
                let shiftId = e?._id;
                let name = e?.name;
                console.log(name, "shift name")

                let shift = shiftData[i][j];
                let responder = responderData[i][j];
                // console.log({shift})
                // console.log({responder})
                let d = shift?.length - 1;
                let date = await getNewDate(i, startDate, "");

                if (shift && name == shift[0]) {
                    let data: any = {
                        onShift: 1,
                        isResponder:0,
                        callCount:0
                        // isResponder:(d>0 && responderData[d] ==shift) ? 1:0
                    }
                    // console.log(responderData[i],"RESPONDER...")
                    // console.log( d,shift,1107)
                    if (d > 0 && (responder == shift)) {
                        console.log("IS RESPONDER")
                        data.isResponder = 1,
                        data.callCount=0
                    }
                    data.shiftId = shiftId;
                    data.staffId = staffId;
                    data.startDay = date,
                        data.startDate = await getDate(i, startDate, e.startTime, null, null),//i + startDay
                        data.endDate = await getDate(i, startDate, e.endTime, null, null)//i + startDay

                    let existShift = await StaffShift.findOne({
                        shiftId: mongoose.Types.ObjectId(shiftId),
                        staffId: mongoose.Types.ObjectId(staffId),
                        startDay: date
                    });
                    if (!existShift) {
                        let insertD = await new StaffShift(data);
                        await insertD.save()
                        console.log(insertD._id)
                    } else {
                        console.log("edit update")
                        await StaffShift.findByIdAndUpdate(existShift?._id, data)
                    }

                } else {
                    console.log("what are u doing", name, date)
                    await StaffShift.deleteMany({
                        shiftId: mongoose.Types.ObjectId(shiftId),
                        staffId: mongoose.Types.ObjectId(staffId),
                        startDay: date
                    })
                }
            }

        }
        return commonUtils.sendSuccess(req, res, {message: lang == "en" ? AppStringEng.SHIFT_ADD_SUCCESS : AppStringJapan.SHIFT_ADD_SUCCESS}, 200);

    } catch (err: any) {
        console.log("UPDATE SHIFT ", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function getAvailableStaff(req: Request, res: Response) {
    try {
        let lang = req.headers.lang ?? "en";
        let startDate = new Date();
        // console.log(startDate)
        let filter: any = {
            // name: { $ne: null },
            startDate: {$lte: startDate},
            endDate: {$gte: startDate}

        };
        let StaffList = await StaffShift.aggregate([
            {$match: filter},
            {
                $lookup: {
                    from: 'users',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff_data'
                }
            },
            {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},

            {
                $project: {
                    _id: 1,
                    staffId: 1,
                    name: "$staff_data.name",
                    startDate: 1,
                    endDate: 1,
                    status: 1,
                    createdAt: 1,
                    mobile: "$staff_data.mobile"

                },

            },
        ])
        if (StaffList.length == 1) {
            return commonUtils.sendSuccess(req, res, StaffList[0], 200);
        } else if (StaffList.length > 1) {
            let data = StaffList[pageState]
            pageState = (pageState + 1) % StaffList.length;
            return commonUtils.sendSuccess(req, res,data, 200);
        } else {

            return commonUtils.sendError(req, res, {message: "Satff not available"}, 409);
        }
        // if (StaffList && StaffList[0]) {

        //     return commonUtils.sendSuccess(req, res, StaffList, 200);
        // } else {
        //     return commonUtils.sendError(req, res, {message: "Satff not available"}, 409);
        // }
    } catch (err: any) {
        console.log("Avaialable STAFF ID", err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }

}

const callWelcome = async (req: Request, res: Response) => {
    try {
        console.log("/ecall/welcome called")
        const response = new twilio.twiml.VoiceResponse();
        // const gather = response.gather({
        //     numDigits: 4,
        //     action: '/ecall/forward',
        //     method: 'POST'
        // });
        response.say('Thank you for calling Medical Arc! please wait while we will connect our staff here.');

        // our logic goes here
        let isAvailable :any= await getAvailableStaff3();
        let day = moment(new Date()).format('YYYY-MM-DD');
        day = day.toString();
        // console.log("day", day)
        console.log("isAvailable", isAvailable?.name)
        // console.log("isAvailable", isAvailable.length)

        if (isAvailable) {
            // console.log("Staff Id", isAvailable?.staffId)
            var mobileNumber = isAvailable?.mobile;
            // console.log("phone", isAvailable?.mobile)

            //make status busy

            let exist = await StaffCallStatus.findOne({staffId: mongoose.Types.ObjectId(isAvailable?.staffId)});
            if (!exist) {
                let newRecord = await new StaffCallStatus();
                let staffId = isAvailable?.staffId;
                let shiftId = isAvailable?.shiftId;
                newRecord.staffId = isAvailable?.staffId;
                newRecord.shiftId = isAvailable?.shiftId;
                // console.error("Shift Id",staffId,shiftId)
                newRecord.status = 1; //busy and connected
                await newRecord.save()
                let update = {
                    startDay :day,
                    shiftId : mongoose.Types.ObjectId(shiftId),
                    staffId : mongoose.Types.ObjectId(staffId)} 
                // console.log(update)
                let shiftDatta = await StaffShift.findOneAndUpdate(update,{$inc:{callCount:1}});
                // console.log(shiftDatta)
                // if(shiftDatta){
                //     shiftDatta.callCount = shiftDatta.callCount+1;
                //     await shiftDatta.save()
                // }
                
                console.log("CAll SUCCESS")
                return res.redirect('/api/ecall/call-agent/' + mobileNumber);
                // res.set('Content-Type', 'text/xml');
                // return res.send(response.toString());
            } else {
                response.say("This line is busy. Call after sometime.");
                response.hangup();
                res.set('Content-Type', 'text/xml');
                return res.send(response.toString());
            }
        } else {
            console.log("Staff Not Available call forwarded to +819094270315");
            return res.redirect('/api/ecall/call-agent/' + "+819094270315");
            //return res.redirect('/ecall/call-agent/917405249551');
            // response.say("Sorry no staff available to join this call. Please try again. Thank you for call with Medical Arc! Your voice makes a difference.");
            // response.hangup();
            // res.set('Content-Type', 'text/xml');
            // return res.send(response.toString());
            return res.json({"success":true});
        }

    } catch (error) {
        console.log("welcome", error);
        res.status(400).send(error);
    }
}

var pageState = 0;

async function getAvailableStaff2() {
    try {
        let startDate = new Date();
        // console.log(startDate)
        let filter: any = {
            // name: { $ne: null },
            startDate: {$lte: startDate},
            endDate: {$gte: startDate}

        };
        let StaffList = await StaffShift.aggregate([
            {$match: filter},
            {
                $lookup: {
                    from: 'users',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff_data'
                }
            },
            {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'staffcallstatuses', // Replace with the actual collection name
                    localField: 'staffId',
                    foreignField: 'staffId',
                    as: 'call_status_data'
                }
            },
            {
                $match: {
                    call_status_data: {$size: 0} // Exclude records with call status data
                }
            },
            {
                $project: {
                    _id: 1,
                    staffId: 1,
                    shiftId: 1,
                    name: "$staff_data.name",
                    startDate: 1,
                    endDate: 1,
                    status: 1,
                    createdAt: 1,
                    mobile: "$staff_data.mobile"

                },

            },
        ])

        if (StaffList.length == 1) {
            return StaffList[0];
        } else if (StaffList.length > 1) {
            let data = StaffList[pageState]
            pageState = (pageState + 1) % StaffList.length;
            return data;
        } else {
            return null;
        }

        // if (StaffList && StaffList.length>0) {
        //     return StaffList[0];
        // } else {
        //     return [];
        // }
    } catch (err: any) {
        console.log("Avaialable STAFF ID", err);
        return false;
    }

}
async function getAvailableStaff3() {
    try {

        let startDate = new Date();
        // console.log(startDate)
        let day = moment(new Date()).format('YYYY-MM-DD');
        day = day.toString();
        // console.log("day", day)

        let filter: any = {
            // name: { $ne: null },
            startDay:day,
            startDate: {$lte: startDate},
            endDate: {$gte: startDate}

        };
        // let filter2 ={...filter,isResponder:1} 
        // // console.log(filter2)
        // let responderExistAndFree = await StaffShift.aggregate([
        //     {$match: filter2},
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'staffId',
        //             foreignField: '_id',
        //             as: 'staff_data'
        //         }
        //     },
        //     {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},
        //     {
        //         $lookup: {
        //             from: 'staffcallstatuses', // Replace with the actual collection name
        //             localField: 'staffId',
        //             foreignField: 'staffId',
        //             as: 'call_status_data'
        //         }
        //     },
        //     {
        //         $match: {
        //             call_status_data: {$size: 0} // Exclude records with call status data
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             staffId: 1,
        //             shiftId: 1,
        //             name: "$staff_data.name",
        //             startDate: 1,
        //             endDate: 1,
        //             status: 1,
        //             createdAt: 1,
        //             mobile: "$staff_data.mobile"

        //         },

        //     },
        // ])
        // // console.log(responderExistAndFree)
        // if(responderExistAndFree.length==1){
        //     // return res.json( responderExistAndFree[0]);
        //     return responderExistAndFree[0];
        // }else
        // {

        
        let StaffList = await StaffShift.aggregate([
            {$match: filter},
            {
                $lookup: {
                    from: 'users',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff_data'
                }
            },
            {$unwind: {path: "$staff_data", preserveNullAndEmptyArrays: true}},
            {
                $lookup: {
                    from: 'staffcallstatuses', // Replace with the actual collection name
                    localField: 'staffId',
                    foreignField: 'staffId',
                    as: 'call_status_data'
                }
            },
            {
                $match: {
                    call_status_data: {$size: 0} // Exclude records with call status data
                }
            },
            {
                $project: {
                    _id: 1,
                    staffId: 1,
                    shiftId: 1,
                    callCount : 1,
                    isResponder : 1,
                    onShift : 1,
                    name: "$staff_data.name",
                    startDate: 1,
                    endDate: 1,
                    status: 1,
                    createdAt: 1,
                    mobile: "$staff_data.mobile",
                    staff_data:1,
                },

            },
            {$sort:{callCount:1,isResponder:-1,_id:1}}
        ])
        
        if (StaffList.length == 1) {
            // return res.json(StaffList[0]);
            return StaffList[0];    
        } else if (StaffList.length > 1) {
            // console.log("else i m here page state",pageState)
            let data = StaffList[0]
            // console.log(StaffList.length)
            // pageState = (pageState + 1) % StaffList.length;
            // return res.json(data);
            // console.log("new state",pageState)
            return data;
        } else {
            // return res.json();
            return null;
        }
    } catch (err: any) {
        console.log("Avaialable STAFF ID", err);
        return false;
    }

}

const callForward = async (req: Request, res: Response) => {
    try {
        console.log("forward")
        console.log(req.query)
        // logic
        if (false) {
            return res.redirect('/ecall/call-agent/8107022626469');
        } else {
            //return res.redirect('/ecall/call-agent/917405249551');
            const response = new twilio.twiml.VoiceResponse();
            response.say("Sorry no staff available to join this call. Please try again. Thank you for call with Medical Arc! Your voice makes a difference. Goodbye.");
            response.hangup();
            res.set('Content-Type', 'text/xml');
            res.send(response.toString());
        }
    } catch (error) {
        console.log("forward", error);
        res.status(400).send(error);
    }

}

async function getStaffId(phone: any) {
    return new Promise(async (resolve, reject) => {
        let user = await User.findOne({mobile: phone});
        if (!user) {
            return resolve(false);
        } else {
            return resolve(user?._id);
        }
    })
}

const callSenator = async (req: Request, res: Response) => {
    try {
        console.log("callSenator")
        const phone = req?.params?.phone_no;
        // const phone :any= req.query.phone_no;

        console.log({phone})
        let staffId = await getStaffId(phone);
        console.log("staffId", staffId)

        const response = new twilio.twiml.VoiceResponse();
        // response.say("Connecting you to " + phone);
        let phone2 = phone ? phone.replace("+","") :"";
        console.log({phone2})
        const dial = response.dial({
            record: "record-from-answer-dual",
            callerId: '+815018085051',
            action: '/api/ecall/goodbye/' + staffId
        });
        dial.number(phone2);
        res.set('Content-Type', 'text/xml');
        return res.send(response.toString());
    } catch (error) {
        console.log("callSenator", error);
        res.status(400).send(error);
    }

}


const callGoodBye = async (req: Request, res: Response) => {
    try {
        console.log("goodbye")
        const response = new twilio.twiml.VoiceResponse();
        const staffId = req?.params?.staff_id;
        if(staffId){

            let r = await StaffCallStatus.remove({staffId: staffId});
            if (r) {
                console.log("remove success");
            }
        }
        response.say("Thank you for call with Medical Arc! Your voice makes a difference.");
        response.hangup();
        res.set('Content-Type', 'text/xml');
        res.send(response.toString());
    } catch (error) {
        console.log("goodbye", error);
        res.status(400).send(error);
    }

}
const callHistory = async (req: Request, res: Response) => {
    try {
        console.log("call history called")

        // const accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        // const authToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

        console.log(req.query)

        client.calls.page({
            pageSize: req.query.pageSize,
            pageNumber: req.query.pageNumber,
            pageToken: req.query.pageToken ?? ""
        }).then((calls: any) => res.send(calls));
    } catch (error) {
        console.log("callHistory", error);
        res.status(400).send(error);
    }

}

function makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function getName(req: Request, res: Response) {
    try {
        console.log("heee")

        //    let lang = req.headers.lang ?? "en";
        let dynamicObj: any = {};

        for (var i = 0; i < 10; i++) {
            let k = await makeid(5).toString()
            let v = await makeid(5).toString()
            dynamicObj[k] = v
        }
        res.json(dynamicObj)
        // return commonUtils.sendSuccess(req, res, {data:dynamicObj}, 200);

    } catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

async function getNameAdvance(req: Request, res: Response) {

    let dynamicObjTemp: any = {};

    var list = [20, 30, 50]

    for (var i = 0; i < 3; i++) {
        let k = await makeid(5).toString()
        let v = await makeid(list[Math.floor(Math.random() * list.length)]).toString()
        dynamicObjTemp[k] = v
    }

    var items = [await makeid(5).toString(), "Winter", "Monsoon", 12345, 8989, 10.22, 11.34, await makeid(5).toString(), dynamicObjTemp, dynamicObjTemp, list, list]

    try {

        //    let lang = req.headers.lang ?? "en";
        let dynamicObj: any = {};

        for (var i = 0; i < 10; i++) {
            let k = await makeid(5).toString()
            let v = items[Math.floor(Math.random() * items.length)]
            dynamicObj[k] = v
        }
        res.json(dynamicObj)
        // return commonUtils.sendSuccess(req, res, {data:dynamicObj}, 200);

    } catch (err: any) {
        console.log(err)
        return commonUtils.sendError(req, res, {message: err.message}, 409);
    }
}

const checkCallForward = async (req: Request, res: Response) => {
    try {
        console.log("/ecall/welcome called")
        const response = new twilio.twiml.VoiceResponse();
        // const gather = response.gather({
        //     numDigits: 4,
        //     action: '/ecall/forward',
        //     method: 'POST'
        // });
        response.say('Thank you for calling Medical Arc! please wait while we will connect our staff here.');

        // our logic goes here
        let isAvailable :any= await getAvailableStaff3();
        let day = moment(new Date()).format('YYYY-MM-DD');
        day = day.toString();
        // console.log("day", day)
        console.log("isAvailable", isAvailable?.name)
        // console.log("isAvailable", isAvailable.length)

        if (isAvailable) {
            // console.log("Staff Id", isAvailable?.staffId)
            var mobileNumber = isAvailable?.mobile;
            console.log("phone", isAvailable?.mobile)

            //make status busy

            let exist = await StaffCallStatus.findOne({staffId: mongoose.Types.ObjectId(isAvailable?.staffId)});
            if (!exist) {
                let newRecord = await new StaffCallStatus();
                let staffId = isAvailable?.staffId;
                let shiftId = isAvailable?.shiftId;
                newRecord.staffId = isAvailable?.staffId;
                newRecord.shiftId = isAvailable?.shiftId;
                // console.error("Shift Id",staffId,shiftId)
                newRecord.status = 1; //busy and connected
                await newRecord.save()
                let update = {
                    startDay :day,
                    shiftId : mongoose.Types.ObjectId(shiftId),
                    staffId : mongoose.Types.ObjectId(staffId)} 
                let shiftDatta = await StaffShift.findOneAndUpdate(update,{$inc:{callCount:1}});
                // if(shiftDatta){
                //     shiftDatta.callCount = shiftDatta.callCount+1;
                //     await shiftDatta.save()
                // }
                
                console.log("CAll SUCCESS")
                if(staffId){

                    let r = await StaffCallStatus.remove({staffId: staffId});
                    if (r) {
                        console.log("remove success");
                    }
                }
                return res.json({"success":true,staff:isAvailable?.name});

                
            } else {
                response.say("This line is busy. Call after sometime.");
                response.hangup();
                res.set('Content-Type', 'text/xml');
                return res.json({"success":false});
            }
        } else {
            console.log("Staff Not Available call forwarded to +819094270315");
           
            return res.json({"success":true});
        }

    } catch (error) {
        console.log("welcome", error);
        res.status(400).send(error);
    }
}
export default {
    shiftAdd,
    shiftUpdate,
    getShift,
    deleteShift,
    activeInactiveShift,
    //Staff Shift Manage
    addShift,
    staffShift,
    shiftByStaffId,
    updateShift,
    responderShift,
    symptomsAdd,
    symptoms,
    addShift2,
    addStaffShift,
    shiftByStaffId2,
    updateStaffShift,
    addStaffShift2,
    getAvailableStaff,

    /* Call managerment */
    callWelcome,
    callForward,
    callSenator,
    callGoodBye,
    callHistory,
    getName,
    getNameAdvance,
    getAvailableStaff3,
    checkCallForward
}


// let hash2={
//     "0":["AD0","AD1",'AD2','AD3','AD4','AD5','AD6'],
//     "1":["BD0","",'','',"",'','BD6'],
//     "2":["CD0","",'','',"",'','CD6'],
//     "3":["DD0","DD1",'DD2','DD3',"DD4",'DD5','DD6']
// }
/*

"4":["AD0","BD1",'CD2','DD3'],
    "5":["AD0","BD1",'CD2','DD3'],
    "6":["AD0","BD1",'CD2','DD3'],

*/
//    var  shiftsData= [
//         { day: '0', shift: ['AD0', 'DD0'] },
//         { day: '1', shift: ['AD1', 'DD1', 'BD1', 'CD1'] },
//         { day: '2', shift: ['AD2', 'DD2', 'BD2', 'CD2'] },
//         { day: '3', shift:  ['AD3','CD3'] },
//         { day: '4', shift: ['AD4', 'CD4']},
//         { day: '5', shift: ['DD5', 'AD5', 'CD5','BD5'] },
//         { day: '6', shift: ['AD6', 'DD6']}
//       ]
//     var  shiftsData= [
//     { day: '0', shift: ['AD0', 'DD0'] },
//     { day: '1', shift: ['AD1', 'DD1', 'BD1', 'CD1'] },
//     { day: '2', shift: ['AD2', 'DD2', 'BD2', 'CD2'] },
//     { day: '3', shift:  ['AD3','CD3'] },
//     { day: '4', shift: ['AD4', 'CD4']},
//     { day: '5', shift: ['DD5', 'AD5', 'CD5','BD5'] },
//     { day: '6', shift: ['AD6', 'DD6']}
//   ]