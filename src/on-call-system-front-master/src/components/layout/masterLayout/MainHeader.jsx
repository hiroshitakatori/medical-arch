import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Switch, theme, Button } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import { PATH_AUTH, PATH_FRONT } from '../../routes/path';
import { CloseCircle, HambergerMenu, LogoutCurve, Setting2 } from 'iconsax-react';
import SubMenu from 'antd/es/menu/SubMenu';
import { useTranslation } from "react-i18next";
import http from '../../../security/Http'
import url from '../../../Development.json'
import { enqueueSnackbar } from "notistack";
import authStores from '../../contexs/AuthProvider';
const { Header } = Layout;


function MainHeader(props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const breakpoint = 991;
  const [windowwidth, setWindowWidth] = useState(window.innerWidth);
  const [IsMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()
  const authstore = authStores()
  var permissionsData = authstore?.permission;
  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const Adminname = parsedAdminData?.state?.userData?.name;
  // console.log(Adminname);

  useEffect(() => {
    window.addEventListener('resize', (event) => {
      setWindowWidth(window.innerWidth)
    });
    windowwidth > breakpoint && setIsMenuOpen(false)
  }, [windowwidth])


  useEffect(() => {
    setIsMenuOpen(false)
  }, [location]);

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
              <Link to='/'>Medical Arch</Link>
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
                <MenuItem><Link to={"/"} >{t('general_module.menu.Home')}</Link></MenuItem>
                {/* {permissionsData?.Facility?.substring(0, 1) == "1" ? */}
                  <MenuItem><Link to={PATH_FRONT.facilityList} >{t('general_module.menu.Lists_of_facilities')}</Link></MenuItem>
                  {/* : "" */}
                {/* } */}
                <MenuItem><Link to={PATH_FRONT.reportList} >{t('general_module.menu.Report')}</Link></MenuItem>
                {/* {permissionsData?.Staff?.substring(0, 1) == "1" ? */}
                <MenuItem><Link to={PATH_FRONT.staffList} >{t('general_module.menu.Staff')}</Link></MenuItem> : ""
                {/* } */}
                {/* {permissionsData?.Shift?.substring(0, 1) == "1" ? */}
                  <MenuItem><Link to={PATH_FRONT.shiftList} >{t('general_module.menu.Shift')}</Link></MenuItem> :
                  {/* ""
                } */}
                <MenuItem><Link to={PATH_FRONT.logList} >{t('general_module.menu.List_of_logs')}</Link></MenuItem>
              </Menu>
              {/* <MenuItem><Link to={"/"} >{t('general_module.menu.Home')}</Link></MenuItem>
                <MenuItem><Link to={PATH_FRONT.facilityList} >{t('general_module.menu.Lists_of_facilities')}</Link></MenuItem>
                <MenuItem><Link to={PATH_FRONT.reportList} >{t('general_module.menu.Report')}</Link></MenuItem>
                <MenuItem><Link to={PATH_FRONT.staffList} >{t('general_module.menu.Staff')}</Link></MenuItem>
                <MenuItem><Link to={PATH_FRONT.shiftList} >{t('general_module.menu.Shift')}</Link></MenuItem>
                <MenuItem><Link to={PATH_FRONT.logList} >{t('general_module.menu.List_of_logs')}</Link></MenuItem>
              </Menu> */}
            </div>
          </div>
          {permissionsData?.myPage?.substring(0, 1) == "1" ?
            <div className="account-right flex_item_cc">
              {/* <Switch unCheckedChildren="En" checkedChildren="じゃ" defaultChecked={i18n.language == 'en' ? false : true} onChange={handelLanguagesChange} /> */}
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
                        <h6 className='fs-16'>{Adminname}</h6>
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
                        <Link to={PATH_FRONT.Mypage}>{t('general_module.menu.My_Page')}</Link>
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
            :
            <div className="account-right flex_item_cc">
              {/* <Switch unCheckedChildren="En" checkedChildren="じゃ" defaultChecked={i18n.language == 'en' ? false : true} onChange={handelLanguagesChange} /> */}
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
                        <h6 className='fs-16'>{Adminname}</h6>
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
                        <Link to={PATH_FRONT.Mypage}>{t('general_module.menu.My_Page')}</Link>
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
          }

          <div className="toggle-btn d-xl-none">
            <a role="button" onClick={ToggleSidebar}><HambergerMenu size="32" color="#FF8A65" /></a>
          </div>
          <div className={`menu-overlay-bg ${IsMenuOpen ? "active" : ""}`} onClick={ToggleSidebar}></div>
        </div>
      </div >

    </Header >
  )
}

export default MainHeader
