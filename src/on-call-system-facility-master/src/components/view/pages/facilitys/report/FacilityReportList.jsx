import React, {useEffect, useState } from 'react'
import {  Empty, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { PATH_FRONT } from '../../../../routes/path'
import { Link, useNavigate } from 'react-router-dom'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import { enqueueSnackbar } from "notistack";
import { Typography } from 'antd';
import { Button } from 'antd';
import Loader from '../../Loader';
import moment from 'moment'
import { format} from 'date-fns';
import { ja } from 'date-fns/locale';

var Base_url = process.env.REACT_APP_BASE_URL;
const { Text } = Typography;

function FacilityReportList() {
  const { t, i18n } = useTranslation();
  const [report, setReport] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [total, setTotal] = useState("");
  const [prebutton, setPrebutton] = useState(0);
  const [nextButton, setNextButton] = useState(true);
  const [buttondis,setButtonDisbale] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  //format(new Date(tDate), 'yyyy-MMM-d h:mm a') : format(new Date(tDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja }) 
  //moment(moment.now()).format('MMMM DD');
  //年7月21日
  // var today = moment(moment.now()).format('YYYY-MM-DD');
  const lang = localStorage.getItem('i18nextLng')
  const Token = localStorage.getItem('token')
  var currentDate = lang == 'en' ? moment(moment.now()).format('YYYY MMMM DD') :format(new Date(moment.now()), "yyyy'年'MMMd'日'", { locale: ja }) 
  // moment("令和2年1月1日", "NNNNyoM月D日", "ja").format('YYYY-MM-DD')	
  const onSubmit = () => {
   
    http.get( Base_url +`/facility/getReport?page=${currentPage}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang ,role:"facility"}
    })
      .then((res) => {
        // console.log(res,"res");
        setLoading(false)
        setReport(res.data[0]?.data)
        setTotal(res.data[0]?.metadata[0].total)
        setNextButton(res.data[0]?.metadata[0].hasMoreData)
        setPrebutton(res.data[0]?.metadata[0].page)
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

  if (loading) return <Loader />
  const getOneReport = (e,report) => {
    navigate(PATH_FRONT.facilityReportDetails,{state:report});
  }
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

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
          <h4>{t('table_title.Reports')} <span className='text-gray fs-16'>{t(currentDate)}</span></h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton >1 ?  handleperviousPagination(1):""}  className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""}   disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={report}
            onRow={(i) => ({
              onClick: (e) => {
                  getOneReport(e,i)
                },
              })}
              locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}
              >
              <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"} 
               render={(stat) =>
                  stat == 1 ? <span  style={{ backgroundColor: "#cce6f2", padding: "3px 10px", borderRadius: "5px" }}>{t('Reports.InPreperation')}</span> :
                    stat == 2 ?  <span  style={{ backgroundColor: "#ccf2d6", padding: "3px 20px", borderRadius: "5px" }}>{t('Reports.Confrimed')} </span> : <span style={{ backgroundColor: "#f2dbcb", padding: "3px 13px", borderRadius: "5px", width: "100px" }}>{t('Reports.UnConfrimed')} </span>}
                className='td_status text-start' 
                >
                
              </Column>
              <Column ellipsis={true} title={t('table_title.PaymentDate')} dataIndex={"createdAt"} key={"day"} className='td_day text-start'
                render={(_, e) => {
                  var contractStartDate = e?.createdAt;
                  let dt="";
                  if(contractStartDate){

                   dt = lang == 'en' ? format(new Date(contractStartDate), "yyyy-MMM-d h:mm a") : format(new Date(contractStartDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  }
                  return dt;
                }}
              
              ></Column>
              <Column ellipsis={true} title={t('table_title.Staff')} dataIndex={"staffId"} key={"staff"} className='td_staff text-start' ></Column>
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
