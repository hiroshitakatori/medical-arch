import PermissionController from "./permissionController";
import V from "./validation";

// path: "", method: "post", controller: "",
// validation: ""(can be array of validation), 
// isEncrypt: boolean (default true), isPublic: boolean (default false)

export default [
    {
        path: "/permissionAdd",
        method: "post",
        controller: PermissionController.permissionAdd,
        validation: V.permissionValidation,
        isPublic: true,
    },
    {
        path: "/permissionUpdate/:_id",
        method: "put",
        controller: PermissionController.permissionUpdate,
        validation: V.permissionUpdateValidation,
        // isPublic: true,
    },
    {
        path: "/getPermission",
        method: "get",
        controller: PermissionController.getPermission,
        isPublic: true,
    },
    {
        path :"/deletePermission/:_id",
        method :"delete",
        controller : PermissionController.deletePermission
    },
    {
        path :"/activeInactivePermission/:_id",
        method :"put",
        controller : PermissionController.activeInactivePermission
    }
];