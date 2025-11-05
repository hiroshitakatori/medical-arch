import { Button, Form, Input, Space, Table } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'

function ShiftList() {
    const { t, i18n } = useTranslation();
    return (
        <section className='ptb40'>
            <div className="fliter_box_card mb30">
                <Form>
                    <Space className='flex-wrap flex_item_ce'>
                        <Form.Item className='mb0'>
                            <Link to={PATH_FRONT.addShift} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" /> {t('Shift.Add_Shift')}</Link>
                        </Form.Item>
                        {/* <Form.Item className='mb0'>
                            <Input placeholder={t('table_title.Facility_search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
                        </Form.Item>
                        <Form.Item className='mb0'>
                            <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
                        </Form.Item> */}
                    </Space>
                </Form>
            </div>
            <div className="custom_card">
                <div className="custom_card_head flex_item_cb flex-wrap mb10">
                    <h4>{t('Shift.Shift_List')}</h4>
                    <div className="flex_item_ce flex-wrap shift_badge_list">
                        <span className='shift_badge badge_primary'>A : 17:00〜20:00</span>
                        <span className='shift_badge badge_success'>B : 20:00〜0:00</span>
                        <span className='shift_badge badge_warning'>C : 0:00〜6:00</span>
                        <span className='shift_badge badge_danger'>D : 6:00〜8:30</span>
                    </div>
                </div>
                <div className="custom_card_body p10">
                    <div className="shift-list-table custom_table_wrapper">
                        <Table scroll={{x: 900}} dataSource={ApiData().shiftList} pagination={false} className="text-nowrap">
                            <Column title={
                                <div className='flex_item_cc'>
                                    <a role="button" className='lh1 flex_item_cc'><ArrowLeft2 variant="Bold" color="#0D0B0B" size="24" /></a>
                                    <h6 className='lh1'>{t('Shift.March')}</h6>
                                    <a role="button" className='lh1 flex_item_cc'><ArrowRight2 variant="Bold" color="#0D0B0B" size="24" /></a>
                                </div>
                            } className='td_staff_name text-start' dataIndex="name" key="name" />
                            <Column title={<div className='flex_item_cc gap2'><a className='lh1_5 flex_item_cc' role='button'><ArrowLeft2 variant="Bold" color="#0D0B0B" size="24" /></a> 1 {t('Shift.Day')}</div>} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.monday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="monday" key="monday" />
                            <Column title={`2 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.tuesday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="tuesday" key="tuesday" />
                            <Column title={`3 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.wednesday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="wednesday" key="wednesday" />
                            <Column title={`4 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.thursday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="thursday" key="thursday" />
                            <Column title={`5 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.friday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="friday" key="friday" />
                            <Column title={`6 ${t('Shift.Day')}`} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.saturday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="saturday" key="saturday" />
                            <Column title={<div className='flex_item_cc gap2'>7 {t('Shift.Day')} <a className='lh1 flex_item_cc' role='button'><ArrowRight2 variant="Bold" color="#0D0B0B" size="24" /></a> </div>} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item.sunday?.shiftTime?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    ))}
                                </ul>
                            }} dataIndex="sunday" key="sunday" />
                        </Table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShiftList
