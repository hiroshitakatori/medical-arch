import { Button, Form, Input } from 'antd'
import { React, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PATH_AUTH, PATH_FRONT } from '../../routes/path'
import { useTranslation } from 'react-i18next';
import { enqueueSnackbar } from "notistack";
import http from '../../../security/Http'
import url from '../../../Development.json'
import { connect, useDispatch } from "react-redux";
import authStores from '../../contexs/AuthProvider';

function Login() {
    const [form] = Form.useForm();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const authstore = authStores()
    
    const isAuthenticated =  authStores((state) => state.isAuthenticated)
    // console.log(18)
    if(isAuthenticated == true){
        navigate('/');
    }
    // useEffect(() => {
    //     const isLogin = localStorage.getItem("token") || false;
    //     if (isLogin) {
    //         navigate('/');
    //     }
    // }, []);

    useEffect(() => {
        document.title = process.env.REACT_APP_APP_NAME + ' :: Admin Login';
    }, [1]);

    const lang = localStorage.getItem('i18nextLng')

    const onSubmit = async (values) => {
        const [success, errors] = await authstore.login(
            values
        )
        if (success) {
            console.log("hiiiiiii")
            localStorage.setItem('token', success.accessToken)
            localStorage.setItem('isAuthenticated', true)
            enqueueSnackbar(
                //i18n()
                lang == "en" ? "Login Successfully" : "ログインに成功しました",
                { variant: "success" },
                { autoHideDuration: 100 }
            )
            console.log(success?.user?.passReset)
            if(!success?.user?.passReset || success?.user?.passReset == 0){
                navigate('/setting-password')
            }else{
                navigate('/')
            }
            // return true;

        }
        if (errors) {
            console.log(55,errors)
            enqueueSnackbar(
                errors.message,
                { variant: "error" },
                { autoHideDuration: 1000 }
            );
        }

    }



    return (
        <div className="page-ath-wrap page-ath-right">
            <div className="page-ath-gfx" style={{ backgroundImage: `url(${require('../../../assets/images/auth_main_banner.jpg')})` }}></div>
            <div className="page-ath-content">
                <div className="page-ath-form">
                    {/* <a href="index.html" className="page-ath-logo"><img src="assets/images/logo.svg" alt="logo" /></a> */}
                    <div className="auth-head">
                        <h6>{t('auth.SignIn')}</h6>
                        <p>{t('auth.Login_Text')}</p>
                    </div>
                    <Form layout="vertical" form={form} autoComplete="off" onFinish={onSubmit}>
                        <div className="form-group">
                            <Form.Item label={t('auth.Email')} name="email" rules={[
                                 {
                                    message:lang === "en" ? t('Invalid Email') : "無効な電子メール",
                                },
                                {
                                    required: true,
                                    message: lang === "en" ? t('Email Is Required') : "メールアドレスは必須です",
                                },
                            ]}>
                                <Input type="email" placeholder={t('auth.Email')} />
                            </Form.Item>
                            <Form.Item label={t('auth.Password')} name="password" rules={[
                                {
                                    required: true,
                                    message: lang === "en" ? t('Password Is Required') : "パスワードが必要",
                                },
                                {
                                    min: 8,
                                    message: lang === "en" ? t('Password Minimum Length 8') : "パスワードは8文字以上で設定してください",
                                  },
                            ]}>
                                <Input.Password placeholder={t('auth.Password')} />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 10 }}>
                                <div className="forgot-link text-end">
                                    <Link to={PATH_AUTH.forgetPassword}>{t('auth.Forgot_password?')}</Link>
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" className='btn-theme w100'>{t('auth.Login')}</Button>
                            </Form.Item>
                        </div>
                    </Form>
                    {/* <div className="form-footer-link text-center">
                        <p>{t('auth.Dont_have_an_account?')} <Link to={PATH_AUTH.register} className="fw-600">{t('auth.Registration')}</Link></p>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
// const mapStateToProps = state => {
//     return {
//         isAuthenticated: state.Auth.isAuthenticated,
//         accessToken: state.Auth.accessToken,
//     }
// };
// export default connect(mapStateToProps)(Login);



export default Login
