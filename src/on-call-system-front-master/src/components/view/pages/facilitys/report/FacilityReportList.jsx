import React, { useState } from 'react'
import { Button, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { PATH_FRONT } from '../../../../routes/path'
import { Link, useNavigate } from 'react-router-dom'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'

function FacilityReportList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
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
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Reports')} <span className='text-gray fs-16'>{t('table_title.On_March_20th')}</span></h4>
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
              <Column ellipsis={true} title={t('table_title.PaymentDate')} dataIndex={"day"} key={"day"} className='td_day text-start'></Column>
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

export default FacilityReportList
