import React from 'react'
import { Button, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../../data/ApiData'
import { Link } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path'
import { useTranslation } from 'react-i18next'

function LogList() {
  const { t, i18n } = useTranslation();
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0'>
              <Input placeholder={t('table_title.Select_search_date')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Log_List')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={ApiData().logList}>
              <Column title={t('table_title.Date')} dataIndex={"date"} key={"date"} className='td_day text-start'></Column>
              <Column title={t('table_title.Name_of_facility')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name text-start' ></Column>
              {/* <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status' ></Column> */}
              <Column title={t('table_title.Corresponding_Person')} dataIndex={"responders"} key={"responders"} className='td_responders text-start' ></Column>
              <Column title={t('table_title.Call_Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column>
              <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action text-center' ></Column>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LogList;
