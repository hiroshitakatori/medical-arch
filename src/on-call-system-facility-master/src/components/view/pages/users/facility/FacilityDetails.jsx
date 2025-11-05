import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';

function FacilityDetails() {
  const { t, i18n } = useTranslation();
  const naviagte = useNavigate();
  const location = useLocation();
  const data = location.state


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  // const start = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
  //   }, 1000);
  // };
  const onSelectChange = (newSelectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const editstaffdetalis = () => {
    naviagte('/edit-facility', {state:data})
  }
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.facilityList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('table_title.Back')}</Link>
            <Link to={PATH_FRONT.addReport} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" /> {t('table_title.Create_Report')}</Link>
            <Button onClick={editstaffdetalis} to={PATH_FRONT.editFacility} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('table_title.Edit_Facility')} </Button>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Facility_Information.title')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <Row>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label><span>{data?.name}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label><span>{data?.yomi}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label><span>{data?.address}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label><span>{data?.mobile}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label><span>{data?.email}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>{data?.managerName}</span></li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label><span>{data?.facilityManagerName}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label><span>{data?.contractDetails}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>{data?.capacity}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}.</label><span>{data?.businessType}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{data?.plan}</span></li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_facility_can_also_view')}</label>
            <div className="border_card">
              <p>{data.memoForFacility}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_viewable_by_staff_only')}</label>
            <div className="border_card">
              <p>{data?.memoForStaff}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Affiliated_Facilities')}</label>
            <p>{data?.affiliatedFacility}</p>
          </div>
        </div>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.List_of_Past_Reports')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" />{t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' rowSelection={{ type: "radio", ...rowSelection }} pagination={false} dataSource={ApiData().pastReportList}>
              <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status text-start' ></Column>
              <Column title={t('table_title.Corresponding_Person')} dataIndex={"responders"} key={"responders"} className='td_responders text-start' ></Column>
              <Column title={t('table_title.Name_of_facility')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name' ></Column>
              <Column title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day'></Column>
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Past_Incoming_Call_Log')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" />{t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' rowSelection={{ type: "radio", ...rowSelection }} pagination={false} dataSource={ApiData().pastIncomingCallHistory}>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day text-start'></Column>
              <Column ellipsis={true} title={t('table_title.Responders')} dataIndex={"responders"} key={"responders"} className='td_responders text-start minw_auto' ></Column>
              {/* <Column title={t('table_title.Facility_Name')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name' ></Column> */}
              {/* <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status' ></Column> */}
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action text-start' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityDetails
