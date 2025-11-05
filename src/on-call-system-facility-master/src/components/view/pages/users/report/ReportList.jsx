import React, {useEffect, useState } from 'react'
import { Button, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { PATH_FRONT } from '../../../../routes/path'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";
var Base_url = process.env.REACT_APP_BASE_URL;
function ReportList() {
  
  const { t, i18n } = useTranslation();
  const [report, setReport] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [total, setTotal] = useState("");
  const [prebutton, setPrebutton] = useState(0);
  const [nextButton, setNextButton] = useState(true);
  const [buttondis,setButtonDisbale] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setLoading(false);
      setSelectedRowKeys([]);
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
  const onSubmit = () => {
    const lang = localStorage.getItem('i18nextLng')
    const Token = localStorage.getItem('token')
    http.get( Base_url +`/facility/getReport?page=${currentPage}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setReport(res.data[0].data)
        setTotal(res.data[0].metadata[0].total)
        setNextButton(res.data[0].metadata[0].hasMoreData)
        setPrebutton(res.data[0].metadata[0].page)
        enqueueSnackbar(
          res.data.message,
          { variant: "success" },
          { autoHideDuration: 1000 }
        );
      })
      .catch((error) => {
        if (error.response) {
          enqueueSnackbar(
            error.response.data.message,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      })

  }
  useEffect(() => {
    onSubmit()
  }, [currentPage])
  const getOneReport = (report) => {
    navigate("/staff-details",{state:report});
  }
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            {/* <Form.Item className='mb0'>
              <Link to={PATH_FRONT.addReport} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" />{t('table_title.Add_Reports')}</Link>
            </Form.Item> */}
            <Form.Item className='mb0'>
              <Input placeholder={t('table_title.Facility_search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.List_of_Reports')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' className='flex_item_cc prev_btn gap1'><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" />{t('table_title.Previous')}</a>
            <a role='button' className='flex_item_cc next_btn gap1'>{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' rowSelection={{ type: "radio", ...rowSelection }} pagination={false} dataSource={report}>
              <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status text-start' ></Column>
              <Column title={t('table_title.FirstAid')} dataIndex={"FirstAid"} key={"FirstAid"} className='td_time text-start' ></Column>
              <Column title={t('table_title.Corresponding_Person')} dataIndex={"responders"} key={"responders"} className='td_responders text-start' ></Column>
              <Column title={t('table_title.Name_of_facility')} dataIndex={"facilityName"} key={"facilityName"} className='td_facility_name text-start' ></Column>
              <Column title={t('table_title.Date')} dataIndex={"day"} key={"day"} className='td_day'></Column>
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReportList
