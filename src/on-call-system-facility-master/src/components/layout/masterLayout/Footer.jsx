import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer-wrapper">
      {/* <div className='footer_top'>
        <div className='container'>
          <div className='footer_top_content'>
            <div className='row gy-5'>
              <div className='col-lg-6 col-xl-4 col-md-6 col-sm-12'>
                <div className='text_content text-start pe-5'>
                  <div className='logo mb-4'>
                    <Link to={"/"}>
                      <img src={require("../../../assets/images/mee-time-logo.png")} alt="logo" className='logo' />
                    </Link>
                  </div>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
              </div>
              <div className='col-lg-6 col-xl-3 col-md-6 col-sm-12'>
                <div className='text_content'>
                  <h4 className='site_map_heading'>Welcome to the Mee Time</h4>
                  <p>Subscribe to see our latest services, exclusive offers near by your area</p>
                  <div className='subscribe_form_wrapper'>
                    <form className=''>
                      <input type="text" placeholder='Enter email' />
                      <button className='btn-theme' type='submit'>
                        Subscribe Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-3 col-md-6 col-sm-6'>
                <div className='text_content middle_50'>
                  <h4 className='site_map_heading'>More Info</h4>
                  <ul className='site_map_links'>
                    <li>
                      <Link to={"/about-us"}>About Me Time</Link>
                    </li>
                    <li>
                      <Link to={"/prices"}>Prices</Link>
                    </li>
                    <li>
                      <Link to={"/contact-us"}>Contact Us</Link>
                    </li>
                    <li>
                      <Link to={"/faq"}>FAQ</Link>
                    </li>
                    <li>
                      <Link to={"/"}>Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to={"/"}>Terms of Use</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-xl-2 col-lg-6 col-md-6 col-sm-6'>
                <div className='text_content'>
                  <h4 className='site_map_heading'>Social Media</h4>
                  <div className='social_icons_wrapper'>
                    <a href=""><img src={require("../../../assets/images/tiktok-icon.png")} alt="" /></a>
                    <a href=""><img src={require("../../../assets/images/facebook-icon.png")} alt="" /></a>
                    <a href=""><img src={require("../../../assets/images/instagram-icon.png")} alt="" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='footer_bottom'>
        <div className="container text-center">
          <p>@2023 Medical Arch. All Rights Reserved </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
