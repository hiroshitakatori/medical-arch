import userController from "../users/userController";
import ReportController from "../report/reportController";
import facilityController from "./facilityController";
import V from "./validation";
import encryptedData from "../../middlewares/secure/encryptData";
import decryptData from "../../middlewares/secure/decryptData";

export default [
      
   
    {
        path: "/login",
        method: "post",
        controller: facilityController.login,
        isPublic: true,
    },
    {
        path: "/logout",
        method: "patch",
        controller: facilityController.logout,
        isEncrypt: false,
    },
    {
        path: "/getProfile",
        method: "get",
        controller: facilityController.getProfile,
    },
    {
        path: "/updateFacility",
        method: "post",
        controller: userController.updateFacility,
        validation: V.updateFacilityValidation
    },
    {
        path: "/otp/get",
        method: "post",
        controller: facilityController.getOtp,
        validation: V.OTPValidation,
        isPublic: true
    },
    {
        path: "/otp/verify",
        method: "post",
        controller: facilityController.verifyOtp,
        validation: V.verifyOTPValidation,
        isPublic: true,
    },
    {
        path: "/forgotPassword",
        method: "post",
        controller: facilityController.forgotPassword,
        isPublic: true,
    },
    {
        path: "/changePassword",
        method: "post",
        controller: facilityController.changePassword,
        validation: V.changePasswordValidation,
    },
    {
        path: "/getFacility",
        method: "get",
        controller: userController.getFacility,
        // isPublic: true,
    }
    // {
    //     path: "/getReport",
    //     method: "get",
    //     controller: ReportController.getReport,
    //     isPublic: true,
    // },
];
