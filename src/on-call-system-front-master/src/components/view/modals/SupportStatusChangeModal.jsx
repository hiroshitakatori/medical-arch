import React from 'react'
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { ArrowDown2 } from 'iconsax-react'

const { Option } = Select
const { TextArea } = Input
function SupportStatusChangeModal(props) {
    const { modalOpenEvent, modalCloseEvent } = props
    const { t, i18n } = useTranslation();
    return (
        <Modal
            title={<h5>{t('table_title.Support_status_change')}</h5>}
            centered
            open={modalOpenEvent}
            // onOk={() => modalCloseEvent(false)}
            onCancel={() => modalCloseEvent(false)}
            footer={false}
        >
            <div className="">
                <Form layout='vertical'>
                    <Row gutter={16}>
                        <Col xs={{ span: 24 }}>
                            <Form.Item className='mb16'>
                                <Select className='custom-ant-select' placeholder={t('table_title.Corresponding_Person')} suffixIcon={<ArrowDown2 size="18" color="#707070" variant="Bold" />}>
                                    <Option value="1">Responders 1</Option>
                                    <Option value="2">Responders 2</Option>
                                    <Option value="3">Responders 3</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* <Col xs={{ span: 24 }}>
                            <Form.Item className='mb16' required label={t('dashboard.Comment')}>
                                <TextArea rows={4} placeholder={t('dashboard.Please_describe_progress_report_etc')}></TextArea>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }}>
                            <Form.Item className='mb16' required label={t('dashboard.Confirmation')}>
                                <Checkbox>{t('dashboard.Please_make_sure_to_check_the_box_after_confirmation')}</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }}>
                            <Form.Item className='mb16' required label={t('Facility_Information.Entry_By')}>
                                <Input placeholder={t('Facility_Information.Entry_By')} />
                            </Form.Item>
                        </Col> */}
                        <Form.Item className='mb0' style={{width: "100%"}}>
                            <div className="flex_item_cc flex-wrap">
                                <Button onClick={() => modalCloseEvent(false)} className='btn-theme btn-danger' >{t('table_title.Cancel')} </Button>
                                <Button onClick={() => modalCloseEvent(false)} className='btn-theme btn-success' >{t('table_title.Update')}</Button>
                            </div>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default SupportStatusChangeModal
