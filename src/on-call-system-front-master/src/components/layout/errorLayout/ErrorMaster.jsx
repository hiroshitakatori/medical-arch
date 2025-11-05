import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// import PageLoader from '../../view/common/PageLoader';

const ErrorMaster = (props) => {


    const {ptitle, ActiveMenuKey} = props;
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        document.title = "Paxform :: " +ptitle;
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, [ptitle, ActiveMenuKey]);

   
    window.addEventListener('load', (event) => {
        setLoading(false)
    });


    // SelectedKeys Change
    useEffect(() => {
        // localStorage.setItem("SelectedMenus", JSON.stringify(SelectedKeys));
        localStorage.setItem("OpenMenus", JSON.stringify(ActiveMenuKey));
    }, [ActiveMenuKey]);


    return (
        <>
            {/* <PageLoader loading={loading}/> */}
            <div className="main-wrapper">
                <Outlet/>
            </div>
        </>
    )

}


export default ErrorMaster;
