import userController from "./userController";
import V from "./validation";
import encryptedData from "../../middlewares/secure/encryptData";
import decryptData from "../../middlewares/secure/decryptData";
import auth from "../../auth/index";

export default [
    {
        path: "/register",
        method: "post",
        controller: userController.register,
        validation: V.registerValidation,
        isPublic: true,
    },
    {
        path: "/otp/verify/signup",
        method: "post",
        controller: userController.signupVerifyOtp,
        validation: V.verifySignupOTPValidation,
        isPublic: true
    },
    {
        path: "/otp/resend",
        method: "post",
        controller: userController.resend,
        isPublic: true
    },
    {
        path: "/login",
        method: "post",
        controller: userController.login,
        isPublic: true,
    },
    {
        path: "/logout",
        method: "patch",
        controller: auth.logout,
        isEncrypt: false,
    },
    {
        path: "/updateprofile",
        method: "post",
        controller: userController.updateProfile,
        // validation: V.profileValidation
    },
    {
        path: "/getProfile",
        method: "get",
        controller: userController.getProfile,
    },
    {
        path: "/encryption",
        method: "post",
        controller: encryptedData.encryptedDataRequest,
        isEncrypt: false,
        isPublic: true,
    },
    {
        path: "/decryption",
        method: "post",
        controller: decryptData.DecryptedDataRequest,
        isEncrypt: false,
        isPublic: true,
    },

    /* Forget password */
    {
        path: "/otp/get",
        method: "post",
        controller: userController.getOtp,
        validation: V.OTPValidation,
        isPublic: true
    },
    {
        path: "/otp/verify",
        method: "post",
        controller: userController.verifyOtp,
        validation: V.verifyOTPValidation,
        isPublic: true,
    },
    {
        path: "/forgotPassword",
        method: "post",
        controller: userController.forgotPassword,
        isPublic: true,
    },
    {
        path: "/changePassword",
        method: "post",
        controller: userController.changePassword,
        validation: V.changePasswordValidation,
    },
    // {
    //     path: "/upload",
    //     method: "post",
    //     controller: userController.uploadImage
    // },

    /* Add Staff */
    
    {
        path: "/addStaff",
        method: "post",
        controller: userController.addStaff,
        validation: V.addStaffValidation
    },
    {
        path: "/updateStaff",
        method: "post",
        controller: userController.updateStaff,
        validation: V.updateStaffValidation
    },
    {
        path: "/deleteStaff/:_id",
        method: "delete",
        controller: userController.deleteStaff
    },
    {
        path: "/changeStatusStaff/:_id",
        method: "put",
        controller: userController.changeStatusStaff
    },
    {
        path: "/getStaff",
        method: "get",
        controller: userController.getStaff,
        isPublic: true
    },

    {
        path: "/addFacility",
        method: "post",
        controller: userController.addFacility,
        validation: V.addFacilityValidation
    },
    {
        path: "/updateFacility",
        method: "post",
        controller: userController.updateFacility,
        validation: V.updateFacilityValidation
    },
    {
        path: "/deleteFacility/:_id",
        method: "delete",
        controller: userController.deleteFacility
    },
    {
        path: "/changeStatusFacility/:_id",
        method: "put",
        controller: userController.changeStatusFacility
    },
    {
        path: "/cancelFacilityContract",
        method: "post",
        controller: userController.cancelFacilityContract
    },
    {
        path: "/getFacility",
        method: "get",
        controller: userController.getFacility,
        // isPublic: true,
    },
    {
        path: "/facilityList",
        method: "get",
        controller: userController.facilityList,
        // isPublic: true,
    },
    {
        path: "/StaffList",
        method: "get",
        controller: userController.StaffList,
        // isPublic: true,
    },
    {
        path: "/callHistory",
        method: "get",
        controller: userController.callHistory,
        // isPublic: true,
    },,
    {
        path: "/callRecording",
        method: "get",
        controller: userController.downloadCallRecording,
        // isPublic: true,
    },
    {
        path: "/callHistoryByFacilityId",
        method: "get",
        controller: userController.callHistoryByFacilityId,
        // isPublic: true,
    },
    {
        path: "/missedCallHistory",
        method: "get",
        controller: userController.missedCallHistory,
        // isPublic: true,
    },
    {
        path: "/plans",
        method: "get",
        controller: userController.plans,
        isPublic: true,
    },
    {
        path: "/testChanges",
        method: "get",
        controller: userController.testChanges,
        isPublic: true,
    },
    {
        path: "/allfacilityList",
        method: "get",
        controller: userController.allfacilityList
       
    },
    {
        path: "/deleteMissCall",
        method: "post",
        controller: userController.deleteMissCall
       
    },
];
