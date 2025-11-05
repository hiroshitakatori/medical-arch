import React, { useState } from 'react'
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table } from 'antd'
import { ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../data/ApiData'
import { useTranslation } from 'react-i18next'
import { PATH_FRONT } from '../../routes/path'
import { Link } from 'react-router-dom'
import SupportStatusChangeModal from '../modals/SupportStatusChangeModal'

const { Option } = Select;
const { TextArea } = Input;

function Dashboard() {
  console.log("DASHBOARD")
  const { t, i18n } = useTranslation();
  const [supportStatusChangeModalOpen, setSupportStatusChangeModalOpen] = useState(false);
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
            <Form.Item className='mb0'>
              <Input placeholder={t('table_title.No_Facility_Name_Yomi')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('dashboard.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Missed_Calls')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" />{t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table className='text-nowrap' pagination={false} dataSource={ApiData().missedCallsData} >
              <Column title={t('table_title.Name_of_facility')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name' ></Column>
              <Column title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day'></Column>
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Incoming_call_history')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          {/* <div className="flex_item_ce">
            <Form>
              <Form.Item className='mb0'>
                <Select className='custom-ant-select' placeholder={t('table_title.Responders')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                  <Option value="1">Responders 1</Option>
                  <Option value="2">Responders 2</Option>
                  <Option value="3">Responders 3</Option>
                </Select>
              </Form.Item>
            </Form>
          </div> */}
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' rowSelection={{ type: "radio", ...rowSelection }} pagination={false} dataSource={ApiData().incomingCallHistory}>
              <Column ellipsis={true} title={t('table_title.Status')} render={(item, data) => <a onClick={() => setSupportStatusChangeModalOpen(true)}>{data.status}</a>} dataIndex={"status"} key={"status"} className='td_status text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Corresponding_Person')} dataIndex={"responders"} key={"responders"} className='td_responders text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Name_of_facility')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name' ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day'></Column>
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Report_List')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' rowSelection={{ type: "radio", ...rowSelection }} pagination={false} dataSource={ApiData().reportList}>
              <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.FirstAid')} dataIndex={"FirstAid"} key={"FirstAid"} className='td_time text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Corresponding_Person')} dataIndex={"responders"} key={"responders"} className='td_responders text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Name_of_facility')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name' ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day'></Column>
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.March_20_2023_shift')}</h4>
          <p> {t('table_title.It_will_be_updated_at_13_00_PM_the_next_day')}</p>
        </div>
        <div className="custom_card_body p0" style={{border:"none"}}>
          {/* <div className="custom_table_wrapper leader_and_responder_table">
          <Table showHeader={false} scroll={{ x: 900 }} defaultExpandAllRows={true} showExpandColumn={false} className='text-nowrap' pagination={false} dataSource={ApiData().selectLeaderData}>
              <Column title={t('table_title.Responder')} dataIndex={"shiftTime"} key={"shiftTime"} className='td_responders text-start' ></Column>
              <Column title={t('table_title.Responder')} render={(_, data) =>  data?.leaderName ? data.leaderName  : data.responders1 } dataIndex={"responders1"} key={"responders1"} className='td_responders text-start' ></Column>
              <Column title={t('table_title.Responder')} dataIndex={"responders2"} key={"responders2"} className='td_responders' ></Column>
              <Column title={t('table_title.Responder')} dataIndex={"responders3"} key={"responders3"} className='td_responders' ></Column>
              <Column title={t('table_title.Responder')} dataIndex={"responders4"} key={"responders4"} className='td_responders'></Column>
            </Table>
          </div> */}
          <div className="leader_and_responder_table shift_badge_list">
            <div className="responder_item border_card mb16">
              <span className='shift_badge mb10 badge_primary'>A : 17:00〜20:00</span>
              <h6 className='text-danger fs-16 mb10'>{t('table_title.Leader')}</h6>
              <ul className='responder_list'>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} A</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} B</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} C</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} D</Link></li>
              </ul>
            </div>
            <div className="responder_item border_card mb16">
            <span className='shift_badge mb10 badge_success'>B : 20:00〜0:00</span>
              <h6 className='text-danger fs-16 mb10'>{t('table_title.Leader')}</h6>
              <ul className='responder_list'>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} A</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} B</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} C</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} D</Link></li>
              </ul>
            </div>
            <div className="responder_item border_card mb16">
            <span className='shift_badge mb10 badge_warning'>C : 0:00〜6:00</span>
              <h6 className='text-danger fs-16 mb10'>{t('table_title.Leader')}</h6>
              <ul className='responder_list'>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} A</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} B</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} C</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} D</Link></li>
              </ul>
            </div>
            <div className="responder_item border_card mb16">
            <span className='shift_badge mb10 badge_danger'>D : 6:00〜8:30</span>
              <h6 className='text-danger fs-16 mb10'>{t('table_title.Leader')}</h6>
              <ul className='responder_list'>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} A</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} B</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} C</Link></li>
                <li><Link className="fw-600 fs-16" to={PATH_FRONT.staffDetails}>{t('table_title.Responder')} D</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SupportStatusChangeModal modalOpenEvent={supportStatusChangeModalOpen} modalCloseEvent={setSupportStatusChangeModalOpen} />
    </section>
  )
}

export default Dashboard
