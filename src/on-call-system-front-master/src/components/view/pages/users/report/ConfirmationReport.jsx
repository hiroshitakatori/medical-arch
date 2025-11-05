import React, { useState } from 'react'
import { Button, Form, Row, Space, Col, Divider } from 'antd'
import { Add, ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ja } from 'date-fns/locale';
import { format} from 'date-fns';
import moment from 'moment';
import 'moment/locale/ja';

function ConfirmationReport() {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const data = location.state
  console.log(data, "dtaa");
  // console.log(data, "confrimation data");
  const navigate = useNavigate()
  const ID = data?._id
  const backclick = () => {
    if (ID) {
      location.state.data = "confirmreport"
      navigate('/edit-report', { state: location.state });
    } else {
      location.state.data = "confirmreport"
      navigate('/add-report', { state: location.state });
    }
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  const lang = localStorage.getItem('i18nextLng')

  
  const addreport = () => {
    setIsLoading(true);

      data.status = 0
   
    const Token = localStorage.getItem('token')
    http.callApi(data?._id ? url.editreport : url.addreport, data, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setIsLoading(false);
        navigate('/report-list')
        enqueueSnackbar(
          res.data.message,
          { variant: "success" },
          { autoHideDuration: 1000 }
        )
      }
      )
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


console.log(data?.respondentDate);
  return (
    <section className='ptb40'>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Reports.Report_Content_Confirmation')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Basic_Information')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Facility_Name')}</label> <span>{data?.facilityName}</span></li>
                    <li><label className='fs-16'>{t('Reports.Name_of_Facility')}</label> <span>{data?.nameOfFacility}</span></li>
                    <li><label className='fs-16'>{t('Reports.Address')}</label> <span>{data?.address}</span></li>
                    <li><label className='fs-16'>{t('Reports.Phone')}</label> <span>{data?.mobile}</span></li>
                    <li><label className='fs-16'>{t('Reports.Email')}</label> <span>{data?.email}</span></li>
                  </ul>
                </Col>
                <Col span={24}><Divider /></Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Correspondent')}</label> <span>{data?.resoptionsname}</span></li>
                    <li><label className='fs-16'>{t('Reports.Response_Date')}</label> <span>{moment(data?.respondentDate, 'YYYY-MM-DD HH:mm a').locale('ja').format("YYYY'年'MMMDo a h:mm") }</span></li>
                    <li><label className='fs-16'>{t('Reports.Staff_name')}</label> <span>{data?.staffName}</span></li>
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
                    {/* <li><label className='fs-16'>{t('Reports.Temperature')}</label> <span>{data?.temperature} ℃</span></li>
                    <li><label className='fs-16'>{t('Reports.Blood_pressure')}</label> <span>{data?.bp} MmHg</span></li>
                    <li><label className='fs-16'>{t('Reports.Pulse')}</label> <span>{data?.pulse} 回/分</span></li>
                    <li><label className='fs-16'>{t('Reports.SPO2')}</label> <span>{data?.sp02} ％</span></li> */}

                    <li><label className='fs-16'>{t('Reports.Temperature')}</label> <span>{data?.temperature ? data?.temperature +"℃" : "-" } </span></li>
                    <li><label className='fs-16'>{t('Reports.Blood_pressure')}</label> <span>{data?.bp ? data?.bp +" MmHg" : "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Pulse')}</label> <span>{data?.pulse  ? data?.pulse +" 回/分" : "-"} </span></li>
                    <li><label className='fs-16'>{t('Reports.SPO2')}</label> <span>{data?.sp02 ? data?.sp02+ " ％" : "-"} </span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
            <div className="border_card">
              <Row>
                <Col span={24}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Symptoms')}</label></li>

                    {data?.symptomsData?.map((r,index) => {

                      return (
                        <li>
                          <div style={{ width: "100%" }}>
                            <h6 style={{paddingBottom:"10px"}}>{index + 1}. &nbsp;{r?.symptoms}</h6>
                            <div>
                              
                              {r?.radioButton &&
                                Object?.keys(r?.radioButton)?.map((e) => {
                                  return <p><span style={{ color: "black", fontSize: "16px" }}>{e}</span> : {r?.radioButton[e]}</p>
                                })
                              }
                              {/* <p style={{ fontWeight: "bolder", color: "black" }}>Emergancy Transport</p>
                              <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                                {r?.EmergancyTransport?.map((e) => {
                                  return <li>{e}</li>
                                })
                                }
                              </ul> */}

                            </div>
                            {/* <div>
                              <p style={{ fontWeight: "bolder", color: "black", paddingTop: "10px" }}>Response</p>
                              <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                                {r?.response?.map((e) => {
                                  return <li>{e}</li>
                                })
                                }
                              </ul>

                            </div> */}
                          </div>
                        </li>

                      )

                      // console.log(r,"rr");
                    })}
                    {/* <li><label className='fs-16'>{t('Reports.Shoulder_respiration')}</label> <span>{lang == 'en' ? data?.respiratory == "1" ? "Yes" : " No" : data?.respiratory == "1" ? "はい" : "いいえ"}</span></li>
                    <li><label className='fs-16'>{t('Reports.cyanotic_fever')}</label> <span>{lang == 'en' ? data?.cyanosis == "1" ? "Yes" : " No" : data?.cyanosis == "1" ? "はい" : "いいえ"}</span></li> */}
                  </ul>
                </Col>
                <Col style={{ color: "#707070"}} span={24}><Divider /></Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Memo')}</label> <span>{data?.memo ? data?.memo : "-"}</span></li>
                  </ul>
                </Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <label className='fs-16 mb10'>{t('Reports.Report_types')}</label>
                    <li style={{ paddingLeft: "15px" }}><label className='fs-16'>{t('Reports.Emergency_Rescue')}</label> <span>{lang == 'en' ? data?.reportType == "1" ? "Yes" : " No" : data?.reportType == "1" ? "はい" : "いいえ"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Facility_staff')}</label> <span>{data?.facilitystaff ? data?.facilitystaff : "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Comment')}</label> <span>{data?.comment ? data?.comment : "-"}</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="flex_item_ce flex-wrap">
            <Button onClick={backclick} className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.addReport}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Correction')}</Button>
            {isLoading == true ?
            
              <Button disabled onClick={addreport} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.reportList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Submission')}<Spin style={{color:"#fff"}} indicator={antIcon} /></Button>
             : <Button onClick={addreport} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.reportList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Submission')}</Button>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfirmationReport;
