import React,{useEffect, useState} from 'react'
import { Button, Form, Input, Space, Table } from 'antd'
import { ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import { enqueueSnackbar } from "notistack";
import { Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path';
import moment from 'moment';

const { Text } = Typography;


function CancelFacilitySearch() {
  const { t, i18n } = useTranslation();
  var [facility, setFacility] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1);
  var [total, setTotal] = useState("");
  var [search, setSearch] = useState("");
  var [prebutton, setPrebutton] = useState(0);
  var [nextButton, setNextButton] = useState(true);
  var data = location.state
  var lang = localStorage.getItem('i18nextLng')
  var Token = localStorage.getItem('token')
  const currentDate = moment().format('YYYY-MM-DD');
  console.log(data?.terminationDate)
  console.log(currentDate)
  const getonefacility = (staff) => {
    navigate("/facility-details",{state:staff});
  }
  var getfacility = () => {

    http.get(process.env.REACT_APP_BASE_URL + `/admin/getFacility?page=${currentPage}&&search=${search}&&flag=cancel`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        console.log(res);
        setFacility(res.data[0].data)
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
          console.log(error.response, "error");
          enqueueSnackbar(
            error.response,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      })

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
  function setFilter(e){
      setSearch(e.target.value);
  }
  useEffect(() => {
    getfacility()
  }, [currentPage])


  const cancelFacility = (data) => {
    console.log(data,"data");
    navigate('/cancel-facility',{state:data})
    
    
    // let data2={_id:data?._id}
    // http.callApi( url.cancelFacility, data2, {
    //   headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    // })
    //   .then((res) => {
       
    //       navigate("/cancel-facility-search");  
    //       enqueueSnackbar(
    //         res.data.message,
    //         { variant: "success" },
    //         { autoHideDuration: 1000 }
    //       );
        
     
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       enqueueSnackbar(
    //         error.response.data.message,
    //         { variant: "error" },
    //         { autoHideDuration: 1000 }
    //       );
    //     }
    //   })
  
  }

  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0 minw_320'>
              <Input onChange={setFilter} placeholder={t('table_title.No_Facility_Name_Yomi')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button onClick={getfacility} type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Cancellation_Procedure_Search_Results')}</h4>
          <div className="pagination_flex flex_item_cc">
          <a role='button' onClick={() => prebutton >1 ?  handleperviousPagination(1):""}  className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""}   disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 1200 }} className='text-nowrap' pagination={false} dataSource={facility} >
              <Column title={t('Facility_Information.FacilityId')} dataIndex={"uniqeId"} key={"uniqueId"} className='td_unique' ></Column>
              <Column title={t('table_title.Facility_Name')} dataIndex={"name"} key={"facilityName"} className='td_facility_name'
              render={(_, e) => <a style={{color:"#0638be"}} onClick={() => getonefacility(e)} to={""}>{e.name}</a>}
              ></Column>
              {/*<Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status'
               render={(stat,e) =>
                lang == "en" ?
                (e.status == 1 ? "Under Contract" :
                  e.status == 0 ?  <Text type="danger">Canceled</Text> : null) :
                  e.status == 1 ? "契約中" :
                  // e.status == 0 ?  <Text type="danger">キャンセル</Text> : null
                 e.status == 0 &&  moment(e?.terminationDate).format("YYYY-MM-DD")  > currentDate  ? t('table_title.UnderContract') :<Text type="danger">{t('table_title.Canceled')}</Text> 
                }
              ></Column>*/}
              <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"}
                      render={(stat,e) =>
                          stat == 1 ? t('table_title.UnderContract') :
                              stat == 0 && moment(e?.terminationDate).format("YYYY-MM-DD")  > currentDate ? <><span>契約中</span><span style={{color:"#ff5a5c"}}> { ' ' + moment(e?.terminationDate).format("MM/DD") + ' ' + '解約予定'} </span></> :<Text type="danger">{t('table_title.Canceled')}</Text>
                      }
                      className='td_status text-start' ></Column>
              <Column title={t('table_title.BusinessFormat')} dataIndex={"businessType"} key={"businessformat"} className='td_business_format' 
              render={(text) =>
                lang == "en" ?
                (text == 1 ? "Special Nursing Home" :
                  text == 2 ? "Short Stay" :
                    text == 3 ? "Paid Nursing Home" : null) :
                    (text == 1 ? "特別養護老人ホーム" :
                    text == 2 ? "ショートステイ" :
                      text == 3 ? "有料老人ホーム" : null) 
              }
              ></Column>
              <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action'
                  render={(_, e) => {
                    return e?.status == 1 ?   (
                      <Button onClick={() => cancelFacility(e)} to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>
                        {t('table_title.Cancel')}
                      </Button>
                    ):
                    e?.status == 0 &&  moment(e?.terminationDate).format("YYYY-MM-DD")  > currentDate  ?
                    (
                      <Button onClick={() => cancelFacility(e)} to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>
                        {t('table_title.Cancel')}
                      </Button>
                    ):<Text type="danger">{t('table_title.Canceled')}</Text> 
                  }}
              ></Column>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CancelFacilitySearch
