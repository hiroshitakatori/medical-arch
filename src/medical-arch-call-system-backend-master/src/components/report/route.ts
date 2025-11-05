import reportController from "./reportController";
import V from "./validation";
import encryptedData from "../../middlewares/secure/encryptData";
import decryptData from "../../middlewares/secure/decryptData";

export default [
      
    {
        path: "/addReport",
        method: "post",
        controller: reportController.addReport,
        validation: V.addReportValidation
    },
    {
        path: "/updateReport",
        method: "post",
        controller: reportController.updateReport,
        validation: V.updateReportValidation
    },
    {
        path: "/getReport",
        method: "get",
        controller: reportController.getReport
    },
    {
        path: "/reportByFacilityId",
        method: "get",
        controller: reportController.reportByFacilityId
    },
    {
        path: "/commentOnReport",
        method: "post",
        controller: reportController.commentOnReport
    }

];
