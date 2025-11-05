import React, { useEffect, useState,useRef } from 'react'
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

function FacilityReportDetails() {
  const arraysmpatons = [{
    "symptoms": ""
  }]
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const ref = useRef();
  const options = {
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [alldata, setAlldata] = useState(arraysmpatons);

  // console.log(data)
  const lang = localStorage.getItem('i18nextLng')

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    if (location.state) {
      // form.setFieldsValue({key:{facilityId: location.state.facility_data?._id}, value:{facilityId: location.state.facility_data?.name} });


      if ((location?.state?.symptomsData)) {

        const tempAlldata = [];
        // Loop through each item in location.state.symptomsData
        location?.state?.symptomsData?.forEach((data, i) => {
          // Set the initial form values for each item
          form.setFieldsValue({ [`symptoms_${i}`]: data?.symptoms });
          if (data?.radioButton) {
            Object.keys(data.radioButton).forEach((key) => {
              form.setFieldsValue({ [key]: data.radioButton[key] });
            });
          }
          if (data?.inputField) {
            Object.keys(data.inputField).forEach((key) => {
              form.setFieldsValue({ [key]: data.inputField[key] });
            });
          }

          // Push the data to the temporary array
          tempAlldata.push({ symptoms: data?.symptoms });
        });

        // Update the state with the temporary array
        setAlldata(tempAlldata);
      }
    }

  }, [location.state]);
  // function createPage(doc, header, footer) {
  //   // doc.addPage();
  //   doc.setFontSize(12);
  //   doc.text(header, 10, 10);
  //   doc.text(footer, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
  // }
  // function addContent(doc, image, header, footer) {
  //   const image2 = image.toDataURL('image/jpeg');

  //   const contentHeight = doc.internal.pageSize.height - 20;
  //   const imageWidth = doc.internal.pageSize.width - 20;
  //   const imageHeight = (image2.naturalHeight / image2.naturalWidth) * imageWidth;
  //   let y = 20;

  //   for (let i = 0; i < imageHeight; i += contentHeight - 10) {
  //     if (y + 10 > contentHeight) {
  //       createPage(doc, header, footer);
  //       y = 20;
  //     }
  //     doc.addImage(image2, 'JPEG', 10, y, imageWidth, imageHeight);
  //     y += contentHeight;
  //   }
  // }

  const generatePDF = async () => {

    // const avatarElement = document.getElementsByClassName('reportpage')[0];
    // avatarElement.style.visibility = 'visible';

    // const avatarElementname = document.getElementsByClassName('reportpagename')[0];
    // avatarElementname.style.visibility = 'visible';

    // const reportpdf = document.getElementsByClassName('reportpdf')[0];
    // reportpdf.style.visibility = 'hidden';

    

    // Get the total height of the content
    // const totalHeight = element.scrollHeight;

    // Create an empty array to store the individual parts of the content
    const contentParts = [];

    // Split the content into parts that can fit within a single PDF page height (480 in this case)
    //  const contentHeight = element.clientHeight;

    // const totalPages = Math.ceil(content.clientHeight / pdf.internal.pageSize.getHeight());
    const contentElement = document.getElementById('pdf-content');
    
    const pdf = new jsPDF(options);
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentHeight = contentElement.clientHeight;
    let offset = 0;

  
    while (offset < contentHeight) {
      // console.log({pageHeight})

      const canvas = await html2canvas(contentElement, {
        windowWidth: contentElement.scrollWidth,
        windowHeight: window.innerHeight,
        scrollY: -offset,
      });

      const imageData = canvas.toDataURL('image/jpeg', 1.0);
      // console.log({imageData})
      pdf.addImage(imageData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), 0, null, 'FAST');

      offset +=window.innerHeight;;
      if (offset < contentHeight) {
        pdf.addPage();
      }
      
    }
  
    pdf.save('MedicalReport.pdf');
  };



  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const editprofilepage = () => {
    data.edit = "comment";
    navigate('/facility/report-comment', { state: data })
  }

  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.facilityReport} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Reports.Back')}</Link>
            <Button onClick={editprofilepage} to={PATH_FRONT.facilityReportComment} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('Facility_Information.Comment_Confirm')}</Button>

            <Button onClick={generatePDF} className='btn-theme btn-with-icon btn-success flex-row' icon={<Add size="24" color="#ffffff" />}>{t('Reports.PDF')}</Button>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Reports.Report')}</h4>
        </div>
        <div className="custom_card_body" id='pdf-content' >
          <div className="mb30">
            <Avatar disabled={true} style={{  backgroundColor: "black", width: "270px", height: "60px", borderRadius: "0", border: "0" }} className='user_image reportpage w100' src={require('../../../../../assets/images//Logo.png')} />
            <span style={{ fontWeight: "bolder", fontSize: "49px",  marginLeft: "10px" }} className='reportpagename'>Medical Report</span>
            <label className='fs-16 mb10 reportpdf'>{t('Reports.Basic_Information')}</label>
            <div className="border_card">
              <Row>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Facility_Name')}</label> <span>{data?.facility_data?.name}</span></li>
                    <li><label className='fs-16'>{t('Reports.Name_of_Facility')}</label> <span>{data?.nameOfFacility}</span></li>
                    <li><label className='fs-16'>{t('Reports.Address')}</label> <span>{data?.facility_data?.address || "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Phone')}</label> <span>{data?.facility_data?.mobile || "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Email')}.</label> <span>{data?.facility_data?.email || "-"}</span></li>
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
                    <li><label className='fs-16'>{t('Reports.Correspondent')}</label> <span>{data?.respondent_data?.name || "-"}</span></li>
                    <li><label className='fs-16'>{t('Reports.Response_Date')}</label> <span>
                    {format(new Date(data?.respondentDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja }) }
                    </span></li>
                    <li><label className='fs-16'>{t('Reports.Staff_name')}</label> <span>{data?.staff_data?.name}</span></li>
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
                    {/* <li><label className='fs-16'>{t('Reports.Yomi')}</label> <span>{data?.respondent_data?.yomi}</span></li> */}

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
              <Row>
                <Col span={24}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Symptoms')}</label></li>

                    {data?.symptomsData?.map((r, index) => {

                      return (
                        <li >
                          <div style={{ width: "100%" }}>
                            <p style={{ paddingLeft: "10px", textTransform: "capitalize", fontSize: "14px", color: "black", fontWeight: 600, paddingBottom: "10px" }}>{index + 1}.&nbsp;{r?.symptoms}</p>
                            <div style={{ paddingLeft: "25px" }}>
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
                              index == data?.symptomsData.length - 1 ?
                                "" : <Col span={24} style={{ color: "#707070" }}><Divider /></Col>
                            }
                          </div>
                        </li>

                      )
                    })}

                  </ul>
                </Col>
                <Col span={24}><Divider /></Col>
                <Col span={18}>
                  <ul className='details_list'>
                    <li><label className='fs-16'>{t('Reports.Memo')}</label> <span>{data?.memo}</span></li>
                    <li><label className='fs-16'>{t('Reports.Report_Types')}</label> <span></span></li>
                    <li style={{ paddingLeft: "15px" }}><label className='fs-16'>
                      {t('Reports.Emergency_Rescue')}</label>
                      <span>{lang == 'en' ? data?.reportType == "1" ? "Yes" : " No" : data?.reportType == "1" ? "はい" : "いいえ"}</span></li>

                    <li><label className='fs-16'>{t('Reports.Facility_staff')}</label> <span>{data?.facilityStaff}</span></li>
                    <li><label className='fs-16'>{t('Reports.Comment')}</label> <span>{data?.comment}</span></li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FacilityReportDetails;
