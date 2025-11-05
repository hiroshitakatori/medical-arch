import React, {useEffect, useState } from 'react'
import { Button, Form, Row, Col,Input } from 'antd'
import { Add, ArrowLeft2, ArrowRight2 } from 'iconsax-react'

import { Link,useNavigate,useLocation } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { TextArea } = Input;

function MyPage() {
  const { t, i18n } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setuser] = useState({}) 
  const [form] = Form.useForm();
  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const memo = parsedAdminData?.state?.userData?.memoForFacility;

  const getprofile = () => {
    const lang = localStorage.getItem('i18nextLng')
    const Token = localStorage.getItem('token')
    http.callApi(url.getprofile, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res.data)
        setuser(res?.data)
        form.setFieldValue("memoForFacility",res?.data?.memoForFacility);
        // console.log(memo)
        setLoading(false)
       
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
  const lang = localStorage.getItem('i18nextLng')

  const addfacility = (values) => {
    setLoading(true);
    const Token = localStorage.getItem("token");
    if(!user?.affiliatedFacility || user?.affiliatedFacility == "none" || user?.affiliatedFacility == "なし"){
      user.affiliatedFacility = null;
    }
    
    let data = {
      _id : user?._id,
      memoForFacility : values?.memoForFacility || memo,
      isFacility : true
    }
    setLoading(false)

    http.callApi( url.editfacility, data, {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res, "res");
        // navigate('/facility/my-page')
        enqueueSnackbar(
          res.data.message,
          { variant: "success" },
          { autoHideDuration: 100 }
        );
           setLoading(false)
      })
      .catch((errors) => {
        console.log(errors?.response)
        console.log(errors.response, "error");
        enqueueSnackbar(
          errors.response.data.errors,
          { variant: "error" },
          { autoHideDuration: 1000 }
        );
      }
      )

  }
  useEffect(()=>{
    getprofile()
  },[])

  // const editprofilepage = () => {
  //   user.edit="edit";
  //   // console.log({user})
  //   navigate('/edit-facility',{state:user})
  // }
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return (
    <>

    <section className='ptb40'>
    <div className="fliter_box_card mb30">
     {/* <Form>
       <Space className='flex-wrap flex_item_ce'>
         <Button onClick={editprofilepage}  to={PATH_FRONT.editFacility} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('table_title.Edit_Profile')} </Button>
       </Space>
     </Form> */}
   </div>
  
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4> {t('Facility_Information.My_page')}</h4>
        </div>
        <div className="custom_card_body">
        <Form layout='vertical' form={form} autoComplete="off" onFinish={addfacility}>
          <div className="">
            <Row>
              <Col sm={{ span: 14 }} xs={{ span: 24 }}>
                <ul className='details_list mb10'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label> <span>{user?.name ? user?.name : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label> <span>{user?.yomi ? user?.yomi : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label> <span>{user?.address ? user?.address : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label> <span>{user?.mobile ? user?.mobile : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label> <span>{user?.email ? user?.email : "-"}</span></li>
                  {/* <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label> <span>{user?.managerName ? user?.managerName : "-"}</span></li> */}
                </ul>
              </Col>
              <Col sm={{ span: 14 }} xs={{ span: 24 }}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label> <span>{user?.facilityManagerName ? user?.facilityManagerName : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label> <span>{user?.contractDetails ? user?.contractDetails : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>{user?.capacity ? user?.capacity : "-"}</span></li>
                  
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}</label><span>
                  {/* { user?.businessType == 1 ? "Special Nursing Home" : user?.businessType == 2 ? "Short Stay" : user?.businessType == 3 ? "Paid Nursing Home" : "-" } */}
                  {
                    user?.businessType == 1 ? "特別養護老人ホーム"
                    : user?.businessType == 2 ? "ショートステイ"
                    : user?.businessType == 3 ? "有料老人ホーム"
                    : "-"
                  }
                  </span></li>
                  {/* <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{ user?.plan == 1 ? "plan A" : user?.plan == 2 ? "Plan B" : user?.plan == 3 ? "Plan C" : user?.plan == 4 ? "Plan D" : user?.plan == 5 ? "Plan E" : "-" }</span></li> */}
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{ user?.plan_data?.jname}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Affiliated_Facilities')}</label><span>{ 
                    user?.affiliatedFacility_data?.name || t('Facility_Information.none')
                   }</span></li>
                  {/* <li><label className='fs-16'>{t('Facility_Information.Affiliated_Facilities')}</label><span>{ 
                    user?.affiliatedFacility == 1 ? "Social Relations Center" :
                    user?.affiliatedFacility == 2 ? "Library and Information Processing Center" : 
                    user?.affiliatedFacility == 3 ? "Gender Equality Promotion Center" : 
                    user?.affiliatedFacility == 4 ? "University Research Administration Office" : 
                    user?.affiliatedFacility == 5 ? "Research Equipment Sharing Center" : 
                    user?.affiliatedFacility == 6 ? "Career Support Center" :
                    user?.affiliatedFacility == 7 ? "International Exchange Center" :
                    user?.affiliatedFacility == 8 ? "Center for Urban Policy Research and Education" :
                    user?.affiliatedFacility == 9 ? "Medical Psychology Center" : "-"
                   }</span></li> */}
                  
                  
                  {/* <li> */}
                  <Col span={24}>

                  <li><label className='fs-16'>{t('Facility_Information.Memo_facility_can_also_view')}</label><span></span></li>
                  <Form.Item name="memoForFacility" >
                    <TextArea defaultValue={user?.memoForFacility} placeholder={t('Facility_Information.Memo_facility_can_also_view')} rows={4} />
                  </Form.Item>
                  </Col>
                  <span>
               
                                    
                  </span>
                  
                  
                  {/* <li><label className='fs-16'>{t('Facility_Information.BusinessType')}</label> <span>{user?.businessType ? user?.businessType : "-"}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label> <span>{user?.plan ? user?.plan : "-"}</span></li> */}
                {/* 
                
                  <Option value="1">Social Relations Center</Option>
                    <Option value="2">Library and Information Processing Center</Option>
                    <Option value="3">Gender Equality Promotion Center</Option>
                    <Option value="4">University Research Administration Office</Option>
                    <Option value="5">Research Equipment Sharing Center</Option>
                    <Option value="6">Career Support Center</Option>
                    <Option value="7">International Exchange Center</Option>
                    <Option value="8">Center for Urban Policy Research and Education</Option>
                    <Option value="9">Medical Psychology Center</Option>
                
                
                 */}
                </ul>
            
              </Col>
            </Row>
            <div className="flex_item_ce flex-wrap">
            {loading == true ?
                  <Button disabled  htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.facilityList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Submission')}<Spin style={{color:"#fff"}} indicator={antIcon} /></Button>
                  : <Button  htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.facilityList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Submission')}</Button>
                }
            </div>
          </div>
        </Form>
        </div>
      </div>
    </section>
    </>

  )
}

export default MyPage
