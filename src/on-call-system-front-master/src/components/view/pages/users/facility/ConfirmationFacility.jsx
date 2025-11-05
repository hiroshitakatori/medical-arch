import React, { useState } from 'react'
import { Button, Form, Input, Row, Space, Col } from 'antd'
import { Add, ArrowLeft2, ArrowRight2 } from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";
import pdfIcon from "../../../../../assets/images/PDF_file_icon.svg.png";
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Loader from '../../../../Loader'

const { TextArea } = Input;
function ConfirmationFacility() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const data = location.state;
  // console.log({ data });
  const contractStartDate = data?.contractStartDate;
  // const contractStartDate = data?.contractStartDate; 
  const rendate = data?.renewldate
  const renewalDate = contractStartDate ? new Date(new Date(contractStartDate).getTime() + rendate * 24 * 60 * 60 * 1000) : null;
  const daterenewl = moment(renewalDate).format('YYYY-MM-DD')
  // console.log(renewalDate,"renewldate");

  const ID = data?._id
  const backclick = () => {
    if (ID) {

      navigate('/edit-facility', { state: location.state });
    }
    else {

      navigate('/add-facility', { state: location.state });
    }
  }

  const lang = localStorage.getItem('i18nextLng')

  const addfacility = () => {
    setIsLoading(true);
    const Token = localStorage.getItem("token");
    // console.log(data)
    if(!data?.affiliatedFacility || data?.affiliatedFacility == "none" || data?.affiliatedFacility == "なし"){
      data.affiliatedFacility = null;
    }
    if(!data?.managerName){
      data.managerName =  data?.contractDetails|| data?.adminname || ""
    } 
    // return false;
    http.callApi(data?._id ? url.editfacility : url.addfacility, data, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res, "res");
        navigate('/facility-list')
        // enqueueSnackbar(
        //   res.data.message,
        //   { variant: "success" },
        //   { autoHideDuration: 1000 }
        // );
      })
      .catch((errors) => {
        console.log(errors?.response)
        console.log(errors.response, "error");
        enqueueSnackbar(
          errors.response.data.errors.email,
          { variant: "error" },
          { autoHideDuration: 1000 }
        );
      }
      )

  }
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  return (
    <section className='ptb40'>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Facility_Information.Add_Contracted_Facility_Confirmation')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <Row>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label><span>{data?.name}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label><span>{data?.address}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label><span>{data?.mobile}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label><span>{data?.facilityManagerName}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label><span>{data?.contractDetails}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}.</label><span>{lang == "en" ? data?.businessType == 1 ? "Special Nursing Home" : data?.businessType == 2 ? "Short Stay" : data?.businessType == 3 ? "Paid Nursing Home" : "-" : data?.businessType == 1 ? "特別養護老人ホーム" : data?.businessType == 2 ? "ショートステイ" : data?.businessType == 3 ? "有料老人ホーム" : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Start_Date')}</label> <span>{data?.contractStartDate}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Amount')}</label><span>{data?.amount}</span></li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className='details_list'>
                <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label><span>{data?.yomi}</span></li>
                <li><label className='fs-16'>{t('Facility_Information.Email')}</label><span>{data?.email}</span></li>
                  <li><label className='fs-16'>{t('Edit_Facility.Phone2')}</label><span>{data?.mobile2}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>{data?.managerName || data?.adminname}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>{data?.capacity}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{data?.planname}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.renewelDate')}</label><span>{daterenewl}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Initial_Cost')}</label><span>{data?.cost}</span></li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Contract_File')}</label>
            {/* <div className="border_card"> */}
            <p>{
              data?.contract?.includes('pdf') ? (<a href={process.env.REACT_APP_FILE_PATH + "contract/" + data?.contract} target='blank'>
                <img src={pdfIcon} alt="" style={{ height: "70px", width: "60px" }} />
              </a>) :
              data?.contract ?  <img src={data?.contract ? process.env.REACT_APP_FILE_PATH + "contract/" + data?.contract :""} alt="" style={{ height: "100px", width: "200px" }} />:""
            }
            </p>
            {/* </div> */}
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_facility_can_also_view')}</label>
            <div className="border_card">
              <p>{data?.memoForFacility}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_viewable_by_staff_only')}</label>
            <div className="border_card">
              <p>{data?.memoForStaff}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Affiliated_Facilities')}</label>
            <p>
              {
                  data?.affiliatedFacilityname ? data?.affiliatedFacilityname : lang=="en" ? "none" :"なし"
              }
            </p>
          </div>
          <div className="flex_item_ce flex-wrap">
            <Button onClick={backclick} className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.addFacility}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Amendment')}</Button>
            {isLoading == true ?
              <Button disabled onClick={addfacility} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.facilityList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Submission')}<Spin style={{color:"#fff"}} indicator={antIcon} /></Button>
              : <Button onClick={addfacility} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.facilityList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Submission')}</Button>
            }
          </div>
        </div>
      </div >
    </section>
  )
}

export default ConfirmationFacility
