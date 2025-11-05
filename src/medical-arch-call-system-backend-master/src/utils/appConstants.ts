const config = require("config")

export const AppConstants = {
    "API_ROUTE_SOCKET": "",
    "USER_IMAGE_PATH": config.get("ROUTE_URL") + "/uploads/images/",
    "MODEL_TOKEN" :"Token",
    "MODEL_USER": 'Users',
    
    "MODEL_ROLE": 'Role',
    "MODEL_PERMISSION": 'Permission',
    "MODEL_BUSINESS_TYPE": 'BusinessType',
    "MODEL_PLAN": 'Plan',
    "MODEL_AFFILIATED_FACILITY": 'AffiliatedFacility',
    "MODEL_FACILITY": 'Facility',
    "MODEL_REPORT": 'Report',
    "MODEL_SHIFT": 'Shift',
    "MODEL_STAFF_SHIFT": 'ShiftStaff',
    "MODEL_STAFF_SHIFT1": 'ShiftStaff1',
    "MODEL_SYMPTOMS": 'Symptoms',
    "MODEL_DELETED_CALL": 'DeletedCall',
    "MODEL_STAFF_CALL_STATUS": 'StaffCallStatus',
    
    "TOKEN_EXPIRY_TIME": '10m',
    "DATE_FORMAT": "yyyy-MM-DD HH:mm:ss.SSS",
    "DATE_FORMAT_SHORT": "yyyy-MM-DD HH:mm:ss",

    "PROFILE_PATH":"uploads/profile/",
    "CONTRACT_PATH":"uploads/contract/",
    "LICENSE_PATH":"uploads/license/",
    "REPORT_PATH":"uploads/report/"

}

declare global {
    interface String {
        isExists(): boolean;
        isEmpty(): boolean;
    }

    interface Number {
        isExists(): boolean;
    }

    interface Boolean {
        isExists(): boolean;
    }
}

String.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}
String.prototype.isEmpty = function () {
    return (this) == "";
}

Number.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}

Boolean.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}