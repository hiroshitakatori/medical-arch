import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Space, Col, Select, DatePicker, Checkbox, message, Upload,Radio } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, DocumentUpload } from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Loader from '../../../../Loader'
const BaseUrl = process.env.REACT_APP_BASE_URL;

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;
function EditStaff() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state
  const [isLoading, setIsLoading] = useState(false)
  console.log({data});
  var permissionData = localStorage.getItem("auth-storage");
  var parsedpermission = JSON.parse(permissionData);
  var permission = parsedpermission?.state?.permission;
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  var lang = localStorage.getItem('i18nextLng')
  useEffect(() => { 
    if (location.state) {
      form.setFieldsValue({ name: location.state.name || location?.state?.respondent_data?.name }); 
      form.setFieldsValue({ yomi: location.state.yomi || location?.state?.respondent_data?.yomi }); 
      form.setFieldsValue({ frigana: location.state.frigana || location?.state?.respondent_data?.frigana}); 
      form.setFieldsValue({ email: location.state.email }); 
      form.setFieldsValue({ mobile: location?.state?.mobile?.replace('+81','')}); 
      form.setFieldsValue({ address: location.state.address });
      form.setFieldsValue({ password2: data?.password || data?.password2 ||  location?.state?.respondent_data?.password2});
      if(location?.state.license || location?.state?.respondent_data?.license){
        // setlicence(location?.state?.license)
        form.setFieldsValue({ license: location?.state?.license || location?.state?.respondent_data?.license});
      }
      if(location?.state?.contract || location?.state?.respondent_data?.contract){
        // setContract(location?.state?.contract)
        form.setFieldsValue({ contract: location?.state?.contract || location?.state?.respondent_data?.contract});
      } 
      console.log(form.getFieldValue('password2'))
      // console.log(location?.state.authority)
      if(location?.state?.role_data?.name=="staff"){
        form.setFieldsValue({ authority: 0 });  
      }else if(location?.state?.role_data?.name=="superAdmin"){
        form.setFieldsValue({ authority: 1 });  
      }
      
      setIsLoading(false);
    }
  }, [location.state]);


  const validateAddress = (rule, value, callback) => {
    const specialChars = /[!@#$%^&*().?":{}|<>]/;
    if (specialChars.test(value)) {
      callback(lang === 'en' ? 'Special characters are not allowed' : '特殊文字は使用できません');
    } else {
      callback();
    }
  };


  let [licence, setlicence] = useState([])
  let [contract, setContract] = useState("")
  var [licenseDocument, setLicenceDocument] = useState([]);
  var [contractDocument, setContractDocument] = useState([]);
  var checkImageType = (file, type) => {
    // if (file.type.includes('image/')) {
      if (type == "license") {
        setLicenceDocument([file])

      }
      if (type == "contract") {

        setContractDocument([file])
      }
      var formData = new FormData();
      // formData.append('file', newFileList);
      formData.append('file', file);
      // // Make API call to upload the file
      let url = BaseUrl + "/uploadImage/" + type;
      // console.log("url", url);
      axios.post(url, formData)
        .then((res) => {
          // console.log(res, "res");
          if (type == "license") {

            setlicence(res?.data?.file_name)
            setIsLoading(false);
          }
          if (type == "contract") {

            setContract(res?.data?.file_name)
            setIsLoading(false);
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
    // }
    // return ToastMe('Please select only image');
  };
  const handleRemoveImage = (file) => {
    if (contractDocument) {
      const filteredDocumentList = contractDocument.filter((doc) => {
        return doc.uid != file.uid;
      })
      setContractDocument(filteredDocumentList);
    } else if (licenseDocument) {
      const filteredDocumentList = licenseDocument.filter((doc) => {
        return doc.uid != file.uid;
      })
      setLicenceDocument(filteredDocumentList);
    }
  };

  
  const editstaff = (values) => {
    values.contract = contract ? contract : data.contract;
    values.license = licence != "" ? licence : data.license;
    values._id = data._id
    values.isAuthority = permission?.admin_setting=="11111" ? true:false;
    values.mobile = "+81"+values.mobile
    if(location?.state?.edit){
      values.edit =location?.state?.edit
    }
    navigate('/confirmation-staff',{state:values})   
  }


  return (
    <section className='ptb40'>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Staff.Edit_Staff')}</h4>
        </div>
        <div className="custom_card_body">
        <Form layout='vertical' form={form} autoComplete="off" onFinish={editstaff}>
            <Row gutter={16}>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Name')} name="name" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Name is Required') : "名前は必須です",
                  },
                ]}>
                  <Input defaultValue={data?.name} type='text' placeholder={t('Staff.Name')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Staff.Frigana')} name="frigana" rules={[
                  {
                    required: true,
                    message: lang === "en" ? 'Frigana Is Required' : "フリガナは必須です",
                  },
                ]}>
                  <Input defaultValue={data?.frigana} type='text' placeholder={t('Staff.Frigana')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Staff.Phone_Label')} name="mobile" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Mobile Number Is Required') : "携帯電話番号は必須です",
                  },
                  {
                    min: 9,
                    message: lang === "en" ? t('Mobile Number must be 9-15 digit') : "携帯電話番号は9～12桁でなければなりません",
                  },
                  {
                    max: 12,
                    message: lang === "en" ? t('Mobile Number must be 9-12 digit!') : "携帯電話番号は9～12桁でなければなりません！",
                  },
                  {
                    pattern: /^(?:\d{0,4}?\d{0,4}?\d{4})$/,
                    message: lang === "en" ? t('Not a valid number , Allow only 0-9 Numbers') : "有効な数字ではありません。0 ～ 9 の数字のみを許可します",
                  }
                ]}>
                   
                  <Input prefix="+81" defaultValue={data?.mobile}  placeholder={t('Staff.Phone')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Staff.Email')} name="email" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Email Is Required') : "メールアドレスは必須です",

                  },
                ]}>
                  <Input defaultValue={data?.email} type='email' placeholder={t('Staff.Email')} />
                </Form.Item>
                </Col>
              
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Staff.Address')} name="address" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Address Is Required') : "住所は必須です",
                  },
                  {
                    validator: validateAddress,
                  },
                ]}>
                  <Input defaultValue={data?.address} type='text' placeholder={t('Staff.Address')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Form.Item label={t('Staff.Password')} name="password2" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Password Is Required') : "パスワードが必要",
                  },
                  {
                    min: 8,
                    message: lang === "en" ? t('Password Minimum Length 8') : "パスワードは8文字以上で設定してください",
                  },
                  {
                    max: 16,
                    message: lang === "en" ? t('Password Maximum Length 16') : "パスワードの最大長 16",
                  },
                  // {
                  //     pattern: new RegExp(
                  //         /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!#$%\-_=+<>])([a-zA-Z0-9!#$%\-_=+<>]+)$/
                  //     ),
                  //     message: lang === "en" ? `The password format is invalid` : "パスワードの形式が無効です"
                  // }
                ]}>
                  <Input.Password defaultValue={data?.password || data?.password2} placeholder={t('Staff.Password')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Nursing_License')} name="license"
                 rules={[
                  // {
                  //   required: true,
                  //   message: lang === "en" ? t('Nursing License Is Required') : "看護師免許が必要です",
                  // },
                ]}>
                <Dragger fileList={licenseDocument} multiple={false} maxCount={1} beforeUpload={(e) => checkImageType(e, "license")} onRemove={handleRemoveImage}>
                    <p className="ant-upload-drag-icon">
                      <DocumentUpload size="40" color="#707070" />
                    </p>
                    <h6 className="ant-upload-text fs-16">{t('Edit_Facility.Contract_File_Title')}</h6>
                    <p className="ant-upload-hint text-gray">{t('Edit_Facility.Contract_File_Text')}</p>
                  </Dragger>
                  <span>{location?.state?.license ? location?.state?.license : ""}</span>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Contract')} name="contract" 
                rules={[
                  // {
                  //   required: true,
                  //   message: lang === "en" ? t('Contract Is Required') : "契約が必要です",
                  // },
                  
                ]}>
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

              {
                permission?.admin_setting=="11111"? 
                <>
                  <Col sm={{ span: 12 }} xs={{ span: 25 }}>
                    <Form.Item label={t('Staff.Authority')} className='mb0' name="authority">
                       <Radio.Group className='flex_item_cs'>
                        <Radio value={1}><p style={{width:"50px", color:"#0D0B0B", fontWeight:500 , fontSize:"14px" ,}}> {t('Staff.Admin')}</p></Radio>
                        <Radio value={0}><p style={{width:"80px", color:"#0D0B0B", fontWeight:500 , fontSize:"14px" , textTransform:"capitalize"}}> {t('Staff.Part-Timer')}</p></Radio>
                      </Radio.Group>
                     
                    </Form.Item>
                  </Col>
                </>
                :""
    
                
              }
              <Col span={24}>
                <Form.Item className="mb0">
                  <Space className="flex_item_ce flex-wrap">
                    <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.staffList}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Back')}</Link>
                    {isLoading == true ?   
                    <Button disabled htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.confirmationStaff}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Content_Confirmation')}<Spin style={{color:"#fff"}} indicator={antIcon} /></Button>
                  :  <Button htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.confirmationStaff}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Content_Confirmation')}</Button>
                  }
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

export default EditStaff
