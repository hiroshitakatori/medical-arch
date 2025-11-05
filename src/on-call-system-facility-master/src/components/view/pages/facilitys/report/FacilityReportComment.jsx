import React, { useState,useEffect } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider, Select, Input, Checkbox } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http';
import { enqueueSnackbar } from "notistack";

import url from "../../../../../Development.json"
import moment from 'moment';
import { ja } from 'date-fns/locale';
import { format} from 'date-fns';

var Base_url = process.env.REACT_APP_BASE_URL;

const { TextArea } = Input
const { Option } = Select

function FacilityReportComment() {
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem('i18nextLng')
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Isconfrim, setIsconfrim] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  var data = location.state;
  // console.log(data)
  // const [checked, setChecked] = useState(false);

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const reportDetails = () => {
    navigate('/facility/report-details', { state: data })
  }
  const commentOnReport = (values) => {
    values._id = data?._id;
    values.status = Isconfrim ==true ?2:0;
    const Token = localStorage.getItem('token')
    http.callApi(url.commentOnReport, values, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        data.comment = values.comment;
        data._id = values._id;
        data.facilityStaff = values.facilityStaff;
        data.comment = values.comment;
        data.status = Isconfrim ==true ?2:0;
        
        navigate('/facility/report-details', { state: data })

        enqueueSnackbar(
          lang == "en" ? "Report updated successfully" : "レポートが正常に更新されました",
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
  var confrimation = (e) => {
    e.target.checked ? setIsconfrim(true) : setIsconfrim(false);
  }
  useEffect(() => {
    if (location.state) {
      form.setFieldsValue({ comment: location.state.comment ? location.state.comment : "" }); 
      form.setFieldsValue({ facilityStaff: location.state.facilityStaff ? location.state.facilityStaff : "" }); 
      if (location?.state?.status === 2) {
        setIsconfrim(true)
      }
    }
  },[ location.state])
  return (
    <section className='ptb40'>
      {/* <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.reportList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Reports.Back')}</Link>
            <Link to={PATH_FRONT.editReport} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('Reports.Editing')}</Link>
            <Button className='btn-theme btn-with-icon btn-success flex-row' icon={<Add size="24" color="#ffffff" />}>{t('Reports.PDF')}</Button>
          </Space>
        </Form>
      </div> */}
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Reports.Report')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Basic_Information')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Facility_Name')}</label> <span>{data?.facility_data?.name}</span></li>
                    <li><label className='fs-16'>{t('Reports.Name_of_Facility')}</label> <span>{data?.nameOfFacility}</span></li>
                    <li><label className='fs-16'>{t('Reports.Address')}</label> <span>{data?.address || "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Phone')}</label> <span>{data?.mobile || "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Email')}.</label> <span>{data?.email || "-"}</span></li>
                  </ul>
                </Col>
                <Col span={24}><Divider /></Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Correspondent')}</label> <span>{data?.respondent_data?.name || "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Response_Date')}</label> <span>
                    {/* {moment(data?.respondentDate).format('YYYY-MM-DD')} */}
                    {format(new Date(data?.respondentDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja }) }
                    </span></li>
                    <li><label className='fs-16'>{t('Reports.Staff_name')}</label> <span>{data?.staffId}</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Resident_information')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Name')}</label> <span>{data?.residentName}</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Vitals')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                  <li><label className='fs-16'>{t('Reports.Temperature')}</label> <span>{data?.temperature ? data?.temperature +"℃" : "-" } </span></li>
                    <li><label className='fs-16'>{t('Reports.Blood_pressure')}</label> <span>{data?.bp ? data?.bp +" MmHg" : "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Pulse')}</label> <span>{data?.pulse  ? data?.pulse +" 回/分" : "-"} </span></li>
                    <li><label className='fs-16'>{t('Reports.SPO2')}</label> <span>{data?.sp02 ? data?.sp02+ " ％" : "-"} </span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="">
            <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
            <div className="border_card">
              <Form layout='vertical' form={form} autoComplete="off" onFinish={commentOnReport}>
                <Row gutter={16}>

                <Col span={24}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Symptoms')}</label></li>

                    {data?.symptomsData?.map((r,index) => {

                      return (
                        <li >
                          <div style={{ width: "100%" }}>
                            <p style={{paddingLeft:"10px" , textTransform: "capitalize", fontSize:"14px", color:"black",fontWeight:600,paddingBottom:"10px"}}>{index+1}. &nbsp;{r?.symptoms}</p>
                            <div style={{paddingLeft:"25px"}}>
                              {r?.inputField &&
                                Object?.keys(r?.inputField)?.map((e) => {
                                  {/* console.log(r?.inputField[e], "eertergg"); */ }
                                  return <p><span style={{ color: "black", fontSize: "14px" }}>{e}</span> : {r?.inputField[e]}</p>
                                })
                              }
                              {r?.radioButton &&
                                Object?.keys(r?.radioButton)?.map((e) => {
                                  {/* console.log(r?.radioButton[e], "eertergg"); */ }
                                  return <p><span style={{ color: "black", fontSize: "14px" }}>{e}</span> : {r?.radioButton[e] == 1 ? t('Reports.Yes') : t('Reports.None')}</p>
                                })
                              }
                              {/* <p style={{ fontWeight: "bolder", color: "black" }}>{lang == "en" ? "Emergency transport" : "緊急搬送"}</p>
                              <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                                {r?.EmergancyTransport?.map((e) => {
                                  return <li>{e}</li>
                                })
                                }
                              </ul> */}

                            </div>
                            {/* <div>
                              <p style={{ fontWeight: "bolder", color: "black", paddingTop: "10px" }}>{lang == "en" ? "Response" : "応答"}</p>
                              <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                                {r?.response?.map((e) => {
                                  return <li>{e}</li>
                                })
                                }
                              </ul>
                            </div> */}
                            {
                              index==data?.symptomsData.length-1?
                              "":<Col span={24} style={{color:"#707070"}}><Divider /></Col>
                            } 
                        </div>
                        </li>

                  )
                    })}
                  
                </ul>
              </Col>
                         
              <Col span={24}><Divider /></Col>
              
                  
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                  <Row>
                    <Col span={18}>
                        <ul className='details_list'>
                          <li><label className='fs-16'>{t('Reports.Memo')}</label> <span>{data?.memo}</span></li>
                        </ul>
                    </Col>
                  </Row>
                    <Form.Item className='mb16' required label={t('dashboard.Facility_Staff')} name="facilityStaff"
                      rules={[
                        {
                          required: true,
                          message: lang === "en" ? "Facility Staff Id Is Required" : "スタッフIDは必須です",
                        },
                      ]}
                    >
                      <Input type="text" placeholder={t('dashboard.Facility_Staff')} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                    <Form.Item className='mb16' required label={t('dashboard.Comment')} name="comment" rules={[
                      {
                        required: true,
                        message: lang === "en" ? t('Comment Is Required') : "コメントは必須です",
                      },
                    ]}>
                      <TextArea type="text" rows={4} placeholder={t('dashboard.Please_describe_progress_report_etc')} ></TextArea>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                    <Form.Item className='mb16' required label={t('dashboard.Confirmation')}>
                      <Checkbox  value={Isconfrim} checked={ Isconfrim  == true ? 1 : ""} onChange={confrimation}>{t('dashboard.Please_make_sure_to_check_the_box_after_confirmation')}</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item className="mb0">
                  <Space className="flex_item_ce flex-wrap">
                    <Button onClick={reportDetails} className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.facilityReportDetails}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Back')}</Button>
                    <Button htmlType='submit' className='btn-theme btn-with-icon btn-success' ><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('table_title.Completed')}</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityReportComment;
