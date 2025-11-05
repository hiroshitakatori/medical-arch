import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Space, Table, Col } from 'antd'
import { Add, ArrowLeft2, ArrowRight2, Edit2 } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

function MyPage() {
  const { t, i18n } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [user, setuser] = useState("") 
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const getprofile = () => {
    const lang = localStorage.getItem('i18nextLng')
    const Token = localStorage.getItem('token')
    http.callApi(url.getprofile, [], {
      headers: { 'authorization': 'Bearer ' + Token, lang: lang }
    })
      .then((res) => {
        setuser(res.data)
        enqueueSnackbar(
          res.data.message,
          { variant: "success" },
          { autoHideDuration: 1000 }
        );
      })
      .catch((error) => {
        if (error.response) {
          enqueueSnackbar(
            error.response.data.message,
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      })

  }

  useEffect(()=>{
    getprofile()
  },[])

  const editprofilepage = () => {
    user.edit="edit";
    navigate('/edit-staff',{state:user})
  }




  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <section className='ptb40'>
       <div className="fliter_box_card mb30">
        <Form>
          <Space className='flex-wrap flex_item_ce'>
            <Button onClick={editprofilepage}  to={PATH_FRONT.editFacility} className='btn-theme btn-warning btn-with-icon flex-row'><Edit2 variant="Bold" size={24} color="#ffffff" />{t('table_title.Edit_Profile')} </Button>
          </Space>
        </Form>
      </div>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Facility_Information.My_page')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="">
            <Row>
              <Col sm={{ span: 14 }} xs={{ span: 24 }}>
                <ul className='details_list mb10'>
                  <li><label className='fs-16'> {t('Staff.Name')}</label> <span>{user?.name ? user?.name : "-"}</span></li>
                  <li><label className='fs-16'>{t('Staff.Frigana')}</label> <span>{user?.frigana ? user?.frigana : "-"}</span></li>
                  {/* <li><label className='fs-16'>Yomi</label> <span>{user?.yomi ? user?.yomi : "-"}</span></li> */}
                  <li><label className='fs-16'>{t('Staff.Address')}</label> <span>{user?.address ? user?.address : "-"}</span></li>
                  <li><label className='fs-16'>{t('Staff.Phone')}</label> <span>{user?.mobile ? user?.mobile : "-"}</span></li>
                  <li><label className='fs-16'>{t('Staff.Email')}</label> <span>{user?.email ? user?.email : "-"}</span></li>
                </ul>
              </Col>
              
          
            </Row>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyPage
