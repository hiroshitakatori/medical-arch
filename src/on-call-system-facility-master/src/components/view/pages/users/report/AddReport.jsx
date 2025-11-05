import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider, Input, DatePicker, Select, Radio } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';

const { Option } = Select
function AddReport() {
  const { t, i18n } = useTranslation();
  return (
    <section className='ptb40'>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Reports.Add_Report')}</h4>
        </div>
        <div className="custom_card_body">
          <Form layout='vertical'>
            <div className="mb30">
              <label className='fs-16 mb10'>{t('Reports.Basic_Information')}</label>
              <div className="border_card">
                <Row gutter={16}>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Facility_Name')}>
                      <Input placeholder={t('Reports.Facility_Name')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Name_of_Facility')}>
                      <Input placeholder={t('Reports.Name_of_Facility')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Address')}>
                      <Input placeholder={t('Reports.Address')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Phone')}>
                      <Input placeholder={t('Reports.Phone')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Email')} className='mb0'>
                      <Input placeholder={t('Reports.Email')} />
                    </Form.Item>
                  </Col>
                  <Col span={24}><Divider /></Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Respondent')}>
                      <Input placeholder={t('Reports.Respondent')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Response_Date')}>
                      <DatePicker className='custom-ant-picker' placeholder={t('Reports.Response_Date')} suffixIcon={<Calendar size="22" color="#707070" />} format={"DD-MM-YYYY"} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Staff_name')} className='mb0'>
                      <Input placeholder={t('Reports.Staff_name')}/>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mb30">
              <label className='fs-16 mb10'>{t('Reports.Resident_information')}</label>
              <div className="border_card">
                <Row gutter={16}>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Name')} className='mb0'>
                      <Input placeholder={t('Reports.Name')} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mb30">
              <label className='fs-16 mb10'>Vitals</label>
              <div className="border_card">
                <Row gutter={16}>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Temperature')}>
                      <Input placeholder={t('Reports.Temperature')} suffix={<span className='text-gray'>℃</span>} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Blood_pressure')}>
                      <Input placeholder={t('Reports.Blood_pressure')} suffix={<span className='text-gray'>MmHg</span>} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Pulse')}>
                      <Input placeholder={t('Reports.Pulse')} suffix={<span className='text-gray'>Cycle per minute</span>} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.SPO2')}>
                      <Input placeholder={t('Reports.SPO2')} suffix={<span className='text-gray'>％</span>} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mb30">
              <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
              <div className="border_card">
                <Row gutter={16}>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Project_Type')} required>
                      <Select className='custom-ant-select' placeholder={t('Reports.Project_Type')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                        <Option value="1">Big Project</Option>
                        <Option value="2">Small Project</Option>
                        <Option value="3">Short Time Project</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Amount_Of_Stool')} required>
                      <Input placeholder={t('Reports.Amount_Of_Stool')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Deterioration_Of_Respiratory_Condition')} required>
                      <Radio.Group className='flex_item_cs'>
                        <Radio value={1}>{t('Reports.Yes')}</Radio>
                        <Radio value={2}>{t('Reports.None')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Cyanosis')} required className='mb0'>
                      <Radio.Group className='flex_item_cs'>
                        <Radio value={1}>{t('Reports.Yes')}</Radio>
                        <Radio value={2}>{t('Reports.None')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mb30">
              <label className='fs-16 mb10'>{t('Reports.Report_Types')}</label>
              <div className="border_card">
                <Row gutter={16}>
                  <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.Emergency_Rescue')} required className='mb0'>
                      <Radio.Group className='flex_item_cs'>
                        <Radio value={1}>{t('Reports.Yes')}</Radio>
                        <Radio value={2}>{t('Reports.None')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <Form.Item className="mb0">
              <Space className="flex_item_ce flex-wrap">
                <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.reportList}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Back')}</Link>
                <Link className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.confirmationReport}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Content_Confirmation')}</Link>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default AddReport
