import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider, Avatar } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { ja } from 'date-fns/locale';
import { format} from 'date-fns';
const lang = localStorage.getItem('i18nextLng')

function ReportDetails() {
  const { t, i18n } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  console.log(location, "locationlocationlocation");
  const data = location.state
  const navigate = useNavigate();
  console.log(data, "data");
  const pagename = data?.value

  const editreport = () => {
    data.mode = "edit";
    data.data = "confirmreport"
    navigate('/edit-report', { state: data })
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
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const generatePDF = () => {
  //   const avatarElement = document.getElementsByClassName('reportpage')[0];
  //   const avatarVisibility = avatarElement.style.visibility;
  //   avatarElement.style.visibility = 'visible';

  //   const avatarElementname = document.getElementsByClassName('reportpagename')[0];
  //   const avatarVisibilityname = avatarElementname.style.visibility;
  //   avatarElementname.style.visibility = 'hidden';

  //   const reportpdf = document.getElementsByClassName('reportpdf')[0];
  //   const avatarVisibilityreportpdf = reportpdf.style.visibility;
  //   reportpdf.style.visibility = 'visible';

  //   // return false; 
  //   console.log("button is clicked");
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const element = document.getElementById('pdf-content');
  //   html2canvas(element).then((canvas) => {
  //     const imageData = canvas.toDataURL('image/png');
  //     pdf.addImage(imageData, 'PNG', 10, 10, 260, 310);
  //     const fileName = `${data?.facility_data?.name}.pdf`;
  //     pdf.save(fileName);
  //     avatarElement.style.visibility = avatarVisibility;
  //     avatarElementname.style.visibility = avatarVisibilityname;
  //     reportpdf.style.visibility = avatarVisibilityreportpdf;
  //   });
  //   if (pagename == "loglist") {
  //     navigate("/log-list")
  //   }
  // };


const generatePDF = async () => {
  const avatarElement = document.getElementsByClassName('reportpage')[0];
  const avatarVisibility = avatarElement.style.visibility;
  avatarElement.style.visibility = 'visible';

  const avatarElementname = document.getElementsByClassName('reportpagename')[0];
  const avatarVisibilityname = avatarElementname.style.visibility;
  avatarElementname.style.visibility = 'hidden';

  const reportpdf = document.getElementsByClassName('reportpdf')[0];
  const avatarVisibilityreportpdf = reportpdf.style.visibility;
  reportpdf.style.visibility = 'visible';

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const element = document.getElementById('pdf-content');
  const pages = Array.from(element.children);
  console.log(pages);

  const addImageToPDF = async (pdf, page) => {
    const canvas = await html2canvas(page, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size dimensions
    pdf.addPage();
  };

  for (let i = 0; i < pages.length; i++) {
    await addImageToPDF(pdf, pages[i]);
  }

  pdf.deletePage(pdf.internal.getNumberOfPages()); // Remove the last blank page

  const fileName = `${data?.facility_data?.name}.pdf`;
  pdf.save(fileName);

  avatarElement.style.visibility = avatarVisibility;
  avatarElementname.style.visibility = avatarVisibilityname;
  reportpdf.style.visibility = avatarVisibilityreportpdf;

  if (pagename === "loglist") {
    navigate("/log-list");
  }
};

  

  
  
  
  
  

  
  
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            {pagename == "loglist" ? " " :
              <><Link to={PATH_FRONT.reportList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Reports.Back')}</Link>
                <Button onClick={editreport} to={PATH_FRONT.editReport} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('Reports.Editing')}</Button>
              </>}
            <Button onClick={generatePDF} className='btn-theme btn-with-icon btn-success flex-row' icon={<Add size="24" color="#ffffff" />}>{t('Reports.PDF')}</Button>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Reports.Report')}</h4>
        </div>
        <div className="custom_card_body" id='pdf-content'>
          <div className="mb30">
            <Avatar disabled={true} style={{ visibility: 'hidden', backgroundColor: "black", width: "270px", height: "60px", borderRadius: "0", border: "0" }} className='user_image reportpage w100' src={require('../../../../../assets/images//Logo.png')} />
            <span style={{ fontWeight: "bolder", fontSize: "49px", visibility: "hidden", marginLeft: "10px" }} className='reportpagename'>Medical Report</span>
            <label className='fs-16 mb10 reportpdf'>{t('Reports.Basic_Information')}</label>
            <div>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Facility_Name')}</label> <span>{data?.facility_data?.name}</span></li>
                    <li><label className='fs-16'>{t('Reports.Name_of_Facility')}</label> <span>{data?.nameOfFacility}</span></li>
                    <li><label className='fs-16'>{t('Reports.Address')}</label> <span>{data?.address}</span></li>
                    <li><label className='fs-16'>{t('Reports.Phone')}</label> <span>{data?.mobile}</span></li>
                    <li><label className='fs-16'>{t('Reports.Email')}.</label> <span>{data?.email}</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          <div className="mb30">
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Correspondent')}</label> <span>{data?.respondent_data?.name}</span></li>
                    <li><label className='fs-16'>{t('Reports.Response_Date')}</label> <span>{format(new Date(data?.createdAt), "yyyy'年'MMMd'日'ah:mm", { locale: ja }) }</span></li>
                    <li><label className='fs-16'>{t('Reports.Staff_name')}</label> <span>{data?.staffId }</span></li>
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
          <div>
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
          </div>
          <div className="">
            <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
            <div className="border_card">
              <Row>
                <Col span={24}>
                  <ul className='details_list' style={{ width: "100%" }}>
                    <li><label className='fs-16'>{t('Reports.Symptoms')}</label></li>

                    {data?.symptomsData?.map((r, index) => {

                      return (
                        <li >
                          <div style={{ width: "100%" }}>
                            <p style={{ paddingLeft: "10px", textTransform: "capitalize", fontSize: "14px", color: "black", fontWeight: 600 ,paddingBottom:"10px"}}>{index + 1}. &nbsp;{r?.symptoms}</p>
                            <div style={{ paddingLeft: "25px" }}>
                              {/* {r?.inputField &&
                                Object?.keys(r?.inputField)?.map((e) => { */}
                                  {/* console.log(r?.inputField[e], "eertergg"); */ }
                                  {/* return <p><span style={{ color: "black", fontSize: "14px" }}>{e}</span> : {r?.inputField[e]}</p>
                                })
                              } */}
                              {r?.radioButton &&
                                Object?.keys(r?.radioButton)?.map((e) => {
                                  {/* console.log(r?.radioButton[e], "eertergg"); */ }
                                  return <p><span style={{ color: "black", fontSize: "14px" }}>{e}</span> : {r?.radioButton[e] }</p>
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
                              index == data?.symptomsData.length - 1 ?
                                "" :                 <Col span={24} style={{color:"#707070"}}><Divider /></Col>

                            }
                          </div>
                        </li>

                      )

                      // console.log(r,"rr");
                    })}
                    {/* <li><label className='fs-16'>{t('Reports.Shoulder_respiration')}</label> <span>{lang == 'en' ? data?.respiratory == "1" ? "Yes" : " No" : data?.respiratory == "1" ? "はい" : "いいえ"}</span></li>
                    <li><label className='fs-16'>{t('Reports.cyanotic_fever')}</label> <span>{lang == 'en' ? data?.cyanosis == "1" ? "Yes" : " No" : data?.cyanosis == "1" ? "はい" : "いいえ"}</span></li> */}
                  </ul>
                </Col>
                <Col span={24} style={{color:"#707070"}}><Divider /></Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Memo')}</label> <span>{data?.memo ? data?.memo : "-"}</span></li>
                  </ul>
                </Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <label className='fs-16 mb10'>{t('Reports.Report_types')}</label>
                    <li style={{ paddingLeft: "15px" }}><label className='fs-16'>{t('Reports.Emergency_Rescue')}</label> <span>{lang == 'en' ? data?.reportType == "1" ? "Yes" : " No" : data?.reportType == "1" ? "はい" : "いいえ"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Facility_staff')}</label> <span>{data?.facilityStaff ? data?.facilityStaff : "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Comment')}</label> <span>{data?.comment ? data?.comment : "-"}</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default ReportDetails;
