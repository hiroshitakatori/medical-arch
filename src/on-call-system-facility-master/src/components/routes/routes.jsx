import { PATH_AUTH, PATH_FRONT } from "./path";
import ForgotPassword from "../view/auth/ForgotPassword";
import Login from "../view/auth/Login";
import Register from "../view/auth/Register";
import ResetPassword from "../view/auth/ResetPassword";
import SettingPassword from "../view/auth/SettingPassword";
import OtpVerification from "../view/auth/OtpVerification";
// import Dashboard from "../view/pages/Dashboard";
// import FacilityList from "../view/pages/users/facility/FacilityList";
// import FacilityDetails from "../view/pages/users/facility/FacilityDetails";
import EditFacility from "../view/pages/users/facility/EditFacility";
// import AddFacility from "../view/pages/users/facility/AddFacility";
import ConfirmationFacility from "../view/pages/users/facility/ConfirmationFacility";
// import CancelFacilitySearch from "../view/pages/users/facility/CancelFacilitySearch";
// import CancelFacility from "../view/pages/users/facility/CancelFacility";
// import ReportList from "../view/pages/users/report/ReportList";
// import ReportDetails from "../view/pages/users/report/ReportDetails";
// import EditReport from "../view/pages/users/report/EditReport";
// import AddReport from "../view/pages/users/report/AddReport";
// import ConfirmationReport from "../view/pages/users/report/ConfirmationReport";
// import StaffList from "../view/pages/users/staff/StaffList";
// import StaffDetails from "../view/pages/users/staff/StaffDetails";
// import AddStaff from "../view/pages/users/staff/AddStaff";
// import EditStaff from "../view/pages/users/staff/EditStaff";
// import ConfirmationStaff from "../view/pages/users/staff/ConfirmationStaff";
// import ShiftList from "../view/pages/users/shift/ShiftList";
// import AddShift from "../view/pages/users/shift/AddShift";
// import LogList from "../view/pages/users/log/LogList";
import FacilityDashboard from "../view/pages/facilitys/FacilityDashboard";
import FacilityReportList from "../view/pages/facilitys/report/FacilityReportList";
import MyPage from "../view/pages/facilitys/mypage/MyPage";
import ErrorPage from "../view/auth/ErrorPage";
import FacilityReportDetails from "../view/pages/facilitys/report/FacilityReportDetails";
import FacilityReportComment from "../view/pages/facilitys/report/FacilityReportComment";



const routes = [
    {
        path: PATH_FRONT.home,
        layout: 'master',
        // exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <FacilityDashboard title="Welcome To Dashboard" />
    },
    {
        path: PATH_AUTH.login,
        layout: 'auth',
        exact: true,
        auth: false,
        ActiveMenuKey: "",
        component: <Login title="Login" />
    },
    {
        path: PATH_AUTH.register,
        layout: 'auth',
        exact: true,
        auth: false,
        ActiveMenuKey: "",
        component: <Register title="Register" />
    },
    {
        path: PATH_AUTH.forgetPassword,
        layout: 'auth',
        exact: true,
        auth: false,
        ActiveMenuKey: "",
        component: <ForgotPassword title="Forgot Password" />
    },
    {
        path: PATH_AUTH.resetPassword,
        layout: 'auth',
        exact: true,
        auth: false,
        ActiveMenuKey: "",
        component: <ResetPassword title="Reset Password" />
    },
    {
        path: PATH_AUTH.settingPassword,
        layout: 'auth',
        exact: true,
        auth: false,
        ActiveMenuKey: "",
        component: <SettingPassword title="Setting Password" />
    },
    {
        path: PATH_AUTH.otpVerification,
        layout: 'auth',
        exact: true,
        auth: false,
        ActiveMenuKey: "",
        component: <OtpVerification title="Otp Verification" />
    },
    // {
    //     path: PATH_FRONT.facilityList,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <FacilityList title="Facility List" />
    // },
    // {
    //     path: PATH_FRONT.facilityDetails,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <FacilityDetails title="Facility Details" />
    // },
    // {
    //     path: PATH_FRONT.editFacility,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <EditFacility title="Edit Facility" />
    // },
    // {
    //     path: PATH_FRONT.addFacility,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <AddFacility title="Add Facility" />
    // },
    // {
    //     path: PATH_FRONT.confirmationFacility,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <ConfirmationFacility title="Confirmation Facility" />
    // },
    // {
    //     path: PATH_FRONT.cancelFacilitySearch,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <CancelFacilitySearch title="Cancel Facility Search" />
    // },
    // {
    //     path: PATH_FRONT.cancelFacility,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <CancelFacility title="Cancel Facility" />
    // },
    // {
    //     path: PATH_FRONT.reportList,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <ReportList title="Report List" />
    // },
    // {
    //     path: PATH_FRONT.reportDetails,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <ReportDetails title="Report Details" />
    // },
    // {
    //     path: PATH_FRONT.editReport,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <EditReport title="Edit Report" />
    // },
    // {
    //     path: PATH_FRONT.addReport,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <AddReport title="Add Report" />
    // },
    // {
    //     path: PATH_FRONT.confirmationReport,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <ConfirmationReport title="Confirmation Report" />
    // },
    // {
    //     path: PATH_FRONT.staffList,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <StaffList title="staff" />
    // },
    // {
    //     path: PATH_FRONT.staffDetails,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <StaffDetails title="Staff Details" />
    // },
    // {
    //     path: PATH_FRONT.addStaff,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <AddStaff title="Add Staff" />
    // },
    // {
    //     path: PATH_FRONT.editStaff,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <EditStaff title="Edit Staff" />
    // },
    // {
    //     path: PATH_FRONT.confirmationStaff,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <ConfirmationStaff title="Confirmation Staff" />
    // },
    // {
    //     path: PATH_FRONT.logList,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <LogList title="Log List" />
    // },
    // {
    //     path: PATH_FRONT.shiftList,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <ShiftList title="Shift List" />
    // },
    // {
    //     path: PATH_FRONT.addShift,
    //     layout: 'master',
    //     exact: true,
    //     auth: true,
    //     ActiveMenuKey: "",
    //     component: <AddShift title="Add Shift" />
    // },
    {
        path: PATH_FRONT.facilityDashboard,
        layout: 'facility',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <FacilityDashboard title="Dashboard" />
    },
    {
        path: PATH_FRONT.facilityReport,
        layout: 'facility',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <FacilityReportList title="Report List" />
    },
    {
        path: PATH_FRONT.facilityReportDetails,
        layout: 'facility',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <FacilityReportDetails title="Facility Report Details" />
    },
    {
        path: PATH_FRONT.facilityReportComment,
        layout: 'facility',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <FacilityReportComment title="Facility Report Comment" />
    },
    {
        path: PATH_FRONT.facilityMypage,
        layout: 'facility',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <MyPage title="My Page" />
    },
    {
        path: PATH_FRONT.editFacility,
        layout: 'master',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <EditFacility title="Edit Facility" />
    },
    {
        path: PATH_FRONT.confirmationFacility,
        layout: 'master',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <ConfirmationFacility title="Confirmation Facility" />
    },
    {
        path: "*",
        layout: 'master',
        exact: true,
        auth: true,
        ActiveMenuKey: "",
        component: <ErrorPage title="404 Page Not Found" />
    },
]

export default routes;