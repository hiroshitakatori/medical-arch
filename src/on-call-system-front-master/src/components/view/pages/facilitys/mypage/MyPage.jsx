import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Space, Table, Col } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';


function MyPage() {
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
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4> {t('Facility_Information.My_page')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="">
            <Row>
              <Col sm={{ span: 14 }} xs={{ span: 24 }}>
                <ul className='details_list mb10'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label> <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. In, assumenda.</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label> <span>Auto Reflect</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label> <span>5450-A, ABC Mall, Near Tokyo Japan</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label> <span>057 874 4587 891</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label> <span>info.yourname@xyz.com</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label> <span>Dr. Suyog Bora</span></li>
                </ul>
              </Col>
              <Col sm={{ span: 14 }} xs={{ span: 24 }}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label> <span>Dr. Sagar Kachariya</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>Lorem, ipsum dolor.</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}</label> <span>Paid Nursing Home</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label> <span>Platinium</span></li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyPage
