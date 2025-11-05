import React, { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Switch, theme } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import { PATH_AUTH, PATH_FRONT } from '../../routes/path';
import { CloseCircle, HambergerMenu, LogoutCurve, Setting2 } from 'iconsax-react';
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from 'notistack';
import authStore  from '../../contexs/AuthProvider';

const { Header } = Layout;
function FacilityHeader(props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const breakpoint = 991;
  const navigate = useNavigate()
  const [windowwidth, setWindowWidth] = useState(window.innerWidth);
  const [IsMenuOpen, setIsMenuOpen] = useState(false);
  const authstore = authStore()

  useEffect(() => {
    window.addEventListener('resize', (event) => {
      setWindowWidth(window.innerWidth)
    });
    windowwidth > breakpoint && setIsMenuOpen(false)
  }, [windowwidth])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location]);

  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const userName = parsedAdminData?.state?.userData?.name;

  // Toggle Sidebar
  const ToggleSidebar = () => {
    setIsMenuOpen(!IsMenuOpen)
  }
  const handelLanguagesChange = (e) => {
    i18n.changeLanguage(e == true ? "ja" : "en");
  }
  const handelLanguages2 = (e) => {
    i18n.changeLanguage("ja");
  }

  useEffect(() => {
    handelLanguages2()
  }, []);
  const logout = async () => {
    const Token = localStorage.getItem('token')
    // console.log(Token, "Tokenhjghjghj");
    const lang = localStorage.getItem('i18nextLng')
    // console.log(lang, "lang");
    const [success, errors] = await authstore.logout(
      Token, lang
    )
    if (success) {
      localStorage.removeItem('token')
      localStorage.removeItem('isAuthenticated')
      navigate('/login')
      enqueueSnackbar(
        lang === "en" ? "Logout Successfully" : "正常にログアウトしました",
        { variant: "success" },
        { autoHideDuration: 1000 }
      )
    }
    if (errors) {
      console.log(errors.response.data, "errors");
      enqueueSnackbar(
        errors.response?.data?.message,
        { variant: "errors" },
        { autoHideDuration: 1000 }
      );
    }
  }

  return (
    <Header className='header-wrapper'>
      <div className="container">
        <div className="header-part flex_item_cb">
          <div className="logo-part">
            <div className="logo">
              <Link to={PATH_FRONT.facilityDashboard}>Medical Arch</Link>
            </div>
          </div>
          <div className={`menu-part ${IsMenuOpen ? "active" : ""}`}>
            <div className="close-menu" onClick={ToggleSidebar}><CloseCircle color="#FC3434" variant="Bold" size="24" /></div>
            <div className="menu-data">
              <Menu
                mode={windowwidth > breakpoint ? "horizontal" : "inline"}
                style={{ width: '100%' }}
                className='main-menu'
                getPopupContainer={node => node.parentNode}
              >
                <MenuItem><Link to={PATH_FRONT.facilityDashboard} >{t('general_module.menu.Home')}</Link></MenuItem>
                <MenuItem><Link to={PATH_FRONT.facilityReport} >{t('general_module.menu.Report')}</Link></MenuItem>
                {/* <MenuItem><Link to={PATH_FRONT.logList} >{t('general_module.menu.List_of_logs')}</Link></MenuItem> */}
              </Menu>
            </div>
          </div>
          <div className="account-right flex_item_cc">
            {/* <Link to={PATH_FRONT.facilityMypage} className="header_btn btn-theme" >My page</Link> */}
            {/* <Switch unCheckedChildren="En" checkedChildren="じゃ" defaultChecked={i18n.language == 'en' ? false: true} onChange={handelLanguagesChange} /> */}
            <Dropdown
              getPopupContainer={node => node.parentNode}
              placement="bottomRight"
              className='account_dropdwon'
              arrow
              menu={{
                items: [
                  {
                    key: '1',
                    type: 'group',
                    label: (
                      <h6 className='fs-16'>{userName}</h6>
                    ),
                    children: [
                      {
                        type: 'divider',
                      },
                    ]
                  },
                  {
                    key: '2',
                    label: (
                      <Link to={PATH_FRONT.facilityMypage}  >{t('general_module.menu.My_Page')}</Link>
                    ),
                    icon: <Setting2 />
                  },
                  {
                    key: '3',
                    label: (
                      <a role='button' onClick={logout}>{t('general_module.menu.Logout')}</a>
                    ),
                    icon: <LogoutCurve />
                  },
                ]
              }}
            >
              <Avatar className='user_image w40' src={require('../../../assets/images/auth_main_banner.jpg')} />
            </Dropdown>
          </div>
          <div className="toggle-btn d-xl-none">
            <a role="button" onClick={ToggleSidebar}><HambergerMenu size="32" color="#FF8A65" /></a>
          </div>
          <div className={`menu-overlay-bg ${IsMenuOpen ? "active" : ""}`} onClick={ToggleSidebar}></div>
        </div>
      </div>

    </Header>
  )
}

export default FacilityHeader
