import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, Space, Table } from 'antd'
import { ArrowLeft2, ArrowRight2, Link, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../data/ApiData';
import { useTranslation } from 'react-i18next';
import { PATH_FRONT } from '../../../routes/path';
import { useNavigate } from 'react-router-dom';

function FacilityDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  return (
    <section className='ptb40'>
      {/* <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0'>
              <Input placeholder={t('table_title.Facility_search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div> */}
      <div className="custom_card mb30">
        <div className='mb30'>
          <Row>
            <Col className='text-center' md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }}>
              <h6 className='text-blue'>{t('facility_Dashboard.On_Call_Hours')}</h6>
              <h3>17:00 ~ 08:30</h3>
            </Col>
            <Col className='text-center' md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }}>
              <h6 className='text-success'>{t('facility_Dashboard.Representative_Phone')}</h6>
              <h3>000-0000-0000</h3>
            </Col>
            <Col className='text-center' md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }}>
              <h6 className='text-danger'>{t('facility_Dashboard.Please_call_here_from')}</h6>
              <h3>000-0000-0000</h3>
            </Col>
          </Row>
        </div>
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Reports')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">

          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={ApiData().facilityReport}
            onRow={(i) => ({
              onClick: (e) => {
                  return navigate(PATH_FRONT.facilityReportDetails);
                },
              })}>
              <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day text-start'></Column>
              <Column ellipsis={true} title={t('table_title.Staff')} dataIndex={"staff"} key={"staff"} className='td_staff text-start' ></Column>
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityDashboard

