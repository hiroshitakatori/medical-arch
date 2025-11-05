import React from 'react'
import { Button, Form, Input, Row, Col, DatePicker, Checkbox } from 'antd'
import { ArrowLeft2, ArrowRight2, Calendar } from 'iconsax-react'
import { Link } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
function CancelFacility() {
  const { t, i18n } = useTranslation();
  return (
    <section className='ptb40'>
      <div className="custom_card mb30">
        <div className="custom_card_head flex_item_cb flex-wrap mb16">
          <h4>{t('Facility_Information.Cancellation_procedure')}</h4>
        </div>
        <div className="custom_card_body">
          <div className="mb30">
            <Row>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.FacilityName')}</label><span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. In, assumenda.</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Yomi')}</label><span>Auto Reflect</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Address')}</label><span>5450-A, ABC Mall, Near Tokyo Japan</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Phone')}</label><span>057 874 4587 891</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Email')}</label><span>info.yourname@xyz.com</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.ManagerName')}</label><span>Dr. Suyog Bora</span></li>
                </ul>
              </Col>
              <Col span={12}>
                <ul className='details_list'>
                  <li><label className='fs-16'>{t('Facility_Information.Facility_Manager_Name')}</label><span>Dr. Sagar Kachariya</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Contract_Details')}</label><span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Capacity')}</label> <span>Lorem, ipsum dolor.</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.BusinessType')}.</label><span>Paid Nursing Home</span></li>
                  <li><label className='fs-16'>{t('Facility_Information.Plan')}</label><span>Platinium</span></li>
                </ul>
              </Col>
            </Row>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_facility_can_also_view')}</label>
            <div className="border_card">
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo sequi incidunt minus numquam repellat asperiores cupiditate facilis repellendus odio, dolorem quidem! Inventore dolores dolore magni cum esse consequatur ex doloribus exercitationem eaque debitis accusantium recusandae eius cumque dicta architecto provident, odit ducimus quibusdam sapiente dolorum blanditiis facilis. Quos odio, asperiores magnam magni, accusamus deserunt laborum quae earum quas reprehenderit veritatis, est voluptate fugiat rem. Fugit beatae error totam alias iure quibusdam nihil itaque reprehenderit necessitatibus odio veritatis nesciunt, illo, voluptate velit porro. Accusantium aperiam rem quia, modi sit ea quos alias ipsa iusto aliquid dolorem exercitationem ipsam asperiores. Numquam, corrupti.</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Memo_viewable_by_staff_only')}</label>
            <div className="border_card">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere minus esse mollitia delectus perspiciatis dolorem fugiat sapiente reiciendis autem, amet eos dolorum quo libero a exercitationem earum iure laboriosam, eligendi dolor maiores quos impedit vitae, aliquam accusamus. Voluptas dolore impedit optio excepturi! Vel soluta deserunt quod sunt omnis eos adipisci veritatis consequatur natus, aperiam deleniti facilis non voluptate commodi blanditiis distinctio vero laudantium officia voluptates id. Natus veniam ipsum voluptates, earum maiores nobis eos voluptate laboriosam, ducimus blanditiis id cum eligendi sapiente nisi maxime ex recusandae. Corrupti facere veniam doloremque dignissimos nulla unde ullam explicabo libero soluta alias aperiam harum mollitia illum, excepturi asperiores minus repellendus iste, repudiandae neque! Deserunt voluptates aut incidunt voluptatum iure ducimus eius eos. Temporibus modi odio debitis voluptatum blanditiis, sunt at nostrum officiis aut minima possimus aperiam, voluptate iste. Laboriosam impedit exercitationem in neque optio voluptate inventore obcaecati voluptatibus aliquid! Error eaque ullam veniam odio!</p>
            </div>
          </div>
          <div className="mb30">
            <label className='fs-16 mb10'>{t('Facility_Information.Affiliated_Facilities')}</label>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, quas!</p>
          </div>
          <div className="">
            <label className='fs-16 mb10'>{t('Facility_Information.Subscriber_Registrant')}</label>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, quas!</p>
          </div>
        </div>
      </div >
      <div className="custom_card">
        <div className="custom_card_body">
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                <Form.Item required label={t('Facility_Information.Termination_Date')}>
                  <DatePicker className='custom-ant-picker' placeholder={t('Facility_Information.Termination_Date')} suffixIcon={<Calendar size="22" color="#707070" />} format={"DD-MM-YYYY"} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                <Form.Item>
                  <Checkbox>{t('Facility_Information.Are_you_sure_you_want_to_cancel_your_subscription?')}</Checkbox>
                </Form.Item>
              </Col>
              <Col sm={{ span: 13 }} xs={{ span: 24 }}>
                <Form.Item required label={t('Facility_Information.Entry_By')}>
                  <Input placeholder={t('Facility_Information.Entry_By')} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item className='mb0'>
              <div className="flex_item_ce flex-wrap">
                <Link className='btn-theme btn-with-icon btn-brown flex-row' to={PATH_FRONT.cancelFacilitySearch}><ArrowLeft2 variant="Bold" size="24" color="#ffffff" />{t('Facility_Information.Amendment')} </Link>
                <Link className='btn-theme btn-with-icon btn-danger' to={PATH_FRONT.cancelFacilitySearch}><ArrowRight2 variant="Bold" size="24" color="#ffffff" /> {t('Facility_Information.Cancellation')}</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default CancelFacility
