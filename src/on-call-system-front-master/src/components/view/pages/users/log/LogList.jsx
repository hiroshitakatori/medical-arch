import React, { useState, useEffect } from 'react'
import { Button, Empty, Form, Input, Space, Spin, Table } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, DocumentDownload, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../../data/ApiData'
import { Link, useNavigate } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import moment from 'moment'
import Highlighter from "react-highlight-words";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Loader from '../../../../Loader'
import { LoadingOutlined } from '@ant-design/icons';
var Base_url = process.env.REACT_APP_BASE_URL;

function LogList() {
  const { t, i18n } = useTranslation();
  const [report, setReport] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [total, setTotal] = useState("");
  const [prebutton, setPrebutton] = useState(0);
  const [nextButton, setNextButton] = useState(true);
  const [search, setSearch] = useState("");
  const lang = localStorage.getItem('i18nextLng')
  const [mediaUrl, setMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const [Loading, setLoading] = useState(false)
  const [pagetoken, setpagetoken] = useState("");
  const [nextpagetoken, setNextpagetoken] = useState("");
  const [perpagetoken, setPerpagetoken] = useState("");
  const Token = localStorage.getItem('token')
  const getoneuser = (report) => {
    navigate("/staff-details", { state: report });
  }

  const getonefacility = (report) => {
    navigate("/facility-details", { state: { report: report } });
  }

  const getreportdetails = (report) => {
    navigate("/report-details ", { state: report });
  }
  const onSubmit = () => {
    setIsLoading(true);
    const urlParams = new URLSearchParams(pagetoken?.split('?')[1]);
    const pageToken = urlParams.get('PageToken');

    http.get(Base_url + `/admin/callHistory?page=${currentPage}&&pageToken=${pageToken}&&search=${search}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })

      .then((res) => {
        // console.log(res, 12354978);
        // console.log(res?.data?.data?.previousPageUrl);
        // console.log(res?.data?.data?.nextPageUrl);
        setIsLoading(false);
        setReport(res?.data?.data?.instances)
        // setNextButton(res.data?.data?.nextpageUrl)
        // setPrebutton(res?.data?.data?.previousPageUrl)
        setNextpagetoken(res?.data?.data?.nextPageUrl)
        setPerpagetoken(res?.data?.data?.previousPageUrl)
        setIsLoading(false);
        setTotal(res.data[0].metadata[0].total)
        // enqueueSnackbar(
        //   res.data.message,
        //   { variant: "success" },
        //   { autoHideDuration: 1000 }
        // );
      })
      .catch((error) => {
        if (error.response) {
          // enqueueSnackbar(
          //   error.response.data.message,
          //   { variant: "error" },
          //   { autoHideDuration: 1000 }
          // );
        }
      })

  }
  function setFilter(e) {
    setSearch(e.target.value);
  }
  useEffect(() => {
    onSubmit()
  }, [currentPage])

  const getOneReport = (e, report) => {
    navigate(PATH_FRONT.facilityReportDetails, { state: report });
  }
  const handlePagination = (increment) => {
    if (nextButton == false) {
      return false;
    } else {
      setPrebutton((prevPage) => prevPage + increment)
      setCurrentPage((prevPage) => prevPage + increment);
      setpagetoken(nextpagetoken);
    }
  };
  const handleperviousPagination = (increment) => {
    if (prebutton == 0) {
      return false;
    } else {
      setPrebutton(currentPage - increment)
      setCurrentPage(currentPage - increment);
      setpagetoken(perpagetoken);
    }
  };
  const pdfdownload = (e) => {
    setLoading(true);

    http.get(Base_url + `/admin/callRecording?callId=${e?.parentCallSid}`, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })

      .then((res) => {
        // console.log(res.data[0].dsata);
        console.log(res);
        setMediaUrl(res?.data?.media_url)
        handleDownload(res?.data?.media_url);

      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      })

    // e.value = "loglist"
    // navigate('/report-details',{state:e})
  }

  const handleDownload = async (media) => {
    console.log(media);
    await fetch(media)
      .then((response) => response.blob()) // Convert the response to a blob
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'downloaded_media.mp3'; // Specify the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error downloading media:', error);
      });
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  return (
    <section className='ptb40'>
      <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Form.Item className='mb0'>
              <Input onChange={setFilter} placeholder={t('table_title.Search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button onClick={onSubmit} type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item>
            {/* <Form.Item className='mb0'>
              <Input placeholder={t('table_title.Select_search_date')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
            </Form.Item>
            <Form.Item className='mb0'>
              <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
            </Form.Item> */}
          </Space>
        </Form>
      </div>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb10">
          <h4>{t('table_title.Log_List')}</h4>
          <div className="pagination_flex flex_item_cc">
            <a role='button' onClick={() => prebutton > 1 ? handleperviousPagination(1) : ""} className={`flex_item_cc prev_btn gap1 ${prebutton === 0 ? 'disabled' : ''}`} disabled={prebutton === 0}><ArrowLeft2 size={24} color="#0D0B0B" variant="Bold" /> {t('table_title.Previous')}</a>
            <a role='button' onClick={() => nextButton ? handlePagination(1) : ""} disabled={!nextButton} className={`flex_item_cc next_btn gap1 ${nextButton ? '' : 'disabled'}`} >{t('table_title.Next')}<ArrowRight2 size={24} color="#0D0B0B" variant="Bold" /></a>
          </div>
        </div>
        <div className="custom_card_body">
          <div className="custom_table_wrapper">
            {isLoading == true ? <Loader /> : <>
              <Table scroll={{ x: 900 }} className='text-nowrap' pagination={false} dataSource={report} locale={{ emptyText: <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}>
                <Column title={t('table_title.Date')} dataIndex={"dateCreated"} key={"dateCreated"} className='td_day text-start' render={(text) => {
                  var tDate = text;
                  return lang == 'en' ? format(new Date(tDate), 'yyyy-MMM-d h:mm a') : format(new Date(tDate), "yyyy'年'MMMd'日'ah:mm", { locale: ja })
                  //return moment(text).format("MMM DD YYYY h:mm A");
                }}></Column>
                <Column title={t('table_title.Name_of_facility')} dataIndex={["facility_data", "name"]}
                  render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getonefacility(e)} to={""}>

                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[search]}
                      autoEscape={true}
                      textToHighlight={e?.facility_data?.name}
                    />

                  </a>}
                  key={"facilityName"} className='td_facility_name text-start' ></Column>
                {/* <Column title={t('table_title.Status')} dataIndex={"status"} key={"status"} className='td_status' ></Column> */}
                <Column title={t('table_title.Corresponding_Person')} dataIndex={["respondent_data", "name"]} key={"responders"}
                  render={(_, e) => <a style={{ color: "#0638be" }} onClick={() => getoneuser(e)} to={""}>   <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={[search]}
                    autoEscape={true}
                    textToHighlight={e?.respondent_data?.name}
                  /></a>}
                  className='td_responders text-start' ></Column>
                <Column title={t('table_title.Action')} dataIndex={"action"} key={"action"}
                  render={(_, e) => (
                    <Button onClick={() => pdfdownload(e)} className="btn-theme btn-sm btn-with-icon" style={{ marginLeft: "auto" }}>
                      <DocumentDownload variant="Bold" color="#ffffff" size={18} />
                      {t('table_title.Download')}
                    </Button>
                  )}
                  className='td_action text-center' ></Column>
              </Table></>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LogList;
