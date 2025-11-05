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

function ConfirmationStaff() {
  const { t, i18n } = useTranslation();
  const location = useLocation(); 
  const navigate = useNavigate();
  const data = location.state;
  // console.log(data);
  const  backclick = () =>{
    navigate('/add-staff', {state: location.state});
  }
  const lang = localStorage.getItem('i18nextLng')

  if(data?._id){

  }
  const addstaff = () => {
    const Token = localStorage.getItem('token')
    http.callApi(data?._id ? url.editstaff : url.addstaff, data, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        navigate('/staff-list')
        enqueueSnackbar(
          res.data.message,
          { variant: "success" },
          { autoHideDuration: 1000 }
        );
      })
      .catch((error) => {
        if (error.response) {
          enqueueSnackbar(
            error.response.data.message,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
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
                <li><label className='fs-16'>{t('Staff.Yomi')}</label> <span>{data?.yomi}</span></li>
                <li><label className='fs-16'>{t('Staff.Address')}</label> <span>{data?.address}</span></li>
                <li><label className='fs-16'>{t('Staff.Phone')}</label> <span>{data.mobile}</span></li>
                <li><label className='fs-16'>{t('Staff.Email')}</label> <span>{data?.email}</span></li>
                <li><label className='fs-16'>{t('Staff.Contract')}</label> <span>{data?.contract ? data?.contract : "-"}</span></li>
                <li><label className='fs-16'>{t('Staff.Nursing_License')}</label> <span>{data?.license ? data?.license : "-"}</span></li>
              </ul>
            </Col>
          </Row>
          <div className="flex_item_ce flex-wrap mt30">
            <Button onClick={backclick} className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.addStaff}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Back')}</Button>
            <Button onClick={addstaff} htmlType='submit'  className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.staffList} ><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Finished')}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfirmationStaff;
