import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Space, Col, Select, DatePicker, Checkbox, message, Upload } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, DocumentUpload } from 'iconsax-react'
import { PATH_FRONT } from '../../../../routes/path';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
const BaseUrl = process.env.REACT_APP_BASE_URL;

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;
function EditFacility() {
  var [contractDocument, setContractDocument] = useState([]);
  let [contract, setContract] = useState([])
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state
  // console.log(data,"kkkkk");
  const lang = localStorage.getItem('i18nextLng')

  useEffect(() => { 
    if (location.state) {
      form.setFieldsValue({ name: location.state.name }); 
      form.setFieldsValue({ yomi: location.state.yomi }); 
      form.setFieldsValue({ address: location.state.address }); 
      form.setFieldsValue({ mobile: location.state.mobile.replace("+","").trim() }); 
      form.setFieldsValue({ email: location.state.email }); 
      form.setFieldsValue({ managerName: location.state.managerName }); 
      form.setFieldsValue({ facilityManagerName: location.state.facilityManagerName }); 
      form.setFieldsValue({ contractDetails: location.state.contractDetails }); 
      form.setFieldsValue({ businessType: location.state.businessType }); 
      form.setFieldsValue({ capacity: location.state.capacity }); 
      form.setFieldsValue({ affiliatedFacility: location.state.affiliatedFacility }); 
      form.setFieldsValue({ plan: location.state.plan }); 
      form.setFieldsValue({ amount: location.state.amount }); 
      form.setFieldsValue({ cost: location.state.cost }); 
      form.setFieldsValue({ memoForFacility: location.state.memoForFacility }); 
      form.setFieldsValue({ memoForStaff: location.state.memoForStaff }); 
      form.setFieldsValue({ subscriberRegistrant: location.state.subscriberRegistrant }); 
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
      setContractDocument(filteredDocumentList);
    }
  };

  const editfacility = (values) => {
   values._id = data?._id;
  //  console.log(contract)
  values.managerName = data?.managerName
  values.plan = location.state.plan
   values.contract = contract.length>0 ? contract : location.state.contract
    // console.log(values, "data");
    navigate('/confirmation-facility',{state:values})
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
                ]} >
                  <Input  defaultValue={data?.name} placeholder={t('Edit_Facility.FacilityName')} />
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
                  min: 10,
                  message: lang === "en" ? t('Mobile Number must be 10-15 digit') : "携帯電話番号は10～12桁でなければなりません",
                },
                {
                  max: 15,
                  message: lang === "en" ? t('Mobile Number must be 10-15 digit!') : "携帯電話番号は10～12桁でなければなりません！",
                },
                ]}>
                  <Input defaultValue={data?.mobile} placeholder={t('Edit_Facility.Phone')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Email')} name="email" rules={[
                  {
                    message: lang === "en" ? t('Invalid Email') : "無効な電子メール",
                  },
                  {
                    required: true,
                    message: lang === "en" ? t('Email Is Required') : "メールアドレスは必須です",
                  },
                ]}>
                  <Input defaultValue={data?.email} placeholder={t('Edit_Facility.Email')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Facility_Manager_Name')} name="facilityManagerName" rules={[
                   {
                    required: true,
                    message: lang === "en" ? t('Facility Manager Name is Required') : "マネージャー名は必須です",
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
                  <Select defaultValue={data?.businessType} className='custom-ant-select' placeholder={t('Edit_Facility.BusinessType')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    <Option value="1">Special Nursing Home</Option>
                    <Option value="2">Short Stay</Option>
                    <Option value="3">Paid Nursing Home</Option>
                  </Select>
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
              {/* <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Plan')} name="plan" rules={[
                    {
                      required: true,
                      message: lang === "en" ? t('Facility Plan Is Required') : "施設計画は必須です",
                    },
                ]}>
                  <Select defaultValue={data?.plan} className='custom-ant-select' placeholder={t('Edit_Facility.Plan')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    <Option value="1">Plan A</Option>
                    <Option value="2">Plan B</Option>
                    <Option value="3">Plan C</Option>
                    <Option value="4">Plan D</Option>
                    <Option value="5">Plan E</Option>
                  </Select>
                </Form.Item>
              </Col> */}
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Edit_Facility.Affiliated_Facilities')} name="affiliatedFacility" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Affiliated Facilities Is Required') : "付属施設は必須です",
                  },
                ]}>
                  <Select defaultValue={data?.affiliatedFacility} className='custom-ant-select' placeholder={t('Edit_Facility.Affiliated_Facilities')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    <Option value="1">Social Relations Center</Option>
                    <Option value="2">Library and Information Processing Center</Option>
                    <Option value="3">Gender Equality Promotion Center</Option>
                    <Option value="4">University Research Administration Office</Option>
                    <Option value="5">Research Equipment Sharing Center</Option>
                    <Option value="6">Career Support Center</Option>
                    <Option value="7">International Exchange Center</Option>
                    <Option value="8">Center for Urban Policy Research and Education</Option>
                    <Option value="9">Medical Psychology Center</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <Form.Item label={t('Edit_Facility.Contract_File')}>
                <Dragger fileList={contractDocument} multiple={false} maxCount={1} accept={"image/*"} beforeUpload={(e) => checkImageType(e, "contract")} onRemove={handleRemoveImage}>
                    <p className="ant-upload-drag-icon">
                      <DocumentUpload size="40" color="#707070" />
                    </p>
                    <h6 className="ant-upload-text fs-16">{t('Edit_Facility.Contract_File_Title')}</h6>
                    <p className="ant-upload-hint text-gray">{t('Edit_Facility.Contract_File_Text')}</p>
                  </Dragger>
                </Form.Item>
              </Col> */}
                            <Col span={24}>
                <Form.Item className='mb0'>
                  <Space className="flex_item_ce flex-wrap">
                    <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.facilityMypage}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Edit_Facility.Back')}</Link>
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
