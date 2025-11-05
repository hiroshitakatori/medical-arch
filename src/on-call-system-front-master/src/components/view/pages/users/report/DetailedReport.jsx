import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Space, Table, Col, Divider, Input, DatePicker, Select, Radio, AutoComplete, Tag } from 'antd'
import { Add, ArrowDown2, ArrowLeft2, ArrowRight2, Calendar } from 'iconsax-react'
import ApiData from '../../../../data/ApiData'
import Column from 'antd/es/table/Column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATH_FRONT } from '../../../../routes/path';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import http from '../../../../../security/Http'
import SupportStatusChangeModal from '../../../modals/SupportStatusChangeModal';
import SymptomsModel from '../../../modals/SymptomsModel';
import { Option } from 'antd/es/mentions';

function DetailedReport(props) {
    // console.log(props)
    let s = props.state;
    // if (s == "fever") {
    //     console.log(ApiData().feverData)
    // }
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const location = useLocation();
    const data = location.state
    return (<>
        {/* <Col> */}
        <Row gutter={16}>
            {s === "fever" ?
            <>
                <Col sm={{ span: 12 }} xs={{ span: 12 }}>
                <Col sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Symptoms.Shoulder_breathing')} name="Shoulder breathing">
                        <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                   </Form.Item>
                   <Form.Item label={t('Symptoms.cyanosis')} name="cyanosis">
                        <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                   </Form.Item>
                   <Form.Item label={t('Symptoms.phlegm_entanglement')} name="phlegm entanglement">
                        <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                   </Form.Item>
                   <Form.Item label={t('Symptoms.pain')} name="pain">
                        <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                   </Form.Item>
                   <Form.Item label={t('Symptoms.decreased_level_of_consciousness')} name="decreased level of consciousness">
                        <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                   </Form.Item>
                   <Form.Item label={t('Symptoms.Chills')} name="Chills">
                        <Radio.Group className='flex_item_cs'>
                            <Radio value={1}>{t('Reports.Yes')}</Radio>
                            <Radio value={0} defaultChecked>{t('Reports.None')}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Form.Item label={t('Symptoms.cyanosis')} className='mb0' name="cyanosis" rules={[
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
                </Col>
                </Col >
                <Col sm={{ span: 12 }} xs={{ span: 12 }}>
                        <Col sm={{ span: 24 }} >
                            <h6>{t('')} Emergency transport</h6>
                            <ul style={{ listStyleType: "circle", paddingLeft: "35px", fontSize: "13px" }}>
                                <li>Deterioration of respiratory condition</li>
                                <li>Decreased level of consciousness</li>
                                <li>Decreased blood pressure</li>
                                <li>Shivering does not stop even after heating</li>
                            </ul>
                        </Col>
                        <Col sm={{ span: 24 }}>
                            <h6>Response</h6>
                            <p style={{ paddingLeft: "15px", fontSize: "13px" }}>
                                Antipyretic medication (not allowed if blood pressure is below 100, basically prohibited to administer via PEG)
                                *Drugs prescribed for other than fever are not allowed. 1) Chills and respiratory status
                                Decreased level of consciousness/above 39°C, consult physician 2) Volume
                                Consult a physician if there are no instructions regarding the frequency or interval between doses.
                                Temperature above 38°C: 3-point cooling (head, both groins, or one axilla, groin)
                                If possible, encourage drinking water to prevent aspiration.
                                Adjust room temperature and hanging items.
                                Check vital signs after 2 hours.
                                If chills are present, warm the patient and call again in 30 minutes.
                                →If chills persist, consider sepsis.
                                If fever persists at the time of recall but no other symptoms are present, retest is not necessary.
                            </p>
                        </Col>
                </Col>
            </>
        : ""
    }

        </Row>
    </>)
}
export default DetailedReport

