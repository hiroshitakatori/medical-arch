function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/";
const WORKER_AUTH = "/worker";
const FRONT = "/";
const FRONT_FACILITY = "/facility/";
const CUSTOMER_AUTH = "/customer";

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "login"),
  register: path(ROOTS_AUTH, "register"),
  forgetPassword: path(ROOTS_AUTH, "forget-password"),
  resetPassword: path(ROOTS_AUTH, "reset-password"),
  forgetPasswordOtpVerify: path(ROOTS_AUTH, "verify-otp"),
  otpVerification: path(ROOTS_AUTH, "otp-verification"),
  prices: path(ROOTS_AUTH, "prices"),
  faq: path(ROOTS_AUTH, "faq"),
  applyForJob: path(ROOTS_AUTH, "apply-for-job"),
  registerProfile: path(ROOTS_AUTH, "register-profile"),
  aboutUs: path(ROOTS_AUTH, "/about-us"),
  contactUs: path(ROOTS_AUTH, "/contact-us"),
};

export const PATH_FRONT = {
    home: path(FRONT, "/"),
    facilityList: path(FRONT, "facility-list"),
    facilityDetails: path(FRONT, "facility-details"),
    editFacility: path(FRONT, "edit-facility"),
    addFacility: path(FRONT, "add-facility"),
    confirmationFacility: path(FRONT, "confirmation-facility"),
    cancelFacilitySearch: path(FRONT, "cancel-facility-search"),
    cancelFacility: path(FRONT, "cancel-facility"),
    reportList: path(FRONT, "report-list"),
    reportDetails: path(FRONT, "report-details"),
    editReport: path(FRONT, "edit-report"),
    addReport: path(FRONT, "add-report"),
    confirmationReport: path(FRONT, "confirmation-report"),
    staffList: path(FRONT, "staff-list"),
    staffDetails: path(FRONT, "staff-details"),
    addStaff: path(FRONT, "add-staff"),
    editStaff: path(FRONT, "edit-staff"),
    confirmationStaff: path(FRONT, "confirmation-staff"),
    logList: path(FRONT, "log-list"),
    shiftList: path(FRONT, "shift-list"),
    addShift: path(FRONT, "add-shift"),
    facilityDashboard: path(FRONT_FACILITY, ""),
    facilityReport: path(FRONT_FACILITY, "report-list"),
    facilityReportDetails: path(FRONT_FACILITY, "report-details"),
    facilityReportComment: path(FRONT_FACILITY, "report-comment"),
    facilityMypage: path(FRONT_FACILITY, "my-page"),
    Mypage: path(FRONT, "my-page"),
}

