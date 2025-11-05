import { Button, Col, Form, Input, Row, Select, Space, Table } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'

const { Option } = Select
function AddShift() {
    const { t, i18n } = useTranslation();
    return (
        <section className='ptb40'>
            <div className="custom_card">
                <div className="custom_card_head flex_item_cb flex-wrap mb10">
                    <h4>{t('Shift.Add_Shift')}</h4>
                </div>
                <div className="custom_card_body p10">
                    <Form layout='vertical'>
                        <Row>
                            <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                                <Form.Item label={t('Shift.Staff_Name')}>
                                    <Select className='custom-ant-select' placeholder={t('Shift.Staff_Name')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                                        <Option value="1">MR. Brooks Botsford</Option>
                                        <Option value="2">MR. Denis</Option>
                                        <Option value="3">MR. Mgerlach</Option>
                                        <Option value="4">MR. Botsford</Option>
                                        <Option value="5">MR. Naomi</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <div className="add-shift-table custom_table_wrapper">
                                <Table scroll={{
                                    x: 'calc(600px + 50%)',
                                }} dataSource={ApiData().addshiftData} pagination={false} className="text-nowrap">
                                    <Column title={
                                        <div className='flex_item_cc'>
                                            <a role="button" className='lh1 flex_item_cc'><ArrowLeft2 variant="Bold" color="#0D0B0B" size="24" /></a>
                                            <h6 className='lh1'>{t('Shift.March')}</h6>
                                            <a role="button" className='lh1 flex_item_cc'><ArrowRight2 variant="Bold" color="#0D0B0B" size="24" /></a>
                                        </div>
                                    } className='td_staff_name text-start' dataIndex="name" key="name" />
                                    <Column title={<div className='flex_item_cc gap2'><a className='lh1_5 flex_item_cc' role='button'><ArrowLeft2 variant="Bold" color="#0D0B0B" size="24" /></a> 1 {t('Shift.Day')} </div>} className='td_weekday text-center' render={(e, item) => item.monday?.shiftTime } dataIndex="monday" key="monday" />
                                    <Column title={`2 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => item.tuesday?.shiftTime} dataIndex="tuesday" key="tuesday" />
                                    <Column title={`3 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => item.wednesday?.shiftTime} dataIndex="wednesday" key="wednesday" />
                                    <Column title={`4 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => item.thursday?.shiftTime} dataIndex="thursday" key="thursday" />
                                    <Column title={`5 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => item.friday?.shiftTime} dataIndex="friday" key="friday" />
                                    <Column title={`6 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => item.saturday?.shiftTime} dataIndex="saturday" key="saturday" />
                                    <Column title={<div className='flex_item_cc gap2'>7 {t('Shift.Day')}<a className='lh1 flex_item_cc' role='button'><ArrowRight2 variant="Bold" color="#0D0B0B" size="24" /></a> </div>} className='td_weekday text-center' render={(e, item) => item.sunday?.shiftTime } dataIndex="sunday" key="sunday" />
                                </Table>
                            </div>
                        </Form.Item>
                        <Form.Item >
                            <Space className="flex_item_ce flex-wrap">
                                <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.shiftList}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Shift.Back')}</Link>
                                <Link className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.shiftList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" />{t('Shift.Finished')}</Link>
                            </Space>
                        </Form.Item>
                    </Form>

                </div>
            </div>
        </section>
    )
}

export default AddShift;
