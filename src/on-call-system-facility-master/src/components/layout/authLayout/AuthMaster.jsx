import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router';

const AuthMaster = (props) => {
    const { ptitle, ActiveMenuKey } = props;
    const location = useLocation();
    useEffect(() => {
        document.title = "On Cale System :: " + ptitle;
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }, [ptitle, location, ActiveMenuKey]);

    // SelectedKeys Change
    useEffect(() => {
        // localStorage.setItem("SelectedMenus", JSON.stringify(SelectedKeys));
        localStorage.setItem("OpenMenus", JSON.stringify(ActiveMenuKey));
    }, [ActiveMenuKey]);

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-content-section">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
export default AuthMaster;