import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Form, Input, Modal, Radio, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowDown2, Add } from 'iconsax-react'
import url from '../../../Development.json'
import http from '../../../security/Http'
import { enqueueSnackbar } from "notistack";
import Symptomsdata from '../../data/symptomsdata.json'

const { Option } = Select
const { TextArea } = Input
function SymptomsModel(props) {
  const { modalOpenEvent, modalCloseEvent } = props
  console.log(props,"propsqqqqqqqqqqqqqqqq")
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [symptomsModalOpen, setSymptomsModelOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [symptomsModelList, setSymptomsModelList] = useState([]);
  const [ptype, setPtype] = useState("");
  const [inputFieldall, setInputFieldall] = useState([]);
  const inputFieldKeys = Object.keys(inputFieldall);
  const [radiobuttonall, setRadiobuttonall] = useState([]);
  const radioButtonKeys = Object.keys(radiobuttonall);
  const [alldata, setAlldata] = useState([]);
  const [symptoms, setSymptoms] = useState([])
  
  const [emergencyall, setEmergencyall] = useState([]);
  const [responseall, setResponseall] = useState([])

  const lang = localStorage.getItem('i18nextLng')
  const Token = localStorage.getItem('token')

  // const saveData = (values) => {
  //     // console.log(values)
  //     if(values?.ename){
  //         values.ename = values?.name.trim()
  //     }
  //     if(values?.jname){
  //         values.jname = values?.jame.trim()
  //     }

  //     // http.callApi(url.addSymptom, values, {
  //     //     headers: { 'authorization': 'Bearer ' + Token, lang: lang }
  //     // })
  //         // .then((res) => {
  //         //     // if (location?.state?.edit) {
  //         //     //   navigate('/my-page')
  //         //     //   enqueueSnackbar(
  //         //     //     lang == "en" ? "Profile updated successfully" : "プロファイルが正常に更新されました",
  //         //     //     { variant: "success" },
  //         //     //     { autoHideDuration: 1000 }
  //         //     //   );
  //         //     // } else {
  //         //     //navigate('/staff-list')
  //         //     modalCloseEvent(false)
  //         //     enqueueSnackbar(
  //         //         res.data.message,
  //         //         { variant: "success" },
  //         //         { autoHideDuration: 1000 }
  //         //     );
  //         //     //}

  //         // })
  //         // .catch((error) => {
  //         //     console.log(error)
  //         //     // let type = e.target.type == "email" ? "email": "mobile"  ;
  //         //     // console.log(error.response?.data?.errors?.ename)
  //         //     if (error.response?.data?.errors) {
  //         //         form.setFields([
  //         //             {
  //         //               name: "ename",
  //         //               errors: [error.response?.data?.errors?.ename]
  //         //             },
  //         //             {
  //         //                 name: "jname",
  //         //                 errors: [error.response?.data?.errors?.jname]
  //         //               }
  //         //           ]);

  //         //     }
  //         // })

  // }
  const getSymptoms = (value) => {
    // console.log(value, "e");
        setSymptoms(props.data)
    // const datavalue = value;
    // http.get(process.env.REACT_APP_BASE_URL + `/admin/symptoms`, [], {
    //   headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    // })
    //   .then((res) => {
    //     // console.log(res.data,"resdata")
    //     // symptoms.map((f) => ({ key: f._id.toString(), value: lang=="en" ? f.ename : f.jname }))
    //     // setOptions(res?.data?.map((f) => ({ key: f._id.toString(), value: lang == "en" ? f.ename : f.jname })))
    //     // console.log({options})

    //   })
  }
  useEffect(() => {
    getSymptoms();
  }, [])

  useEffect(() => {
    Symptomsdata.map((s) => {
      const symptomName = Object.keys(s)[0];
      // console.log(symptomName);

      if (symptomName == ptype) {
        const finaldata = s[symptomName];
        const inputdatafield = finaldata?.inputField;
        const radiodatafield = finaldata?.radioButton;
        const emergancyTransport = finaldata?.emergancyTransport;
        const response = finaldata?.response;
        const inputlength = Object.keys(inputdatafield).length;
        const radiolength = Object.keys(radiodatafield).length;
        setInputFieldall(inputdatafield);
        setRadiobuttonall(radiodatafield)
        setEmergencyall(emergancyTransport)
        setResponseall(response)
      }
    })
  }, [ptype])

  const handleClick = () => {
    console.log(count, "count");
    if (count < 25) {
      setSymptomsModelOpen(true);
      setCount(count + 1);
      // setSymptomsModelList([...symptomsModelList, <SymptomsModel key={count}  name={ptype}/>]);
    }
  };
  const seletedchange = (e) => {
    // console.log(e, "eeee");
    setPtype(e);
   
  }
  



  return (

    <>
      <div className="mb30">
        <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
        <div className="border_card">
          <Row gutter={16}>
            <Col sm={{ span: 12 }} xs={{ span: 24 }}>

              <Col sm={{ span: 24 }} xs={{ span: 24 }} name="projectType" rules={[
                // {
                //   required: true,
                //   message: lang === "en" ? t('Project Type is Required') : "プロジェクトの種類は必須です",
                // },
              ]}>
                {/* <Form.Item label={} name="projectType" rules={[ */}
                <Form.Item labelCol={{ span: 24 }} className='label_flex_btn' label={<div className="flex_item_cb">
                  {/* <label className='fs-16 mb10'>{t('Reports.Project_Type')}</label> */}
                  {/* <a role='button' className='btn-link flex_item_cc gap1 text-success' onClick={handleClick} title='Add'><Add size="24" color="#0D0B0B" /> </a> */}
                </div>
                } name="projectType" rules={[
                  // {
                  //   required: true,
                  //   message: lang === "en" ? t('Project Type is Required') : "プロジェクトの種類は必須です",
                  // },
                ]}>
                  <Select className='custom-ant-select' onChange={(e) => seletedchange(e)} placeholder={t('Reports.Project_Type')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                    {/* <Option value="1">Big Project</Option>
                        <Option value="2">Small Project</Option>
                        <Option value="3">Short Time Project</Option> */}
                    {
                      symptoms.map((s) => {
                        return <Option value={s.ename}>{lang == "en" ? s.ename : s.jname}</Option>
                      })
                    }
                  </Select>
                  {/* <Select
                            className='custom-ant-select'
                            placeholder={t('Reports.Project_Type')}
                            suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}
                            mode="multiple"
                            onChange={(e)=> seletedchange(e)}
                            showArrow
                            // defaultValue={['gold', 'cyan']}
                            style={{ width: '100%' }}
                            options={options}
                          /> */}
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                {
                  radioButtonKeys?.map((r) => {
                    // console.log(r);
                    return (<Col sm={{ span: 24 }} xs={{ span: 24 }}>
                      <Form.Item label={r} name={`${ptype} ${r}`} rules={[
                      ]}>
                        <Radio.Group className='flex_item_cs'>
                          <Radio value={1}>{t('Reports.Yes')}</Radio>
                          <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>)
                  })
                }
              </Col>
              <Col sm={{ span: 24 }}>
                {
                  inputFieldKeys?.map((n) => {
                    // console.log(n, "n");
                    return (<Col sm={{ span: 24 }} xs={{ span: 24 }}>
                      <Form.Item label={n} name={`${ptype} ${n}`} rules={[
                      ]}>
                        <Input placeholder={n} />
                      </Form.Item>
                    </Col>)
                  })
                }
              </Col>
              {/* <Col sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Form.Item label={t('Reports.Deterioration_Of_Respiratory_Condition')} name="respiratory" rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Respiratory is Required') : "呼吸器が必要です",
                          // },
                        ]}>
                          <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Form.Item label={t('Reports.Cyanosis')} className='mb0' name="cyanosis" rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Cyanosis is Required') : "チアノーゼが必要です",
                          // },
                        ]}>
                          <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col sm={{ span: 24 }} xs={{ span: 24 }} >
                        <Form.Item label={t('Reports.Amount_Of_Stool')} name="amountOfStool" rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Amount Of Stool is Required') : "必要な便の量",
                          // },
                        ]}>
                          <Input placeholder={t('Reports.Amount_Of_Stool')} />
                        </Form.Item>
                      </Col> */}
            </Col>
            <Col sm={{ span: 12 }} xs={{ span: 24 }}>
              <Col sm={{ span: 24 }} >

                {
                  emergencyall.length > 0 ?
                    <>
                      <h6> Emergency transport</h6>
                      <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                        {
                          emergencyall?.map((e) => {
                            return <li key={e}>{e}</li>
                          })
                        }
                      </ul>
                    </>
                    : ""
                }

              </Col>
              <Col sm={{ span: 24 }}>
                {responseall.length > 0 ?
                  <>
                    <h6>Response</h6>
                    <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                      {
                        responseall?.map((e) => {
                          return <li key={e}>{e}</li>
                        })
                      }
                    </ul>
                  </>
                  : ""}

              </Col>
            </Col>
          </Row>
        </div>
      </div>
      {/* {symptomsModalOpen && (
                <SymptomsModel
                  modalOpenEvent={symptomsModalOpen}
                  modalCloseEvent={setSymptomsModelOpen}
                />
              )} */}
    </>

    // <Modal
    //     title={<h5>{t('table_title.Add_Symptoms')}</h5>}
    //     centered
    //     open={modalOpenEvent}
    //     // onOk={() => modalCloseEvent(false)}
    //     onCancel={() => modalCloseEvent(false)}
    //     footer={false}
    // >
    //     <div className="">
    //         <Form layout='vertical' form={form} autoComplete="off" onFinish={saveData}>

    //             <Row gutter={16}>

    //                 {/* <Col xs={{ span: 24 }}>
    //                     <Form.Item className='mb16' required label={t('dashboard.Comment')}>
    //                         <TextArea rows={4} placeholder={t('dashboard.Please_describe_progress_report_etc')}></TextArea>
    //                     </Form.Item>
    //                 </Col> */}
    //                 {/* <Col xs={{ span: 24 }}>
    //                     <Form.Item className='mb16' required label={t('dashboard.Confirmation')}>
    //                         <Checkbox>{t('dashboard.Please_make_sure_to_check_the_box_after_confirmation')}</Checkbox>
    //                     </Form.Item>
    //                 </Col> */}
    //                 <Col xs={{ span: 24 }}>
    //                     <Form.Item className='mb16'  label={t('Facility_Information.Symptom_En_Name')} name="ename"

    //                         rules={[
    //                             {
    //                                 required: true,
    //                                 message: lang === "en" ? t('English Name is Required') : "居住者名は必須です",
    //                             },
    //                         ]}
    //                     >
    //                         <Input placeholder={t('Facility_Information.Symptom_En_Name')} />
    //                     </Form.Item>
    //                     <Form.Item className='mb16' required label={t('Facility_Information.Symptom_Ja_Name')} name="jname"

    //                     rules={[
    //                             {
    //                                 required: true,
    //                                 message: lang === "en" ? t('Japaneese Name is Required') : "居住者名は必須です",
    //                             },
    //                         ]}

    //                     >
    //                         <Input placeholder={t('Facility_Information.Symptom_Ja_Name')} />
    //                     </Form.Item>
    //                 </Col>
    //                 <Form.Item className='mb0' style={{ width: "100%" }}>
    //                     <div className="flex_item_cc flex-wrap">
    //                         <Button onClick={() => modalCloseEvent(false)} className='btn-theme btn-danger' >{t('table_title.Cancel')} </Button>
    //                         <Button htmlType='submit' className='btn-theme btn-success' >{t('table_title.Save')}</Button>
    //                     </div>
    //                 </Form.Item>
    //             </Row>
    //         </Form>
    //     </div>
    // </Modal>
  )
}

export default SymptomsModel
