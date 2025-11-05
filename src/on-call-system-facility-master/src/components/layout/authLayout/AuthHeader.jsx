import React from 'react'
import { Link } from 'react-router-dom'

const AuthHeader = () => {
    return (
        <div className='header-part'>
            <header className="header-wrapper">
                <div className='header_content'>
                    <div className='logo_part'>
                        <img src={require("../../../assets/images/oncale_logo.svg").default} alt="logo" className='logo' />
                    </div>
                    <div className='menu_part'>
                        <ul>
                            <li className=''>
                                <Link to={"/login"}><img src={require("../../../assets/images/icons/login-icon-white.svg").default} />Login</Link>
                            </li>
                            <li className=''>
                                <Link to={"/register"}><img src={require("../../../assets/images/icons/file-dock-white.svg").default} alt="" />Register</Link>
                            </li>
                            <li>
                                <a href="" role={"button"}>
                                    <img src={require("../../../assets/images/icons/menu_icn_bright.svg").default} width="" alt="" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default AuthHeader;