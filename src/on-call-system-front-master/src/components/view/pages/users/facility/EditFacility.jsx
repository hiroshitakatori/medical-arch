import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Space, Col, Select, DatePicker, Checkbox, message, Upload,ConfigProvider } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, DocumentUpload } from 'iconsax-react'
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
import http from '../../../../../security/Http'
import urls from '../../../../../Development.json'
import ConfirmationFacility from './ConfirmationFacility';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import jaJP from 'antd/locale/ja_JP';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(customParseFormat);
const BaseUrl = process.env.REACT_APP_BASE_URL;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

function EditFacility() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  var [contractDocument, setContractDocument] = useState([]);
  let [contract, setContract] = useState([])
  let [plan, setPlan] = useState([])
  let [Allfacility, setAllfacility] = useState([])
  var data = location.state
  const lang = localStorage.getItem('i18nextLng')

  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const Adminname = parsedAdminData.state.userData.name;
  let [allowLogin, setAllowLogin] = useState(false)

  const plans = () => {
    // console.log("api calls");
    const Token = localStorage.getItem("token");
    http.callApi(urls.getplans, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res?.data, "res");
        setPlan(res?.data);
      })
      .catch((errors) => {
        console.log(errors?.response)
      }
      )
  }

  const GetallFacility = () => {
    // console.log("api calls");
    const Token = localStorage.getItem("token");
    http.callApi(urls.GetallFacility, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res?.data, "res");
        let newData = res?.data;
        let none = lang == "en" ? "none" :"なし"
        newData.push({"_id":none,"name":none})
        setAllfacility(newData);
      })
      .catch((errors) => {
        console.log(errors?.response)
      }
      )
  }

  var allowLoginCheck = (e) => {
    e.target.checked ? setAllowLogin(true) : setAllowLogin(false);
  }
  useEffect(() => {
    plans()
    GetallFacility()
  }, [])



  useEffect(() => { 
    console.log(location.state)
    if (location.state) {
      form.setFieldsValue({ name: location.state.name ? location.state.name : location.state?.facility_data?.name }); 
      form.setFieldsValue({ yomi: location.state.yomi ? location.state.yomi :location.state?.facility_data?.yomi }); 
      form.setFieldsValue({ address: location.state.address }); 
      form.setFieldsValue({ mobile: location.state.mobile?.replace('+81','') }); 
      form.setFieldsValue({ mobile2: location?.state?.mobile2?.replace('+81','') }); 
      form.setFieldsValue({ email: location.state.email }); 
      form.setFieldsValue({ managerName: location.state.managerName ? location.state.managerName : location.state?.facility_data?.managerName }); 
      form.setFieldsValue({ contractDetails: location.state.contractDetails ? location.state.contractDetails : location.state?.facility_data?.contractDetails }); 
      form.setFieldsValue({ businessType: location.state.businessType ? location.state.businessType :location.state?.facility_data?.businessType }); 
      form.setFieldsValue({ capacity: location.state.capacity || location.state?.facility_data?.capacity}); 
      form.setFieldsValue({ contract: location.state.contract || location.state?.facility_data?.contract});
      form.setFieldsValue({ affiliatedFacility: location.state.affiliatedFacility  || location.state?.facility_data?.affiliatedFacility }); 
      form.setFieldsValue({ plan: location.state.plan || location.state?.facility_data?.plan }); 
      form.setFieldsValue({ facilityManagerName: location.state.facilityManagerName || location.state?.facilityManagerName }); 
      form.setFieldsValue({ amount: location.state?.amount?.toString() || location.state?.facility_data?.amount?.toString()}); 
      form.setFieldsValue({ cost: location.state.cost?.toString() || location.state?.facility_data?.cost?.toString() }); 
      form.setFieldsValue({ memoForFacility: location.state.memoForFacility || location.state?.facility_data?.memoForFacility }); 
      form.setFieldsValue({ memoForStaff: location.state.memoForStaff || location.state?.facility_data?.memoForStaff }); 
      form.setFieldsValue({ subscriberRegistrant: location.state.subscriberRegistrant || location.state?.facility_data?.subscriberRegistrant}); 
      form.setFieldsValue({ contractStartDate: dayjs(location.state.contractStartDate || location.state?.facility_data?.contractStartDate,'YYYY年M月D日')  }); 
      console.log(location.state,"heree")
      if (location?.state?.allowLogin == true || location?.state?.allowLogin == 1) {
        setAllowLogin(true)
      }
    }
  }, [location.state]);


  var checkImageType = (file, type) => {
    if (file.type.includes('image/')) {
      if (type == "contract") {

        setContractDocument([file])
      }
      var formData = new FormData();
      formData.append('file', file);
      let url = BaseUrl + "/uploadImage/" + type;
      // console.log("url", url);
      axios.post(url, formData)
        .then((res) => {
          if (type == "contract") {

            setContract(res?.data?.file_name)
          }
          enqueueSnackbar(
            res.data.message,
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response, "error");
            enqueueSnackbar(
              error.response.data.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        })
      return [file];
    }
    // return ToastMe('Please select only image');
  };
  const handleRemoveImage = (file) => {
    if (contractDocument) {
      const filteredDocumentList = contractDocument.filter((doc) => {
        return doc.uid != file.uid;
      })
      if(contract && contract!=""){
        let url = BaseUrl + "/deleteImage";

        axios.post(url, {type:"contract",file:contract})
        .then((res) => {
          setContractDocument(filteredDocumentList);

          enqueueSnackbar(
            res.data.message,
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response, "error");
            enqueueSnackbar(
              error.response.data.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        })
      }
      setContractDocument(filteredDocumentList);
    }
  };

  const editfacility = (values) => {
    let durations;
    let planname ;
    plan?.map((e) => {
      if (values?.plan == e._id) {
        durations = e.duration;
        planname =lang == "en" ?  e.name : e.jname
      }
    })
    let  affiliatedFacilityname ;
    
    Allfacility?.map((e) => {
        if(e?._id == values?.affiliatedFacility){
          affiliatedFacilityname = e?.name
        }
    })
    const { contractStartDate } = values;
    if(!values.managerName){
      values.managerName = location?.state?.managerName ? location.state.managerName : location.state?.facility_data?.managerName;
    }

    const contractdate = contractStartDate.format('YYYY-MM-DD')
    values.renewldate = durations
    values.planname = planname
    values.affiliatedFacilityname = affiliatedFacilityname
    values.contractStartDate = contractdate;
    values._id = data?.facility_data?._id ? data?.facility_data?._id : data?._id;
    values.contract = contract != "" ? contract : data?.contract;
    values.adminname = Adminname ;
    // return false 
    values.flag="edit-facility";
    values.allowLogin = allowLogin;

    let m1=values?.mobile ?? "";
    let m2=values?.mobile2 ?? "";
    values.mobile = "+81"+m1
    values.mobile2 = "+81"+m2
    
    if(values){
      navigate('/confirmation-facility' , {state:values})
    }
    
  }

  var userExist = (e)=>{
    let type = e.target.type == "email" ? "email": "mobile"  ;
    let value = e.target.value;
    const lang = localStorage.getItem('i18nextLng')
    const Token = localStorage.getItem('token')
    if(value!=""){
    http.get( process.env.REACT_APP_BASE_URL +`/admin/facilityList?search=${value}&type=${type}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        if ( res?.data?.message) {
          form.setFields([
            {
              name: e?.target?.id,
              errors: [res?.data?.message]
            }
          ]);
        } 
      
      })
      .catch((error) => {
      
        if (error.response) {
          console.log(error.response, "error");
          enqueueSnackbar(
            error.response.data.message,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      })
    }
  }

  return (
    <section className='ptb40'>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Edit_Facility.title')}</h4>
        </div>
        <div className="custom_card_body">
        <Form layout='vertical' form={form} autoComplete="off" onFinish={editfacility}>
            <Row gutter={16}>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.FacilityName')} name="name" rules={[
                   {
                    required: true,
                    message: lang === "en" ? t('Name is Required') : "名前は必須です",
                  },
                  {
                    min: 1,
                    message: lang === "en" ? t('Name must be 1-100 character') : "名前は 1 ～ 100 文字にする必要があります",
                  },
                  {
                    max: 100,
                    message: lang === "en" ? t('Name must be 1-100 character') : "名前は 1 ～ 100 文字にする必要があります",
                  },
                ]} >
                  <Input  placeholder={t('Edit_Facility.FacilityName')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Yomi')} name="yomi" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Yomi Is Required') : "ヨミは必須です",
                  },
                ]}>
                  <Input defaultValue={data?.yomi} placeholder={t('Edit_Facility.Yomi')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Address')} name="address" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Address Is Required') : "住所は必須です",
                  },
                ]}>
                  <Input defaultValue={data?.address} placeholder={t('Edit_Facility.Address')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Phone')} name="mobile" rules={[
                 {
                  required: true,
                  message: lang === "en" ? t('Mobile Number Is Required') : "携帯電話番号は必須です",
                },
                {
                  min: 9,
                  message: lang === "en" ? t('Mobile Number must be 9-12 digit') : "携帯電話番号は9～12桁でなければなりません",
                },
                {
                  max: 13,
                  message: lang === "en" ? t('Mobile Number must be 9-12 digit!') : "携帯電話番号は9～12桁でなければなりません！",
                },
                {
                    pattern: /^(?:\d{0,4}?\d{0,4}?\d{4})$/,
                    message: lang === "en" ? t('Not a valid number , Allow only 0-9 Numbers') : "有効な数字ではありません。0 ～ 9 の数字のみを許可します",
                  }
                ]}>
                  <Input prefix="+81" defaultValue={data?.mobile} placeholder={t('Edit_Facility.Phone')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Edit_Facility.Phone2')} name="mobile2" rules={[
                  // {
                  //   required: true,
                  //   message: lang === "en" ? 'Phone 2 Is Required' : "電話番号2は必須です",
                  // },
                  {
                    min: 9,
                    message: lang === "en" ? 'Phone 2 must be 9-12 digit' : "電話番号 2 は 9 ～ 12 桁である必要があります",
                  },
                  {
                    max: 13,
                    message: lang === "en" ? 'Phone 2 must be 9-12 digit!' : "電話番号 2 は 9 ～ 12 桁である必要があります",
                  },
                  {
                    pattern:  /^(?:\d{0,4}?\d{0,4}?\d{4})$/,
                    message: lang === "en" ? 'Not a valid number , Allow only 0-9 Numbers' : "有効な数字ではありません。0 ～ 9 の数字のみを許可します",
                  },
                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('mobile') === value) {
                                          if(value){
                                            return Promise.reject(lang === "en" ? 'Phone and Phone 2 must be different' : "電話番号と電話番号2は異なっていなければなりません");
                                          }else{
                                            return Promise.resolve();
                                          } 
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                ]}>
                  <Input prefix="+81" defaultValue={data?.mobile2} placeholder={t('Edit_Facility.Phone2')} onChange={userExist} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Email')} name="email" rules={[
                  {
                    type: 'email',
                    message: lang === "en" ? t('Invalid Email') : "無効な電子メール",
                  },
                  {
                    required: true,
                    message: lang === "en" ? t('Email Is Required') : "メールアドレスは必須です",
                  },
                ]}>
                  <Input defaultValue={data?.email} type="email" placeholder={t('Edit_Facility.Email')} onChange={userExist}/>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Facility_Manager_Name')} name="facilityManagerName" rules={[
                   {
                    required: true,
                    message: lang === "en" ? "Facility Manager Name is Required" : "施設管理者名は必須です",
                  },
                  {
                    min: 1,
                    message: lang === "en" ? t('Facility Manager Name must be 1-50 character') : "施設管理者名は 1 ～ 100 文字である必要があります",
                  },
                  {
                    max: 100,
                    message: lang === "en" ? t('Facility Manager Name must be 1-50 character') : "施設管理者名は 1 ～ 100 文字である必要があります",
                  },
                ]}>
                  <Input defaultValue={data?.facilityManagerName} placeholder={t('Edit_Facility.Facility_Manager_Name')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Contract_Details')} name="contractDetails" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Contract Details Is Required') : "契約の詳細は必須です",
                  },
                ]}>
                  <Input defaultValue={data?.contractDetails} placeholder={t('Edit_Facility.Contract_Details')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.BusinessType')} name="businessType" rules={[
                   {
                    required: true,
                    message: lang === "en" ? t('BusinessType Is Required') : "ビジネスタイプは必須です",
                  },
                ]}>
                      {lang == 'en' ? 
                  <Select defaultValue={data?.businessType} className='custom-ant-select' placeholder={t('Edit_Facility.BusinessType')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    <Option value="1">Special Nursing Home</Option>
                    <Option value="2">Short Stay</Option>
                    <Option value="3">Paid Nursing Home</Option>
                  </Select>
                  :
                  <Select defaultValue={data?.businessType} className='custom-ant-select' placeholder={t('Edit_Facility.BusinessType')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    <Option value="1">特別養護老人ホーム</Option>
                    <Option value="2">ショートステイ</Option>
                    <Option value="3">有料老人ホーム</Option>
                  </Select>
                  }
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Capacity')} name="capacity" rules={[
                   {
                    required: true,
                    message: lang === "en" ? t('Capacity Is Required') : "容量が必要です",
                  },
                ]}>
                  <Input defaultValue={data?.capacity} placeholder={t('Edit_Facility.Capacity')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Affiliated_Facilities')} name="affiliatedFacility" rules={[
                  //  {
                  //   required: true,
                  //   message: lang === "en" ? t('Affiliated Facilities Is Required') : "付属施設は必須です",
                  // },
                ]}>
                  {/* {lang === "en" ?    */}
                  <Select defaultValue={data?.affiliatedFacility ?? lang=="en" ? "none" :"なし"} className='custom-ant-select' placeholder={t('Edit_Facility.Affiliated_Facilities')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                  {
                      Allfacility?.map((e) => {
                        return (
                          <Option value={e?._id}>
                            {e?.name}
                          </Option>
                        );
                      })
                    }
                  </Select>
                  {/* :
                  <Select defaultValue={data?.affiliatedFacility} className='custom-ant-select' placeholder={t('Edit_Facility.Affiliated_Facilities')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    <Option value="1">ソーシャルリレーションセンター</Option>
                    <Option value="2">図書館情報処理センター</Option>
                    <Option value="3">男女共同参画推進センター</Option>
                    <Option value="4">大学研究管理室</Option>
                    <Option value="5">研究機器シェアリングセンター</Option>
                    <Option value="6">キャリアサポートセンター</Option>
                    <Option value="7">国際交流センター</Option>
                    <Option value="8">都市政策研究教育センター</Option>
                    <Option value="9">医療心理センター</Option>
                  </Select>
                  } */}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('Edit_Facility.Contract_File')}>
                <Dragger fileList={contractDocument} multiple={false} maxCount={1}  beforeUpload={(e) => checkImageType(e, "contract")} onRemove={handleRemoveImage}>
                    <p className="ant-upload-drag-icon">
                      <DocumentUpload size="40" color="#707070" />
                    </p>
                    <h6 className="ant-upload-text fs-16">{t('Edit_Facility.Contract_File_Title')}</h6>
                    <p className="ant-upload-hint text-gray">{t('Edit_Facility.Contract_File_Text')}</p>
                  </Dragger>
                  <span>{location?.state?.contract ? location?.state?.contract : ""}</span>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Edit_Facility.Customer_Allow_Login')} name='allowLogin'>
                  <Checkbox value={allowLogin} checked={ allowLogin  == true ? 1:""} onChange={allowLoginCheck} >{t('Edit_Facility.Customer_Allow_Login')}</Checkbox>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <ConfigProvider locale={jaJP}>

                <Form.Item label={t('Edit_Facility.Contract_Start_Date')} name="contractStartDate" rules={[
                   {
                    required: true,
                    message: lang === "en" ? t('Contract Start Date Is Required') : "契約開始日は必須です",
                  },
                ]}>
                  <DatePicker className='custom-ant-picker' placeholder={t('Edit_Facility.Contract_Start_Date')} suffixIcon={<Calendar size="22" color="#707070" />} format={"YYYY年M月D日"}  />
                </Form.Item>
                </ConfigProvider>

              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Plan')} name="plan" rules={[
                    {
                      required: true,
                      message: lang === "en" ? t('Facility Plan Is Required') : "施設計画は必須です",
                    },
                ]}>
                  <Select defaultValue={data?.plan} className='custom-ant-select' placeholder={t('Edit_Facility.Plan')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                  {
                      plan?.map((e) => {
                        return (
                          <option value={e?._id}>
                            {lang == "en" ? e?.name : e?.jname}
                          </option>
                        );
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Contract_Amount')} name="amount" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Contract Amount Is Required') : "契約金額が必要です",
                  },
                  {
                    max: 18,
                    message: lang === "en" ? t('Contract Amount must be 1-18 digit!') : "契約金額は 1 ～ 18 桁である必要があります。",
                  },
                  {
                    pattern: '^[0-9][0-9]*$',
                    message: lang === "en" ? t('Not a valid number , Allow only 1-9 Numbers') : "有効な数字ではありません。1 ～ 9 の数字のみを許可します",
                  },
                ]}>
                  <Input placeholder={t('Edit_Facility.Contract_Amount')} suffix={<span className='text-gray'>{t('Edit_Facility.Yen')}</span>} name="amount" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('Edit_Facility.Initial_Cost')} name="cost" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Required Initial Cost') : "必要な初期費用",
                  },
                  {
                    max: 18,
                    message: lang === "en" ? t('Initial Cost must be 1-18 digit!') : "初期費用は 1 ～ 18 桁でなければなりません。",
                  },
                  {
                    pattern: '^[0-9][0-9]*$',
                    message: lang === "en" ? t('Not a valid number , Allow only 1-9 Numbers') : "有効な数字ではありません。1 ～ 9 の数字のみを許可します",
                  },
                ]}>
                  <Input placeholder={t('Edit_Facility.Initial_Cost')} suffix={<span className='text-gray'>{t('Edit_Facility.Yen')}</span>} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('Edit_Facility.Memo_facility_can_also_view')} name="memoForFacility" 
                // rules={[
                //   {
                //     required: true,
                //     message: lang === "en" ? t('Memo facility Is Required') : "メモ機能は必須です",
                //   },
                // ]}
                >
                  <TextArea defaultValue={data?.memoForFacility} placeholder={t('Edit_Facility.Memo_facility_can_also_view')} rows={4} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('Edit_Facility.Memo_viewable_by_staff_only')} name="memoForStaff" 
                // rules={[
                //   {
                //     required: true,
                //     message: lang === "en" ? t('Memo Staff Is Required') : "メモスタッフは必須です",
                //   },
                // ]}
                >
                  <TextArea defaultValue={data?.memoForStaff} placeholder={t('Edit_Facility.Memo_viewable_by_staff_only')} rows={4} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Subscriber_Registrant')} name="subscriberRegistrant" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Subscriber Registrant Is Required') : "購読者登録者が必要です",
                  },
                ]}>
                  <Input defaultValue={data?.subscriberRegistrant} placeholder={t('Edit_Facility.Registrant')} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item className='mb0'>
                  <Space className="flex_item_ce flex-wrap">
                    <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.facilityList}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Edit_Facility.Back')}</Link>
                    <Button htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.confirmationFacility} ><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Edit_Facility.Content_Confirmation')}</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default EditFacility