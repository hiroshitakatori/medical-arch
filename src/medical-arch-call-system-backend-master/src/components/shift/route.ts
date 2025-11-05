import ShiftController from "./shiftController";
import V from "./validation";

// path: "", method: "post", controller: "",
// validation: ""(can be array of validation), 
// isEncrypt: boolean (default true), isPublic: boolean (default false)

export default [
    {
        path: "/shiftAdd",
        method: "post",
        controller: ShiftController.shiftAdd,
        validation: V.shiftAddValidation,
        // isPublic:true
    },
    {
        path: "/symptomsAdd",
        method: "post",
        controller: ShiftController.symptomsAdd,
        validation: V.symptomsAddValidation,
        // isPublic:true
    },
    // {
    //     path: "/shiftUpdate",
    //     method: "post",
    //     controller: ShiftController.shiftUpdate,
    //     validation: V.shiftAddValidation,
    //     isPublic:true
    // },
    {
        path: "/shiftUpdate/:_id",
        method: "post",
        controller: ShiftController.shiftUpdate,
        validation: V.shiftUpdateValidation

    },
    {
        path: "/activeInactiveShift/:_id",
        method: "post",
        controller: ShiftController.activeInactiveShift,
    },
    {
        path: "/getShift",
        method: "get",
        controller: ShiftController.getShift,
        // isPublic:true
    },
    {
        path: "/shiftByStaffId",
        method: "get",
        controller: ShiftController.shiftByStaffId,
        // isPublic:true
    },
    {
        path: "/shiftByStaffId2",
        method: "get",
        controller: ShiftController.shiftByStaffId2,
        // isPublic:true
    },
    {
        path: "/staffShift",
        method: "get",
        controller: ShiftController.staffShift,
        // isPublic:true
    },
    {
        path: "/responderShift",
        method: "get",
        controller: ShiftController.responderShift,
        isPublic:true,
        isEncrypt:false
    },
    {
        path :"/deleteShift/:_id",
        method :"delete",
        controller : ShiftController.deleteShift
    },


    {
        path: "/addShift",
        method: "post",
        controller: ShiftController.addShift,
        // validation: V.addShiftValidation,
        // isPublic:true
    },
    {
        path: "/addShift2",
        method: "post",
        controller: ShiftController.addShift2,
        // validation: V.addShiftValidation,
        // isPublic:true
    },
    {
        path: "/updateShift",
        method: "post",
        controller: ShiftController.updateShift,
        // validation: V.shiftUpdateValidation
        // isPublic:true

    },
    // {
    //     path: "/updateShift2",
    //     method: "post",
    //     controller: ShiftController.updateShift2,
    //     // validation: V.shiftUpdateValidation
    //     // isPublic:true

    // },
    {
        path: "/symptoms",
        method: "get",
        controller: ShiftController.symptoms,
        isPublic:true
    },
    {
        path: "/addStaffShift",
        method: "post",
        controller: ShiftController.addStaffShift,
        // validation: V.shiftUpdateValidation
        // isPublic:true

    },
    {
        path: "/updateStaffShift",
        method: "post",
        controller: ShiftController.updateStaffShift,
        // validation: V.shiftUpdateValidation
        // isPublic:true

    },
    {
        path: "/addStaffShift2",
        method: "post",
        controller: ShiftController.addStaffShift2,
        // validation: V.shiftUpdateValidation
        // isPublic:true
        
    },
    {
        path: "/getAvailableStaff",
        method: "get",
        controller: ShiftController.getAvailableStaff,
        isPublic:true
    },

    /* cal managment */
    // {
    //     path: "/ecall/welcome",
    //     method: "post",
    //     controller: ShiftController.callWelcome,
    //     isPublic:true
    // },
    // {
    //     path: "/ecall/forward",
    //     method: "post",
    //     controller: ShiftController.callForward,
    //     isPublic:true
    // }
    // {
    //     path: "/getAvailableStaff3",
    //     method: "get",
    //     controller: ShiftController.getAvailableStaff3,
    //     isPublic:true
    // },
    {
        path: "/checkCallForward",
        method: "get",
        controller: ShiftController.checkCallForward,
        isPublic:true
    }

];