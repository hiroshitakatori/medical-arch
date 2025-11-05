import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Switch, theme } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import { PATH_AUTH, PATH_FRONT } from '../../routes/path';
import { CloseCircle, HambergerMenu, LogoutCurve, Setting2 } from 'iconsax-react';
import { useTranslation } from "react-i18next";
const { Header } = Layout;
function FacilityHeader(props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const breakpoint = 991;
  const [windowwidth, setWindowWidth] = useState(window.innerWidth);
  const [IsMenuOpen, setIsMenuOpen] = useState(false);

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
            <Switch unCheckedChildren="En" checkedChildren="じゃ" defaultChecked={i18n.language == 'en' ? false: true} onChange={handelLanguagesChange} />
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
                      <h6 className='fs-16'>{t('general_module.menu.user_name')}</h6>
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
                      <Link to={PATH_FRONT.facilityMypage}>{t('general_module.menu.My_Page')}</Link>
                    ),
                    icon: <Setting2 />
                  },
                  {
                    key: '3',
                    label: (
                      <Link to={PATH_AUTH.login}>{t('general_module.menu.Logout')}</Link>
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
