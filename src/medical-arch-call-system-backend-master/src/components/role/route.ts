import RoleController from "./roleController";
import V from "./validation";

// path: "", method: "post", controller: "",
// validation: ""(can be array of validation), 
// isEncrypt: boolean (default true), isPublic: boolean (default false)

export default [
    {
        path: "/roleAdd",
        method: "post",
        controller: RoleController.roleAdd,
        validation: V.roleValidation,
        isPublic:true
    },
    {
        path: "/roleEdit",
        method: "get",
        controller: RoleController.roleEdit
    },
    {
        path: "/roleUpdate/:_id",
        method: "put",
        controller: RoleController.roleUpdate,
        validation: V.roleUpdateValidation

    },
    {
        path: "/activeInactiveRole/:_id",
        method: "put",
        controller: RoleController.activeInactiveRole,
    },
    {
        path: "/getRole",
        method: "get",
        controller: RoleController.getRole,
        isPublic:true
    },
    {
        path :"/deleteRole/:_id",
        method :"delete",
        controller : RoleController.deleteRole
    }
];