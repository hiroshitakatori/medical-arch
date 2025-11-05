import React, { useEffect,useState } from 'react'
import { Button, Col, Empty, Form, Input, Row, Space, Table } from 'antd'
import { ArrowLeft2, ArrowRight2, Link, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../data/ApiData';
import { useTranslation } from 'react-i18next';
import { PATH_FRONT } from '../../../routes/path';
import { useNavigate } from 'react-router-dom';
import http from '../../../../security/Http';
import { enqueueSnackbar } from "notistack";
import Loader from '../Loader';
import authStores from '../../../contexs/AuthProvider';
import { format} from 'date-fns';
import { ja } from 'date-fns/locale';
var Base_url = process.env.REACT_APP_BASE_URL;

function FacilityDashboard() {
  // console.log("FACILITY DASHBOARD")
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const authstore = authStores();

  authStores((state) => state.accessToken)
  const lang = localStorage.getItem('i18nextLng')
  const Token = authStores((state) => state.accessToken)

  const [report, setReport] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  // const [total, setTotal] = useState("");
  const [prebutton, setPrebutton] = useState(0);
  const [nextButton, setNextButton] = useState(true);
  // const [buttondis,setButtonDisbale] = useState(true)
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // console.log(Token)

  const getOneReport = (e,report) => {
    // console.log(report)
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
  const onSubmit = () => {
    // if(Token){
    http.get( Base_url +`/facility/getReport?page=${currentPage}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang,role:"facility" }
    })
      .then((res) => {
        
        setLoading(false);
        setReport(res.data[0]?.data)
        // setTotal(res.data[0]?.metadata[0].total)
        setNextButton(res.data[0]?.metadata[0].hasMoreData)
        setPrebutton(res.data[0]?.metadata[0].page)

        enqueueSnackbar(
          res.data.message,
          { variant: "success" },
          { autoHideDuration: 100 }
        );
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error)
        if (error.response) {
          return false;
          enqueueSnackbar(
            error.response.data.message,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      })
    // }
  }
  useEffect(() => {
    onSubmit()
    // setLoading(false);  
  }, [currentPage])
  return (
    <section className='ptb40'>
      {/* <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0'>
              <Input placeholder={t('table_title.Facility_search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div> */}
      <div className="custom_card mb30">
        <div className='mb30'>
          <Row>
            <Col className='text-center' md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }}>
              <h6 className='text-blue'>{t('facility_Dashboard.On_Call_Hours')}</h6>
              <h3>17:00 ~ 08:30</h3>
            </Col>
            <Col className='text-center' md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }}>
              <h6 className='text-success'>{t('facility_Dashboard.Representative_Phone')}</h6>
              <h3>050-1808-5051</h3>
            </Col>
            <Col className='text-center' md={{ span: 8 }} sm={{ span: 12 }} xs={{ span: 24 }}>
              <h6 className='text-danger'>{t('facility_Dashboard.Please_call_here_from')}</h6>
              <h3>090-9427-0315</h3>
            </Col>
          </Row>
        </div>
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Reports')}</h4>
          <div className="pagination_flex flex_item_cc">
          <a role='button' onClick={() => prebutton >1 ?  handleperviousPagination(1):""}  className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""}   disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">

          <div className="custom_table_wrapper">
          {loading==true ? <Loader /> :
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={report}
            onRow={(i) => ({
              onClick: (e) =>  {
                  // return navigate(PATH_FRONT.facilityReportDetails);
                  getOneReport(e,i)
                },
              })}
              locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}
              >
              <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status text-start'
                 render={(stat) =>
                  stat == 1 ? <span style={{ backgroundColor: "#cce6f2", padding: "3px 10px", borderRadius: "5px" }}>{t('Reports.InPreperation')}</span> :
                  stat == 2 ?  <span  style={{ backgroundColor: "#ccf2d6", padding: "3px 20px", borderRadius: "5px" }}>{t('Reports.Confrimed')} </span> : <span style={{ backgroundColor: "#f2dbcb", padding: "3px 13px", borderRadius: "5px", width: "100px" }}>{t('Reports.UnConfrimed')} </span>}
             ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"createdAt"} key={"day"} className='td_day text-start'
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
            </Table>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityDashboard

