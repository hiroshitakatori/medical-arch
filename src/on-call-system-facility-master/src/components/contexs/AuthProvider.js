import { useEffect, useState } from "react";
import create from "zustand";
import createContext from "zustand/context";
import { devtools, persist } from "zustand/middleware";
// import { AUTH_API_URL, CUSTOMER_AUTH_API_URL } from "../../Development.json";
import Http from "../../security/Http";
import url from '../../Development.json'
// import { setBearerToken } from "../../Axios";
import { isEmpty } from "lodash";
const { Provider, useStore } = createContext();
const middleware_ = (f) =>
  create(devtools(persist(f, { name: "auth-storage" })));
// const middleware_ = (f) => create(devtools(f, { name: "auth-storage" }));

const authStore = middleware_((set, get) => ({
  isAuthenticated: false,
  isInitialized: false,
  accessToken: "",
  method: "jwt",
  rememberToken: "",
  user: "",
  isRefreshing: false,
  selectedAuthTab: 1,
  is_profile_complete: 0,
  is_become_worker: 0,
  both_worker_profile_complete: 0,
  both_salon_profile_complete: 0,
  loginStep: 0,
  setInitialized: () => set({ isInitialized: true }),
  login: async (values, lang) => {
    try {
      // console.log(values);
      // values.env='test';
      const response = await Http.callApi(url.login, values, { headers: { lang: lang } });
      // console.log(response);
      // if (response?.data?.data?.success) {
      console.log(response, "response");
      set({
        accessToken: response?.data?.accessToken,
        isAuthenticated: true,
        permission : response?.data?.permission,
        userData : response?.data?.user
      });
      // }
      return [response?.data, null];
    } catch (err) {
      // console.log(err);
      return [null, err?.response?.data];
    }
  },
  logout: async (Token) => {
    try {
      // console.log(Token,"Token");
      const response = await Http.callApi(url.logout, [], { headers: { 'authorization': 'Bearer ' + Token } });
      // console.log(response);
      // if (response?.data?.data?.success) {
      // console.log(response, "response");
      set({
        accessToken: "",
        isAuthenticated: false,
        permission : {},
        userData : {}
      });
      // }
      return [response?.data, null];
    } catch (err) {
      console.log(err);
      return [null, err.response?.data];
    }
  },
  // customerLogin: async (loginObj) => {
  //   try {
  //     const response = await Http.post(CUSTOMER_AUTH_API_URL.login, loginObj);
  //     if (response?.data?.success) {
  //       Http.setBearerToken(response?.data?.data?.token);
  //       set({
  //         accessToken: response?.data?.data?.token,
  //         user: response?.data?.data,
  //         isAuthenticated: true,
  //       });
  //     }
  //     return [response?.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // register: async (signUpObj) => {
  //   try {
  //     const response = await Http.post(AUTH_API_URL.register, signUpObj);
  //     if (response.data) {
  //       if (!isEmpty(signUpObj?.social_id)) {
  //         Http.setBearerToken(response?.data?.data?.token);
  //         set({
  //           accessToken: response?.data?.data?.token,
  //           profileType: response?.data?.data.type,
  //           user: response?.data?.data,
  //           salonProfileStep: response?.data?.data.step,
  //           loginStep:response?.data?.data.step,
  //           is_profile_complete: response?.data?.data.is_profile_complete,
  //           rememberToken: "",
  //           isAuthenticated: true,
  //           both_worker_profile_complete : 0,
  //           both_salon_profile_complete : 0,
  //         });
  //       } else {
  //         set({
  //           rememberToken: response?.data?.data?.remember_token,
  //         });
  //       }
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerRegister: async (signUpObj) => {
  //   try {
  //     const response = await Http.post(
  //       CUSTOMER_AUTH_API_URL.register,
  //       signUpObj
  //     );
  //     if (response.data) {
  //       if (!isEmpty(signUpObj?.social_id)) {
  //         Http.setBearerToken(response?.data?.data?.token);
  //         set({
  //           accessToken: response?.data?.data?.token,
  //           user: response?.data?.data,
  //           rememberToken: "",
  //           isAuthenticated: true,
  //         });
  //       } else {
  //         set({
  //           rememberToken: response?.data?.data?.remember_token,
  //         });
  //       }
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // otpVerify: async (otpDataObj) => {
  //   const otpObj = {
  //     otp: otpDataObj.otp,
  //   };
  //   try {
  //     const response = await Http.post(AUTH_API_URL.otpVerify, otpObj, {
  //       headers: { "remember-token": otpDataObj.rememberToken },
  //     });
  //     if (response?.data) {
  //       Http.setBearerToken(response?.data?.data?.token);
  //       set({
  //         accessToken: response?.data?.data?.token,
  //         user: response?.data?.data,
  //         profileType: response?.data?.data.type,
  //         salonProfileStep: response?.data?.data.step,
  //         loginStep:response?.data?.data.step,
  //         rememberToken: "",
  //         isAuthenticated: true,
  //         both_worker_profile_complete : 0,
  //         both_salon_profile_complete : 0,
  //         is_become_worker: 0,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerOtpVerify: async (otpDataObj) => {
  //   const otpObj = {
  //     otp: otpDataObj.otp,
  //   };
  //   try {
  //     const response = await Http.post(
  //       CUSTOMER_AUTH_API_URL.otpVerify,
  //       otpObj,
  //       {
  //         headers: { "remember-token": otpDataObj.rememberToken },
  //       }
  //     );
  //     if (response?.data) {
  //       Http.setBearerToken(response?.data?.data?.token);
  //       set({
  //         accessToken: response?.data?.data?.token,
  //         user: response?.data?.data,
  //         rememberToken: "",
  //         isAuthenticated: true,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // resendOtp: async (otpDataObj) => {
  //   try {
  //     const response = await Http.post(AUTH_API_URL.resendOtp, [], {
  //       headers: { "remember-token": otpDataObj.rememberToken, user_type: 2 },
  //     });
  //     if (response?.data) {
  //       set({
  //         rememberToken: response?.data?.data?.remember_token,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerResendOtp: async (otpDataObj) => {
  //   try {
  //     const response = await Http.post(CUSTOMER_AUTH_API_URL.resendOtp, [], {
  //       headers: { "remember-token": otpDataObj.rememberToken },
  //     });
  //     if (response?.data) {
  //       set({
  //         rememberToken: response?.data?.data?.remember_token,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // forgetOtpVerify: async (otpDataObj) => {
  //   const otpObj = {
  //     otp: otpDataObj.otp,
  //   };
  //   try {
  //     const response = await Http.post(
  //       AUTH_API_URL.forgotPasswordOtpVerify,
  //       otpObj,
  //       {
  //         headers: {
  //           "remember-token": otpDataObj.verifyOtpToken,
  //         },
  //       }
  //     );
  //     if (response?.data) {
  //       set({
  //         user: response?.data?.data,
  //         verifyOtpToken: response?.data?.data?.token,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerForgetOtpVerify: async (otpDataObj) => {
  //   const otpObj = {
  //     otp: otpDataObj.otp,
  //   };
  //   try {
  //     const response = await Http.post(
  //       CUSTOMER_AUTH_API_URL.forgotPasswordOtpVerify,
  //       otpObj,
  //       {
  //         headers: {
  //           "remember-token": otpDataObj.verifyOtpToken,
  //         },
  //       }
  //     );
  //     if (response?.data) {
  //       set({
  //         user: response?.data?.data,
  //         verifyOtpToken: response?.data?.data?.token,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // forgetPassword: async (forgetPwdObj) => {
  //   try {
  //     const response = await Http.post(
  //       AUTH_API_URL.forgotPassword,
  //       forgetPwdObj
  //     );
  //     if (response.data) {
  //       set({
  //         verifyOtpToken: response?.data?.data?.remember_token,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerForgetPassword: async (forgetPwdObj) => {
  //   try {
  //     const response = await Http.post(
  //       CUSTOMER_AUTH_API_URL.forgotPassword,
  //       forgetPwdObj
  //     );
  //     if (response.data) {
  //       set({
  //         verifyOtpToken: response?.data?.data?.remember_token,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // resetPassword: async (forgetPwdObj) => {
  //   try {
  //     const response = await Http.post(
  //       AUTH_API_URL.resetPassword,
  //       forgetPwdObj,
  //       {
  //         headers: { "remember-token": forgetPwdObj.token },
  //       }
  //     );
  //     if (response.data) {
  //       set({
  //         verifyOtpToken: "",
  //         rememberToken: "",
  //         user: "",
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerRsetPassword: async (forgetPwdObj) => {
  //   try {
  //     const response = await Http.post(
  //       CUSTOMER_AUTH_API_URL.resetPassword,
  //       forgetPwdObj
  //     );
  //     if (response.data) {
  //       set({
  //         verifyOtpToken: "",
  //         rememberToken: "",
  //         user: "",
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // logout: async () => {
  //   try {
  //     const response = await Http.post(AUTH_API_URL.logout);
  //     if (response.data) {
  //       set({
  //         user: {},
  //         rememberToken: "",
  //         verifyOtpToken: "",
  //         isAuthenticated: false,
  //         accessToken: "",
  //         profileType: "",
  //         salonDataId: "",
  //         // is_become_worker:0,
  //         loginStep:0,
  //         is_profile_complete: 0,
  //         // both_worker_profile_complete : 0,
  //         // both_salon_profile_complete : 0,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // customerLogout: async () => {
  //   try {
  //     const response = await Http.post(CUSTOMER_AUTH_API_URL.logout);
  //     if (response.data) {
  //       set({
  //         user: {},
  //         rememberToken: "",
  //         verifyOtpToken: "",
  //         isAuthenticated: false,
  //         accessToken: "",
  //         profileType: "",
  //         is_become_worker:0,
  //         salonDataId: "",
  //         both_worker_profile_complete : 0,
  //         both_salon_profile_complete : 0,
  //       });
  //     }
  //     return [response.data, null];
  //   } catch (err) {
  //     return [null, err.response.data];
  //   }
  // },
  // updateUserType: (data) => {
  //   set({
  //     profileType: data,
  //   });
  // },

  // updateBecomeWorker: (data) => {
  //   set({
  //     is_become_worker: data,
  //   });
  // },

  // updateSalonProfileStep: (data) => {
  //   set({
  //     salonProfileStep: data,
  //   });
  // },

  // updateLoginStep: (data) => {
  //   set({
  //     loginStep: data,
  //   });
  // },

  // updateSaloneDataId: (data) => {
  //   set({
  //     salonDataId: data,
  //   });
  // },

  // ProfileCompleteStep: (data) => {
  //   set({
  //     is_profile_complete: data,
  //   });
  // },
  // updateUserProfile: (data) => {
  //   set({
  //     user: data,
  //   });
  // },

  // bothWorkerProfileComplete: (data) => {
  //   set({
  //     both_worker_profile_complete: data,
  //   });
  // },

  // bothsalonProfileComplete: (data) => {
  //   set({
  //     both_salon_profile_complete: data,
  //   });
  // },

  // setSelectedTab: (tabVal) => {
  //   set({ selectedAuthTab: tabVal });
  // },
  // refreshToken: async () => {
  //   try {
  //     const response = await axios.get(AUTH_API_URL.refreshToken, {
  //       withCredentials: true,
  //     });
  //     set({ accessToken: response?.data?.accessToken });
  //     return [response?.data?.accessToken, undefined];
  //   } catch (error) {
  //     return [undefined, true];
  //   }
  // },
}));

const AuthProvider = ({ children }) => {
  const setInitialized = authStore((state) => state.setInitialized);
  useEffect(() => {
    setInitialized();
  }, []);
  return <Provider createStore={() => authStore}>{children}</Provider>;
};

const refreshStore = create((set, get) => ({
  isRefreshing: false,
}));

export { AuthProvider, authStore, refreshStore };
export default useStore;
