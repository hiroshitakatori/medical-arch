import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Space,
  Col,
  Divider,
  Input,
  DatePicker,
  Select,
  Radio,
  AutoComplete,
  ConfigProvider
} from "antd";
import {
  Add,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  CloseCircle,
} from "iconsax-react";
import { PATH_FRONT } from "../../../../routes/path";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import http from "../../../../../security/Http";
import moment from "moment";
// import SymptomsModel from '../../../modals/SymptomsModel';
import { Option } from "antd/es/mentions";
import Symptomsdata from "../../../../data/symptomsdata.json";
import Symptomsdataja from "../../../../data/symptomsdataja.json";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import jaJP from 'antd/locale/ja_JP';
import 'dayjs/locale/ja';
dayjs.locale('ja');

function EditReport() {
  const lang = localStorage.getItem("i18nextLng");
  const Symptomsall = lang == "en" ? Symptomsdata : Symptomsdataja;
  const arraysmpatons = [
    {
      symptoms: "",
    },
  ];
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  // console.log(data);
  const [symptoms, setSymptoms] = useState([]);
  const [facility, setFacility] = useState([]);
  const [options, setOptions] = useState([]);
  const [facilityId, setFacilityId] = useState(null);
  const [facilityname, setFacilityname] = useState(null);
  const [alldata, setAlldata] = useState(arraysmpatons);
  const [count, setCount] = useState(0);

  const [symptomsModalOpen, setSymptomsModelOpen] = useState(false);
  const Token = localStorage.getItem("token");

  const adminData = localStorage.getItem("auth-storage");
  const parsedAdminData = JSON.parse(adminData);
  const RespondentName = parsedAdminData?.state?.userData?.name;
  const RespondentId = parsedAdminData?.state?.userData?._id;

  const [staff, setStaff] = useState([]);
  const [saffOption, setStaffOption] = useState([]);
  // const [staffId, setStaffId] = useState(null);
  // const [staffName, setStaffname] = useState(null);
  const [dependentInputVisibleData, setDependentInputVisibleData] = useState([]);
  const [alreadySelected,setalreadySelected]=useState([]);

  useEffect(() => {
    // console.log(facility)
    const facilityOptions = facility.map((f) => ({
      key: f._id.toString(),
      value: f.name,
    }));
    setFacilityId(facilityOptions[0]?.key);
    setFacilityname(facilityOptions[0]?.value);
  }, [facility]);

  const seletedchange = (field, index, value) => {
    console.log(field, index, value, "eeee");
    let newData = [...alldata];
    newData[index][field] = value;
    setAlldata(newData);
    Symptomsall.filter((f) => {
      const symptomName = Object.keys(f)[0];
      if (symptomName == value) {
        console.log(f, "ffffffffffffff");
        const finaldata = f[symptomName];
        console.log(finaldata.emergancyTransport, "data");
        newData[index]["EmergancyTransport"] = finaldata.emergancyTransport;
        newData[index]["response"] = finaldata.response;
        setAlldata(newData);
      }
    });
    // setalreadySelected(preData=>[...preData,value]);
    let allSym = alldata.map((e)=> {return e.symptoms});
   
    setalreadySelected(allSym);
    console.log("Alreadyyy",alreadySelected)
  };

  const allradioandinputchange = (index, r, e) => {
    let value = e?.target?.value || e;

    const dependentValue = r?.dependentValue?.toString();
    if (value == dependentValue) {
      // console.log(99);
      const dependentField = r?.dependentId?.toString();
      setDependentInputVisibleData((prevData) => [...prevData, dependentField]);
    } else {
      // console.log(103);
      const dependentField = r?.dependentId?.toString();

      if (dependentInputVisibleData.includes(dependentField)) {
        let filter = dependentInputVisibleData.filter(
          (r) => r !== dependentField
        );
        setDependentInputVisibleData(filter);
      } else {
        // console.log("110");
      }
    }

    // console.log(index, r, value, "value");
    let newData = [...alldata];
    // if (value === 1 || value === 0) {
    if (!newData[index]["radioButton"]) {
      newData[index]["radioButton"] = {};
    }
    newData[index]["radioButton"][r.name] = value;
    // } else {
    //   if (!newData[index]['inputField']) {
    //     newData[index]['inputField'] = {};
    //   }
    //   newData[index]['inputField'][r] = value;
    // }

    setAlldata(newData);
  };

  const handleClick = () => {
    console.log(count, "count");
    if (count < 25) {
      setSymptomsModelOpen(true);
      setCount(count + 1);
      console.log({ alldata });
      setAlldata([
        ...alldata,
        {
          symptoms: "",
        },
      ]);
    }
  };

  const handleDeleteClick = (i) => {
    console.log(i, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    const index = i?.i;
    // console.log(index, "iiiiiiiiiiiiiiii");
    setAlldata((prevArray) => {
      const newArray = [...prevArray];
      // console.log(newArray, "newArray");
      // console.log(newArray[index], "newArray[index]");
      // if (newArray[index]) {
      if (index >= 0 && index < newArray.length) {
        newArray.splice(index, 1);
      }
      // }
      return newArray;
    });
    alldata.map((t) => {
      form.setFieldsValue({ [`symptoms_${index}`]: t?.symptoms });
    });
    let set2 = alreadySelected;
    set2.splice(index,1);
    setalreadySelected(set2)
  };

  // const getallfacility = (value) => {
  //   // console.log(value, "e");
  //   const datavalue = value;
  //   http.get(process.env.REACT_APP_BASE_URL + `/admin/facilityList?search=${datavalue}`, [], {
  //     headers: { 'authorization': 'Bearer ' + Token, lang: lang }
  //   })
  //     .then((res) => {
  //       setFacility(res.data)
  //     })
  // }

  const getSymptoms = (value) => {
    // console.log(value, "e");
    http
      .get(process.env.REACT_APP_BASE_URL + `/admin/symptoms`, [], {
        headers: { authorization: "Bearer " + Token, lang: lang },
      })
      .then((res) => {
        setSymptoms(res.data);
        // setOptions(res?.data?.map((f) => ({ key: f._id.toString(),value: lang=="en" ? f.ename : f.jname})))
      });
  };
  useEffect(() => {
    getSymptoms();
  }, []);
  if (symptoms && location?.state?.mode) {
    // console.log(symptoms,"hereree")
    form.setFieldsValue({ symptomsId: symptoms });
  } else {
    // console.log("goooo")
    // console.log(location.state.symptomsId)
    // console.log(location.state.projectType)
    form.setFieldsValue({ symptomsId: location.state.symptomsId });
  }
  // useEffect(() => {
  //   const respondentOptions = respondent.map((f) => ({ key: f._id.toString(), value: f.name }));
  //   // console.log(respondentOptions, "respondentOptions");
  //   setResOptions(respondentOptions);
  //   setResoptionsId(respondentOptions[0]?.key);
  //   setResoptionsname(respondentOptions[0]?.value)
  // }, [respondent]);

  // const getallrespondent = (value) => {
  //   // console.log(value, "e");
  //   const datavalue = value;
  //   const Token = localStorage.getItem('token')
  //   http.get(process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`, [], {
  //     headers: { 'authorization': 'Bearer ' + Token, lang: lang }
  //   })
  //     .then((res) => {
  //       // console.log(res?.data);
  //       setrespondent(res?.data)
  //     })
  // }

  const addreport = (values) => {
    // console.log(values);
    // console.log(staffId, staffName);
    const { respondentDate } = values;
    const respondent = location?.state?.respondentDate
    values.facilityId = location?.state?.facility_data?._id
      ? location?.state?.facility_data?._id
      : location.state?._id;
    values.facilityName = location?.state?.facility_data?.name
      ? location?.state?.facility_data?.name
      : location?.state?.name;
    values.respondentId = RespondentId;
    values.resoptionsname = RespondentName;
    // values.staffId = staffId;
    // values.staffName = staffName;
    values.respondentDate = respondent;
    values._id = data._id;
    values.symptomsData = alldata;
    values.dependentField = dependentInputVisibleData;

    // values.symptomsId = values?.projectType
    // console.log("button is clicked");
    console.log(values, "data");
    // return false
    navigate("/confirmation-report", { state: values });
  };

  // const currentDate = moment().format('YYYY-MM-DD');
  useEffect(() => {
    console.log(185, location.state);
    if (location.state) {
      // form.setFieldsValue({key:{facilityId: location.state.facility_data?._id}, value:{facilityId: location.state.facility_data?.name} });
      form.setFieldsValue({
        facilityId: location.state.facility_data?._id
          ? location.state.facility_data?._id
          : location.state?._id,
      });
      form.setFieldsValue({
        facilityId: location.state.facility_data?.name
          ? location.state.facility_data?.name
          : location.state.name,
      });
      form.setFieldsValue({ nameOfFacility: location.state.nameOfFacility });
      form.setFieldsValue({ address: location.state.address });
      form.setFieldsValue({ mobile: location.state.mobile });
      form.setFieldsValue({ email: location.state.email });
      form.setFieldsValue({ staffName: location.state.staffName });
      form.setFieldsValue({
        respondentId: location.state.respondent_data?.name
          ? location.state.respondent_data?.name
          : location?.state?.resoptionsname,
      });
      form.setFieldsValue({
        staffName: location.state?.staff_data?.name
          ? location.state.staff_data?.name
          : location?.state?.staffName,
      });
      form.setFieldsValue({
        staffId: location?.state?.staff_data?.name
          ? location?.state?.staff_data?.name
          : location?.state?.staff_data?.name,
      });

      form.setFieldsValue({ residentName: location.state.residentName });
      form.setFieldsValue({
        respondentDate: 
        dayjs(location.state.createDate
          ? location.state.createDate
          : location.state.respondentDate, "YYYY年M月D日")
      });
      // form.setFieldsValue({
      //   respondentDate: moment(
      //     location.state.createDate
      //       ? location.state.createDate
      //       : location.state.respondentDate,
      //     "YYYY-MM-DD"
      //   ),
      // });
      form.setFieldsValue({ temperature: location?.state?.temperature });
      form.setFieldsValue({ bp: location?.state?.bp });
      form.setFieldsValue({ pulse: location?.state?.pulse });
      form.setFieldsValue({ sp02: location?.state?.sp02 });
      // form.setFieldsValue({ projectType: location.state.symptomsId });
      // console.log(location?.state.symptomsId,"....")
      // setSymptoms(location.state.symptomsId)
      if(location?.state?.data === "confirmreport"){
        form.setFieldsValue({ memo: location?.state?.memo });
      }
      form.setFieldsValue({ amountOfStool: location?.state?.amountOfStool });
      form.setFieldsValue({ respiratory: location?.state?.respiratory });
      form.setFieldsValue({ cyanosis: location?.state?.cyanosis });
      form.setFieldsValue({ reportType: location?.state?.reportType });
      form.setFieldsValue({ firstAid: location?.state?.firstAid });

      form.setFieldsValue({
        staffId: location?.state?.staffId
          ? location?.state?.staffId
          : location?.state?.staff_data?._id,
      });
      form.setFieldsValue({
        staffName: location?.state?.staffId
          ? location?.state?.staffId
          : location?.state?.staff_data?.name,
      });
      // setStaffId(
      //   location?.state?.staffId
      //     ? location?.state?.staffId
      //     : location?.state?.staff_data?._id
      // );
      // setStaffname(
      //   location?.state?.staffId
      //     ? location?.state?.staffId
      //     : location?.state?.staff_data?.name
      // );

      // edit

      if (location?.state?.symptomsData) {
        setDependentInputVisibleData(location?.state?.dependentField);
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

        let selectedSymp = location?.state?.symptomsData
        var symptomsArray = selectedSymp.map(item => item.symptoms);
  
        setalreadySelected(symptomsArray );
        console.log(symptomsArray)
        // Update the state with the temporary array
        setAlldata(location?.state?.symptomsData);
      }
    }
  }, [location.state]);

  const getAllStaff = (value) => {
    // console.log(value, "e");
    const datavalue = value;
    http
      .get(
        process.env.REACT_APP_BASE_URL + `/admin/StaffList`,
        [],
        {
          headers: { authorization: "Bearer " + Token, lang: lang },
        }
      )
      .then((res) => {
        console.log(res?.data, "STAFF");
        setStaff(res?.data);
      });
  };
  const getAllStaff2 = (e,value) => {
    // console.log(value, "e");
    const datavalue = value ? value?.key || "" :"";
    if(datavalue!=""){

    
    http
      .get(
        process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`,
        [],
        {
          headers: { authorization: "Bearer " + Token, lang: lang },
        }
      )
      .then((res) => {
        console.log(res?.data, "STAFF");
        setStaff(res?.data);
      });
  };
}    
  useEffect(() => {
    let saffOptions = staff.map((f) => ({
      key: f._id.toString(),
      value: f.name,
    }));
    setStaffOption(saffOptions);

    // if (saffOptions.length == 1) {
    //   setStaffId(saffOptions[0]?.key);
    //   setStaffname(saffOptions[0]?.value);
    // }
  }, [staff]);

  return (
    <>
      <section className="ptb40">
        <div className="custom_card mb30">
          <div className="custom_card_head flex_item_cb flex-wrap mb16">
            <h4>{t("Reports.Edit_Report")}</h4>
          </div>
          <div className="custom_card_body">
            <Form
              layout="vertical"
              form={form}
              autoComplete="off"
              onFinish={addreport}
            >
              <div className="mb30">
                <label className="fs-16 mb10">
                  {t("Reports.Basic_Information")}
                </label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Facility_Name")}
                        name="facilityId"
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: lang === "en" ? t('Facility Name is Required') : "名前は必須です",
                            // },
                          ]
                        }
                      >
                        <Input
                          placeholder={t("Reports.Facility_Name")}
                          readOnly
                        />
                        {/* <AutoComplete
                     className='custom-ant-select auto-complete-select'
                        options={options}
                        onChange={(e)=>getallfacility(e)}
                        placeholder={t('Reports.Facility_Name')}
                        defaultValue={{key:mydefaultValue,value:mydefaultValue}}
                      /> */}
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Name_of_Facility")}
                        name="nameOfFacility"
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: lang === "en" ? t('Facility Name is Required') : "名前は必須です",
                            // },
                          ]
                        }
                      >
                        <Input placeholder={t("Reports.Name_of_Facility")} />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Address")}
                        name="address"
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: lang === "en" ? t('Address is Required') : "住所は必須です",
                            // },
                          ]
                        }
                      >
                        <Input placeholder={t("Reports.Address")} />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Phone")}
                        name="mobile"
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: lang === "en" ? t('Mobile is Required') : "モバイルは必須です",
                            // },
                            // {
                            //   min: 10,
                            //   message: lang === "en" ? t('Mobile Number must be 10-12 digit') : "携帯電話番号は10～12桁でなければなりません",
                            // },
                            // {
                            //   max: 12,
                            //   message: lang === "en" ? t('Mobile Number must be 10-12 digit!') : "携帯電話番号は10～12桁でなければなりません！",
                            // },
                          ]
                        }
                      >
                        <Input placeholder={t("Reports.Phone")} />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Email")}
                        className="mb0"
                        name="email"
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: lang === "en" ? t('Email is Required') : "メールアドレスは必須です",
                            // },
                          ]
                        }
                      >
                        <Input placeholder={t("Reports.Email")} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Divider />
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Respondent")}
                        name="respondentId"
                        rules={
                          [
                            // {
                            //   required: true,
                            //   message: lang === "en" ? t('Respondent is Required') : "回答者は必須です",
                            // },
                          ]
                        }
                      >
                        <Input placeholder={t("Reports.Respondent")} readOnly />
                        {/* <AutoComplete
                      className='custom-ant-select auto-complete-select'
                        options={resoptions}
                        onChange={(e) => getallrespondent(e)}
                        placeholder={t('Reports.Respondent')}
                      /> */}
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      
                        {/* <DatePicker
                          disabled
                          className="custom-ant-picker"
                          placeholder={t("Reports.Response_Date")}
                          suffixIcon={<Calendar size="22" color="#707070" />}
                          format={"DD-MM-YYYY"}
                          disabledDate={(current) =>
                            current && current <= moment().endOf("day")
                          }
                          readonly
                        /> */}
                        <ConfigProvider locale={jaJP}>

                        <Form.Item label={t('Reports.Response_Date')} name="respondentDate" >
                        <DatePicker
                            disabled  className='custom-ant-picker'  placeholder={t("Reports.Response_Date")} suffixIcon={<Calendar size="22" color="#707070" />} 
                            format={"YYYY年M月D日"} 
                            disabledDate={(current) =>
                            current && current <= moment().endOf("day")
                          }
                            />
                        </Form.Item>
                        </ConfigProvider>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Staff_name")}
                        className="mb0"
                        name="staffName"
                        rules={[
                          {
                            required: true,
                            message:
                              lang === "en"
                                ? t("Staff Name is Required")
                                : "スタッフ名は必須です",
                          },
                        ]}
                      >
                        <Input placeholder={t('Reports.Staff_name')} />
                        {/* <AutoComplete
                          className="custom-ant-select auto-complete-select"
                          options={saffOption}
                          onClick={(e) => getAllStaff(e)}
                          onChange={(e,v) => getAllStaff2(e,v)}
                          placeholder={t("Reports.Staff_name")}
                        /> */}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mb30">
                <label className="fs-16 mb10">
                  {t("Reports.Resident_information")}
                </label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Name")}
                        className="mb0"
                        name="residentName"
                        // rules={[
                        //   // {
                        //   //   required: true,
                        //   //   message: lang === "en" ? t('Resident Name is Required') : "居住者名は必須です",
                        //   // },
                        // ]}
                      >
                        <Input placeholder={t("Reports.Name")} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="mb30">
                <label className="fs-16 mb10">Vitals</label>
                <div className="border_card">
                  <Row gutter={16}>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Temperature")}
                        name="temperature"
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
                                      ? t(
                                          "Temperature must be between -300 and 300"
                                        )
                                      : "温度は -300 ～ 300 ℃でなければなりません"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("Reports.Temperature")}
                          suffix={<span className="text-gray">℃</span>}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Blood_pressure")}
                        name="bp"
                        rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Blood Pressure is Required') : "血圧は必須です",
                          // },
                          {
                            pattern: "^[0-9/0-9]*$",
                            message:
                              lang === "en" ? t("Only Numbers") : "数字のみ",
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("Reports.Blood_pressure")}
                          suffix={<span className="text-gray">MmHg</span>}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.Pulse")}
                        name="pulse"
                        rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Pulse is Required') : "パルスが必要です",
                          // },
                          {
                            pattern: "^[0-9]*$",
                            message:
                              lang === "en" ? t("Only Numbers") : "数字のみ",
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("Reports.Pulse")}
                          suffix={
                            <span className="text-gray">回/分</span>
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        label={t("Reports.SPO2")}
                        name="sp02"
                        rules={[
                          // {
                          //   required: true,
                          //   message: lang === "en" ? t('Sp02 is Required') : "Sp02は必須です",
                          // },
                          {
                            pattern: "^[0-9]*$",
                            message:
                              lang === "en" ? t("Only Numbers") : "数字のみ",
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("Reports.SPO2")}
                          suffix={<span className="text-gray">％</span>}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="mb30">
                <label className="fs-16 mb10">
                  {t("Reports.Report_Types")}
                </label>
                <div className="border_card">
                  {alldata?.map((row, i) => {
                    let radiodatafield;
                    let observation;
                    let inputFieldall;
                    let emergancyTransport;
                    let response;
                    let valuedata;
                    Symptomsall.map((s) => {
                      const symptomName = Object.keys(s)[0];

                      valuedata = row?.symptoms;
                      if (symptomName == valuedata) {
                        const finaldata = s[symptomName];
                        inputFieldall = finaldata?.inputField;
                        radiodatafield = finaldata?.radioButton;
                        emergancyTransport = finaldata?.emergancyTransport;
                        observation = finaldata?.observation;
                        response = finaldata?.response;
                      }
                    });
                    // let newData = [...alldata];
                    // { newData[i][valuedata] = emergancyTransport };
                    // { newData[i][valuedata] = response };
                    // setAlldata(newData)

                    return (
                      <Row gutter={16} style={{ paddingTop: "50px" }}>
                        <Col sm={{ span: 12 }} xs={{ span: 24 }} >
                          <Col
                            sm={{ span: 24 }}
                            xs={{ span: 24 }}
                            name="projectType"
                            rules={
                              [
                                // {
                                //   required: true,
                                //   message: lang === "en" ? t('Project Type is Required') : "プロジェクトの種類は必須です",
                                // },
                              ]
                            }
                          >
                            {/* <Form.Item label={} name="projectType" rules={[ */}
                            <Form.Item
                              labelCol={{ span: 24 }}
                              className="label_flex_btn"
                              label={
                                <div className="flex_item_ce">
                                  {i < 1 ? (
                                    <a
                                      role="button"
                                      className="btn-link flex_item_ce gap1 text-success"
                                      onClick={handleClick}
                                      title="Add"
                                    >
                                      <Add size="24" color="#0D0B0B" />
                                    </a>
                                  ) : (
                                    <a
                                      role="button"
                                      className="btn-link flex_item_ce gap1 text-warning"
                                      onClick={() => handleDeleteClick({ i })}
                                      title="cancel"
                                    >
                                      <CloseCircle size="24" color="#ff0100" />
                                      
                                    </a>
                                  )}
                                </div>
                              }
                              name={"symptoms_" + i}
                              rules={[]}
                            >
                              <Select
                                className="custom-ant-select"
                                name={"symptoms_" + i}
                                onChange={(e) =>
                                  seletedchange("symptoms", i, e)
                                }
                                placeholder={t("Reports.Project_Type")}
                                suffixIcon={
                                  <ArrowDown2
                                    size="18"
                                    color="#707070"
                                    variant="Bold"
                                  />
                                }
                              >
                                {symptoms.map((s) => {
                                  const name =
                                    lang == "en" ? s?.ename : s?.jname;
                                  return (
                                    alreadySelected.includes(lang == "en" ? s.ename : s.jname) ? "" : <Option value={name}>
                                      {lang == "en" ? s.ename : s.jname}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col sm={{ span: 24 }} >
                            {radiodatafield &&
                              radiodatafield?.map((r) => {
                                let optionsData = r?.options;
                                {
                                  /* console.log(optionsData); */
                                }

                                return (
                                  <Col
                                    sm={{ span: 24 }}
                                    xs={{ span: 24 }}
                                    key={r.name}
                                  >
                                    {r?.type === "radio" ? (
                                      <Form.Item
                                        label={r.name}
                                        name={r.name}
                                        rules={[]}
                                      >
                                        <Radio.Group
                                          className="flex_item_cs"
                                          onChange={(e) =>
                                            allradioandinputchange(i, r, e)
                                          }
                                        >
                                          {optionsData.map((d, index) => {
                                            return (
                                              <Radio id={r?.id} value={d}>
                                                {d}
                                              </Radio>
                                            );
                                          })}
                                        </Radio.Group>
                                      </Form.Item>
                                    ) : r?.type ==="input" ? (
                                      <Form.Item
                                        label={r?.name}
                                        name={r?.name}
                                        rules={[]}
                                        style={{
                                          display:
                                            !r?.isDependent ||
                                            (r?.isDependent &&
                                              dependentInputVisibleData?.includes(
                                                r?.id
                                              ))
                                              ? ""
                                              : "none",
                                        }}
                                      >
                                        <Input
                                          placeholder={r?.name}
                                          onChange={(e) =>
                                            allradioandinputchange(i, r, e)
                                          }
                                        />
                                      </Form.Item>
                                    ) :
                                    <Form.Item label={r?.name} name={r?.name} rules={[]} >
                                    
                                    <Select className='custom-ant-select' name={r?.name} onChange={(e) => allradioandinputchange(i, r, e)} placeholder={r?.name} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                                      {optionsData.map((d,index)=>{
                                        return(<Option id={r?.id} value={d} >{d}</Option>)
                                      })}  
                                    </Select>
                                     
                                    {/* <Input  placeholder={r?.name} onChange={(e) => allradioandinputchange(i, r, e)} /> */}
                                  </Form.Item>
                                    
                                    }
                                  </Col>
                                );
                              })}
                          </Col>
                        </Col>
                        <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                          <Col
                            sm={{ span: 24 }}
                            style={{ paddingBottom: "40px" }}
                          >
                            {observation?.length > 0 ? (
                              <>
                                <h6 style={{paddingTop:"35px", paddingBottom:"10px"}}>
                                  {lang == "en"
                                    ? "Observation/Confirmation"
                                    : "観察・確認事項"}
                                </h6>
                                {/* <ul
                                  style={{
                                    listStyleType: "circle",
                                    paddingLeft: "35px",
                                    fontSize: "13px",
                                  }}
                                > */}
                                  {observation?.map((e) => {
                                    return (
                                      <p
                                        key={e}
                                        style={{
                                          fontSize: "14px",
                                          color: "black",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {e}
                                      </p>
                                    );
                                  })}
                                {/* </ul> */}
                              </>
                            ) : (
                              ""
                            )}
                          </Col>
                          <Col
                            sm={{ span: 24 }}
                            style={{ paddingBottom: "40px" }}
                          >
                            {emergancyTransport?.length > 0 ? (
                              <>
                                <h6 style={{paddingBottom:"10px"}}>
                                  {lang == "en"
                                    ? "Emergency transport"
                                    : "緊急搬送"}
                                </h6>
                                {/* <ul
                                  style={{
                                    listStyleType: "circle",
                                    paddingLeft: "35px",
                                    fontSize: "13px",
                                  }}
                                > */}
                                  {emergancyTransport?.map((e) => {
                                    return <p key={e}>{e}</p>;
                                  })}
                                {/* </ul> */}
                              </>
                            ) : (
                              ""
                            )}
                          </Col>
                          <Col sm={{ span: 24 }}>
                            {response?.length > 0 ? (
                              <>
                                <h6 style={{paddingBottom:"10px"}}>{lang == "en" ? "Response" : "対応"}</h6>
                                {/* <ul
                                  style={{
                                    listStyleType: "circle",
                                    paddingLeft: "35px",
                                    fontSize: "13px",
                                  }}
                                > */}
                                  {response?.map((e) => {
                                    return e == "" ? <br/> : <p style={{fontSize:"14px", color:"#202020",fontWeight:400}}>{e}</p>;;
                                  })}
                                {/* </ul> */}
                              </>
                            ) : (
                              ""
                            )}
                          </Col>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              </div>
              <Col span={24}>
                <Form.Item
                  label={t("Reports.Memo")}
                  name="memo"
                  rules={[
                    {
                      required: true,
                      message:
                        lang === "en"
                          ? t("Memo Is Required")
                          : "メモは必須です",
                    },
                  ]}
                >
                  <TextArea
                    defaultValue={data?.memoForStaff}
                    placeholder={t("Reports.Memo")}
                    rows={4}
                  />
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
                  <Link
                    className="btn-theme btn-with-icon btn-brown flex-row"
                    to={PATH_FRONT.reportList}
                  >
                    <ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{" "}
                    {t("Reports.Back")}
                  </Link>
                  <Button
                    htmlType="submit"
                    className="btn-theme btn-with-icon btn-success"
                    to={PATH_FRONT.confirmationReport}
                  >
                    <ArrowRight2 variant="Bold" size="24" color="#ffffff" />{" "}
                    {t("Reports.Content_Confirmation")}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
      {/* <SymptomsModel modalOpenEvent={symptomsModalOpen} modalCloseEvent={setSymptomsModelOpen} /> */}
    </>
  );
}

export default EditReport;
