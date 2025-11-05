import { Button, Empty, Form, Input, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PATH_FRONT } from '../../../../routes/path'
import { Add, ArrowLeft2, ArrowRight2, SearchNormal1 } from 'iconsax-react'
import Column from 'antd/es/table/Column'
import ApiData from '../../../../data/ApiData'
import { useTranslation } from 'react-i18next'
import http from '../../../../../security/Http'
import url from '../../../../../Development.json'
import { format, addDays, addMonths, addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { enqueueSnackbar } from "notistack";
import { ja } from 'date-fns/locale';
import moment from 'moment'
import Loader from '../../../../Loader'


function ShiftList() {
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem('i18nextLng')
    const Token = localStorage.getItem("token");
    const [shift, setShift] = useState([])
    const [staffshift, setStaffShift] = useState([])
    const [day7, setday7] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDate, setWeekDate] = useState([1, 2, 3, 4, 5, 6, 7])
    const [isLoading, setIsLoading] = useState(true)

    var permissionData = localStorage.getItem("auth-storage");
    var parsedpermission = JSON.parse(permissionData);
    var permission = parsedpermission?.state?.permission;

    let weekStart;
    let weekEnd;
    let weekStartDay;
    let weekEndDay;
    let newdatestart;
    let newdateend;

    {
        weekDate.map((data, ind) => {
            weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
            weekStartDay = startOfWeek(currentDate, { weekStartsOn: 1 });
            weekEndDay = endOfWeek(currentDate, { weekStartsOn: 1 });
            newdatestart = format(new Date(weekStartDay), 'yyyy-MM-d');
            newdateend = format(new Date(weekEndDay), 'yyyy-MM-d');
        })
    }

    const getshifttime = () => {
        http.callApi(url.getshift, [], {
            headers: { 'authorization': 'Bearer ' + Token, lang: lang }
        })
            .then((res) => {
                // console.log(res.data, "res");
                setShift(res.data)
            })
            .catch((error) => {
                // console.log(error)
                if (error?.response.data?.errors?.message) {

                    // console.log(error?.response, "error");
                }
            })

    }

    const getallshift = () => {
        http.get(process.env.REACT_APP_BASE_URL + `/admin/staffshift?startDay=${newdatestart}&&endDay=${newdateend}`, [], {
            headers: { 'authorization': 'Bearer ' + Token, lang: lang }
        })
            .then((res) => {
                console.log(res?.data, "all data")
                setStaffShift(res?.data);
                setIsLoading(false);
            })
            .catch((error) => {
                // console.log(error)

                // console.log(error?.response, "error");
                enqueueSnackbar(
                    error,
                    { variant: "error" },
                    { autoHideDuration: 1000 }
                );

            })

    }

    useEffect(() => {
        getshifttime()
        getallshift()
    }, [])
    useEffect(() => {
        getallshift()
    }, [currentDate])

    const handleMonthChange = (amount) => {
        setCurrentDate(addMonths(currentDate, amount));
    };

    const handleWeekChange = (amount) => {
        setCurrentDate(addWeeks(currentDate, amount));
    };




    return (
        <section className='ptb40'>
            <div className="fliter_box_card mb30">
                <Form>
                    <Space className='flex-wrap flex_item_ce'>
                    {permission?.Shift?.substring(0, 1) == "1" ?  
                        <Form.Item className='mb0'>
                            <Link to={PATH_FRONT.addShift} className='btn-theme btn-with-icon btn-success flex-row'><Add size="24" color="#ffffff" /> {t('Shift.Add_Shift')}</Link>
                        </Form.Item>
                        :""
                    }
                        {/* <Form.Item className='mb0'>
                            <Input placeholder={t('table_title.Facility_search')} prefix={<SearchNormal1 size={18} color="#707070" variant="Outline" />} />
                        </Form.Item>
                        <Form.Item className='mb0'>
                            <Button type="primary" className='btn-theme btn-warning btn-with-icon' icon={<ArrowRight2 size={24} color="#ffffff" variant="Bold" />}>{t('table_title.Search')}</Button>
                        </Form.Item> */}
                        
                    </Space>
                </Form>
            </div>
            <div className="custom_card">
                <div className="custom_card_head flex_item_cb flex-wrap mb10">
                    <h4>{t('Shift.Shift_List')}</h4>
                    <div className="flex_item_ce flex-wrap shift_badge_list">
                        {shift?.map((time) => {
                            const badgeClass = `shift_badge badge_${time?.name === 'A' ? 'primary' : time?.name === 'B' ? 'success  ' : time?.name === 'C' ? 'warning' : time?.name === 'D' ? 'danger' : 'default'}`;

                            return (
                                <span className={badgeClass}>
                                    {time?.name + " :" + time?.startTime + " 〜 " + time?.endTime}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="custom_card_body p10">
                    <div className="shift-list-table custom_table_wrapper">
                    {isLoading == true ?    <Loader /> : <>
                        <Table scroll={{ x: 900 }} dataSource={staffshift} pagination={false} className="text-nowrap" locale={{emptyText : <Empty description={<p>{t('Reports.No_Data')}</p>} image={Empty.PRESENTED_IMAGE_SIMPLE} />}}>
                            <Column
                                title={
                                    <div className="flex_item_cc">
                                        <a role="button" className="lh1 flex_item_cc" onClick={() => handleMonthChange(-1)}>
                                            <ArrowLeft2 variant="Bold" color="#0D0B0B" size="24" />
                                        </a>
                                        <h6>{lang === 'en' ? format(currentDate, 'MMMM yyyy') : format(currentDate, 'MMMM yyyy', { locale: ja })}</h6>
                                        <a role="button" className="lh1 flex_item_cc" onClick={() => handleMonthChange(1)}>
                                            <ArrowRight2 variant="Bold" color="#0D0B0B" size="24" />
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
                                        <a className='lh1_5 flex_item_cc' role='button' onClick={() => handleWeekChange(-1)}><ArrowLeft2 variant="Bold" color="#0D0B0B" size="24" /></a>
                                    </div>
                                }
                            />
                            <Column title={<div className='flex_item_cc gap2'> {lang === 'en' ? format(weekStart, 'd') : format(weekStart, 'd')}</div>} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item?.shiftData[moment(weekStart).format('YYYY-MM-DD')] ? item?.shiftData[moment(weekStart).format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )) :
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>
                                    }
                                </ul>
                            }} dataIndex="day1" key="monday" />
                            <Column title={lang === 'en' ? format(addDays(weekStart, 1), 'd') : format(addDays(weekStart, 1), 'd')} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item?.shiftData[moment(weekStart).add(1, 'days').format('YYYY-MM-DD')] ? item?.shiftData[moment(weekStart).add(1, 'days').format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )):
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>}
                                </ul>
                            }} dataIndex="tuesday" key="tuesday" />
                            <Column title={lang === 'en' ? format(addDays(weekStart, 2), 'd') : format(addDays(weekStart, 2), 'd ')} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item?.shiftData[moment(weekStart).add(2, 'days').format('YYYY-MM-DD')] ? item?.shiftData[moment(weekStart).add(2, 'days').format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )):
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>}
                                </ul>
                            }} dataIndex="wednesday" key="wednesday" />
                            <Column title={lang === 'en' ? format(addDays(weekStart, 3), 'd') : format(addDays(weekStart, 3), 'd')} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item?.shiftData[moment(weekStart).add(3, 'days').format('YYYY-MM-DD')] ? item?.shiftData[moment(weekStart).add(3, 'days').format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )):
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>}
                                </ul>
                            }} dataIndex="thursday" key="thursday" />
                            <Column title={lang === 'en' ? format(addDays(weekStart, 4), 'd') : format(addDays(weekStart, 4), 'd')} className='td_weekday text-center' render={(e, item) => {
                                return <ul>

                                    {item?.shiftData[moment(weekStart).add(4, 'days').format('YYYY-MM-DD')] ? item?.shiftData[moment(weekStart).add(4, 'days').format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )):
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>
                                    }
                                </ul>
                            }} dataIndex="friday" key="friday" />
                            <Column title={lang === 'en' ? format(addDays(weekStart, 5), 'd') : format(addDays(weekStart, 5), 'd')} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item?.shiftData[moment(weekStart).add(5, 'days').format('YYYY-MM-DD')]? item?.shiftData[moment(weekStart).add(5, 'days').format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )):
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>}
                                </ul>
                            }} dataIndex="saturday" key="saturday" />
                            <Column title={<div className='flex_item_cc gap2'>{lang === 'en' ? format(weekEnd, 'd') : format(weekEnd, 'd')}</div>} className='td_weekday text-center' render={(e, item) => {
                                return <ul>
                                    {item?.shiftData[moment(weekEnd).format('YYYY-MM-DD')] ? item?.shiftData[moment(weekEnd).format('YYYY-MM-DD')]?.map((dt, ind) => (
                                        ind == 0 ?
                                            dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_primary'></span></li> : <li></li>
                                            : ind == 1 ?
                                                dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_success'></span></li> : <li></li>
                                                : ind == 2 ?
                                                    dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_warning'></span></li> : <li></li>
                                                    : ind == 3 ?
                                                        dt !== "" ? <li><span className='label'>{dt}</span><span className='shift_badge badge_danger'></span></li> : <li></li>
                                                        : <></>
                                    )):
                                    
                                    <li><span className='label'></span><span className='shift_badge' style={{"visibility":"hidden"}} ></span></li>}
                                </ul>
                            }} dataIndex="day7" key="sunday" />
                            <Column
                                title={
                                    <div className="flex_item_cc">
                                        <a className='lh1 flex_item_cc' role='button' onClick={() => handleWeekChange(1)}><ArrowRight2 variant="Bold" color="#0D0B0B" size="24" /></a>
                                    </div>
                                }
                            />
                        </Table></>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShiftList
