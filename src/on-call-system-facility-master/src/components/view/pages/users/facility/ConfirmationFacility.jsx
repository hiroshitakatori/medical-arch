import React from 'react'
import { Button, Form, Input, Row, Space, Col } from 'antd'
import { Add, ArrowLeft2, ArrowRight2} from 'iconsax-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { enqueueSnackbar } from "notistack";

const { TextArea } = Input;
function ConfirmationFacility() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate()
  // console.log(location.state);
  var data = location.state;
  console.log({data});
  const  backclick = () =>{
    navigate('/facility/my-page', {state: location.state});
  }
  const lang = localStorage.getItem('i18nextLng')

    const addfacility = () => {
      const Token = localStorage.getItem("token");
      // console.log(data)
      http.callApi(data?._id ? url.editfacility : url.addfacility, data, {
        headers: { 'authorization': 'Bearer ' + Token, lang: lang }
      })
        .then((res) => {
          // console.log(res, "res");
          navigate('/facility/my-page')
          enqueueSnackbar(
            res.data.message,
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
        })
        .catch((error) => {
          if (error.response.data.errors.message) {
            console.log(error.response, "error");
            enqueueSnackbar(
              error.response.data.errors.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        })
  
    }
  
  
 



  return (
    <section className='ptb40'>
      <div className="custom_card">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Facility_Information.Add_Contracted_Facility_Confirmation')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
          <Row>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label><span>{data.name}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label><span>{data?.yomi}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label><span>{data?.address}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label><span>{data?.mobile}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label><span>{data?.email}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>{data?.managerName}</span></li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label><span>{data?.facilityManagerName}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label><span>{data?.contractDetails}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>{data?.capacity}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}.</label><span>{lang == "en" ?  data?.businessType == 1 ? "Special Nursing Home" : data?.businessType == 2 ? "Short Stay" : data?.businessType == 3 ? "Paid Nursing Home" : "-" :  data?.businessType == 1 ? "特別養護老人ホーム" : data?.businessType == 2 ? "ショートステイ" : data?.businessType == 3 ? "有料老人ホーム" : "-"}</span></li>
                  {/* <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{lang == "en" ? data?.plan == 1 ? "plan A" : data?.plan == 2 ? "Plan B" : data?.plan == 3 ? "Plan C" : data?.plan == 4 ? "Plan D" : data?.plan == 5 ? "Plan E" : "-" : data?.plan == 1 ? "プランA" : data?.plan == 2 ? "次のプラン" : data?.plan == 3 ? "プランC" : data?.plan == 4 ? "プランD" : data?.plan == 5 ? "飛行機" : "-"  }</span></li> */}
                  <li><label className='fs-16'>{t('Facility_Information.Affiliated_Facilities')}</label><span>{ 
                    data?.affiliatedFacility == 1 ? "Social Relations Center" :
                    data?.affiliatedFacility == 2 ? "Library and Information Processing Center" : 
                    data?.affiliatedFacility == 3 ? "Gender Equality Promotion Center" : 
                    data?.affiliatedFacility == 4 ? "University Research Administration Office" : 
                    data?.affiliatedFacility == 5 ? "Research Equipment Sharing Center" : 
                    data?.affiliatedFacility == 6 ? "Career Support Center" :
                    data?.affiliatedFacility == 7 ? "International Exchange Center" :
                    data?.affiliatedFacility == 8 ? "Center for Urban Policy Research and Education" :
                    data?.affiliatedFacility == 9 ? "Medical Psychology Center" : "-"
                   }</span></li>



                  {/* <li><label className='fs-16'>{t('Facility_Information.BusinessType')}.</label><span>{data?.businessType}</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>{data?.plan}</span></li> */}
                </ul>
              </Col>
            </Row>
          </div>
          {/* <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_facility_can_also_view')}</label>
            <div className="border_card">
              <p>{data?.memoForFacility}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_viewable_by_staff_only')}</label>
            <div className="border_card">
              <p>{data?.memoForStaff}</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Affiliated_Facilities')}</label>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, quas!</p>
          </div> */}
          <div className="flex_item_ce flex-wrap">
            <Button  onClick={backclick} className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.facilityMypage}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Amendment')}</Button>
            <Button onClick={addfacility} htmlType='submit' className='btn-theme btn-with-icon btn-success' to={PATH_FRONT.facilityList}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Submission')}</Button>
          </div>
        </div>
      </div >
    </section>
  )
}

export default ConfirmationFacility
