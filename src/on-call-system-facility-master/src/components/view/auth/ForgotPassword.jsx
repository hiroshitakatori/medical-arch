import { Button, Form, Input } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATH_AUTH } from '../../routes/path'
import { useTranslation } from 'react-i18next';
import http from '../../../security/Http'
import url from '../../../Development.json'
import { enqueueSnackbar } from "notistack";
import authStores from '../../contexs/AuthProvider';


function ForgotPassword() {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const authstore = authStores()
    const isAuthenticated = authStores((state) => state.isAuthenticated)
    // console.log(isAuthenticated,"isAuthenticated");
    if(isAuthenticated == true){
        navigate('/');
    }

    const lang = localStorage.getItem('i18nextLng')
    const forgetpassword = (values) => {
        // console.log("Forget button is clicked");
        // console.log(values, "data");
        http.callApi(url.forgetpassword, values, {
            headers: { lang: lang }
        })
            .then((res) => {
                // console.log(res.data, "res");
                localStorage.setItem('resetToken', res.data.token);
                navigate('/otp-verification', { state: "forget-password" })
                enqueueSnackbar(
                    res.data.message,
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

    return (
        <div className="page-ath-wrap page-ath-right">
            <div className="page-ath-gfx" style={{ backgroundImage: `url(${require('../../../assets/images/auth_main_banner.jpg')})` }}></div>
            <div className="page-ath-content">
                <div className="page-ath-form">
                    {/* <a href="index.html" className="page-ath-logo"><img src="assets/images/logo.svg" alt="logo" /></a> */}
                    <div className="auth-head">
                        <h6>{t('auth.Forgot_Password')}</h6>
                        <p>{t('auth.Forgot_Text')}</p>
                    </div>
                    <Form layout="vertical" form={form} autoComplete="off" onFinish={forgetpassword}>
                        <div className="form-group">
                            <Form.Item label={t('auth.id')} name="uniqueId" rules={[
                                {
                                    required: true,
                                    message: lang === "en" ? t('ID Is Required') : "身分証明書が必要です",
                                },
                            ]}>
                                <Input type="text" placeholder={t('auth.id')} />
                            </Form.Item>
                            <Form.Item label={t('auth.Email')} name="email" rules={[
                                {
                                    message: lang === "en" ? t('Invalid Email') : "無効な電子メール",
                                },
                                {
                                    required: true,
                                    message: lang === "en" ? t('Email Is Required') : "メールアドレスは必須です",
                                },
                            ]}  >
                                <Input type="email" placeholder={t('auth.Registered_email')} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType='submit' to={PATH_AUTH.otpVerification} className='btn-theme w100'>{t('auth.Send')}</Button>
                            </Form.Item>
                        </div>
                    </Form>
                    <div className="form-footer-link text-center mt-4">
                        <p>{t('auth.Remember_Password?')} <Link to={PATH_AUTH.login} className="fw-600">{t('auth.Login')}</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
