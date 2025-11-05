import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider, Input, DatePicker, Select, Radio, AutoComplete, ConfigProvider } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar, CloseCircle } from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import Symptomsdata from '../../../../data/symptomsdata.json'
import Symptomsdataja from '../../../../data/symptomsdataja.json'
import TextArea from 'antd/es/input/TextArea';
import { enqueueSnackbar } from "notistack";
import dayjs from 'dayjs';
import jaJP from 'antd/locale/ja_JP';
import 'dayjs/locale/ja';
dayjs.locale('ja');
const { Option } = Select;

function AddReport() {
  const lang = localStorage.getItem('i18nextLng')
  const Symptomsall = lang == "en" ? Symptomsdata : Symptomsdataja
  const arraysmpatons = [{
    "symptoms": ""
  }]

  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const location = useLocation();
  const data = location.state
  // console.log(data, "data");
  const [date, setDate] = useState('')
  const [facility, setFacility] = useState([])
  const [respondent, setrespondent] = useState([])
  // const [staff, setStaff] = useState([])
  const [saffOption, setStaffOption] = useState([])
  // const [staffId, setStaffId] = useState(null);
  // const [staffName, setStaffname] = useState(null);
  const [symptomsModalOpen, setSymptomsModelOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [ptype, setPtype] = useState("");
  const [inputFieldall, setInputFieldall] = useState([]);
  const inputFieldKeys = Object.keys(inputFieldall);
  const [radiobuttonall, setRadiobuttonall] = useState([]);
  const radioButtonKeys = Object.keys(radiobuttonall);
  const [symptoms, setSymptoms] = useState([])
  const [emergencyall, setEmergencyall] = useState([]);
  const [responseall, setResponseall] = useState([]);
  const [alldata, setAlldata] = useState(arraysmpatons);
  const [draftdata, setDraftdata] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  // let selectedData = location?.state?.symptomsData;
  const [dependentInputVisibleData, setDependentInputVisibleData] = useState([]);
  const [alreadySelected, setalreadySelected] = useState([]);

  // const symptons = location?.state?.symptomsData
  // useEffect(()=>{
  //   if(symptons){
  //     setAlldata([])
  //     console.log(alldata,"gghjgjgjghjghjhj");
  //     console.log(("viral"));
  //     console.log(location?.state?.symptomsData,"11111");
  //     const olddata = location?.state?.symptomsData
  //     setAlldata(location?.state)
  //   }
  // },[location.state])

  // console.log(alldata,"alldata");
  const seletedchange = (field, index, value) => {
    // console.log(field, index, value, "eeee");

    let newData = [...alldata];
    newData[index][field] = value;
    // setAlldata(newData)
    Symptomsall.filter((f) => {
      const symptomName = Object.keys(f)[0];
      if (symptomName == value) {
        // console.log(f,"ffffffffffffff");
        const finaldata = f[symptomName];

        newData[index]["EmergancyTransport"] = finaldata.emergancyTransport
        newData[index]["response"] = finaldata.response
        setAlldata(newData)
      }
    })
    let allSym = alldata.map((e) => { return e.symptoms });

    setalreadySelected(allSym);

    console.log("Alreadyyy", alreadySelected)

    // alreadySelected.push(value);

  }
  const allradioandinputchange = (index, r, e) => {
    // console.log(index,r,e)
    let value = e?.target?.value || e;

    const dependentValue = r?.dependentValue?.toString();
    if (value == dependentValue) {
      // console.log(99)
      const dependentField = r?.dependentId?.toString();
      setDependentInputVisibleData(prevData => [...prevData, dependentField]);

    } else {
      // console.log(103)
      const dependentField = r?.dependentId?.toString();

      if (dependentInputVisibleData.includes(dependentField)) {

        let filter = dependentInputVisibleData.filter(r => r !== dependentField)
        setDependentInputVisibleData(filter);

        if (alldata[index]['radioButton'][r.name] != value) {
          console.log("herere deleted success", r.name)
          let del = r.name + "-" + dependentValue;
          // alldata[index]['radioButton'][del]=undefined;
          let newObj = alldata?.[index]?.['radioButton']

          var newArrObj = Object.assign({}, newObj);

          delete newArrObj[del];

          alldata[index]['radioButton'] = newArrObj

        }

      } else {
        console.log("110")
      }
    }

    // console.log(index, r, value, "value");
    let newData = [...alldata];
    // if (value === 1 || value === 0) {
    if (!newData[index]['radioButton']) {
      newData[index]['radioButton'] = {};
    }
    newData[index]['radioButton'][r.name] = value;
    // } else {
    //   if (!newData[index]['inputField']) {
    //     newData[index]['inputField'] = {};
    //   }
    //   newData[index]['inputField'][r] = value;
    // }

    setAlldata(newData)
  }

  const handleClick = () => {
    console.log(count, "count");
    if (count < 25) {
      console.log(ptype, "sdfghjkl");
      setSymptomsModelOpen(true);
      setCount(count + 1);
      console.log({ alldata });
      setAlldata([...alldata, {
        "symptoms": ""
      }]);
    }
  };
  const handleDeleteClick = (index) => {
    console.log(index, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    setAlldata((prevArray) => {
      const newArray = [...prevArray];
      console.log(newArray, "newArray");
      console.log(newArray[index], "newArray[index]");
      // if (newArray[index]) {
      if (index >= 0 && index < newArray.length) {
        newArray.splice(index, 1);
      }
      // }
      return newArray;
    })
    console.log(alldata, "alldata?.symptoms");
    alldata.map((t) => {
      form.setFieldsValue({ [`symptoms_${index}`]: t?.symptoms });
    })

  }

  useEffect(() => {

    Symptomsall.map((s) => {
      const symptomName = Object.keys(s)[0];
      if (symptomName == ptype) {
        const finaldata = s[symptomName];
        const inputdatafield = finaldata?.inputField;
        const radiodatafield = finaldata?.radioButton;
        const emergancyTransport = finaldata?.emergancyTransport;
        const response = finaldata?.response;
        setInputFieldall(inputdatafield);
        setRadiobuttonall(radiodatafield)
        setEmergencyall(emergancyTransport)
        setResponseall(response)
      }
    });
  }, [ptype])



  const Token = localStorage.getItem('token')

  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const RespondentName = parsedAdminData?.state?.userData?.name;
  const RespondentId = parsedAdminData?.state?.userData?._id;


  const setRDate = (e) => {
    console.log("hiii", e);
  }
  const getallfacility = (value) => {
    // console.log(value, "e");
    const datavalue = value;
    http.get(process.env.REACT_APP_BASE_URL + `/admin/facilityList?search=${datavalue}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setFacility(res?.data)
      })
  }


  const getallrespondent = (value) => {
    // console.log(value, "e");
    const datavalue = value;
    http.get(process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log(res?.data);
        setrespondent(res?.data)
      })
  }
  // const getAllStaff = (value) => {
  //   // console.log(value, "e");
  //   // const datavalue = value;
  //   // http.get(process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`, [], {
  //   http.get(process.env.REACT_APP_BASE_URL + `/admin/StaffList`, [], {
  //     headers: { 'authorization': 'Bearer ' + Token, lang: lang }
  //   })
  //     .then((res) => {
  //       console.log(res?.data,"All STAFF");
  //       setStaff(res?.data)
  //     })
  // }
  // const getAllStaff2 = (e,v) => {
  //   // console.log(value, "e");

  //   const datavalue = v ? v?.key || "":"";
  //   if(datavalue!=""){


  //   http.get(process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`, [], {
  //     headers: { 'authorization': 'Bearer ' + Token, lang: lang }
  //   })
  //     .then((res) => {
  //       console.log(res?.data,"search STAFF");
  //       setStaff(res?.data)
  //     })
  //   }
  // }

  const addreportdata = (e) => {
    console.log(e, "eeee");
    setDraftdata(e)
  }

  // useEffect(() => {
  //   let saffOptions = staff.map((f) => ({
  //     key: f._id.toString(),
  //     value: f.name,
  //   }));
  //   setStaffOption(saffOptions);

  //   if(saffOptions.length==1){

  //     setStaffId(saffOptions[0]?.key);
  //     setStaffname(saffOptions[0]?.value);
  //   }
  // }, [staff]);

  const addreport = (values) => {
    // console.log(values, "valuesvaluesvalues");
    // console.log(staffName,"bgghjghjghjgjghjghjggj");
    // console.log(resoptionsname, "options");
    // console.log('location?.state',location?.state);
    let fId = location?.state?.facilityId || location?.state?._id || location?.state?.facility_data?._id || "unknown";

    values.facilityId = fId;
    // values.facilityName = location?.state?.facilityName ? location?.state?.facilityName : location?.state?.facility_data?.name;
    values.facilityName = location?.state?.name || location?.state?.facilityName || location?.state?.facility_data?.name;
    values.respondentId = RespondentId;
    // values.staffId =  staffId; //  location?.state?.staffId ? location?.state?.staffId :
    // values.staffName = staffName //location?.state?.staffName ? location?.state?.staffName : staffName;
    const arrayvalues = [values]


    // values.symptomsId = values?.projectType
    values.resoptionsname = RespondentName;
    const { respondentDate } = values;

    //for dependent
    values.dependentField = dependentInputVisibleData;
    // console.log(values, "values")
    // console.log(respondentDate,123456);
    const respondent = currentDate
    values.respondentDate = respondent;
    values.symptomsData = alldata
    // return false
    if (draftdata == "draft") {
      setIsLoading(true);
      values.status = 1;
      http.callApi(url.addreport, values, {
        headers: { 'authorization': 'Bearer ' + Token, lang: lang }
      })
        .then((res) => {
          setIsLoading(false);
          navigate('/report-list')
          enqueueSnackbar(
            res.data.message,
            { variant: "success" },
            { autoHideDuration: 1000 }
          )
        }
        )
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar(
              error.response.data.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        })
    } else {
      navigate('/confirmation-report', { state: values })
    }

  }
  const currentDate = moment().format('YYYY-MM-DD H:mm a');
  const getSymptoms = (value) => {
    const datavalue = value;
    http.get(process.env.REACT_APP_BASE_URL + `/admin/symptoms`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        // console.log("symptoms:",res.data)
        setSymptoms(res.data)
      })
  }
  useEffect(() => {
    getSymptoms();
  }, [])

  useEffect(() => {
    // console.log("outside",dependentInputVisibleData)
    if (location.state) {
      // console.log("inside",dependentInputVisibleData)
      let fname = location?.state?.name || location?.state?.facilityName || location?.state?.facility_data?.name || "unknown";
      let fId = location?.state?._id || location?.state?._id || location?.state?.facility_data?._id || "unknown";

      // console.log(location.state.respondentDate);
      setDate(moment(location.state.respondentDate).format('DD-MM-YYYY'));
      // console.log(moment(location.state.respondentDate).format('DD-MM-YYYY'));
      // console.log(date);
      form.setFieldsValue({ facilityId: fId });
      form.setFieldsValue({ facilityName: fname });
      form.setFieldsValue({ nameOfFacility: location.state.nameOfFacility || location.state.nameOfFacility || location?.state?.facility_data?.yomi || location.state.yomi });
      form.setFieldsValue({ address: location.state.address || location?.state?.facility_data?.address });
      form.setFieldsValue({ mobile: location?.state?.mobile?.replace('+', '').trim() || location?.state?.facility_data?.mobile?.replace('+', '').trim() });
      form.setFieldsValue({ email: location?.state?.email || location?.state?.facility_data?.email });
      form.setFieldsValue({ respondentId: RespondentId });
      form.setFieldsValue({ respondentId: RespondentName });
      form.setFieldsValue({ staffId: location.state.staffId });
      form.setFieldsValue({ residentName: location.state.residentName });
      form.setFieldsValue({ respondentDate: dayjs(currentDate, "YYYY年M月D日") });
      form.setFieldsValue({ temperature: location.state.temperature });
      form.setFieldsValue({ bp: location.state.bp });
      form.setFieldsValue({ pulse: location.state.pulse });
      form.setFieldsValue({ sp02: location.state.sp02 });
      form.setFieldsValue({ projectType: location.state.projectType });
      form.setFieldsValue({ amountOfStool: location.state.amountOfStool });
      form.setFieldsValue({ respiratory: location.state.respiratory });
      form.setFieldsValue({ cyanosis: location.state.cyanosis });
      form.setFieldsValue({ reportType: location.state.reportType });
      form.setFieldsValue({ firstAid: location.state.firstAid });
      if (location?.state?.data === "confirmreport") {
        form.setFieldsValue({ memo: location.state.memo });
      }

      form.setFieldsValue({ staffId: location.state.staffId });
      form.setFieldsValue({ staffName: location.state.staffName });
      // setStaffId(location.state.staffId)
      // setStaffname(location.state.staffName)
      if (location?.state?.symptomsData) {

        if (location?.state?.dependentField) {
          setDependentInputVisibleData(location?.state?.dependentField)
        }
        let selectedSymp = location?.state?.symptomsData
        var symptomsArray = selectedSymp.map(item => item.symptoms);

        setalreadySelected(symptomsArray);
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
        setAlldata(location?.state?.symptomsData);
      }
    }
  }, [location.state]);
  // const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];

  return (
    <>
      <section className='ptb40'>
        <div className="custom_card mb30">
          <div className="custom_card_head flex_item_cb flex-wrap mb16">
            <h4>{t('Reports.Add_Report')}</h4>
          </div>
          <div className="custom_card_body">
            <Form layout='vertical' form={form} autoComplete="off" onFinish={addreport}>
              <div className="mb30">
                <label className='fs-16 mb10'>{t('Reports.Basic_Information')}</label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Facility_Name')} name="facilityName" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Facility Name is Required') : "名前は必須です",
                        // },
                      ]}>
                        <Input placeholder={t('Reports.Facility_Name')} readOnly name="facilityId" />
                        {/* <AutoComplete
                        className='custom-ant-select auto-complete-select'
                        options={options}
                        onChange={(e) => getallfacility(e)}
                        placeholder={t('Reports.Facility_Name')}
                      /> */}
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Name_of_Facility')} name="nameOfFacility" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Facility Name is Required') : "名前は必須です",
                        // },
                      ]}>
                        <Input placeholder={t('Reports.Name_of_Facility')} readOnly />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Address')} name="address" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Address is Required') : "住所は必須です",
                        // },
                      ]}>
                        <Input placeholder={t('Reports.Address')} readOnly />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Phone')} name="mobile" rules={[
                        {
                          required: true,
                          message: lang === "en" ? t('Mobile is Required') : "モバイルは必須です",
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
                        <Input placeholder={t('Reports.Phone')} readOnly />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }} >
                      <Form.Item label={t('Reports.Email')} className='mb0' name="email" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Email is Required') : "メールアドレスは必須です",
                        // },
                      ]}>
                        <Input placeholder={t('Reports.Email')} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={24}><Divider /></Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Respondent')} name="respondentId" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Respondent is Required') : "回答者は必須です",
                        // },
                      ]}>
                        <Input placeholder={t('Reports.Respondent')} readOnly />
                        {/* <AutoComplete
                        className='custom-ant-select auto-complete-select'
                        options={resoptions}
                        onChange={(e) => getallrespondent(e)}
                        placeholder={t('Reports.Respondent')}
                      /> */}
                      </Form.Item>

                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      {/* <Form.Item label={t('Reports.Response_Date')} name="respondentDate" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Respondent Date is Required') : "回答者の日付は必須です",
                        // },
                      ]}> */}


                      <ConfigProvider locale={jaJP}>

                        <Form.Item label={t('Reports.Response_Date')} name="respondentDate" >
                          <DatePicker
                            disabled defaultValue={date} className='custom-ant-picker' placeholder={t('Reports.Response_Date')} suffixIcon={<Calendar size="22" color="#707070" />} format={"YYYY年M月D日"} onChange={setRDate} disabledDate={(current) => current && current < moment().startOf('day')} />
                        </Form.Item>
                      </ConfigProvider>

                      {/* <DatePicker disabled defaultValue={date} className='custom-ant-picker' placeholder={t('Reports.Response_Date')} suffixIcon={<Calendar size="22" color="#707070" />} format={"DD-MM-YYYY"} onChange={setRDate} disabledDate={(current) => current && current < moment().startOf('day')} /> */}
                      {/* </Form.Item> */}
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Staff_name')} className='mb0' name="staffName" rules={[
                        {
                          required: true,
                          message: lang === "en" ? t('Staff Name is Required') : "スタッフ名は必須です",
                        },
                      ]}>
                        {/* <Input placeholder={t('Reports.Staff_name')} /> */}

                        <Input placeholder={t('Reports.Staff_name')} />

                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mb30">
                <label className='fs-16 mb10'>{t('Reports.Resident_information')}</label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Name')} className='mb0' name="residentName" rules={[
                        {
                          required: true,
                          message: lang === "en" ? t('Resident Name is Required') : "居住者名は必須です",
                        },
                      ]}>
                        <Input placeholder={t('Reports.Name')} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mb30">
                <label className='fs-16 mb10'>{t('Reports.Vitals')}</label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Temperature')} name="temperature"
                        rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Temperature is Required') : "温度は必須です",
                          // },
                          {
                            validator: (_, value) => {
                              if (value < -300 || value > 300) {
                                return Promise.reject(
                                  new Error(
                                    lang === "en"
                                      ? t('Temperature must be between -300 and 300')
                                      : "温度は -300 ～ 300 ℃でなければなりません"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}>
                        <Input placeholder={t('Reports.Temperature')} suffix={<span className='text-gray'>℃</span>} />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Blood_pressure')} name="bp" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Blood Pressure is Required') : "血圧は必須です",
                        // },
                        {
                          pattern: '^[0-9/0-9]*$',
                          message: lang === "en" ? t('Only Numbers') : "数字のみ",
                        },
                      ]}>
                        <Input placeholder={t('Reports.Blood_pressure')} suffix={<span className='text-gray'>MmHg</span>} />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Pulse')} name="pulse" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Pulse is Required') : "パルスが必要です",
                        // },
                        {
                          pattern: '^[0-9]*$',
                          message: lang === "en" ? t('Only Numbers') : "数字のみ",
                        },

                      ]}>
                        <Input placeholder={t('Reports.Pulse')} suffix={<span className='text-gray'>回/分</span>} />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.SPO2')} name="sp02" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Sp02 is Required') : "Sp02は必須です",
                        // },
                        {
                          pattern: '^[0-9]*$',
                          message: lang === "en" ? t('Only Numbers') : "数字のみ",
                        },
                        {
                          validator: (_, value) => {
                            const numericValue = parseInt(value, 10);
                            if (numericValue < 1 || numericValue > 100) {
                              return Promise.reject(
                                new Error(
                                  lang === "en"
                                    ? t('Sp02 must be between 1 and 100')
                                    : "Sp02は1から100の範囲内で入力してください"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}>
                        <Input placeholder={t('Reports.SPO2')} suffix={<span className='text-gray'>％</span>} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mb30">
                <label className='fs-16 mb10'>{t('Reports.Detailed_Report')}</label>
                <div className="border_card">
                  {alldata?.map((row, i) => {

                    let radiodatafield;
                    let observation;
                    let inputFieldall;
                    let emergancyTransport;
                    let response;
                    let valuedata
                    Symptomsall.map((s) => {
                      const symptomName = Object.keys(s)[0];

                      valuedata = row?.symptoms
                      if (symptomName == valuedata) {
                        const finaldata = s[symptomName];
                        inputFieldall = finaldata?.inputField;
                        radiodatafield = finaldata?.radioButton;
                        emergancyTransport = finaldata?.emergancyTransport;
                        observation = finaldata?.observation
                        response = finaldata?.response;

                      }
                    });
                    // let newData = [...alldata];
                    // { newData[i][valuedata] = emergancyTransport };
                    // { newData[i][valuedata] = response };
                    // setAlldata(newData)


                    return (<Row gutter={16} style={{ paddingTop: "50px" }}>
                      <Col sm={{ span: 12 }} xs={{ span: 24 }} >

                        <Col sm={{ span: 24 }} xs={{ span: 24 }} name="projectType" rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Project Type is Required') : "プロジェクトの種類は必須です",
                          // },
                        ]}>
                          {/* <Form.Item label={} name="projectType" rules={[ */}
                          <Form.Item labelCol={{ span: 24 }} className='label_flex_btn' label={<div className="flex_item_ce">
                            {
                              i < 1 ?
                                <a role='button' className='btn-link flex_item_ce gap1 text-success' onClick={handleClick} title='Add'><Add size="24" color="#0D0B0B" /> </a>
                                : <a role='button' className='btn-link flex_item_ce gap1 text-warning' onClick={() => handleDeleteClick(i)} title='cancel'><CloseCircle size="24" color="#ff0100" /> </a>
                            }
                          </div>
                          } name={"symptoms_" + i} rules={[

                          ]}>
                            <Select className='custom-ant-select' name={"symptoms_" + i} onChange={(e) => seletedchange('symptoms', i, e)} placeholder={t('Reports.Project_Type')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                              {
                                symptoms.map((s) => {
                                  const name = lang == "en" ? s?.ename : s?.jname;

                                  return alreadySelected.includes(lang == "en" ? s.ename : s.jname) ? "" :
                                    <Option value={name}>{lang == "en" ? s.ename : s.jname}</Option>
                                })
                              }
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col sm={{ span: 24 }}>

                          {radiodatafield &&
                            radiodatafield?.map((r) => {
                              let optionsData = r?.options
                              {/* console.log(optionsData); */ }

                              return (
                                <Col sm={{ span: 24 }} xs={{ span: 24 }} key={r.name}>
                                  {r?.type === "radio" ? (

                                    <Form.Item label={r.name} name={r.name} rules={[]}>
                                      <Radio.Group
                                        className='flex_item_cs'
                                        onChange={(e) => allradioandinputchange(i, r, e)}
                                      >
                                        {optionsData.map((d, index) => {
                                          return (<Radio id={r?.id} value={d} >{d}</Radio>)
                                        })}

                                      </Radio.Group>
                                    </Form.Item>
                                  ) : r?.type === "input" ?


                                    (

                                      <Form.Item label={r?.name} name={r?.name} rules={[]} style={{
                                        display:
                                          !r?.isDependent || (r?.isDependent && dependentInputVisibleData.includes(r?.id))
                                            ? ""
                                            : "none"
                                      }}>
                                        <Input placeholder={r?.name} onChange={(e) => allradioandinputchange(i, r, e)} />
                                      </Form.Item>
                                    ) :

                                    <Form.Item label={r?.name} name={r?.name} rules={[]} >

                                      <Select className='custom-ant-select' name={r?.name} onChange={(e) => allradioandinputchange(i, r, e)} placeholder={r?.name} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                                        {optionsData.map((d, index) => {
                                          return (<Option id={r?.id} value={d} >{d}</Option>)
                                        })}
                                      </Select>

                                      {/* <Input  placeholder={r?.name} onChange={(e) => allradioandinputchange(i, r, e)} /> */}
                                    </Form.Item>

                                  }
                                </Col>
                              );
                            })
                          }
                        </Col>

                      </Col>
                      <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                        <Col sm={{ span: 24 }} style={{ paddingBottom: "40px" }}>
                          {
                            observation?.length > 0 ?
                              <>
                                <h6 style={{ paddingTop: "35px", paddingBottom: "10px" }}>{lang == "en" ? "Observation/Confirmation" : "観察・確認事項"}</h6>
                                {/* <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}> */}
                                {
                                  observation?.map((e) => {
                                    return <p key={e} style={{ fontSize: "14px", color: "black", fontWeight: 600 }}>{e}</p>
                                  })
                                }
                                {/* </ul> */}
                              </>
                              : ""
                          }
                        </Col>
                        <Col sm={{ span: 24 }} style={{ paddingBottom: "40px" }}>
                          {
                            emergancyTransport?.length > 0 ?
                              <>
                                <h6 style={{ paddingBottom: "10px" }}>{lang == "en" ? "Emergency transport" : "緊急搬送"}</h6>
                                {/* <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}> */}
                                {
                                  emergancyTransport?.map((e) => {
                                    return <p key={e} style={{ fontSize: "14px", color: "black", fontWeight: 600 }}>{e}</p>
                                  })
                                }
                                {/* </ul> */}
                              </>
                              : ""
                          }
                        </Col>
                        <Col sm={{ span: 24 }}>
                          {response?.length > 0 ?
                            <>
                              <h6 style={{ paddingBottom: "10px" }}>{lang == "en" ? "Response" : "対応"}</h6>
                              {/* <ul style={{ listStyleType: "circle", marginTop:"5px",paddingLeft: "35px", fontSize: "13px" }}> */}

                              {
                                response?.map((e) => {
                                  return e == "" ? <br /> : <p style={{ fontSize: "14px", color: "#202020", fontWeight: 400 }}>{e}</p>;
                                })
                              }
                              {/* </ul> */}
                            </>
                            : ""}

                        </Col>
                      </Col>
                    </Row>)
                  })}
                </div>
              </div>
              <Col span={24}>
                <Form.Item label={t('Reports.Memo')} name="memo" rules={[
                  {
                    required: true,
                    message: lang === "en" ? t('Memo Is Required') : "メモは必須です",
                  },
                ]}>
                  <TextArea placeholder={t('Reports.Memo')} rows={4} />
                </Form.Item>
              </Col>
              <div className="mb30">
                <label className='fs-16 mb10'>{t('Reports.Report_Types')}</label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item label={t('Reports.Emergency_Rescue')} className='mb0' name="reportType" rules={[
                        // {
                        //   required: true,
                        //   message: lang === "en" ? t('Report Type is Required') : "レポートの種類は必須です",
                        // },
                      ]}>
                        <Radio.Group className='flex_item_cs'>
                          <Radio value={1}>{t('Reports.Yes')}</Radio>
                          <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                        {/* <Input placeholder={t('Reports.Emergency_Rescue')} /> */}
                        {/* <Radio.Group className='flex_item_cs'>
                        <Radio value={1}>{t('Reports.Yes')}</Radio>
                        <Radio value={2}>{t('Reports.None')}</Radio>
                      </Radio.Group> */}
                      </Form.Item>
                    </Col>
                    {/* <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Reports.First_Aid')} className='mb0' name="firstAid" rules={[
                      {
                        required: true,
                        message: lang === "en" ? t('FirstAd is Required') : "初回必須",
                      },
                    ]}>
                      <Radio.Group className='flex_item_cs'>
                        <Radio value={1}>{t('Reports.Yes')}</Radio>
                        <Radio value={0}>{t('Reports.None')}</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col> */}
                  </Row>
                </div>
              </div>
              <Form.Item className="mb0">
                <Space className="flex_item_ce flex-wrap">
                  <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.reportList}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Back')}</Link>
                  <Button onClick={() => addreportdata("draft")} htmlType='submit' style={{ bgColor: "#0638be" }} className='btn-theme btn-with-icon ' to={PATH_FRONT.confirmationReport}>{t('Reports.Draft')}</Button>
                  <Button htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.confirmationReport}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Reports.Content_Confirmation')}</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>

    </>
  )
}

export default AddReport
