import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, Input, Tooltip } from 'antd'
import { PATH_AUTH } from '../../routes/path'
import OtpInput from 'react-otp-input';
import { InfoCircle } from 'iconsax-react';
import { useTranslation } from 'react-i18next';
import http from '../../../security/Http'
import url from '../../../Development.json'
import { enqueueSnackbar } from "notistack";
import authStores from '../../contexs/AuthProvider';



function OtpVerification() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [OTP, setOTP] = useState("");
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const authstore = authStores()
    const isAuthenticated = authStores((state) => state.isAuthenticated)
    // console.log(isAuthenticated,"isAuthenticated");
    if(isAuthenticated == true){
        navigate('/');
    }

    const onSubmit = (values) => {
        // console.log("button is clicked");
        // console.log(OTP, "data");
        
        // console.log(Token, "Token");
        const lang = localStorage.getItem('i18nextLng')
        if (location.state == "forget-password") {
            // console.log("forget-password");
            const resetToken = localStorage.getItem('resetToken')
            values.token = resetToken
            values.otp = OTP
            // values.env = 'test'

            // console.log(values,"values");
            http.callApi(url.otpverificationpassword, values, {
                headers: { lang: lang }
            }).then((res) => {
                // console.log(res, "res");
                localStorage.setItem('resetToken',res.data.token)
                navigate('/reset-password')
                enqueueSnackbar(
                    "Otp verification Successfully",
                    { variant: "success" },
                    { autoHideDuration: 1000 }
                   
                  );
            })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response, "error");
                        enqueueSnackbar(
                            error.response.data.message,
                            { variant: "error" },
                            { autoHideDuration: 1000 }
                          );
                    }
                })
        } else {
            // console.log("register");
            const Token = localStorage.getItem('token')
            values.otp = OTP

            http.callApi(url.otpverification, values, {
                headers: {'authorization': "Bearer " + Token,lang: lang }
            })
                .then((res) => {
                    // console.log(res, "res");
                    localStorage.setItem('token', res.data.accessToken);
                    localStorage.setItem('id', res.data.userData.uniqeId);
                    navigate('/login')
                    enqueueSnackbar(
                        lang === "en" ? "Otp verification Successfully" : "OTP 検証が成功しました",
                        { variant: "success" },
                        { autoHideDuration: 1000 }
                       
                      );
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response, "error");
                        enqueueSnackbar(
                            error.response.data.message,
                            { variant: "error" },
                            { autoHideDuration: 1000 }
                          );
                    }
                })
           
        }

    }
    return (
        <div className="page-ath-wrap page-ath-right">
            <div className="page-ath-gfx" style={{ backgroundImage: `url(${require('../../../assets/images/auth_main_banner.jpg')})` }}></div>
            <div className="page-ath-content">
                <div className="page-ath-form">
                    {/* <a href="index.html" className="page-ath-logo"><img src="assets/images/logo.svg" alt="logo" /></a> */}
                    <div className="auth-head">
                        <h6>{t('auth.Enter_Verification_Code')}</h6>
                        <p>{t('auth.otp_text')}</p>
                    </div>
                    <Form layout="vertical" form={form} autoComplete="off" onFinish={onSubmit}>
                        <div className="form-group">
                            <Form.Item className='label_flex' label={<>
                                <span>{t('auth.Email_verification_code')}</span>
                                <span class="code-sent-info flex_item_ce" style={{ gap: 4 }}>
                                    <span class="text-gray">{t('auth.Verification_Code_Sent')}</span>
                                    <Tooltip title="Haven’t received code? The code will expire after 10 mins.">
                                        <InfoCircle color={"#EABE06"} variant="Bold" />
                                    </Tooltip>
                                </span></>}>
                                <div className="otp-input-wrap">
                                    <OtpInput
                                        value={OTP}
                                        onChange={setOTP}
                                        numInputs={6}
                                        renderInput={(props) => <Input rootClassName="otp-input" {...props} />}
                                    />
                                </div>
                                <div class="form-text text-gray text-center mt10">{t('auth.Enter_the_6digit_code_sent_to')}</div>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType='submit' className='btn-theme w100'>{t('auth.Confirm')}</Button>
                            </Form.Item>
                        </div>
                    </Form>
                    <div className="form-footer-link text-center mt-4">
                        <p className="font-open">{t('auth.Already_have_an_account?')} <Link to={PATH_AUTH.login} className="fw-600">{t('auth.Login')}</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerification;
