import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Row, Space, Col, Select, DatePicker, Checkbox, message, Upload } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, DocumentUpload } from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
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
  // console.log(data);


  var lang = localStorage.getItem('i18nextLng')
  useEffect(() => { 
    if (location.state) {
      form.setFieldsValue({ name: location.state.name }); 
      form.setFieldsValue({ yomi: location.state.yomi }); 
      form.setFieldsValue({ frigana: location.state.frigana }); 
      form.setFieldsValue({ email: location.state.email }); 
      form.setFieldsValue({ mobile: location.state.mobile }); 
      form.setFieldsValue({ address: location.state.address }); 
    }
  }, [location.state]);

  let [licence, setlicence] = useState([])
  let [contract, setContract] = useState([])
  var [licenseDocument, setLicenceDocument] = useState([]);
  var [contractDocument, setContractDocument] = useState([]);
  var checkImageType = (file, type) => {
    if (file.type.includes('image/')) {
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
          }
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
    } else if (licenseDocument) {
      const filteredDocumentList = licenseDocument.filter((doc) => {
        return doc.uid != file.uid;
      })
      setLicenceDocument(filteredDocumentList);
    }
  };

  
  const editstaff = (values) => {
    values.contract = contract || "";
    values.license = licence || "";
    values._id = data._id
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
                <Form.Item label={t('Staff.Yomi')} name="yomi" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Yomi Is Required') : "ヨミは必須です",
                  },
                ]}>
                  <Input defaultValue={data?.yomi} type='text' placeholder={t('Staff.Yomi')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Frigana')} name="frigana" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Yomi Is Required') : "ヨミは必須です",
                  },
                ]}>
                  <Input defaultValue={data?.frigana} type='text' placeholder={t('Staff.Frigana')} />
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
                <Form.Item label={t('Staff.Phone')} name="mobile" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Mobile Number Is Required') : "携帯電話番号は必須です",
                  },
                  {
                    min: 10,
                    message: lang === "en" ? t('Mobile Number must be 10-12 digit') : "携帯電話番号は10～12桁でなければなりません",
                  },
                  {
                    max: 12,
                    message: lang === "en" ? t('Mobile Number must be 10-12 digit!') : "携帯電話番号は10～12桁でなければなりません！",
                  },
                ]}>
                  <Input defaultValue={data?.mobile} type='number' placeholder={t('Staff.Phone')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Address')} name="address" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Address Is Required') : "住所は必須です",
                  },
                ]}>
                  <Input defaultValue={data?.address} type='text' placeholder={t('Staff.Address')} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Nursing_License')}>
                <Dragger fileList={licenseDocument} multiple={false} maxCount={1} accept={"image/*"} beforeUpload={(e) => checkImageType(e, "license")} onRemove={handleRemoveImage}>
                    <p className="ant-upload-drag-icon">
                      <DocumentUpload size="40" color="#707070" />
                    </p>
                    <h6 className="ant-upload-text fs-16">{t('Edit_Facility.Contract_File_Title')}</h6>
                    <p className="ant-upload-hint text-gray">{t('Edit_Facility.Contract_File_Text')}</p>
                  </Dragger>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                <Form.Item label={t('Staff.Contract')}>
                <Dragger fileList={contractDocument} multiple={false} maxCount={1} accept={"image/*"} beforeUpload={(e) => checkImageType(e, "contract")} onRemove={handleRemoveImage}>
                    <p className="ant-upload-drag-icon">
                      <DocumentUpload size="40" color="#707070" />
                    </p>
                    <h6 className="ant-upload-text fs-16">{t('Edit_Facility.Contract_File_Title')}</h6>
                    <p className="ant-upload-hint text-gray">{t('Edit_Facility.Contract_File_Text')}</p>
                  </Dragger>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item className="mb0">
                  <Space className="flex_item_ce flex-wrap">
                    <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.staffList}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Back')}</Link>
                    <Button htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.confirmationStaff}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Staff.Content_Confirmation')}</Button>
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
