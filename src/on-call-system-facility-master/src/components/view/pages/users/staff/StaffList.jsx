import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../../data/ApiData'
import { PATH_FRONT } from '../../../../routes/path'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";


function StaffList() {
  const { t, i18n } = useTranslation();
  const [staff, setstaff] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [total, setTotal] = useState("");
  const [prebutton, setPrebutton] = useState(0);
  const [nextButton, setNextButton] = useState(true);
  const [buttondis,setButtonDisbale] = useState(true)
  const handlePagination = (increment) => {
    if(nextButton == false)
    {
      return false;
    }else{
      setCurrentPage((prevPage) => prevPage + increment);
    }
  };
  const handleperviousPagination = (increment) => {
    if(prebutton == 0){
    return false;
    }else{
      setCurrentPage(currentPage - increment);
    }
  };
  const onSubmit = () => {
    const lang = localStorage.getItem('i18nextLng')
    const Token = localStorage.getItem('token')
    http.get( process.env.REACT_APP_BASE_URL +`/admin/getStaff?page=${currentPage}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setstaff(res.data[0].data)
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
  const getoneuser = (staff) => {
    navigate("/staff-details",{state:staff});
  }

  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0'>
              <Link to={PATH_FRONT.addStaff} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" /> {t('Staff.Add_Staff')}</Link>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('Staff.Staff_List')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton >1 ?  handleperviousPagination(1):""}  className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""}   disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>

          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x:1200 }} className='text-nowrap'  pagination={false} dataSource={staff}>
              <Column title={t('Staff.ID')} dataIndex={"uniqeId"} key={"id"} className='td_id'></Column>
              <Column title={t('Staff.Name')} dataIndex={"name"} key={"name"}  render={(_, e) => <a onClick={()=>getoneuser(e)} to={""}>{e.name}</a>} className='td_name'></Column>
              <Column title={t('Staff.Email')} dataIndex={"email"} key={"email"} className='td_email' ></Column>
              <Column title={t('Staff.Phone')} dataIndex={"mobile"} key={"phone"} className='td_phone' ></Column>
              {/* <Column title={t('Staff.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table>
          </div>
        </div>
      </div>
    </section >
  )
}

export default StaffList
