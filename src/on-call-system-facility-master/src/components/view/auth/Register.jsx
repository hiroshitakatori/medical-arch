import { Button, Form, Input } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATH_AUTH } from '../../routes/path'
import { useTranslation } from 'react-i18next';
import http from '../../../security/Http'
import url from '../../../Development.json'
import { enqueueSnackbar } from "notistack";



function Register() {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const lang = localStorage.getItem('i18nextLng')
    const onSubmit = (values) => {
        // console.log("button is clicked");
        // console.log(values, "data");


        http.callApi(url.register, values, {
            headers: { lang: lang }
        })
            .then((res) => {
                // console.log(res, "res");
                localStorage.setItem('token', res.data.token);
                navigate('/otp-verification')
                enqueueSnackbar(
                    res.data.message,
                    { variant: "success" },
                    { autoHideDuration: 1000 }
                );
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error, "error");
                    if(error?.response?.data?.errors?.email){
                        form.setFields([
                            {
                              name: "email",
                              errors: [error?.response?.data?.errors?.email]
                            },
                             {
                              name: "password",
                              errors: [error?.response?.data?.errors?.password]
                            },
                             {
                              name: "confirmPassword",
                              errors: [error?.response?.data?.errors?.confirmPassword]
                            },
                          ]);

                    }
                        form.setFields([
                            {
                              name: "email",
                              errors: [error?.response?.data?.errors?.email]
                            },
                             {
                              name: "password",
                              errors: [error?.response?.data?.errors?.password]
                            },
                             {
                              name: "confirmPassword",
                              errors: [error?.response?.data?.errors?.confirmPassword]
                            },
                          ]);

                    // enqueueSnackbar(
                    //     error?.response?.data?.message,
                    //     { variant: "error" },
                    //     { autoHideDuration: 1000 }
                    // );
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
                        <h6>{t('auth.Create_your_account')}</h6>
                        <p>{t('auth.Login_Text')}</p>
                    </div>
                    <Form layout="vertical" form={form} autoComplete="off" onFinish={onSubmit}>
                        <div className="form-group">
                            <Form.Item label={t('auth.Email')} name="email" rules={[
                                {
                                    message: lang === "en" ? t('Invalid Email') : "無効な電子メール",
                                },
                                {
                                    required: true,
                                    message: lang === "en" ? t('Email Is Required') : "メールアドレスは必須です",
                                }
                            ]} >
                                <Input type="email" placeholder={t('auth.Email')} />
                            </Form.Item>
                            <Form.Item label={t('Password')} name="password" rules={[
                                {
                                    required: true,
                                    message: lang === "en" ? t('Password Is Required') : "パスワードが必要",
                                },
                                {
                                    min: 8,
                                    message: lang === "en" ? t('Password Minimum Length 8') : "パスワードの最小長は 8 です",
                                },
                                // {
                                //     pattern: new RegExp(
                                //         /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!#$%\-_=+<>])([a-zA-Z0-9!#$%\-_=+<>]+)$/
                                //     ),
                                //     message: lang === "en" ? `The password format is invalid` : "パスワードの形式が無効です"
                                // }
                            ]}>
                                <Input.Password placeholder={t('auth.Password')} />
                            </Form.Item>
                            <Form.Item label={t('auth.Confirm_Password')} name="confirmPassword" dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                        message: lang === "en" ? t('Confirm Password is Required') : "パスワードが必要であることを確認してください",
                                    },
                                    {
                                        min: 8,
                                        message: lang === "en" ? t('Password Minimum Length 8') : "パスワードの最小長は 8 です",
                                    },
                                    // {
                                    //     pattern: new RegExp(
                                    //         /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!#$%\-_=+<>])([a-zA-Z0-9!#$%\-_=+<>]+)$/
                                    //     ),
                                    //     message: lang === "en" ? `The password format is invalid` : "パスワードの形式が無効です"
                                    // },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(lang === "en" ? t('Password Mismatch') : "パスワード");
                                        },
                                    }),
                                ]} >
                                <Input.Password placeholder={t('auth.Confirm_Password')} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" className='btn-theme btn-success w100'>{t('auth.Registration')}</Button>
                            </Form.Item>
                        </div>
                    </Form>
                    <div className="form-footer-link text-center">
                        <p>{t('auth.Already_have_an_account?')} <Link to={PATH_AUTH.login} className="fw-600">{t('auth.Login')}</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
