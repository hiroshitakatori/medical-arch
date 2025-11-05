import React, { useState } from 'react';
import { Button, Form, Row, Space, Table, Col, Divider } from 'antd'
import { Add, ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData';
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";
import pdfIcon from "../../../../../assets/images/PDF_file_icon.svg.png";
import Loader from '../../../../Loader'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

function ConfirmationStaff() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  console.log(data);
  const ID = data?._id
  const [isLoading, setIsLoading] = useState(false)
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  const backclick = () => {
    if (ID) {
      navigate('/edit-staff', { state: location.state });
    } else {
      navigate('/add-staff', { state: location.state });
    }
  }
  const lang = localStorage.getItem('i18nextLng')

  if (data?._id) {

  }
  const addstaff = () => {
    const Token = localStorage.getItem('token')
    setIsLoading(true);
    http.callApi(data?._id ? url.editstaff : url.addstaff, data, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setIsLoading(false);

        if (location?.state?.edit) {
          navigate('/my-page')
          enqueueSnackbar(
            lang == "en" ? "Profile updated successfully" : "プロファイルが正常に更新されました",
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
        } else {
          navigate('/staff-list')
          enqueueSnackbar(
            res.data.message,
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
        }

      })
      .catch((error) => {
        console.log(error.response?.data?.errors?.email)
        if (error.response?.data?.errors) {
          // form.setFields([
          //   {
          //     name: "email",
          //     errors: [error.response?.data?.errors?.email]
          //   },
          //   {
          //     name: "mobile",
          //     errors: [error.response?.data?.errors?.mobile]
          //   }
          // ]);
          enqueueSnackbar(
                error.response.data.errors?.email ||error.response.data.errors?.mobile ,
                { variant: "error" },
                { autoHideDuration: 1000 }
              );

        }
        // if (error.response) {
        //   enqueueSnackbar(
        //     error.response.data.message,
        //     { variant: "error" },
        //     { autoHideDuration: 1000 }
        //   );
        // }
      })

  }





  return (
    <section className='ptb40'>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Staff.Staff_Confirmation')}</h4>
        </div>
        <div className="custom_card_body">
          <Row>
            <Col span={18}>
              <ul className='details_list'>
                <li><label className='fs-16'>{t('Staff.Name')}</label> <span>{data?.name}</span></li>
                <li><label className='fs-16'>{t('Staff.Frigana')}</label> <span>{data?.frigana}</span></li>
                <li><label className='fs-16'>{t('Staff.Address')}</label> <span>{data?.address}</span></li>
                <li><label className='fs-16'>{t('Staff.Password')}</label> <span>{data?.password || data?.password2}</span></li>
                <li><label className='fs-16'>{t('Staff.Phone')}</label> <span>{data?.mobile}</span></li>
                <li><label className='fs-16'>{t('Staff.Email')}</label> <span>{data?.email}</span></li>
                <li><label className='fs-16'>{t('Staff.Contract')}</label> <span>
                  {
                    data?.contract?.includes('pdf') ? (<a href={process.env.REACT_APP_FILE_PATH + "contract/" + data?.contract} target='blank'>
                      <img src={pdfIcon} alt="" style={{ height: "70px", width: "60px" }} />
                    </a>) :
                    data?.contract ? 
                      (<a href={process.env.REACT_APP_FILE_PATH + "contract/" + data?.contract} target='blank'>
                        <img src={process.env.REACT_APP_FILE_PATH + "contract/" + data?.contract} alt="" style={{ height: "100px", width: "200px" }} />
                      </a>):""
                  }</span></li>

                <li><label className='fs-16'>{t('Staff.Nursing_License')}</label> <span>{
                  data?.license?.includes('pdf') ? (<a href={process.env.REACT_APP_FILE_PATH + "license/" + data?.license} target='blank'>
                    <img src={pdfIcon} alt="" style={{ height: "70px", width: "60px" }} />
                  </a>) :data?.license ? 
                    (<a href={process.env.REACT_APP_FILE_PATH + "license/" + data?.license} target='blank'>
                      <img src={process.env.REACT_APP_FILE_PATH + "license/" + data?.license} alt="" style={{ height: "100px", width: "200px" }} />
                    </a>):""
                }</span></li>
                {
                  data?.isAuthority ?
                    <li><label className='fs-16'>{t('Staff.Authority')}</label>{data?.authority == 1 ? t('Staff.Admin') : t('Staff.Part-Timer')}</li>
                    : ""
                }

              </ul>
            </Col>
          </Row>
          <div className="flex_item_ce flex-wrap mt30">
            <Button onClick={backclick} className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.addStaff}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Back')}</Button>

            {

              isLoading == true ?

                <Button disabled onClick={addstaff} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.staffList} ><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Finished')}<Spin style={{color:"#fff"}} indicator={antIcon} /></Button>
                :<Button onClick={addstaff} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.staffList} ><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Finished')}</Button>
             
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfirmationStaff;
