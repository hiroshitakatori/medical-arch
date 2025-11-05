import { Button, Checkbox, Dropdown, Menu, Radio, Select, Tag } from 'antd'
import { ArrowDown2, CloseCircle, DocumentDownload, Eye } from 'iconsax-react'
import React, { useState } from 'react'
import { PATH_FRONT } from '../routes/path'
import { Link } from 'react-router-dom'
import { I18nContext, useTranslation } from 'react-i18next'

const { Option } = Select;
function ApiData(props) {
    const { t, i18n } = useTranslation();
    const [selectValue, setSelectValue] = useState("");

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const handleVisibleChange = (visible) => {
        setDropdownVisible(visible);
    };
    const apiData = {
        missedCallsData: [
            {
                key: 1,
                id: "1",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className='text-danger fw-600 mt0 mb0 fs-14'>Oralia Shore</Link>,
                day: t('table_title.4th_Monday'),
                // time: '05:45',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 2,
                id: "2",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className='text-danger fw-600 mt0 mb0 fs-14'>Annamae Felger</Link>,
                day: t('table_title.4th_Monday'),
                // time: '05:50',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 3,
                id: "3",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className='text-danger fw-600 mt0 mb0 fs-14'>Lian Abilay</Link>,
                day: t('table_title.4th_Monday'),
                // time: '06:03',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 4,
                id: "4",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className='text-danger fw-600 mt0 mb0 fs-14'>Dahlia Pillsbury</Link>,
                day: t('table_title.4th_Monday'),
                // time: '06:08',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 5,
                id: "5",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className='text-danger fw-600 mt0 mb0 fs-14'>Ela Turek</Link>,
                day: t('table_title.4th_Monday'),
                // time: '06:22',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
        ],
        incomingCallHistory: [
            {
                key: 1,
                id: "1",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Oralia Shore</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Jason Or</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.Responding')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '05:45',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 2,
                id: "2",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Annamae Felger</Link>,
                responders: "",
                status: <Tag className='text-dark' color="#F2D9CB">{t('table_title.Not_responded_to')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '05:50',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 3,
                id: "3",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Lian Abilay</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Earl Shones</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.Responding')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:03',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 4,
                id: "4",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Dahlia Pillsbury</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Emanuel Millward</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:08',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 5,
                id: "5",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Ela Turek</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Hannah Feezor</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:22',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
        ],
        pastIncomingCallHistory: [
            {
                key: 1,
                id: "1",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Oralia Shore</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Jason Or</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.Responding')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '05:45',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 2,
                id: "2",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Annamae Felger</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Dahlia Pillsbury</Link>,
                status: <Tag className='text-dark' color="#F2D9CB">{t('table_title.Not_responded_to')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '05:50',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 3,
                id: "3",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Lian Abilay</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Earl Shones</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.Responding')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:03',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 4,
                id: "4",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Dahlia Pillsbury</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Emanuel Millward</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:08',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 5,
                id: "5",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fw-600 fs-14">Ela Turek</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Dr. Hannah Feezor</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:22',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
        ],
        reportList: [
            {
                key: 11,
                id: "11",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Oralia Shore</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Giovanni Langlo</Link>,
                status: <Link to={PATH_FRONT.reportDetails}><Tag className='text-dark' color="#CBE6F2">{t('table_title.In_Preparation')}</Tag></Link>,
                day: t('table_title.4th_Monday'),
                FirstAid: "",
                time: '05:45',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 12,
                id: "12",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Annamae Felger</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Jeremiah Fruge</Link>,
                status: <Link to={PATH_FRONT.reportDetails}><Tag className='text-dark' color="#F2D9CB">{t('table_title.Unconfirmed')}</Tag></Link>,
                day: t('table_title.4th_Monday'),
                FirstAid: "",
                time: '05:50',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 13,
                id: "13",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Lian Abilay</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Joaquin Kuhnke</Link>,
                status: <Link to={PATH_FRONT.reportDetails}><Tag className='text-dark' color="#CBE6F2">{t('table_title.In_Preparation')}</Tag></Link>,
                day: t('table_title.4th_Monday'),
                FirstAid: <span className="text-danger">{t('table_title.FirstAid')}</span>,
                time: '06:03',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 14,
                id: "14",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Dahlia Pillsbury</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Ahmed Dirocco</Link>,
                status: <Link to={PATH_FRONT.reportDetails}><Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag></Link>,
                day: t('table_title.4th_Monday'),
                FirstAid: <span className="text-danger">{t('table_title.FirstAid')}</span>,
                time: '06:08',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 15,
                id: "15",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Ela Turek</Link>,
                responders: <Link to={PATH_FRONT.staffDetails}>Abel Loh</Link>,
                status: <Link to={PATH_FRONT.reportDetails}><Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag></Link>,
                day: t('table_title.4th_Monday'),
                FirstAid: "",
                time: '06:22',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
        ],
        facilityList: [
            {
                key: 16,
                id: "16",
                uniqueId: "001",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Oralia Shore</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Special_Nursing_Home'),
            },
            {
                key: 17,
                id: "17",
                uniqueId: "002",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Lavina Bribiesca</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Short_Stay'),
            },
            {
                key: 18,
                id: "18",
                uniqueId: "003",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Alyssa Tack</Link></h6>,
                status: <p className='fw-500 text-danger'>{t('table_title.Canceled')}</p>,
                businessformat: t('table_title.Special_Nursing_Home'),
            },
            {
                key: 19,
                id: "19",
                uniqueId: "004",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Ela Turek</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Special_Nursing_Home'),
            },
            {
                key: 20,
                id: "20",
                uniqueId: "005",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Corene Audie</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Paid_Nursing_Home'),
            },
            {
                key: 21,
                id: "21",
                uniqueId: "006",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Trudy Scoggins</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Special_Nursing_Home'),
            },
            {
                key: 22,
                id: "22",
                uniqueId: "007",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Debi Honahni</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Short_Stay'),
            },
            {
                key: 23,
                id: "23",
                uniqueId: "008",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Annamae Felger</Link></h6>,
                status: <p className='fw-500 text-danger'>{t('table_title.Canceled')}</p>,
                businessformat: t('table_title.Special_Nursing_Home'),
            },
            {
                key: 24,
                id: "24",
                uniqueId: "009",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Lian Abilay</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Special_Nursing_Home'),
            },
            {
                key: 25,
                id: "25",
                uniqueId: "010",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>Dahlia Pillsbury</Link></h6>,
                status: <p className='fw-500 text-dark'>{t('table_title.UnderContract')}</p>,
                businessformat: t('table_title.Paid_Nursing_Home'),
            },
        ],
        pastReportList: [
            {
                key: 26,
                id: "26",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Oralia Shore</Link>,
                responders: <Link to={PATH_FRONT.reportDetails}>Giovanni Langlo</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.In_Preparation')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '05:45',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 27,
                id: "27",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Annamae Felger</Link>,
                responders: <Link to={PATH_FRONT.reportDetails}>Jeremiah Fruge</Link>,
                status: <Tag className='text-dark' color="#F2D9CB">{t('table_title.Unconfirmed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '05:50',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 28,
                id: "28",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Lian Abilay</Link>,
                responders: <Link to={PATH_FRONT.reportDetails}>Joaquin Kuhnke</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.In_Preparation')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:03',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 29,
                id: "29",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Dahlia Pillsbury</Link>,
                responders: <Link to={PATH_FRONT.reportDetails}>Ahmed Dirocco</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:08',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 30,
                id: "30",
                facilityName: <Link className="fw-600" to={PATH_FRONT.facilityDetails}>Ela Turek</Link>,
                responders: <Link to={PATH_FRONT.reportDetails}>Abel Loh</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                time: '06:22',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
        ],
        cancelFacilityList: [
            {
                key: 31,
                id: "31",
                uniqueId: "0031",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: t('table_title.UnderContract'),
                businessformat: t('table_title.Special_Nursing_Home'),
                action: <Link to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>{t('table_title.Cancel')}</Link>
            },
            {
                key: 32,
                id: "32",
                uniqueId: "0032",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: t('table_title.UnderContract'),
                businessformat: t('table_title.Short_Stay'),
                action: <Link to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>{t('table_title.Cancel')}</Link>
            },
            {
                key: 33,
                id: "33",
                uniqueId: "0033",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: t('table_title.Canceled'),
                businessformat: t('table_title.Special_Nursing_Home'),
                action: <Link to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>{t('table_title.Cancel')}</Link>
            },
            {
                key: 34,
                id: "34",
                uniqueId: "0034",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: t('table_title.UnderContract'),
                businessformat: t('table_title.Special_Nursing_Home'),
                action: <Link to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>{t('table_title.Cancel')}</Link>
            },
            {
                key: 35,
                id: "35",
                uniqueId: "0035",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.facilityDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: t('table_title.UnderContract'),
                businessformat: t('table_title.Paid_Nursing_Home'),
                action: <Link to={PATH_FRONT.cancelFacility} className='btn-theme btn-danger btn-sm'>{t('table_title.Cancel')}</Link>
            },
        ],
        staffList: [
            {
                key: 41,
                id: "00001",
                name: <h6 className="fs-14"><Link to={PATH_FRONT.staffDetails}>Toremaf</Link></h6>,
                email: "toremaf128@gmail.com",
                phone: "624 3327 793",
                action: <Link className='flex_item_cc' to={PATH_FRONT.staffDetails}><Eye variant="Bold" color="#707070" size={24} /></Link>,
            },
            {
                key: 42,
                id: "00002",
                name: <h6 className="fs-14"><Link to={PATH_FRONT.staffDetails}>Yomolotok</Link></h6>,
                email: "yomolotok@gmail.com",
                phone: "928 2526 269",
                action: <Link className='flex_item_cc' to={PATH_FRONT.staffDetails}><Eye variant="Bold" color="#707070" size={24} /></Link>,
            },
            {
                key: 43,
                id: "00003",
                name: <h6 className="fs-14"><Link to={PATH_FRONT.staffDetails}>Eazeyomine</Link></h6>,
                email: "eazeyomine@gmail.com",
                phone: "268 9334 768",
                action: <Link className='flex_item_cc' to={PATH_FRONT.staffDetails}><Eye variant="Bold" color="#707070" size={24} /></Link>,
            },
            {
                key: 44,
                id: "00004",
                name: <h6 className="fs-14"><Link to={PATH_FRONT.staffDetails}>Nebfan</Link></h6>,
                email: "nebfan@gmail.com",
                phone: "465 4443 165",
                action: <Link className='flex_item_cc' to={PATH_FRONT.staffDetails}><Eye variant="Bold" color="#707070" size={24} /></Link>,
            },
            {
                key: 45,
                id: "00005",
                name: <h6 className="fs-14"><Link to={PATH_FRONT.staffDetails}>Thwackmaster</Link></h6>,
                email: "thwackmaster@gmail.com",
                phone: "640 2742 480",
                action: <Link className='flex_item_cc' to={PATH_FRONT.staffDetails}><Eye variant="Bold" color="#707070" size={24} /></Link>,
            },
        ],
        logList: [
            {
                key: 1,
                id: "1",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fs-14">Oralia Shore</Link>,
                responders: <Link to={""}>Giovanni Langlo</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.Responding')}</Tag>,
                date: t('table_title.4th_Monday'),
                time: '05:45',
                action: <Button className="btn-theme btn-sm btn-with-icon" style={{ marginLeft: "auto" }}><DocumentDownload variant="Bold" color="#ffffff" size={18} />{t('table_title.Download')}</Button>,
            },
            {
                key: 2,
                id: "2",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fs-14">Annamae Felger</Link>,
                responders: <Link to={""}>Jeremiah Fruge</Link>,
                status: <Tag className='text-dark' color="#F2D9CB">{t('table_title.Not_responded_to')}</Tag>,
                date: t('table_title.4th_Monday'),
                time: '05:50',
                action: <Button className="btn-theme btn-sm btn-with-icon" style={{ marginLeft: "auto" }}><DocumentDownload variant="Bold" color="#ffffff" size={18} />{t('table_title.Download')}</Button>,
            },
            {
                key: 3,
                id: "3",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fs-14">Lian Abilay</Link>,
                responders: <Link to={""}>Joaquin Kuhnke</Link>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.Responding')}</Tag>,
                date: t('table_title.4th_Monday'),
                time: '06:03',
                action: <Button className="btn-theme btn-sm btn-with-icon" style={{ marginLeft: "auto" }}><DocumentDownload variant="Bold" color="#ffffff" size={18} />{t('table_title.Download')}</Button>,
            },
            {
                key: 4,
                id: "4",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fs-14">Dahlia Pillsbury</Link>,
                responders: <Link to={""}>Ahmed Dirocco</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                date: t('table_title.4th_Monday'),
                time: '06:08',
                action: <Button className="btn-theme btn-sm btn-with-icon" style={{ marginLeft: "auto" }}><DocumentDownload variant="Bold" color="#ffffff" size={18} />{t('table_title.Download')}</Button>,
            },
            {
                key: 5,
                id: "5",
                facilityName: <Link to={PATH_FRONT.facilityDetails} className="fs-14">Ela Turek</Link>,
                responders: <Link to={""}>Abel Loh</Link>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                date: t('table_title.4th_Monday'),
                time: '06:22',
                action: <Button className="btn-theme btn-sm btn-with-icon" style={{ marginLeft: "auto" }}><DocumentDownload variant="Bold" color="#ffffff" size={18} />{t('table_title.Download')}</Button>,
            },
        ],
        shiftList: [
            {
                key: 1,
                name: <h6 className="fs-14">MR. Brooks Botsford</h6>,
                monday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                tuesday: {
                    shiftTime: ["A", "", "C", "D"]
                },
                wednesday: {
                    shiftTime: ["A", "B", "", "D"]
                },
                thursday: {
                    shiftTime: ["A", "B", "C", ""]
                },
                friday: {
                    shiftTime: ["", "B", "C", "D"]
                },
                saturday: {
                    shiftTime: ["A", "", "", "D"]
                },
                sunday: {
                    shiftTime: ["A", "B", "", ""]
                },
            },
            {
                key: 2,
                name: <h6 className="fs-14">MR. Denis</h6>,
                monday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                tuesday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                wednesday: {
                    shiftTime: ["", "", "", "D"]
                },
                thursday: {
                    shiftTime: ["A", "B", "C", ""]
                },
                friday: {
                    shiftTime: ["", "", "", ""]
                },
                saturday: {
                    shiftTime: ["A", "", "", "D"]
                },
                sunday: {
                    shiftTime: ["A", "B", "", ""]
                },
            },
            {
                key: 3,
                name: <h6 className="fs-14">MR. Mgerlach</h6>,
                monday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                tuesday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                wednesday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                thursday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                friday: {
                    shiftTime: ["", "B", "C", "D"]
                },
                saturday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                sunday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
            },
            {
                key: 4,
                name: <h6 className="fs-14">MR. Botsford</h6>,
                monday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                tuesday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                wednesday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                thursday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                friday: {
                    shiftTime: ["", "B", "C", "D"]
                },
                saturday: {
                    shiftTime: ["A", "", "", "D"]
                },
                sunday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
            },
            {
                key: 5,
                name: <h6 className="fs-14">MR. Naomi</h6>,
                monday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                tuesday: {
                    shiftTime: ["A", "", "C", "D"]
                },
                wednesday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                thursday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                friday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                saturday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
                sunday: {
                    shiftTime: ["A", "B", "C", "D"]
                },
            },
        ],
        addshiftData: [
            {
                key: 0,
                name: "",
                monday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 1 ? true : false} onVisibleChange={() => handleVisibleChange(1)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 1 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 1 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
                tuesday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 2 ? true : false} onVisibleChange={() => handleVisibleChange(2)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 2 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 2 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
                wednesday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 3 ? true : false} onVisibleChange={() => handleVisibleChange(3)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 3 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 3 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
                thursday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 4 ? true : false} onVisibleChange={() => handleVisibleChange(4)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 4 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 4 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
                friday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 5 ? true : false} onVisibleChange={() => handleVisibleChange(5)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 5 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 5 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
                saturday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 6 ? true : false} onVisibleChange={() => handleVisibleChange(6)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 6 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 6 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
                sunday: {
                    shiftTime:
                        <Dropdown getPopupContainer={(node) => node.parentNode}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                            trigger={['click']}
                            visible={dropdownVisible == 7 ? true : false} onVisibleChange={() => handleVisibleChange(7)}
                            overlay={
                                <Menu onClick={() => { }} visible={dropdownVisible == 7 ? true : false}>
                                    <Menu.Item>
                                        <Radio.Group onChange={(e) => setSelectValue(e.target.value)} className='flex_item_ss flex-column'>
                                            <Radio value={t('table_title.Responder') + 'A'}>{t('table_title.Responder') + 'A'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'B'}>{t('table_title.Responder') + 'B'}</Radio>
                                            <Radio value={t('table_title.Responder') + 'C'}>{t('table_title.Responder') + 'C'}</Radio>
                                        </Radio.Group>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="fs-12 fw-600 flex_item_cb" onClick={(e) => e.preventDefault()}>{dropdownVisible == 7 ? selectValue == "" ? t('table_title.Leader') : selectValue : t('table_title.Leader')} <ArrowDown2 size="18" color="#707070" variant="Bold" /></Button>
                        </Dropdown >
                },
            },
            {
                key: 1,
                name: <h6 className="fs-14 text-blue">A {t('table_title.Frame')}</h6>,
                monday: {
                    shiftTime: <Checkbox value={1} />
                },
                tuesday: {
                    shiftTime: <Checkbox value={2} />
                },
                wednesday: {
                    shiftTime: <Checkbox value={3} />
                },
                thursday: {
                    shiftTime: <Checkbox value={4} />
                },
                friday: {
                    shiftTime: <Checkbox value={5} />
                },
                saturday: {
                    shiftTime: <Checkbox value={6} />
                },
                sunday: {
                    shiftTime: <Checkbox value={7} />
                },
            },
            {
                key: 2,
                name: <h6 className="fs-14 text-success">B {t('table_title.Frame')}</h6>,
                monday: {
                    shiftTime: <Checkbox value={1} />
                },
                tuesday: {
                    shiftTime: <Checkbox value={2} />
                },
                wednesday: {
                    shiftTime: <Checkbox value={3} />
                },
                thursday: {
                    shiftTime: <Checkbox value={4} />
                },
                friday: {
                    shiftTime: <Checkbox value={5} />
                },
                saturday: {
                    shiftTime: <Checkbox value={6} />
                },
                sunday: {
                    shiftTime: <Checkbox value={7} />
                },
            },
            {
                key: 3,
                name: <h6 className="fs-14 text-warning">C {t('table_title.Frame')}</h6>,
                monday: {
                    shiftTime: <Checkbox value={1} />
                },
                tuesday: {
                    shiftTime: <Checkbox value={2} />
                },
                wednesday: {
                    shiftTime: <Checkbox value={3} />
                },
                thursday: {
                    shiftTime: <Checkbox value={4} />
                },
                friday: {
                    shiftTime: <Checkbox value={5} />
                },
                saturday: {
                    shiftTime: <Checkbox value={6} />
                },
                sunday: {
                    shiftTime: <Checkbox value={7} />
                },
            },
            {
                key: 4,
                name: <h6 className="fs-14 text-danger">D {t('table_title.Frame')}</h6>,
                monday: {
                    shiftTime: <Checkbox value={1} />
                },
                tuesday: {
                    shiftTime: <Checkbox value={2} />
                },
                wednesday: {
                    shiftTime: <Checkbox value={3} />
                },
                thursday: {
                    shiftTime: <Checkbox value={4} />
                },
                friday: {
                    shiftTime: <Checkbox value={5} />
                },
                saturday: {
                    shiftTime: <Checkbox value={6} />
                },
                sunday: {
                    shiftTime: <Checkbox value={7} />
                },
            },
        ],
        facilityReport: [
            {
                key: 11,
                id: "11",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.reportDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.In_Preparation')}</Tag>,
                day: t('table_title.4th_Monday'),
                staff: t('table_title.Staff') + "A",
                time: '05:45',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 12,
                id: "12",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.reportDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: <Tag className='text-dark' color="#F2D9CB">{t('table_title.Unconfirmed')}</Tag>,
                day: t('table_title.4th_Monday'),
                staff: t('table_title.Staff') + "B",
                time: '05:50',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 13,
                id: "13",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.reportDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: <Tag className='text-dark' color="#CBE6F2">{t('table_title.In_Preparation')}</Tag>,
                day: t('table_title.4th_Monday'),
                staff: t('table_title.Staff') + " C",
                time: '06:03',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 14,
                id: "14",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.reportDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                staff: t('table_title.Staff') + " D",
                time: '06:08',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
            {
                key: 15,
                id: "15",
                facilityName: <h6 className="fs-14"><Link to={PATH_FRONT.reportDetails}>{t('table_title.Name_of_facility')}</Link></h6>,
                status: <Tag className='text-dark' color="#CBF2D6">{t('table_title.Completed')}</Tag>,
                day: t('table_title.4th_Monday'),
                staff: t('table_title.Staff') + " E",
                time: '06:22',
                action: <a role="button" className='flex_item_cc'><CloseCircle variant="Bold" color="#FC3434" size={24} /></a>,
            },
        ],
        selectLeaderData: [
            {
                key: 1,
                id: "1",
                shiftTime: "",
                leaderName: <h6 className='fs-16 text-danger'>Dr. Jason Or</h6>,
                responders1: "",
                responders2: "",
                responders3: "",
                responders4: "",
                children: [
                    {
                        key: 1_1,
                        id: "1_1",
                        shiftTime: <h6 className='fs-16 text-dark'>A : 17:00 ~ 20:00</h6>,
                        leaderName: "",
                        responders1: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} A</Link>,
                        responders2: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} B</Link>,
                        responders3: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} C</Link>,
                        responders4: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} D</Link>,
                    },
                ]
            },
            {
                key: 2,
                id: "2",
                shiftTime: "",
                leaderName: <h6 className='fs-16 text-danger'>Dr. Kai Scheiner</h6>,
                responders1: "",
                responders2: "",
                responders3: "",
                responders4: "",
                children: [
                    {
                        key: 2_1,
                        id: "2_1",
                        shiftTime: <h6 className='fs-16 text-dark'>A : 20:00 ~ 00:00</h6>,
                        leaderName: "",
                        responders1: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} A</Link>,
                        responders2: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} B</Link>,
                        responders3: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} C</Link>,
                        responders4: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} D</Link>,
                    },
                ]
            },
            {
                key: 3,
                id: "3",
                shiftTime: "",
                leaderName: <h6 className='fs-16 text-danger'>Dr. Earl Shones</h6>,
                responders1: "",
                responders2: "",
                responders3: "",
                responders4: "",
                children: [
                    {
                        key: 3_1,
                        id: "3_1",
                        shiftTime: <h6 className='fs-16 text-dark'>A : 00:00 ~ 06:00</h6>,
                        leaderName: "",
                        responders1: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} A</Link>,
                        responders2: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} B</Link>,
                        responders3: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} C</Link>,
                        responders4: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} D</Link>,
                    },
                ]
            },
            {
                key: 4,
                id: "4",
                shiftTime: "",
                leaderName: <h6 className='fs-16 text-danger'>Dr. Emanuel Millward</h6>,
                responders1: "",
                responders2: "",
                responders3: "",
                responders4: "",
                children: [
                    {
                        key: 4_1,
                        id: "4_1",
                        shiftTime: <h6 className='fs-16 text-dark'>A : 06:00 ~ 08:30</h6>,
                        leaderName: "",
                        responders1: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} A</Link>,
                        responders2: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} B</Link>,
                        responders3: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} C</Link>,
                        responders4: <Link to={PATH_FRONT.reportDetails}>{t('table_title.Responder')} D</Link>,
                    },
                ]
            },
        ]
    }

    return apiData
}

export default ApiData
