import React, { useEffect, useState } from 'react'
import { Badge, Button, Checkbox, Col, DatePicker, Empty, Form, Input, Modal, Row, Select, Space, Table } from 'antd'
import { ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { useTranslation } from 'react-i18next'
import { PATH_FRONT } from '../../routes/path'
import { Link, useNavigate } from 'react-router-dom'
import SupportStatusChangeModal from '../modals/SupportStatusChangeModal'
import http from '../../../security/Http'
import moment from 'moment'
import { Spin } from 'antd';
import { format} from 'date-fns';
import { ja } from 'date-fns/locale';
import Highlighter from "react-highlight-words";
import Loader from '../../Loader'
import url from '../../../Development.json'
import  authStore  from '../../contexs/AuthProvider'
import 'moment/locale/ja';

const { Option } = Select;
const { TextArea } = Input;

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [supportStatusChangeModalOpen, setSupportStatusChangeModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagetoken, setpagetoken] = useState("");
  const [callhistory, setCallhistory] = useState([])
  const [shiftResponder, setShiftResponder] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [iscallLoading, setIscallLoading] = useState(true)
  const [isreportLoading, setIsreportLoading] = useState(true)
  const [isrespondtLoading, setIsrespondtLoading] = useState(true)
  const navigate = useNavigate();
  const authstore = authStore()


  var Token = authstore?.accessToken;
  // console.log(Token,"accesstoken");
  // const Token = localStorage.getItem('token')
  const lang = localStorage.getItem('i18nextLng')

  const [prebutton, setPrebutton] = useState("");
  const [nextButton, setNextButton] = useState("");
  const [prePageToken, setprePageToken] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [search, setSearch] = useState("");

  const [reportcurrentPage, setreportCurrentPage] = useState(1);
  const [report, setReport] = useState([])
  const [reporttotal, setreportTotal] = useState("");
  const [reportprebutton, setreportPrebutton] = useState(0);
  const [reportnextButton, setreportNextButton] = useState(true);

  const [missedcall, setMissedcall] = useState([])
  const [missedcurrentPage, setMissedCurrentPage] = useState(1);
  const [missednextButton, setMissedNextButton] = useState("");
  const [missedprebutton, setMissedPrebutton] = useState("");
  const [missedpagetoken, setMissedpagetoken] = useState("");
  const [missedprePageToken, setMissedprePageToken] = useState("");

  var currentDate = moment(moment.now()).format('MMMM DD,YYYY');
  currentDate = lang == 'en' ?  moment(currentDate).format('YYYY MMM, D') : moment(currentDate).locale('ja').format("YYYY'年'MMMDo")
  
  var today = moment(moment.now()).format('YYYY-MM-DD');
  const handlePagination = (increment) => {
    if (nextButton == undefined) {
      return false;
    } else {
      setCurrentPage((prevPage) => prevPage + increment);
    }
  };
  const handleperviousPagination = (increment) => {
    // console.log(prePageToken);
    // console.log(prebutton, "prebutton");
    if (prebutton == undefined) {
      return false;
    } else {
      setpagetoken(prePageToken);
      setCurrentPage(currentPage + increment);
      // console.log(currentPage,"currentPage");
    }
  };


  const missedhandlePagination = (increment) => {
    if (missednextButton == undefined) {
      return false;
    } else {
      setMissedCurrentPage((prevPage) => prevPage + increment);
    }
  };
  const missedhandleperviousPagination = (increment) => {
    // console.log("onclick");
    // console.log(missedprePageToken);
    // console.log(missedprebutton, "prebutton");
    if (missedprebutton == undefined || "") {
      return false;
    } else {
      setMissedpagetoken(missedprePageToken);
      setMissedCurrentPage(missedcurrentPage + increment);
      // console.log(currentPage,"currentPage");
    }
  };
  const getoneuser = (report) => {
    navigate("/staff-details", { state: report });
  }

  const callhistorys = () => {
    http.get(process.env.REACT_APP_BASE_URL + `/admin/callHistory?page=${currentPage}&&pageToken=${pagetoken}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setIscallLoading(false);
        // console.log(res?.data?.data);
        setNextButton(res?.data?.data?.nextPageUrl)
        setPrebutton(res?.data?.data?.previousPageUrl)

        let prePage = res?.data?.data?.previousPageUrl;
        var url = res?.data?.data?.nextPageUrl
        // console.log(url); 
        var searchParams;
        var searchParams2;
        if (url !== undefined) {
          searchParams = new URLSearchParams(new URL(res?.data?.data?.nextPageUrl)?.search);
        }
        if (prePage !== undefined) {
          searchParams2 = new URLSearchParams(new URL(res?.data?.data?.previousPageUrl)?.search);
        }
        if (searchParams && searchParams.get) {
          const pageToken = searchParams.get('PageToken');
          // console.log(pageToken);
          setpagetoken(pageToken);
        } else {
          // console.log("error")
        }

        if (searchParams2 && searchParams2?.get) {
          var pageToken2 = searchParams2?.get('PageToken');

          setprePageToken(pageToken2)
        }

        // console.log(res?.data?.data?.instances);
        setCallhistory(res?.data?.data?.instances)
      })
  }
  const getShiftResponder = () => {
    http.get(process.env.REACT_APP_BASE_URL + `/admin/responderShift?page=${1}&&startDay=${today}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res?.data,"Responder");
        // console.log(res?.data,"resssssssssssssssss");
        setShiftResponder(res?.data)
      })
  }

  
  const getreportdetails = (report) => {
    navigate("/report-details ", { state: report });
  }
  const getonefacility = (report) => {
    const data ={
      report:report,
      Token:Token
    }
    navigate("/facility-details", { state: data });
  }
  const  nameselectedrespont = (n) => {
    navigate("/staff-details", { state: n });
  }

  const handlereportPagination = (increment) => {
    if (reportprebutton == false) {
      return false;
    } else {
      setreportCurrentPage((prevPage) => prevPage + increment);
    }
  };
  const handlereportperviousPagination = (increment) => {
    if (reportnextButton == 0) {
      return false;
    } else {
      setreportCurrentPage(reportcurrentPage - increment);
    }
  };
  const getreport = () => {

    http.get(process.env.REACT_APP_BASE_URL + `/admin/getReport?page=${reportcurrentPage}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
 
    
      .then((res) => {
        setIsreportLoading(false);
        // console.log(res.data[0].data);
        setReport(res.data[0].data)
        setreportTotal(res.data[0].metadata[0].total)
        setreportPrebutton(res.data[0].metadata[0].hasMoreData)
        setreportNextButton(res.data[0].metadata[0].page)
      })
      .catch((error) => {
        if (error.response) {
          return false;
        }
      })

  }
  function setFilter(e){
    setSearch(e.target.value);
}


  const getmissedcall = () => {

    http.get(process.env.REACT_APP_BASE_URL + `/admin/missedCallHistory?page=${missedcurrentPage}&&pageToken=${missedpagetoken}&&search=${search}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })

      .then((res) => {
        // console.log(res?.data?.data?.instances, "missedcall api");
        // console.log(res?.data?.data?.nextPageUrl,"res?.data?.data?.nextPageUrl");
        // console.log(res?.data?.data?.previousPageUrl,"");
        setMissedNextButton(res?.data?.data?.nextPageUrl)
        setMissedPrebutton(res?.data?.data?.previousPageUrl)
        setIsLoading(false);

        let prePage = res?.data?.data?.previousPageUrl;
        var url = res?.data?.data?.nextPageUrl
        // console.log(url); 
        var searchParams;
        var searchParams2;
        if (url !== undefined) {
          searchParams = new URLSearchParams(new URL(res?.data?.data?.nextPageUrl)?.search);
        }
        if (prePage !== undefined) {
          searchParams2 = new URLSearchParams(new URL(res?.data?.data?.previousPageUrl)?.search);
        }
        if (searchParams && searchParams.get) {
          const pageToken = searchParams.get('PageToken');
          // console.log(pageToken);
          setMissedpagetoken(pageToken);
        } else {
          // console.log("error")
        }

        if (searchParams2 && searchParams2?.get) {
          var pageToken2 = searchParams2?.get('PageToken');

          setMissedprePageToken(pageToken2)
        }

        setMissedcall(res?.data?.data?.instances)
      })
      .catch((error) => {
        if (error.response) {
          return false;
        }
      })

  }

  const deleterecord = (e) => {
    // console.log(e,"eeeeeee");
    const sid = e?.sid 
    http.callApi(url.deletemisscall, {sid}, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res?.data, "res delete");
        // setPlan(res?.data);
        //setIsLoading(true);
        let updatedMissedcall = missedcall.filter((item) => item.sid !== sid);
        setMissedcall(updatedMissedcall)
      })
      .catch((errors) => {
        console.log(errors?.response)
      }
      )
  } 





  useEffect(() => {
    getmissedcall()
  }, [missedcurrentPage])
  useEffect(() => {
    getreport()
  }, [reportcurrentPage])

  useEffect(() => {
    callhistorys()
  }, [currentPage])

  useEffect(() => {
    getShiftResponder()
  }, [])





  let getStatusText

  lang == "en" ?
    getStatusText = (status) => {
      switch (status) {
        case 0:
          return <span style={{ backgroundColor: "#f2dbcb", padding: "3px 13px", borderRadius: "5px", width: "100px" }}>Unconfirmed</span>;
        case 1:
          return <span style={{ backgroundColor: "#cce6f2", padding: "3px 10px", borderRadius: "5px" }}>In Preparation</span>;
        case 2:
          return <span style={{ backgroundColor: "#ccf2d6", padding: "3px 20px", borderRadius: "5px" }}>Completed</span>;
        default:
          return null;
      }
    } :
    getStatusText = (status) => {
      switch (status) {
        case 0:
          return <span style={{ backgroundColor: "#f2dbcb", padding: "3px 13px", borderRadius: "5px", width: "100px" }}>未確認</span>;
        case 1:
          return <span style={{ backgroundColor: "#cce6f2", padding: "3px 10px", borderRadius: "5px" }}>準備中</span>;
        case 2:
          return <span style={{ backgroundColor: "#ccf2d6", padding: "3px 20px", borderRadius: "5px" }}>完了</span>;
        default:
          return null;
      }
    }

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
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
    
      <div className="fliter_box_card mb30">
    
        {/* <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0'>
              <Input onChange={setFilter} placeholder={t('table_title.No_Facility_Name_Yomi')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button onClick={getmissedcall} type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('dashboard.Search')}</Button>
            </Form.Item>
          </Space>
        </Form> */}
      </div>
      <div className="custom_card mb30">
     
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Missed_Calls')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => missedprebutton ? missedhandleperviousPagination(-1) : ""} className={`flex_item_cc prev_btn gap1 ${missedprebutton === 0 ? 'disabled' : ''}`} ><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => missednextButton ? missedhandlePagination(1) : ""} disabled={!missednextButton} className={`flex_item_cc next_btn gap1 ${missednextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper" style={{textAlign:"center"}}>
              {isLoading == true ?    <Loader /> : <>
            <Table className='text-nowrap' pagination={false} dataSource={missedcall} locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}>
              <Column title={t('table_title.Name_of_facility')} dataIndex={"facilityName"}
                render={(_, e) => <a style={{ color: "#ed1111" }} onClick={() => getonefacility(e)} to={""}>
                  <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={e?.facility_data?.name}
                />
                {/* {e?.facility_data?.name} */}

                
                </a>}
                key={"facilityName"} className='td_facility_name' ></Column>
              <Column title={t('table_title.Date')} dataIndex={"day"}
                render={(_, e) => {
                  // var contractStartDate = e?.facility_data?.contractStartDate;
                  var contractStartDate = e?.dateCreated;
                  let dt="";
                  if(contractStartDate){

                   dt = lang == 'en' ? format(new Date(contractStartDate), "yyyy-MMM-d h:mm a") : format(new Date(contractStartDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  }
                  // return 
                  return(
                  <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[search]}
                    autoEscape={true}
                    textToHighlight={dt}
                  />
                  )
                  
                }}
                key={"day"} className='td_day'></Column>
              <Column title={t('table_title.Button')} dataIndex={"time"} key={"time"} className='td_time'
              render={(_,e) => (
                <Button onClick={()=>deleterecord(e)} className="btn-theme btn-sm btn-with-icon btn-danger" style={{ marginLeft: "auto" }}>
                  {t('table_title.Delete')}
                </Button>
                  )} >
              </Column>
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table></>}
          </div>
        </div>
      </div>
       {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Incoming_call_history')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton ? handleperviousPagination(-1) : ""} className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""} disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
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
          {iscallLoading == true ?    <Loader /> : <>
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={callhistory} locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}>
              
              {/* <Column ellipsis={true} title={t('table_title.Status')}
                render={(item, data) => <a onClick={() => setSupportStatusChangeModalOpen(true)}>
                {
                  data?.status == 'completed' ? t('Call.Completed') : 
                  data?.status == 'failed' ? t('Call.Failed') :
                  data?.status == 'queued' ? t('Call.Queued') :
                  data?.status == 'ringing' ? t('Call.Ringing') :
                  data?.status == 'in-progress' ? t('Call.InProgress') :
                  data?.status == 'busy' ? t('Call.Busy') :
                  data?.status == 'no-answer' ? t('Call.NoAnswer') :
                  data?.status == 'canceled' ? t('Call.Canceled') :t('Call.Unanswered') 
                }
                </a>
                }
                dataIndex={"status"} key={"status"} className='td_status text-start' ></Column> */}
              <Column ellipsis={true} title={t('table_title.Corresponding_Person')} dataIndex={"from"} key={"responders"}
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getoneuser(e)} to={""}>{e?.respondent_data?.name}</a>}
                className='td_responders text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Name_of_facility')} dataIndex={"to"} key={"facilityName"}
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getonefacility(e)} to={""}>{e?.facility_data?.name}</a>}
                className='td_facility_name' format={"DD-MM-YYYY"} ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"dateCreated"} key={"day"} className='td_day'
                render={(text) => {
                 var tDate = text;
                 return lang == 'en' ? format(new Date(tDate), 'yyyy-MMM-d h:mm a') : format(new Date(tDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  // return moment(text).format("MMM DD YYYY h:mm A");
                }}
              ></Column>
              {/* <Column title={t('table_title.Time')} dataIndex={"time"} key={"time"} className='td_time' ></Column> */}
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table></>}
          </div>
        </div>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Report_List')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton > 1 ? handlereportperviousPagination(1) : ""} className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlereportPagination(1) : ""} disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
          {isreportLoading == true ?    <Loader /> : <>
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={report} locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}>
              <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"}
                render={(_, e) => <a onClick={() => getreportdetails(e)} to={""}>{getStatusText(e.status)}</a>} className='td_status text-start' ></Column>
              <Column title={t('table_title.FirstAid')} dataIndex={"reportType"} key={"reportType"} className='td_time text-start'
                render={(e) => (
                  lang === "en" ? (e == 1 ? <p><span style={{ color: "red" }}>First Aid</span></p> : "") : (e === 1 ? <p><span style={{ color: "red" }}>救急搬送</span></p> : null)
                )}
              ></Column>
              <Column ellipsis={true} title={t('table_title.Corresponding_Person')} dataIndex={"staffId"} key={"responders"}
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getoneuser(e)} to={""}>{e?.respondent_data?.name}</a>}
                className='td_responders text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Name_of_facility')} dataIndex={["facility_data", "name"]} key={"facilityName"}
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getonefacility(e)} to={""}>{e?.facility_data?.name}</a>}
                className='td_facility_name' ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"createdAt"} key={"day"} className='td_day'
                render={(text) => {
                  var tDate = text;
                 return lang == 'en' ? format(new Date(tDate), 'yyyy-MMM-d h:mm a') : format(new Date(tDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  
                }}
              ></Column>
              {/* <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"} className='td_action' ></Column> */}
            </Table></>}
          </div>
        </div>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          {/* <h4>{t('table_title.March_20_2023_shift')}</h4> */}
          <h4>{t(currentDate)}</h4>
          <p> {t('table_title.It_will_be_updated_at_13_00_PM_the_next_day')}</p>
        </div>
        <div className="custom_card_body p0" style={{ border: "none" }}>
          <div className="custom_table_wrapper leader_and_responder_table">
            {/* <Table showHeader={false} scroll={{ x: 900 }} defaultExpandAllRows={true} showExpandColumn={false} className='text-nowrap' pagination={false} dataSource={shiftResponder}> */}
            {/* <Column title={t('table_title.Responder')} dataIndex={"shiftTime"} key={"shiftTime"}
                render={(_, data) => data?.shiftName[0] + " : " + data?.shift_data[0].startTime + " ~ " + data?.shift_data[0].endTime}
                className='td_responders text-start' ></Column>
              <Column
                title={t('table_title.Responder')}
                render={(_, data) => (
                  <div className="name-wrapper">
                    {data?.name.length > 1 && <span className="name-padding" />}
                    {data?.name.map((name, index) => (
                      <span key={index} className="name" style={{margin:"0 5px"}}>
                        {name}
                      </span>
                    ))}
                    {data?.name.length > 1 && <span className="name-padding" />}
                  </div>
                )}
                dataIndex="responders1"
                key="responders1"
                className="td_responders text-start"
              ></Column> */}
            {/* <Column title={t('table_title.Responder')} dataIndex={"responders2"} key={"responders2"} className='td_responders' ></Column>
              <Column title={t('table_title.Responder')} dataIndex={"responders3"} key={"responders3"} className='td_responders' ></Column>
              <Column title={t('table_title.Responder')} dataIndex={"responders4"} key={"responders4"} className='td_responders'></Column> */}
            {/* </Table> */}
          </div>
          <div className="leader_and_responder_table shift_badge_list">
          {
            shiftResponder.length ==0 ? 
            <div className=" responder_item border_card mb16">
              <div class="css-dev-only-do-not-override-w8mnev ant-empty ant-empty-normal" ><div class="ant-empty-image"><svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 1)" fill="none" fill-rule="evenodd"><ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse><g fill-rule="nonzero" stroke="#d9d9d9"><path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path><path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#fafafa"></path></g></g></svg></div><div class="ant-empty-description">{t('Reports.No_Data')}</div></div>
              </div>: 
                  shiftResponder.map((r) => {
                    {/* const badgeClass = `shift_badge mb10 badge_${r?.shiftName[0] === 'A' ? 'primary' : r?.shiftName[0] === 'B' ? 'success' : r?.shiftName[0] === 'C' ? 'warning' : r?.shiftName[0] === 'D' ? 'danger' : 'default'}`; */}
                    const badgeClass = `shift_badge mb10 badge_${r?.shiftName === 'A' ? 'primary' : r?.shiftName === 'B' ? 'success' : r?.shiftName === 'C' ? 'warning' : r?.shiftName === 'D' ? 'danger' : 'default'}`;

                    return (
                      <div className="responder_item border_card mb16">
                        <span className={badgeClass}>{r?.shiftName} : {r?.shift_data?.startTime} ~ {r?.shift_data?.endTime}</span>
                        <h6 className='text-danger fs-16 mb10'>{t('table_title.Leader')}</h6>
                        <ul className="responder_list">
                        
                          {r?.shift_staff_data?.map((n) => {
                            if (n === "") {
                              return <li>Data Not Found</li>;
                            }
                            return (
                              <li>
                                <a onClick={()=> n?.name=="-" ? "": nameselectedrespont(n)}  className=" fw-600 fs-16 mb10" to={ n?.name=="-" ?"": PATH_FRONT.staffDetails}>
                                  {n?.name}
                                </a>
                              </li>
                            );
                          })}
                        </ul>

                        {/* <ul className="responder_list">
                          {r?.shift_staff_data?.map((n) => {
                            if (n === "") {
                              return <li>Data Not Found</li>;
                            }
                            return (
                              <li>
                                <a  onClick={()=> nameselectedrespont(n)}  className=" fw-600 fs-16" to={PATH_FRONT.staffDetails}>
                                  {n?.name}
                                </a>
                              </li>
                            );
                          })}
                        </ul> */}
                      </div>
                    );
                  })
                }

   
                 
       
     
             
           
      {/* <div className="responder_item border_card mb16">
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
            </div> */}
    </div>
        </div >
      </div >
    <SupportStatusChangeModal modalOpenEvent={supportStatusChangeModalOpen} modalCloseEvent={setSupportStatusChangeModalOpen} />
    </section >
  )
}

export default Dashboard
