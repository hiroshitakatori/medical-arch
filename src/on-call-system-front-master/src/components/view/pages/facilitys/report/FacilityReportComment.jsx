import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider, Select, Input, Checkbox } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input
const { Option } = Select
function FacilityReportComment() {
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
      {/* <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.reportList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Reports.Back')}</Link>
            <Link to={PATH_FRONT.editReport} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('Reports.Editing')}</Link>
            <Button className='btn-theme btn-with-icon btn-success flex-row' icon={<Add size="24" color="#ffffff" />}>{t('Reports.PDF')}</Button>
          </Space>
        </Form>
      </div> */}
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
                <Col span={24}><Divider /></Col>
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
              <Form layout='vertical'>
                <Row gutter={16}>
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                    <Form.Item className='mb16' required label={t('Reports.Report_types')}>
                      <Input placeholder={t('Reports.Report_types')} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                    <Form.Item className='mb16' required label={t('dashboard.Facility_Staff')}>
                      <Input placeholder={t('dashboard.Facility_Staff')} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                    <Form.Item className='mb16' required label={t('dashboard.Comment')}>
                      <TextArea rows={4} placeholder={t('dashboard.Please_describe_progress_report_etc')}></TextArea>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                    <Form.Item className='mb16' required label={t('dashboard.Confirmation')}>
                      <Checkbox>{t('dashboard.Please_make_sure_to_check_the_box_after_confirmation')}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item className="mb0">
                  <Space className="flex_item_ce flex-wrap">
                    <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.facilityReportDetails}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Back')}</Link>
                    <Link className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.facilityReportDetails}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('table_title.Completed')}</Link>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityReportComment;
