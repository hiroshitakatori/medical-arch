import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import FacilityHeader from './FacilityHeader';


function FacilityMaster(props) {
  const {ptitle} = props
  useEffect(() => {
    document.title = "Medical Arch :: " + ptitle;
}, [ptitle]);
  // Toggle Sidebar
  const [IsMenuOpen, setIsMenuOpen] = useState();
  const ToggleSidebar = () => {
    if (IsMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  }
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}, [location]);
  // Menu 
  const [openKeys, setOpenKeys] = useState(['menu1']);

  const rootSubmenuKeys = ['menu1', 'menu2', 'menu3', 'menu4', 'menu5', 'menu6', 'menu7'];

  const onSubmenuOpen = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }

  };
  const OnMenuSelect = ({ key, keyPath }) => {
    const latestSelectedKey = keyPath.find(e => openKeys.indexOf(e) !== key);
    if (rootSubmenuKeys.indexOf(latestSelectedKey) === -1) {
      setOpenKeys(keyPath);
    } else {
      setOpenKeys(latestSelectedKey ? [latestSelectedKey] : []);
    }
  }
  return (
    <div className={`main-wrapper front_layout`}>
      <div className="main-layout-wrapper">
        <FacilityHeader ToggleSidebar={ToggleSidebar} />
        <main className="main-content-wrapper">
          <div className="container">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default FacilityMaster;