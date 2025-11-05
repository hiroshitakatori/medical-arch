import React, { useEffect, useState } from 'react'
import { Button, Empty, Form, Input, Space, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import { Link, useNavigate } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import { enqueueSnackbar } from "notistack";
import { Typography } from 'antd';
import Highlighter from "react-highlight-words";
import Loader from '../../../../Loader'
import moment from 'moment';

const { Text } = Typography;

function FacilityList() {
  const { t, i18n } = useTranslation();
  const [facility, setFacility] = useState([])
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState("");
  const [search, setSearch] = useState("");
  const [prebutton, setPrebutton] = useState(0);
  const [nextButton, setNextButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true)
  const lang = localStorage.getItem('i18nextLng')

  var permissionData = localStorage.getItem("auth-storage");
  var parsedpermission = JSON.parse(permissionData);
  var permission = parsedpermission?.state?.permission;
  const currentDate = moment().format('YYYY-MM-DD');

    const handlePagination = (increment) => {
    if (nextButton == false) {
      return false;
    } else {
      setCurrentPage((prevPage) => prevPage + increment);
    }
  };
  const handleperviousPagination = (increment) => {
    if (prebutton == 0) {
      return false;
    } else {
      setCurrentPage(currentPage - increment);
    }
  };

  const Token = localStorage.getItem('token')
  const getfacility = () => {
    // console.log("button is clicked");
    // console.log(search, "data");

    
    // console.log(url.stafflist,"url.stafflist");
    // const page = 2;
    http.get(process.env.REACT_APP_BASE_URL + `/admin/getFacility?page=${currentPage}&&search=${search}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        console.log("fghghjgjhhjhjkhkjjk");
        setFacility(res.data[0].data)
        setTotal(res.data[0].metadata[0].total)
        setNextButton(res.data[0].metadata[0].hasMoreData)
        setPrebutton(res.data[0].metadata[0].page)
        console.log(isLoading,"isloading....");
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
            error.response,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      })

  }
  function setFilter(e) {
    setSearch(e.target.value);
  }
  useEffect(() => {
    getfacility()
  }, [currentPage])

  const getonefacility = (staff) => {
    navigate("/facility-details", { state: {report:staff,Token:Token} });
  }

  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
          {permission?.Facility?.substring(0, 1) == "1" ?  
          <>

            <Form.Item className='mb0'>
              <Link to={PATH_FRONT.addFacility} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" />{t('table_title.AddFacility')}</Link>
            </Form.Item>
            <Form.Item className='mb0'>
              <Link className='btn-theme btn-with-icon btn-danger flex-row' to={PATH_FRONT.cancelFacilitySearch}><Add size="24" color="#ffffff" /> {t('table_title.Cancellation_Procedure')}</Link>
            </Form.Item>
          </>
            :""}
            <Form.Item className='mb0' name="search">
              <Input onChange={setFilter} placeholder={t('table_title.No_Facility_Name_Yomi')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button onClick={getfacility} type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Facility_List')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton > 1 ? handleperviousPagination(1) : ""} className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""} disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            {isLoading == true ? <Loader /> : <>
              <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={facility} locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}} >
                <Column ellipsis={true} title={t('Facility_Information.FacilityId')} dataIndex={"uniqeId"} key={"uniqeId"} className='td_unique text-start'

                  render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getonefacility(e)} to={""}>
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[search]}
                      autoEscape={true}
                      textToHighlight={e?.uniqeId}
                    />
                    {/* {e?.facility_data?.name} */}


                  </a>}

                ></Column>
                {/* <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"}
                  render={(stat) =>
                    stat == 1 ? t('table_title.UnderContract') :
                      stat == 0  ? <Text type="danger">{t('table_title.Canceled')}</Text> : null}
                  className='td_status text-start' ></Column> */}
                  
                  <Column ellipsis={true} title={t('table_title.Status')} dataIndex={"status"} key={"status"}
                  render={(stat,e) =>
                    stat == 1 ? t('table_title.UnderContract') :
                        stat == 0 && moment(e?.terminationDate).format("YYYY-MM-DD")  > currentDate ? <><span>契約中</span><span style={{color:"#ff5a5c"}}> { ' ' + moment(e?.terminationDate).format("MM/DD") + ' ' + '解約予定'} </span></> :<Text type="danger">{t('table_title.Canceled')}</Text>
                    }
                  className='td_status text-start' ></Column>

                <Column ellipsis={true} title={t('table_title.Name_of_facility')} dataIndex={"name"}
                  render={(_, e) =>
                    <a style={{ color: "#0638be" }} onClick={() => getonefacility(e)} to={""}>
                      <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[search]}
                        autoEscape={true}
                        textToHighlight={e?.name}
                      />
                    </a>
                  }

                  key={"facilityName"} className='td_facility_name text-start'></Column>
                <Column ellipsis={true} title={t('table_title.BusinessFormat')} dataIndex={"businessType"} key={"businessformat"}
                  render={(text) => {
                    return lang == "en" ?
                        text == 1 ? "Special Nursing Home" :
                        text == 2 ? "Short Stay" :
                        text == 3 ? "Paid Nursing Home" : null
                    :
                        text == 1 ? "特別養護老人ホーム" :
                        text == 2 ? "ショートステイ" :
                        text == 3 ? "有料老人ホーム" : null
                }}
                className='td_business_format' ></Column>
          </Table></>}
      </div>
    </div>
      </div >
    </section >
  )
}

export default FacilityList
