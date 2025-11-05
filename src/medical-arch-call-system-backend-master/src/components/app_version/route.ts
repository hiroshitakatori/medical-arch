import appVersionController from "./appVersionController";
import V from "./validation";

// path: "", method: "post", controller: "",
// validation: ""(can be array of validation), 
// isEncrypt: boolean (default true), isPublic: boolean (default false)

export default [
    {
        path: "/appVersionAdd",
        method: "post",
        controller: appVersionController.appVersionAdd,
        validation: V.appVersionValidation
    },
    {
        path: "/appVersionUpdate/:_id",
        method: "put",
        controller: appVersionController.appVersionUpdate,
        validation: V.appVersionUpdateValidation

    },
    {
        path: "/getAppVersion",
        method: "get",
        controller: appVersionController.getAppVersion,
        isPublic:true
    }
];