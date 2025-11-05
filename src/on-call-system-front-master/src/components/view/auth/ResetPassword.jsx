import { Button, Form, Input } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATH_AUTH } from '../../routes/path'
import { useTranslation } from 'react-i18next';
import http from '../../../security/Http'
import url from '../../../Development.json'
import { enqueueSnackbar } from "notistack";
import authStores from '../../contexs/AuthProvider';

function ResetPassword() {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate();


    const authstore = authStores()
    const isAuthenticated = authStores((state) => state.isAuthenticated)
    console.log(isAuthenticated,"isAuthenticated");
    if(isAuthenticated == true){
        navigate('/');
    }

    const lang = localStorage.getItem('i18nextLng')
    const resetpassword = (values) => {
        // console.log("New Password button is clicked");
        // console.log(values, "data");

        const Token = localStorage.getItem('resetToken')
        values.token = Token
        console.log(values, "values");
        http.callApi(url.resetpassword, values, {
            headers: {  lang: lang }
        })
            .then((res) => {
                // console.log(res, "res");
                localStorage.removeItem('resetToken');
                navigate('/login')
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
                        error.response.data.error,
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
                        <h6>{t('auth.Reset_Your_Password')}</h6>
                        <p>{t('auth.Set_your_new_password')}</p>
                    </div>
                    <Form layout="vertical" form={form} autoComplete="off" onFinish={resetpassword}>
                        <div className="form-group">
                            <Form.Item label={t('auth.New_Password')} name="password" rules={[
                                {
                                    required: true,
                                    message: lang === "en" ? t('Password Is Required') : "パスワードが必要",
                                },
                                {
                                    min: 8,
                                    message: lang === "en" ? t('Password Minimum Length 8') : "パスワードは8文字以上で設定してください",
                                },
                                {
                                    max: 16,
                                    message: lang === "en" ? t('Password Maximum Length 16') : "パスワードの最大長 16",
                                },
                            ]}>
                                <Input.Password placeholder={t('auth.New_Password')} />
                            </Form.Item>
                            <Form.Item label={t('auth.Confirm_Password')}  name="confirmPassword"  rules={[
                                {
                                    required: true,
                                    message: lang === "en" ? t('Confirm Password is Required') : "パスワードが必要であることを確認してください",
                                },
                                {
                                    min: 8,
                                    message: lang === "en" ? t('Password Minimum Length 8') : "パスワードは8文字以上で設定してください",
                                },
                                {
                                    max: 16,
                                    message: lang === "en" ? t('Password Maximum Length 16') : "パスワードの最大長 16",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(lang === "en" ? t('Password Mismatch') : "パスワードが一致しません");
                                    },
                                }),
                            ]} >
                                <Input.Password placeholder={t('auth.Confirm_Password')} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType='submit' className='btn-theme btn-success w100'>{t('auth.Reset')}</Button>
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

export default ResetPassword;
