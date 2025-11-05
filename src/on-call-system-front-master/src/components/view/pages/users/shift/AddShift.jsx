import {
  Button,
  Checkbox,
  Dropdown,
  Col,
  Menu,
  Form,
  Radio,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  AutoComplete,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATH_FRONT } from "../../../../routes/path";
import {
  Add,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2
} from "iconsax-react";

import {
  format,
  addMonths,
  addWeeks,
  addDays,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  getDay
} from "date-fns";
import Column from "antd/es/table/Column";
import { useTranslation } from "react-i18next";
import http from "../../../../../security/Http";
import url from "../../../../../Development.json";
import { enqueueSnackbar } from "notistack";
import { ja } from "date-fns/locale";
import moment from "moment";
import { LoadingOutlined } from '@ant-design/icons';

import Loader from "../../../../Loader";

function AddShift() {
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("i18nextLng");
  const [form] = Form.useForm();
  const RadioGroup = Radio.Group;
  const Token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [respondent, setrespondent] = useState([]);
  const [resoptions, setResOptions] = useState([]);
  const [respondentId, setResoptionsId] = useState(null);
  const [resoptionsname, setResoptionsname] = useState(null);
  const [shift, setShift] = useState([]);
  const [staffshift, setStaffShift] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [updatedata, setUpdatedata] = useState("");
  const [datefirst, setDatefirst] = useState("");
  const [datelast, setDatelast] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  const defaultData2 = [{
    day: 0, shift: ["", "", "", ""]
  },
  {
    day: 1, shift: ["", "", "", ""]
  },
  {
    day: 2, shift: ["", "", "", ""]
  },
  {
    day: 3, shift: ["", "", "", ""]
  },
  {
    day: 4, shift: ["", "", "", ""]
  },
  {
    day: 5, shift: ["", "", "", ""]
  },
  {
    day: 6, shift: ["", "", "", ""]
  }];
  const defaultData3 = [{
    day: 0, shift: ["", "", "", ""]
  },
  {
    day: 1, shift: ["", "", "", ""]
  },
  {
    day: 2, shift: ["", "", "", ""]
  },
  {
    day: 3, shift: ["", "", "", ""]
  },
  {
    day: 4, shift: ["", "", "", ""]
  },
  {
    day: 5, shift: ["", "", "", ""]
  },
  {
    day: 6, shift: ["", "", "", ""]
  }];
  const defaultLeaderData = [{
    day: 0, shift: ["", "", "", ""]
  },
  {
    day: 1, shift: ["", "", "", ""]
  },
  {
    day: 2, shift: ["", "", "", ""]
  },
  {
    day: 3, shift: ["", "", "", ""]
  },
  {
    day: 4, shift: ["", "", "", ""]
  },
  {
    day: 5, shift: ["", "", "", ""]
  },
  {
    day: 6, shift: ["", "", "", ""]
  }];
  const defaultSelectValues = {
    "0": "",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
  };
  const [shiftDataNew, setShiftDataNew] = useState(defaultData2);
  const [leaderData, setLeaderData] = useState(defaultLeaderData);
  let firstdate;
  let lastdate;
  // const [shiftDataEdit, setShiftDataEdit] = useState([]);
  const [shiftDataNewResponderValue, setShiftDataNewResponderValue] = useState(defaultData2);
  // const [FlateArray, setFlateArray] = useState([]);
  const [areCheckboxesEnabled, setAreCheckboxesEnabled] = useState(false);

  // console.log({shiftDataNew});
  let weekStart;
  let weekEnd;
  let weekStartDay;
  let weekEndDay;
  let newdatestart;
  let newdateend;

  const [weekDate, setWeekDate] = useState([1, 2, 3, 4, 5, 6, 7]);
  let respondentOptions;
  // let ID;


  useEffect(() => {
    respondentOptions = respondent.map((f) => ({
      key: f._id.toString(),
      value: f.name,
    }));
    setResOptions(respondentOptions);
    // ID = respondentOptions[0]?.key;
    // console.log(127,respondentOptions)
    if (respondentOptions.length == 1) {

      setResoptionsId(respondentOptions[0]?.key);
      setResoptionsname(respondentOptions[0]?.value);
    }
  }, [respondent]);

  useEffect(() => {
    {
      weekDate.map((data, ind) => {
        weekStartDay = startOfWeek(currentDate, { weekStartsOn: 1 });
        weekEndDay = endOfWeek(currentDate, { weekStartsOn: 1 });
        // newdatestart = format(new Date(weekStartDay + 7), "yyyy-MM-d");
        // newdateend = format(new Date(weekEndDay + 7), "yyyy-MM-d");
        newdatestart = moment(weekStartDay).format("YYYY-MM-DD"); //format(new Date(weekStartDay + 7), "yyyy-MM-d");
        newdateend = moment(weekEndDay).format("YYYY-MM-DD"); // format(new Date(weekEndDay +7), "yyyy-MM-d");
        // console.log(newdatestart,newdateend,"fhfhgjgjgj");
        firstdate = newdatestart;
        lastdate = newdateend;
        setDatefirst(newdatestart);
        setDatelast(newdateend);
      });

      getallshift(respondentId, newdatestart, newdateend);

    }
  }, [respondent, currentDate]);

  const setSelectValues = () => {
    for (var jk = 0; jk < 7; jk++) {
      let newResponder = shiftDataNewResponderValue[jk]?.shift.map(r => {
        if (r[0] != "") {

          return r[0];
        }
      }).filter(Boolean);

      // console.log(newResponder)
      selectValue[jk] = t('table_title.Leader') + newResponder.toString().split(",")

    }
    setSelectValue((prevData) => ({
      ...prevData
    }));

  }
  useEffect(() => (
    setSelectValues()
  ), [shiftDataNewResponderValue]);

  const getallshift = useCallback((respondentId, datefirst, datelast) => {
    if (datefirst && datelast && respondentId) {
      http
        .get(
          process.env.REACT_APP_BASE_URL +
          `/admin/shiftByStaffId2?staffId=${respondentId}&&startDay=${datefirst}&&endDay=${datelast}`,
          [],
          {
            headers: { authorization: "Bearer " + Token, lang: lang },
          }
        )
        .then((res) => {
          // console.log("retrieve data all")

          console.log(res?.data, "987654321987654321")
          if (res?.data?.[0] && res?.data?.[0]?.shiftData && respondentId != "") {
            setIsEdit(true)
            // console.log("Update data set 123456789",isEdit)
            console.log(res?.data[0], "viral12546978")
            setShiftDataNewResponderValue(res?.data[0]?.responderData)
            setShiftDataNew(res?.data[0]?.shiftData)
            setIsLoading(false)
            if (respondentId != "") {
              // console.log("LEADER DATA",res?.data?.[0]?.leaderExist)
              if (res?.data?.[0]?.leaderExist) {
                setLeaderData(res?.data?.[0]?.leaderExist)
              }
            }

          } else {
            console.log("INSERT DATA set")

            if (respondentId != "") {
              console.log("LEADER DATA", res?.data?.leaderExist)
              if (res?.data?.leaderExist) {

                setLeaderData(res?.data?.leaderExist)

              }
            }
            setShiftDataNew(defaultData2)
            setShiftDataNewResponderValue(defaultData3)
            setSelectValue(defaultSelectValues)
            // setIsLoading(false)

          }
          setIsLoading(false)

        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false)
        });
    }
  }, []);

  useEffect(() => {
    // console.log(172)
    if (resoptions && resoptions.length > 0 && resoptions.length < 2) {
      // console.log("datadatadatadatadatadatadatadatadatadatadatadata");
      setAreCheckboxesEnabled(true);
      getallshift(respondentId, datefirst, datelast);
    }
  }, [getallshift, respondentId, resoptionsname]);

  if (staffshift && staffshift !== "") {
    // Add a check for staffshift
    shift.forEach((data, ind) => {
      weekDate.forEach((dd, i) => {
        const checkboxName = data.name + "D" + i;
        const isChecked =
          staffshift[ind]?.[i] !== undefined && staffshift[ind]?.[i] !== "";
        const checkboxValues = form.getFieldValue(checkboxName) || [];

        if (isChecked && !checkboxValues.includes(checkboxName)) {
          checkboxValues.push(checkboxName);
        } else if (!isChecked && checkboxValues.includes(checkboxName)) {
          checkboxValues.splice(checkboxValues.indexOf(checkboxName), 1);
        }

        form.setFieldsValue({ [checkboxName]: checkboxValues });
      });
    });
  }

  const [selectValue, setSelectValue] = useState(defaultSelectValues);

  const getshifttime = () => {
    http
      .callApi(url.getshift, [], {
        headers: { authorization: "Bearer " + Token, lang: lang },
      })
      .then((res) => {
        // console.log(res.data)
        setShift(res.data);
      })
      .catch((error) => {
        // console.log(error)
        if (error?.response.data?.errors?.message) {
          // console.log(error?.response, "error");
        }
      });
  };

  let shiftDatas = [];
  if (staffshift && !isEdit) {

    shiftDatas = shift.map((data, ind) => ({
      key: ind + 1,
      name: (

        <h6 className={`fs-14 shift_badge mb10 badge_${data?.name === 'A' ? 'primary' : data?.name === 'B' ? 'success' : data?.name === 'C' ? 'warning' : data?.name === 'D' ? 'danger' : 'default'}`}>
          {data.name} {t('table_title.Frame')}
        </h6>
      ),
      ...weekDate.map((dd, i) => ({
        [dd]: {
          key: "day" + i,
          shiftTime: (
            <Form.Item
              className="text-center  mb0"
              // name={data.name + "D" + i}
              initialValue={[data.name + "D" + i == shiftDataNew[ind]?.[i] ? 1 : 0]}
            >
              <Checkbox
                value={data.name + "D" + i}
                // name={data.name + "D" + i}
                // checked={data.name && data.name !== ""}
                // shiftDataNew[i]?.shift[0]
                // name2 = {shiftDataNew[i]}
                // checked={ data.name + "D" + i  == shiftDataNew[ind]?.[i] ? 1:0}
                disabled={!areCheckboxesEnabled}
                onChange={(e) => handleCheckboxChange(e, data.name + "D" + i)}
              />
            </Form.Item>
          ),
        },
      })),
    }));
  } else {
    // console.log(isEdit)
    shiftDatas = shift.map((data, ind) => ({

      key: ind + 1,
      name: (
        <h6 className={`fs-14 shift_badge mb10 badge_${data?.name === 'A' ? 'primary' : data?.name === 'B' ? 'success' : data?.name === 'C' ? 'warning' : data?.name === 'D' ? 'danger' : 'default'}`}>
          {data.name} {t("table_title.Frame")}
        </h6>
      ),
      ...weekDate.map((dd, i) => ({
        [dd]: {
          key: "day" + i,
          shiftTime: (
            <Form.Item
              className="text-center  mb0"
              initialValue={[]}
            >
              <Checkbox
                value={data.name + "D" + i}
                name={shiftDataNew[i]?.shift[i]}
                checked={shiftDataNew[i]?.shift?.includes(data.name + "D" + i) ? 1 : ""}
                onChange={(e) => handleCheckboxChange(e, data.name + "D" + i)}
                disabled={!areCheckboxesEnabled}
              />

            </Form.Item>
          ),
        },
      })),
    }));
  }

  let defaultData = {
    ...weekDate.map((dd, i) => ({
      key: i,
      name: "",
      [dd]: {
        key: "day" + i,
        shiftTime: (
          <Dropdown disabled={!areCheckboxesEnabled}
            getPopupContainer={(node) => node.parentNode}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
            trigger={["click"]}
            overlay={
              <Menu>
                <Menu.Item>

                  {
                    shiftDataNew[i]?.shift.map(s => {
                      return (<>
                        {s ?
                          <Form.Item
                            className="text-center mb0"
                            // name={data.name + "D" + i}
                            initialValue={[]}
                          >
                            {leaderData[i]?.shift.includes(s) ?

                              <p style={{ color: "red" }}>{t("table_title.Allocated")}</p>
                              :
                              <Checkbox

                                key={s + "D" + i}
                                value={s}
                                name={shiftDataNew[i]?.shift[i]}

                                checked={shiftDataNewResponderValue[i]?.shift?.includes(s) ? 1 : ""}

                                onChange={(e) => setResponderDataNew(e, s)}

                              >{s[0] + t("table_title.Responder") + " "}</Checkbox>

                            }
                          </Form.Item>
                          : ""}
                      </>)

                    })
                  }


                </Menu.Item>
              </Menu>
            }
          >
            <Button
              className="fs-12 fw-600 flex_item_cb"
              style={{ marginLeft: "auto", marginRight: "auto" }}
              onClick={(e) => e.preventDefault()}
            >
              {/* {shiftDataNew[i]?.shift?.includes(e.name + "D" + i) || FlateArray?.includes(e.name+"D"+i) || t("table_title.Leader")} */}
              {/* {  selectValue[i] === "" ? t("table_title.Leader") : selectValue[i] || "Responder"+"" +editedResponder[i][0]}{" "} */}
              {selectValue[i] === "" ? t("table_title.Leader") : selectValue[i] || t('table_title.Leader') + "" + selectValue[i][0]}{" "}
              <ArrowDown2 size="18" color="#707070" variant="Bold" />
            </Button>
          </Dropdown>
        ),
      },
    })),
  };

  shiftDatas.unshift(defaultData);
  useEffect(() => {
    getshifttime();
  }, []);
  // useEffect(() => {
  //   getallshift()
  // }, [isEdit]);

  const onSubmit = async (values) => {
    console.log(values, values);
    // values.shiftsData = isEdit? shiftDataEdit :shiftDataNew
    // // values.responderData = isEdit ? editedResponder :[]

    if (!respondentId) {

      enqueueSnackbar(lang == "en" ? "Select Staff Name" : "スタッフ名を選択してください", {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
    if (shiftDataNew && shiftDataNew.length == 0) {
      enqueueSnackbar(lang == "en" ? "Select Any Shift" : "スタッフ名を選択してください", {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
    // if(isEdit && shiftDataEdit && shiftDataEdit.length==0){
    //   enqueueSnackbar(lang=="en" ? "Select Any Shift" :"スタッフ名を選択してください", {
    //     variant: "error",
    //     autoHideDuration: 1000,
    //   });
    // }
    // if(isEdit){
    //   values.shiftsData = shiftDataEdit;
    //   // values.responderData = shiftDataNewResponderValue
    //   values.responderData = editedResponder
    // }else{
    // }
    const alldata = {}
    alldata.shiftsData = shiftDataNew
    console.log(shiftDataNewResponderValue)
    alldata.responderData = shiftDataNewResponderValue


    alldata.staffId = respondentId;
    // values.responder = selectValue;
    alldata.startDate = moment(weekStart).format("YYYY-MM-DD");
    alldata.endDate = moment(weekEnd).format("YYYY-MM-DD");
    alldata.startDay = format(weekStart, "d");
    alldata.endDay = format(weekEnd, "d");
    // return
    setTimeout(async () => {
      // if(days){
      console.log(alldata, "valuesvalues");
      await addShift(alldata, values);
      // }else{
      //     console.log("error")
      // }
    });
  };
  const addShift = (alldata, values) => {
    console.log(alldata, "123456789");
    const Token = localStorage.getItem("token");
    // console.log("add shiftt")
    // updatedata == "update" ? url.updateShift  :
    //isEdit ===true ? url.updateShift : url.addShift,
    setIsLoading(true)
    http
      .callApi(
        url.addShift,
        alldata,
        {
          headers: { authorization: "Bearer " + Token, lang: lang },
        }
      )
      .then((res) => {
        // console.log(res);
        // if (updatedata == "update") {
        setUpdatedata("");
        if (values === "click") {
          setIsLoading(false)

          enqueueSnackbar(
            res?.data?.message,
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
          navigate("/shift-list");
        }

        // } else {

        //   // console.log(res?.data);
        //   enqueueSnackbar(
        //     res.data.message,
        //     { variant: "success" },
        //     { autoHideDuration: 1000 }
        //   );
        // }
      })
      .catch((error) => {
        if (error.response) {
          enqueueSnackbar(
            error.response.data.message,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      });
  };
  const setResponderDataNew = (event, name) => {
    console.log("546")
    // console.log({ event });
    // console.log({ name });
    var isChecked = event.target.checked;

    // let responderCheckboxName =name.charAt(name.length - 3);
    var day = name.charAt(name.length - 1);
    console.log(leaderData)

    // let arr = [0,1,2,3];

    if (isEdit) {
      let day2 = day
      if (name[0] == "A") {
        day2 = 0
      } else if (name[0] == "B") {
        day2 = 1
      } else if (name[0] == "C") {
        day2 = 2
      } else {
        day2 = 3
      }

      // console.log(477)
      // if (isChecked) {
      //   // console.log({name})
      //   shiftDataEdit[day2][day]=name;
      //   setShiftDataEdit((prevArray) => [...prevArray]);

      //   setFlateArray(shiftDataEdit?.flat())

      //   // setSelectValue((prevData) => ({
      //   //   ...prevData,
      //   //   [day]: "Responder "+name[0],
      //   // }));
      // } else {
      //   shiftDataEdit[day2][day]="";
      //   setShiftDataEdit((prevArray) => [...prevArray]);  
      //   setFlateArray(shiftDataEdit?.flat())

      // }
      let position = 0;
      switch (name[0]) {
        case "A": position = 0
          break;
        case "B": position = 1
          break;
        case "C": position = 2
          break;
        case "D": position = 3
          break;
      }
      if (isChecked) {
        console.log({ position })
        shiftDataNewResponderValue[day].shift[position] = name;
        setShiftDataNewResponderValue((prevArray) => [...prevArray]);

        let newResponder = shiftDataNewResponderValue[day]?.shift.map(r => {
          if (r[0] != "") {

            return r[0];
          }
        }).filter(Boolean)
        setSelectValue((prevData) => ({
          ...prevData,
          [day]: t('Reports.Respondent') + newResponder.toString().split(","),
        }));

      } else {
        shiftDataNewResponderValue[day].shift[position] = "";
        setShiftDataNewResponderValue((prevArray) => [...prevArray]);

        let newResponder = shiftDataNewResponderValue[day]?.shift.map(r => {
          if (r[0] != "") {

            return r[0];
          }
        }).filter(Boolean)
        setSelectValue((prevData) => ({
          ...prevData,
          [day]: t('Reports.Respondent') + newResponder.toString().split(","),
        }));
      }
    } else {
      let position = 0;
      switch (name[0]) {
        case "A": position = 0
          break;
        case "B": position = 1
          break;
        case "C": position = 2
          break;
        case "D": position = 3
          break;
      }
      if (isChecked) {

        shiftDataNewResponderValue[day].shift[position] = name;
        setShiftDataNewResponderValue((prevArray) => [...prevArray]);


        let newResponder = shiftDataNewResponderValue[day]?.shift.map(r => {
          if (r[0] != "") {

            return r[0];
          }
        }).filter(Boolean)
        setSelectValue((prevData) => ({
          ...prevData,
          [day]: t('Reports.Respondent') + newResponder.toString().split(","),
        }));

      } else {
        shiftDataNewResponderValue[day].shift[position] = "";
        setShiftDataNewResponderValue((prevArray) => [...prevArray]);

        let newResponder = shiftDataNewResponderValue[day]?.shift.map(r => {
          if (r[0] != "") {

            return r[0];
          }
        }).filter(Boolean)
        setSelectValue((prevData) => ({
          ...prevData,
          [day]: t('Reports.Respondent') + newResponder.toString().split(","),
        }));
      }
    }


  };
  const handleCheckboxChange = (event, name) => {
    console.log(name)
    var isChecked = event.target.checked;

    var day = name.charAt(name.length - 1);

    let position = 0;
    switch (name[0]) {
      case "A": position = 0
        break;
      case "B": position = 1
        break;
      case "C": position = 2
        break;
      case "D": position = 3
        break;
    }
    if (isEdit) {
      console.log("hiii")
      let day2 = day
      if (name[0] == "A") {
        day2 = 0
      } else if (name[0] == "B") {
        day2 = 1
      } else if (name[0] == "C") {
        day2 = 2
      } else {
        day2 = 3
      }

      if (isChecked) {


        shiftDataNew[day].shift[position] = name;


        // if(leaderData?.[day]?.shift.includes(name)){
        //   enqueueSnackbar(
        //     t('Shift.Responder_Exist'),
        //     { variant: "error" },
        //     { autoHideDuration: 10 }
        //   );
        //   return false;
        // }
        if (leaderData?.[day]?.shift.includes(name)) {
          //return false;
        } else {
          if (selectValue[day] == "") {
            setSelectValue((prevData) => ({
              ...prevData,
              [day]: t('table_title.Responder') + name[0],
            }));
          }
        }

        setShiftDataNew((prevArray) => [...prevArray]);

      } else {

        shiftDataNew[day]["shift"][position] = "";
        shiftDataNewResponderValue[day].shift[position] = "";
        setShiftDataNew((prevArray) => [...prevArray]);
        setShiftDataNewResponderValue((prevArray) => [...prevArray]);
        let newResponder = shiftDataNewResponderValue[day]?.shift.map(r => {
          if (r[0] != "") {

            return r[0];
          }
        }).filter(Boolean)
        setSelectValue((prevData) => ({
          ...prevData,
          [day]: t('Reports.Respondent') + newResponder.toString().split(","),
        }));
      }
    } else {
      // let position = 0;
      //   switch(name[0]){
      //     case "A" : position = 0
      //     break;
      //     case "B" : position = 1
      //     break;
      //     case "C": position = 2
      //     break;
      //     case "D" : position = 3
      //     break;
      //   }
      console.log(776)
      if (isChecked) {
        shiftDataNew[day].shift[position] = name;

        if (leaderData?.[day]?.shift.includes(name)) {
          //return false;
        } else {
          if (selectValue[day] == "") {
            setSelectValue((prevData) => ({
              ...prevData,
              [day]: t('table_title.Responder') + name[0],
            }));
          }
        }


        setShiftDataNew((prevArray) => [...prevArray]);

      } else {

        shiftDataNew[day]["shift"][position] = "";
        shiftDataNewResponderValue[day].shift[position] = "";
        setShiftDataNew((prevArray) => [...prevArray]);
        setShiftDataNewResponderValue((prevArray) => [...prevArray]);
        let newResponder = shiftDataNewResponderValue[day]?.shift.map(r => {
          if (r[0] != "") {

            return r[0];
          }
        }).filter(Boolean)
        setSelectValue((prevData) => ({
          ...prevData,
          [day]: t('Reports.Respondent') + newResponder.toString().split(","),
        }));
      }
    }


  };

  const getallrespondent = () => {
    // const datavalue = value;
    // console.log({value})
    const Token = localStorage.getItem("token");
    http
      .get(
        // process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`,
        process.env.REACT_APP_BASE_URL + `/admin/StaffList`,
        [],
        {
          headers: { authorization: "Bearer " + Token, lang: lang },
        }
      )
      .then((res) => {
        // console.log("responde",res?.data)
        setrespondent(res?.data);
      });
  };
  const getallrespondent2 = (e, v) => {
    // console.log(e,v);
    // value = e.target.value
    var datavalue = v ? v.key : ""
    // console.log({datavalue})
    setResoptionsId(datavalue);

    const Token = localStorage.getItem("token");
    http
      .get(
        process.env.REACT_APP_BASE_URL + `/admin/StaffList?search=${datavalue}`,
        [],
        {
          headers: { authorization: "Bearer " + Token, lang: lang },
        }
      )
      .then((res) => {
        // console.log("responde",res?.data)
        setrespondent(res?.data);
        setShiftDataNew(defaultData2)
        setShiftDataNewResponderValue(defaultData3)
        setSelectValue(defaultSelectValues)
        setIsLoading(true)
      });
  };

  const handleMonthChange = (amount) => {
    console.log("monthchange")
    setCurrentDate(addMonths(currentDate, amount));
    getallshift(respondentId, newdatestart, newdateend);

  };

  const handleWeekChange = (amount) => {
    console.log("weekchange", amount)
    setCurrentDate(addWeeks(currentDate, amount));
    onSubmit('change');
  };

  return (

    <>
      <section className="ptb40">
        <div className="custom_card">
          <div className="custom_card_head flex_item_cb flex-wrap mb10">
            <h4>{t("Shift.Add_Shift")}</h4>
          </div>

          <div className="custom_card_body p10">

            <Form
              layout="vertical"
              form={form}
              autoComplete="off"
              onFinish={() => onSubmit('click')}
            >
              <Row>
                <Col sm={{ span: 12 }} xs={{ span: 24 }}>
                  <Form.Item label={t("Shift.Staff_Name")} name="StaffId"
                    rules={[
                      {
                        required: true,
                        message: lang === "en" ? 'PLease select Responder' : "レスポンダーを選択してください",
                      }]}
                  >
                    <AutoComplete
                      className="custom-ant-select auto-complete-select"
                      options={resoptions}
                      onClick={(e) => getallrespondent()}
                      onChange={(e, v) => getallrespondent2(e, v)}
                      placeholder={t("Reports.Respondent")}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {isLoading ? <Loader></Loader> :
                <>
                  <Form.Item>
                    <div className="add-shift-table custom_table_wrapper">
                      <Table
                        scroll={{ x: "calc(600px + 50%)" }}
                        dataSource={shiftDatas}
                        pagination={false}
                        className="text-nowrap"
                      >


                        {/* Month column */}
                        <Column
                          title={
                            <div className="flex_item_cc">
                              <a
                                role="button"
                                className="lh1 flex_item_cc"
                                onClick={() => handleMonthChange(-1)}
                              >
                                <ArrowLeft2
                                  variant="Bold"
                                  color="#0D0B0B"
                                  size="24"
                                />
                              </a>
                              <h6>
                                {lang === "en"
                                  ? format(currentDate, "MMMM yyyy")
                                  : format(currentDate, "MMMM yyyy", { locale: ja })}
                              </h6>
                              <a
                                role="button"
                                className="lh1 flex_item_cc"
                                onClick={() => handleMonthChange(1)}
                              >
                                <ArrowRight2
                                  variant="Bold"
                                  color="#0D0B0B"
                                  size="24"
                                />
                              </a>
                            </div>
                          }
                          className="td_staff_name text-start"
                          dataIndex="name"
                          key="name"
                        />

                        <Column
                          title={
                            <div className="flex_item_cc">
                              <a
                                role="button"
                                className="lh1 flex_item_cc"
                                onClick={() => handleWeekChange(-1)}
                              >
                                <ArrowLeft2
                                  variant="Bold"
                                  color="#0D0B0B"
                                  size="24"
                                />
                              </a>
                            </div>
                          }
                        />

                        {/* Week columns */}
                        {weekDate.map((data, ind) => {
                          weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
                          weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

                          return (
                            <Column
                              key={ind}
                              title={
                                ind === 0 ? (<>
                                  <div className="flex_item_cc gap5">
                                    {/* <a
                                className="text-center"
                                role="button"
                                onClick={() => handleWeekChange(-1)}
                                
                              >
                                <ArrowLeft2
                                  variant="Bold"
                                  color="#0D0B0B"
                                  size="24"
                                  
                                />
                              </a> */}
                                    <span className="gap2 text-center">

                                      {lang === "en"
                                        ? format(weekStart, "d")
                                        : format(weekStart, "d", { locale: ja })}
                                    </span>
                                  </div>
                                </>
                                ) : ind === 6 ? (
                                  <div className="flex_item_cc gap2">
                                    {lang === "en"
                                      ? format(weekEnd, "d")
                                      : format(weekEnd, "d", { locale: ja })}
                                    {/* <a
                                className="lh1 flex_item_cc"
                                role="button"
                                onClick={() => handleWeekChange(1)}
                                
                              >
                                <ArrowRight2
                                  variant="Bold"
                                  color="#0D0B0B"
                                  size="24"
                                />
                              </a> */}
                                  </div>
                                ) : (
                                  <div className="date text-center">
                                    {lang === "en"
                                      ? format(addDays(weekStart, ind), "d")
                                      : format(addDays(weekStart, ind), "d", {
                                        locale: ja,
                                      })}
                                  </div>
                                )
                              }
                              dataIndex="name"
                              render={(_, dd) => dd[ind][data]?.shiftTime}
                            />
                          );
                        })}

                        <Column
                          title={
                            <div className="flex_item_cc">
                              <a
                                className="lh1 flex_item_cc"
                                role="button"
                                onClick={() => handleWeekChange(1)}

                              >
                                <ArrowRight2
                                  variant="Bold"
                                  color="#0D0B0B"
                                  size="24"
                                />
                              </a>
                            </div>
                          }

                        />

                      </Table>
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Space className="flex_item_ce flex-wrap">
                      <Link
                        className="btn-theme btn-with-icon btn-brown flex-row"
                        to={PATH_FRONT.shiftList}
                      >
                        <ArrowLeft2 variant="Bold" size="24" color="#ffffff" />
                        {t("Shift.Back")}
                      </Link>
                      {isLoading ? <Button
                        disabled
                        htmlType="submit"
                        className="btn-theme btn-with-icon btn-success"
                        to={PATH_FRONT.shiftList}
                        indicator={antIcon}
                      >
                        <ArrowRight2 variant="Bold" size="24" color="#ffffff" />
                        {t("Shift.Finished")}
                      </Button> :
                        <Button
                          htmlType="submit"
                          className="btn-theme btn-with-icon btn-success"
                          to={PATH_FRONT.shiftList}
                          indicator={antIcon}
                        >
                          <ArrowRight2 variant="Bold" size="24" color="#ffffff" />
                          {t("Shift.Finished")}
                        </Button>}
                    </Space>
                  </Form.Item>
                </>
              }
            </Form>

          </div>
        </div>
      </section>
      {/* } */}
    </>
  );
}

export default AddShift;
