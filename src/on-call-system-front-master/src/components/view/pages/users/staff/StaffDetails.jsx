import React, { useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import pdfIcon from "../../../../../assets/images/PDF_file_icon.svg.png";
import authStore from '../../../../contexs/AuthProvider';
function StaffDetails() {
  const { t, i18n } = useTranslation();
  const naviagte = useNavigate();
  const location = useLocation();
  const data = location.state
  console.log(data);
  console.log(process.env.REACT_APP_FILE_PATH, "REACT_APP_FILE_PATH");
  const authstore = authStore()
  var permissionsData = authstore?.permission;
  const editpageclick = () => {
    naviagte('/edit-staff', { state: data })
  }
  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Link to={PATH_FRONT.staffList} className='btn-theme btn-with-icon btn-brown flex-row'><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Back')}</Link>
            {permissionsData?.Staff?.substring(0, 1) == "1" ?
            <Button onClick={editpageclick} to={PATH_FRONT.editStaff} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" /> {t('Staff.Editing')}</Button>
            :""}
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Staff.Correspondent')}</h4>
        </div>
        <div className="custom_card_body">
          <Row>
            <Col span={18}>
              <ul className='details_list'>
                <li><label className='fs-16'>{t('Staff.Name')}</label> <span>{data?.name ? data?.name : data?.respondent_data?.name}</span></li>
                {/* <li><label className='fs-16'>{t('Staff.Yomi')}</label> <span>{data?.yomi ?? data?.respondent_data?.yomi ?? '-'}</span></li> */}
                <li><label className='fs-16'>{t('Staff.ID')}</label> <span>{data?.uniqeId ?? data?.respondent_data?.uniqeId ?? '-'}</span></li>
                <li><label className='fs-16'>{t('Staff.Phone')}</label> <span>{data?.respondent_data?.mobile ? data?.respondent_data?.mobile : data?.mobile}</span></li>
                <li><label className='fs-16'>{t('Staff.Email')}</label> <span>{data?.respondent_data?.email ? data?.respondent_data?.email : data?.email}</span></li>
                {/* {data?.password2 || data?.respondent_data?.password2 ?  */}
                {/* <li><label className='fs-16'>{t('Staff.Password')}</label> <span>{data?.respondent_data?.password2 ? data?.respondent_data?.password2 : data?.password2 || data?.password}</span></li> */}
                 {/* :""} */}
                {/* <li><label className='fs-16'>{t('Staff.Contract')}</label> <span>{data?.contract ? data?.contract : data?.respondent_data?.contract ? data?.contract ? data?.contract : data?.respondent_data?.contract : "-"}</span></li>
                <li><label className='fs-16'>{t('Staff.Nursing_License')}</label> <span>{data?.license ? data?.license : data?.respondent_data?.license ? data?.license ? data?.license : data?.respondent_data?.license : "-"}</span></li> */}
                
                {data?.contract && (
                  <li>
                    <label className='fs-16'>{t('Staff.Contract')}</label>
                    <span>
                      {data?.contract ? (
                        data?.contract?.includes('pdf') ? (
                          <a href={process.env.REACT_APP_FILE_PATH + 'contract/' + data?.contract} target='blank'>
                            <img src={pdfIcon} alt='' style={{ height: '70px', width: '60px' }} />
                          </a>
                        ) : (
                          <img src={process.env.REACT_APP_FILE_PATH + 'contract/' + data?.contract} alt='' style={{ height: '100px', width: '200px' }} />
                        )
                      ) : (
                        data?.respondent_data?.contract?.includes('pdf') ? (
                          <a href={process.env.REACT_APP_FILE_PATH + 'contract/' + data?.respondent_data?.contract} target='blank'>
                            <img src={pdfIcon} alt='' style={{ height: '70px', width: '60px' }} />
                          </a>
                        ) : (
                          <img src={process.env.REACT_APP_FILE_PATH + 'contract/' + data?.respondent_data?.contract} alt='' style={{ height: '100px', width: '200px' }} />
                        )
                      )}
                    </span>
                  </li>
                )}
                {data?.license && (
                  <li>
                    <label className='fs-16'>{t('Staff.Nursing_License')}</label>
                    <span>
                      {data?.license ? (
                        data?.license?.includes('pdf') ? (
                          <a href={process.env.REACT_APP_FILE_PATH + "license/" + data?.license} target='blank'>
                            <img src={pdfIcon} alt="" style={{ height: "70px", width: "60px" }} />
                          </a>
                        ) :
                          <img src={process.env.REACT_APP_FILE_PATH + "license/" + data?.license} alt="" style={{ height: "100px", width: "200px" }} />
                      ) : (
                        data?.respondent_data?.license ? (
                          data?.respondent_data?.license?.includes('pdf') ? (
                            <a href={process.env.REACT_APP_FILE_PATH + "license/" + data?.respondent_data?.license} target='blank'>
                              <img src={pdfIcon} alt="" style={{ height: "70px", width: "60px" }} />
                            </a>
                          ) : (
                            <img src={process.env.REACT_APP_FILE_PATH + "license/" + data?.respondent_data?.license} alt="" style={{ height: "100px", width: "200px" }} />
                          )
                        ) : (
                          <img src={process.env.REACT_APP_FILE_PATH + "license/" + data?.respondent_data?.license} alt="" style={{ height: "100px", width: "200px" }} />
                        )
                      )}
                    </span>
                  </li>
                )}
                <li><label className='fs-16'>{t('Staff.Authority')}</label>{data?.role_data?.name == "superAdmin" ? t('Staff.Admin') : t('Staff.Part-Timer')}</li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>
    </section >
  )
}

export default StaffDetails;
