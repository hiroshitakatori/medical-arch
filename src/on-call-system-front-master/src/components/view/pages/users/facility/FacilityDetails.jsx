import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Empty } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http';
import moment from 'moment';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const lang = localStorage.getItem('i18nextLng')
const Token = localStorage.getItem('token')


function FacilityDetails() {
  const { t, i18n } = useTranslation();
  const naviagte = useNavigate();
  const [reportcurrentPage, setreportCurrentPage] = useState(1);
  const [report, setReport] = useState([])
  const [reporttotal, setreportTotal] = useState("");
  const [prebutton, setPrebutton] = useState("");
  const [nextButton, setNextButton] = useState("");
  const [reportprebutton, setreportPrebutton] = useState(0);
  const [reportnextButton, setreportNextButton] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagetoken, setpagetoken] = useState("");
  const [callhistory, setCallhistory] = useState([])
  const [nextPageToken, setNextPageToken] = useState("");
  const location = useLocation();
  console.log(report);
  const data = location.state.report
  const tokendata = location.state.Token
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // console.log(data)
  let facilityId = data?.facilityId || data?._id || data?.facility_data?._id;
  // console.log({facilityId})
  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const Adminname = parsedAdminData?.state?.userData?.name;
  var permission = parsedAdminData?.state?.permission;
  const currentDate = moment().format('YYYY-MM-DD');
  // console.log(currentDate);
  // console.log(moment(data?.terminationDate).format("YYYY-MM-DD")  <= currentDate)
  // let j = data?.terminationDate ? moment(data?.terminationDate).format("YYYY-MM-DD")  <= currentDate  ? "Not Display" :"Display" :"-"
  // console.log(j);
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
    naviagte('/edit-facility', { state: data })
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
    http.get(process.env.REACT_APP_BASE_URL + `/admin/reportByFacilityId?page=${reportcurrentPage}&&facilityId=${facilityId}`, [], {
      headers: { 'authorization': 'Bearer ' + tokendata, lang: lang }
    })

      .then((res) => {
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
  useEffect(() => {
    getreport()
  }, [reportcurrentPage])


  // function getStatusText(status) {
  //   switch (status) {
  //     case 0:
  //       return 'Unconfirmed';
  //     case 1:
  //       return 'In Preparation';
  //     case 2:
  //       return 'Completed';
  //     default:
  //       return '';
  //   }
  // }
  const getreportdetails = (report) => {
    navigate("/report-details ", { state: report });
  }

  const callhistorys = () => {
    // console.log({facilityId})
    http.get(process.env.REACT_APP_BASE_URL + `/admin/callHistoryByFacilityId?page=${currentPage}&&pageToken=${pagetoken}&&facilityId=${facilityId}`, [], {
      headers: { 'authorization': 'Bearer ' + tokendata, lang: lang }
    })
      .then((res) => {
        // console.log(res?.data?.data.instances);

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
          // console.log(pageToken2);

          setNextPageToken(pageToken2)
          // Handle the case when searchParams is undefined or get method is not available
          // console.log('Unable to retrieve PageToken');
        }
        setCallhistory(res?.data?.data?.instances)
      })
  }
  useEffect(() => {
    callhistorys()
  }, [currentPage])

  const getoneuser = (report) => {
    navigate("/staff-details", { state: report });
  }
  const getonefacility = (report) => {
    console.log(report,"Viral");
    navigate("/facility-details", { state: {report:report} });
  }
  const createreport = () => {
    console.log(data, "add-report");
    navigate("/add-report", { state: data });
  }


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



  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.facilityList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('table_title.Back')}</Link>
            {/* data?.terminationDate ? moment(data?.terminationDate).format("YYYY-MM-DD")  <= currentDate || data?.facility_data?.status == 0 ? */}
            {
              //data?.terminationDate || moment(data?.terminationDate).format("YYYY-MM-DD")  <= currentDate  ? ""
              //data?.status == 0 || data?.facility_data?.status == 0 ? "" 
              data?.terminationDate ? moment(data?.terminationDate).format("YYYY-MM-DD") <= currentDate ? ""
                :
                <>
                  <Button onClick={() => createreport()} to={PATH_FRONT.addReport} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" /> {t('table_title.Create_Report')}</Button>
                  {permission?.Facility?.substring(0, 1) == "1" ? <Button onClick={editstaffdetalis} to={PATH_FRONT.editFacility} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('table_title.Edit_Facility')} </Button> : ""}
                </>
                : <>
                  <Button onClick={() => createreport()} to={PATH_FRONT.addReport} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" /> {t('table_title.Create_Report')}</Button>
                  {permission?.Facility?.substring(0, 1) == "1" ? <Button onClick={editstaffdetalis} to={PATH_FRONT.editFacility} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('table_title.Edit_Facility')} </Button> : ""}
                </>
            }
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
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label><span>{data?.name ? data?.name : data?.facility_data?.name}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label><span>{data?.yomi ? data?.yomi : data?.facility_data.yomi}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label><span>{data?.facility_data?.address ? data?.facility_data?.address : data?.address}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label><span>{data?.facility_data?.mobile ? data?.facility_data?.mobile : data?.mobile}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone2')}</label><span>{data?.facility_data?.mobile2 ? data?.facility_data?.mobile2 : data?.mobile2}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label><span>{data?.facility_data?.email ? data?.facility_data?.email : data?.email}</span></li>
                  {/* <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>{data?.facility_data?.managerName ? data?.facility_data?.managerName : data?.managerName}</span></li> */}
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>{data?.managerName ? data?.managerName : data?.facility_data?.managerName}</span></li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label><span>{data?.facilityManagerName ? data?.facilityManagerName : data?.facility_data?.facilityManagerName}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label><span>{data?.contractDetails ? data?.contractDetails : data?.facility_data?.contractDetails}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>{data?.capacity ? data?.capacity : data?.facility_data?.capacity}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}</label><span>
                    {
                      data?.businessType ?
                        lang == "en"
                          ? data?.businessType == 1 ? "Special Nursing Home"
                            : data?.businessType == 2 ? "Short Stay"
                              : data?.businessType == 3 ? "Paid Nursing Home"
                                : "-"
                          : data?.businessType == 1 ? "特別養護老人ホーム"
                            : data?.businessType == 2 ? "ショートステイ"
                              : data?.businessType == 3 ? "有料老人ホーム"
                                : "-" :
                        lang == "en"
                          ? data?.facility_data?.businessType == 1 ? "Special Nursing Home"
                            : data?.facility_data?.businessType == 2 ? "Short Stay"
                              : data?.facility_data?.businessType == 3 ? "Paid Nursing Home"
                                : "-"
                          : data?.facility_data?.businessType == 1 ? "特別養護老人ホーム"
                            : data?.facility_data?.businessType == 2 ? "ショートステイ"
                              : data?.facility_data?.businessType == 3 ? "有料老人ホーム"
                                : "-"
                    }

                  </span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>
                    {data?.plan_data?.jname}</span></li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_facility_can_also_view')}</label>
            <div className="border_card">
              <p>{data?.memoForFacility ? data?.memoForFacility : data?.facility_data?.memoForFacility}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_viewable_by_staff_only')}</label>
            <div className="border_card">
              <p>{data?.memoForStaff ? data?.memoForStaff : data?.facility_data?.memoForStaff}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Affiliated_Facilities')}</label>
            <p>
              {

                data?.affiliatedFacilityname || data?.affiliatedFacility_data?.name || lang == "en" ? "none" : "なし"

              }
            </p>
          </div>
        </div>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.List_of_Past_Reports')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton > 1 ? handlereportperviousPagination(1) : ""} className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlereportPagination(1) : ""} disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={report} locale={{ emptyText: <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}>
              {/* <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} render={(_, e) => <a>{getStatusText(e.status)}</a>} className='td_status text-start' ></Column> */}
              <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"}
                render={(_, e) => <a onClick={() => getreportdetails(e)} to={""}>{getStatusText(e.status)}</a>}
                className='td_status text-start' ></Column>
              <Column ellipsis={true} title={t('table_title.Corresponding_Person')} dataIndex={"staffId"} key={"responders"} className='td_responders text-start'
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getoneuser(e)} to={""}>{e?.respondent_data?.name}</a>}
              ></Column>
              <Column ellipsis={true} title={t('table_title.Name_of_facility')} dataIndex={["facility_data", "name"]} key={"facilityName"} className='td_facility_name'
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getonefacility(e)} to={""}>{e?.facility_data?.name}</a>}
              ></Column>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"createdAt"} key={"day"} className='td_day'
                // render={(text) => {

                //   return moment(text).format("MMM DD YYYY h:mm A");
                // }

                render={(e) => {
                  let dt = "";
                  if (e) {

                    return dt = lang == 'en' ? format(new Date(e), "yyyy-MMM-d h:mm a") : format(new Date(e), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  }
                }}
              ></Column>
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
            <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={callhistory} locale={{ emptyText: <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}>
              <Column ellipsis={true} title={t('table_title.Date')} dataIndex={"dateCreated"} key={"day"} className='td_day text-start'

                render={(_, e) => {
                  // console.log(e)
                  // var contractStartDate = e?.facility_data?.contractStartDate;
                  var contractStartDate = e?.dateCreated;
                  let dt = "";
                  if (contractStartDate) {

                    return dt = lang == 'en' ? format(new Date(contractStartDate), "yyyy-MMM-d h:mm a") : format(new Date(contractStartDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  }
                }}
              ></Column>
              <Column ellipsis={true} title={t('table_title.Corresponding_Person')} dataIndex={"from"} key={"responders"}
                render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getoneuser(e)} to={""}>{e?.respondent_data?.name}</a>}
                className='td_responders text-start minw_auto' ></Column>
              {/* <Column ellipsis={true} title={t('table_title.Responders')} dataIndex={"responders"} key={"responders"} className='td_responders text-start minw_auto' ></Column> */}
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
