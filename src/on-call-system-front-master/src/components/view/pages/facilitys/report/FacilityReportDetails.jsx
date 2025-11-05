import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';

function FacilityReportDetails() {
  const { t, i18n } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.facilityReport} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Reports.Back')}</Link>
            <Link to={PATH_FRONT.facilityReportComment} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('Facility_Information.Comment_Confirm')}</Link>
            <Button className='btn-theme btn-with-icon btn-success flex-row' icon={<Add size="24" color="#ffffff" />}>{t('Reports.PDF')}</Button>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Reports.Report')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Basic_Information')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Facility_Name')}</label> <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. In, assumenda.</span></li>
                    <li><label className='fs-16'>{t('Reports.Name_of_Facility')}</label> <span>Dr. Suyog Bora</span></li>
                    <li><label className='fs-16'>{t('Reports.Address')}</label> <span>5450-A, ABC Mall, Near Tokyo Japan</span></li>
                    <li><label className='fs-16'>{t('Reports.Phone')}</label> <span>057 874 4587 891</span></li>
                    <li><label className='fs-16'>{t('Reports.Email')}.</label> <span>info.yourname@xyz.com</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Correspondent')}</label> <span>Dr. Sagar Kachariya</span></li>
                    <li><label className='fs-16'>{t('Reports.Response_Date')}</label> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                    <li><label className='fs-16'>{t('Reports.Staff_name')}</label> <span>Lorem, ipsum dolor.</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Resident_information')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Name')}</label> <span>5450-A, ABC Mall, Near Tokyo Japan</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Vitals')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Temperature')}</label> <span>Dr. Sagar Kachariya</span></li>
                    <li><label className='fs-16'>{t('Reports.Blood_pressure')}</label> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                    <li><label className='fs-16'>{t('Reports.Pulse')}</label> <span>Lorem, ipsum dolor.</span></li>
                    <li><label className='fs-16'>{t('Reports.SPO2')}</label> <span>Lorem, ipsum dolor.</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="">
            <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Shoulder_respiration')}</label> <span>Dr. Sagar Kachariya</span></li>
                    <li><label className='fs-16'>{t('Reports.cyanotic_fever')}</label> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                  </ul>
                </Col>
                <Col span={24}><Divider /></Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Report_Types')}</label> <span>Dr. Sagar Kachariya</span></li>
                    <li><label className='fs-16'>{t('Reports.Facility_staff')}</label> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                    <li><label className='fs-16'>{t('Reports.Comment')}</label> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityReportDetails;
