import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';

function StaffDetails() {
  const { t, i18n } = useTranslation();
  const naviagte = useNavigate();
  const location = useLocation();
  const data = location.state
  // console.log(data);

  const editpageclick = () => {
    naviagte('/edit-staff', {state:data})
  }
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.staffList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Back')}</Link>
            <Button onClick={editpageclick} to={PATH_FRONT.editStaff} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" /> {t('Staff.Editing')}</Button>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Staff.Correspondent')}</h4>
        </div>
        <div className="custom_card_body">
          <Row>
            <Col span={18}>
              <ul className='details_list'>
                <li><label className='fs-16'>{t('Staff.Name')}</label> <span>{data?.name}</span></li>
                <li><label className='fs-16'>{t('Staff.Yomi')}</label> <span>{data?.yomi}</span></li>
                <li><label className='fs-16'>{t('Staff.ID')}</label> <span>{data?.uniqeId ? data?.uniqeId : "-"}</span></li>
                <li><label className='fs-16'>{t('Staff.Phone')}</label> <span>{data?.mobile}</span></li>
                <li><label className='fs-16'>{t('Staff.Email')}</label> <span>{data?.email}</span></li>
                <li><label className='fs-16'>{t('Staff.Contract')}</label> <span>{data.contract ? data.contract : "_"}</span></li>
                <li><label className='fs-16'>{t('Staff.Nursing_License')}</label> <span>{data.license ? data.license : "_"}</span></li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  )
}

export default StaffDetails;
