var morgan = require('morgan');
import redisClient from "./utils/redisHelper";
import path from "path";
const config = require("config");
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const _ = require("underscore");
const __ = require("lodash");
const schedule = require('node-schedule');

import { NextFunction, Request, Response } from "express";
import eventEmitter from "./utils/event";
import corsOptions from "./utils/corsOptions";

import adminRoute from "./components/users";
import permissionRoute from "./components/permission";
import roleRoute from "./components/role";
import commonController from "./components/common/commonController";
import facilityRoute from "./components/facility";
import reportRoute from "./components/report";
import shiftRoute from "./components/shift"
import shiftController from "./components/shift/shiftController";
/* for prevent crash */
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})

express.application.prefix = express.Router.prefix = function (path: any, configure: any) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

const app = express()
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// app.facilities.createIndex({ email: 1 });

app.use(cors(corsOptions))
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads/')))

app.use(morgan('dev', { skip: (req: any, res: any) => process.env.NODE_ENV === 'production' }));
app.set('eventEmitter', eventEmitter)

const http = require('http');
const server = http.createServer(app);

/* API Routes */
app.get("/test", function (req: Request, res: Response, next: NextFunction) {
    res.send("success")
});
/* common image upload */
app.post("/uploadImage/:type", async function (req: Request, res: Response, next: NextFunction) {
    await commonController.uploadImage(req, res, next);
});
app.post("/deleteImage", async function (req: Request, res: Response, next: NextFunction) {
    await commonController.deleteImage(req, res, next);
});
// app.post("/uploadPdf", async function (req: Request, res: Response, next: NextFunction) {
//     await commonController.uploadPdf(req, res, next);
// });

/* call management */


app.get('/ecall/dynamic', async(req: Request, res: Response) => {
    await shiftController.getName(req,res);
})

app.get('/ecall/dynamic/advance', async(req: Request, res: Response) => {
    await shiftController.getNameAdvance(req,res);
})
app.post('/ecall/welcome', async(req: Request, res: Response) => {
    await shiftController.callWelcome(req,res);
})
app.post('/ecall/forward', async(req: Request, res: Response) => {
    await shiftController.callForward(req,res);
})
app.post('/ecall/goodbye/:staff_id', async(req: Request, res: Response) => {
    await shiftController.callGoodBye(req,res);
})
app.post('/ecall/history', async(req: Request, res: Response) => {
    await shiftController.callHistory(req,res);
})

app.get('/ecall/call-agent/:phone_no', async(req: Request, res: Response) => {
    await shiftController.callSenator(req,res);
});
app.post('/ecall/call-agent/:phone_no', async(req: Request, res: Response) => {
    await shiftController.callSenator(req,res);
});

app.prefix("/admin", (route: any) => {
    adminRoute(route);
    permissionRoute(route);
    roleRoute(route);
    reportRoute(route);
    shiftRoute(route);
});
app.prefix("/facility",(route:any)=>{
    facilityRoute(route);
    reportRoute(route);
    facilityRoute(route);
})

server.listen(config.get("PORT"), () => {
    // var hostname = os.hostname();
    // console.log({hostname})
    console.log(`⚡️[NodeJs server]: Server is running at http://194.233.85.136:${config.get("PORT")}`)
    mongoose.connect(
        config.get("DB_CONN_STRING"),
        () => console.log('connected to mongodb.')
    );
    // Redis error handling (suppress errors in development/test if Redis is not available)
    redisClient.on('error', (err: any) => {
        if (process.env.NODE_ENV === 'production') {
            console.log('Redis Client Error', err);
        }
        // Silently ignore Redis errors in development/test environments
    });
}).on('error', (err: any) => {
    console.error('[ERROR] Server listen error:', err);
    console.error('[ERROR] Error code:', err?.code);
    console.error('[ERROR] Error message:', err?.message);
});