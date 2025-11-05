import React, { useEffect,useState } from 'react'
import { Badge, Button, Empty, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { PATH_FRONT } from '../../../../routes/path'
import { Link,useNavigate } from 'react-router-dom'
import moment from 'moment'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import { enqueueSnackbar } from "notistack";
import { Typography } from 'antd';
import Highlighter from "react-highlight-words";
import { format} from 'date-fns';
import { ja } from 'date-fns/locale';
import Loader from '../../../../Loader'
var Base_url = process.env.REACT_APP_BASE_URL;
const { Text } = Typography;

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
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  const lang = localStorage.getItem('i18nextLng')
  const Token = localStorage.getItem('token')

  const getoneuser = (report) => {
    navigate("/staff-details",{state:report});
  }

  const getonefacility = (report) => {
    console.log(report)
    navigate("/facility-details",{state:{report:report,Token:Token}});
  }

  const getreportdetails = (report) => {
    console.log(report,"report");
  if(report?.status == 1){
    report.data = "confirmreport"
    navigate("/edit-report ",{state:report});
  }else{
    navigate("/report-details ",{state:report});
  }
  }

  const onSubmit = () => {

    http.get( Base_url +`/admin/getReport?page=${currentPage}&&search=${search}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })

    .then((res) => {
      setIsLoading(false);
      setReport(res.data[0].data)
      setTotal(res.data[0].metadata[0].total)
      setNextButton(res.data[0].metadata[0].hasMoreData)
      setPrebutton(res.data[0].metadata[0].page)
        // enqueueSnackbar(
        //   res.data.message,
        //   { variant: "success" },
        //   { autoHideDuration: 1000 }
        // );
      })
      .catch((error) => {
        if (error.response) {
          // enqueueSnackbar(
          //   error.response.data.message,
          //   { variant: "error" },
          //   { autoHideDuration: 1000 }
          // );
        }
      })

  }
  function setFilter(e){
    setSearch(e.target.value);
}
  useEffect(() => {
    onSubmit()
  }, [currentPage])
  console.log(report)
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

  let getStatusText

  lang == "en" ?
   getStatusText =(status)=> {
    switch (status) {
      case 0:
        return <span style={{backgroundColor:"#f2dbcb",padding:"3px 13px", borderRadius:"5px" , width:"100px"}}>Unconfirmed</span>;
      case 1:
        return <span style={{backgroundColor:"#cce6f2",padding:"3px 10px", borderRadius:"5px"}}>In Preparation</span>;
      case 2:
        return <span style={{backgroundColor:"#ccf2d6",padding:"3px 20px", borderRadius:"5px"}}>Confirmed</span>;
      default:
        return null;
    }
  } :
   getStatusText =(status) => {
    switch (status) {
      case 0:
        return <span style={{backgroundColor:"#f2dbcb",padding:"3px 13px", borderRadius:"5px" , width:"100px"}}>未確認</span>;
      case 1:
        return <span style={{backgroundColor:"#cce6f2",padding:"3px 10px", borderRadius:"5px"}}>準備中</span>;
      case 2:
        return <span style={{backgroundColor:"#ccf2d6",padding:"3px 20px", borderRadius:"5px"}}>完了</span>;
      default:
        return null;
    }
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
              <Input onChange={setFilter}  placeholder={t('table_title.Facility_search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button onClick={onSubmit} type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.List_of_Reports')}</h4>
          <div className="pagination_flex flex_item_cc">
          <a role='button' onClick={() => prebutton >1 ?  handleperviousPagination(1):""}  className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""}   disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
          {   isLoading == true ?   <Loader /> : <>
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={report} locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}>
              <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} 
              render={(_, e) => <a   onClick={()=>getreportdetails(e)} to={""}>{getStatusText(e.status)}</a>}
                className='td_status text-start' ></Column>
              <Column title={t('table_title.FirstAid')} dataIndex={"reportType"} key={"reportType"} className='td_time text-start' 
            render={(e) => (
              lang === "en" ? (e == 1 ? <p><span style={{ color: "red" }}>First Aid</span></p> : "") : (e === 1 ? <p><span style={{ color: "red" }}>救急搬送</span></p> : null)
            )}
              ></Column>
              <Column title={t('table_title.Corresponding_Person')} dataIndex={["respondent_data", "name"]} key={"responders"} 
              render={(_, e) => <a style={{color:"#0638be"}} onClick={()=>getoneuser(e)} to={""}>
              
              <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={e?.respondent_data?.name}
                />
              
              </a>} 
              className='td_responders text-start' ></Column>
              <Column title={t('table_title.Name_of_facility')}   dataIndex={["facility_data", "name"]}
              render={(_, e) => <a style={{color:"#0638be"}} onClick={()=>getonefacility(e)} to={""}>
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[search]}
                  autoEscape={true}
                  textToHighlight={e?.facility_data?.name}
                />
              </a>} 
              key={"facilityName"} className='td_facility_name text-start' ></Column>
              <Column title={t('table_title.Date')} dataIndex={"createdAt"} key={"day"} className='td_day'
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
    </section>
  )
}

export default ReportList
