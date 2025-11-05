import React, { useState } from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Checkbox,ConfigProvider } from 'antd'
import { ArrowLeft2, ArrowRight2, Calendar } from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import url from '../../../../../Development.json'
import http from '../../../../../security/Http'
import moment from 'moment';
import { enqueueSnackbar } from "notistack";
import dayjs from 'dayjs';
import jaJP from 'antd/locale/ja_JP';
import 'dayjs/locale/ja';
dayjs.locale('ja');

var Token = localStorage.getItem('token')
function CancelFacility() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate() 
  const location = useLocation()
  let [allowLogin, setAllowLogin] = useState(false)
  const data = location?.state
  console.log(data,"data");

  var allowLoginCheck=(e)=>{
    e.target.checked ? setAllowLogin(true) : setAllowLogin(false);
  }

  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const staffName = parsedAdminData?.state?.userData?.name;
  console.log(staffName);
  const lang = localStorage.getItem('i18nextLng')

  const cancelfacility = (values) => {
    const { TerminationDate } = values;
    
    const contractdate = TerminationDate.format('YYYY-MM-DD')
    values.terminationDate = contractdate;
    // values.Cancel = allowLogin;
    values._id = data?._id
    let data2 = {
      _id : data?._id,
      terminationDate:values?.terminationDate,
      entryBy:values?.entryBy
    }
    // console.log(values,"valuesvaluesvalues");
    http.callApi( url.cancelFacility, data2, {
        headers: { 'authorization': 'Bearer ' + Token, lang: lang }
      })
        .then((res) => {
         
            navigate("/cancel-facility-search");  
            enqueueSnackbar(
              res.data.message,
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

  return (
    <section className='ptb40'>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Facility_Information.Cancellation_procedure')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <Row>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label><span>{data?.name}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label><span>{data?.yomi}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label><span>{data?.address}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label><span>{data?.mobile}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label><span>{data?.email}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>{staffName}</span></li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label><span>{data?.managerName}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label><span>{data?.contractDetails}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>{data?.capacity}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}.</label><span>{lang == "en" ?  data?.businessType == 1 ? "Special Nursing Home" : data?.businessType == 2 ? "Short Stay" : data?.businessType == 3 ? "Paid Nursing Home" : "-" :  data?.businessType == 1 ? "特別養護老人ホーム" : data?.businessType == 2 ? "ショートステイ" : data?.businessType == 3 ? "有料老人ホーム" : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{data?.plan_data?.jname}</span></li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_facility_can_also_view')}</label>
            <div className="border_card">
              <p>facilities</p>
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
              lang == "en" ?
            data?.affiliatedFacility == 1 ? "Social Relations Center" :
            data?.affiliatedFacility == 2 ? "Library and Information Processing Center" : 
            data?.affiliatedFacility == 3 ? "Gender Equality Promotion Center" :
            data?.affiliatedFacility == 4 ? "University Research Administration Office" : 
            data?.affiliatedFacility == 5 ? "Research Equipment Sharing Center" : 
            data?.affiliatedFacility == 6 ? "Career Support Center" : 
            data?.affiliatedFacility == 7 ? "International Exchange Center" : 
            data?.affiliatedFacility == 8 ? "Center for Urban Policy Research and Education" : 
            data?.affiliatedFacility == 9 ? "Medical Psychology Center" : ""    
          :
          data?.affiliatedFacility == 1 ? "ソーシャルリレーションセンター" :
          data?.affiliatedFacility == 2 ? "図書館情報処理センター" : 
          data?.affiliatedFacility == 3 ? "男女共同参画推進センター" :
          data?.affiliatedFacility == 4 ? "大学研究管理室" : 
          data?.affiliatedFacility == 5 ? "研究機器シェアリングセンター" : 
          data?.affiliatedFacility == 6 ? "キャリアサポートセンター" : 
          data?.affiliatedFacility == 7 ? "国際交流センター" : 
          data?.affiliatedFacility == 8 ? "都市政策研究教育センター" : 
          data?.affiliatedFacility == 9 ? "医療心理センター" : ""    


          }
            </p>
          </div>
          <div className="">
            <label className='fs-16 mb10'>{t('Facility_Information.Subscriber_Registrant')}</label>
            <p>{data?.subscriberRegistrant}</p>
          </div>
        </div>
      </div >
      <div className="custom_card">
        <div className="custom_card_body">
          <Form layout='vertical' form={form} autoComplete="off" onFinish={cancelfacility}>
            <Row gutter={16}>
              <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                <ConfigProvider locale={jaJP}>

                <Form.Item required label={t('Facility_Information.Termination_Date')} name="TerminationDate"
                rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Termination Date Is Required') : "終了日は必須です",
                  },
                ]}>
                  <DatePicker className='custom-ant-picker' placeholder={t('Facility_Information.Termination_Date')} suffixIcon={<Calendar size="22" color="#707070" />} format={"YYYY年M月D日"} disabledDate={(current) => current && current < moment().startOf('day')} />
                </Form.Item>
                </ConfigProvider >
              </Col>
              <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                <Form.Item>
                  <Checkbox onChange={allowLoginCheck}>{t('Facility_Information.Are_you_sure_you_want_to_cancel_your_subscription?')}</Checkbox>
                </Form.Item>
              </Col>
              <Col sm={{ span: 13 }} xs={{ span: 24 }} >
                <Form.Item required label={t('Facility_Information.Entry_By')} name="entryBy" 
                rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Entry By Is Required') : "入力者は必須です",
                  },
                ]}>
                  <Input placeholder={t('Facility_Information.Entry_By')} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item className='mb0'>
              <div className="flex_item_ce flex-wrap">
                <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.cancelFacilitySearch}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Edit_Facility.Back')} </Link>
               {allowLogin == true ?
                <Button  htmlType='submit' className='btn-theme btn-with-icon btn-danger' to={PATH_FRONT.cancelFacilitySearch}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Cancellation')}</Button>
                :
                <Button disabled  htmlType='submit' className='btn-theme btn-with-icon btn-danger' to={PATH_FRONT.cancelFacilitySearch}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Cancellation')}</Button>
              }
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default CancelFacility
