import {
    Modal, Input, Form, Row, Col,
    notification,
    Select,
    InputNumber,
    Button,
    Space,
    Upload,
    UploadProps,
} from 'antd';
import { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import Cookies from 'js-cookie';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    listCate: any[] | []
}

const AddMusicModal = (props: IProps) => {
    const {
        isCreateModalOpen, setIsCreateModalOpen, listCate
    } = props;
    const [form] = Form.useForm();
    const [urlUpload, setUrlUpload] = useState<string>("")
    const [loading, setLoading] = useState(false);

    const { Option } = Select;



    const handleCloseCreateModal = () => {
        form.resetFields()
        setLoading(false)
        setIsCreateModalOpen(false);
    }

    const onFinish = async (values: any) => {

    };

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const propsUpload: UploadProps = {
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload-single-file`,
        method: 'POST',
        name: "fileName",
        listType: "picture",
        maxCount: 1,
        accept: ".jpg,.jpeg,.png",
        headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
        },
        withCredentials: true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                setUrlUpload(info.file.response.data.downloadURL)
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                notification.error({ message: `${info.file.name} file upload failed.` })
            }
        },
    };
    return (
        <div>
            <Modal
                style={{ top: 50 }}
                title="Add new product"
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseCreateModal()}
                maskClosable={false}
                loading={loading}
                footer={[
                    <Button key="cancel" onClick={handleCloseCreateModal} >
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" onClick={() => form.submit()} style={{ background: '#1890ff', color: '#fff' }}>
                        OK
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <Form.Item hasFeedback name="cate_id" label="Category" rules={[{ required: true, message: "Please choose category" }]}>
                        <Select
                            placeholder="Choose category for product"
                            allowClear>
                            {
                                listCate && listCate.length > 0 && listCate.map((item, index) => (
                                    <Option key={item._id + index} value={item._id}>{item.cate_name}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Row>
                        <Form.List name="musicTag" initialValue={[""]}>
                            {(fields, { add, remove }) => (
                                <div>
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add tag</Button>
                                    </Form.Item>
                                    <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {fields.map((field) => (
                                            <Form.Item
                                                key={field.key}
                                            >
                                                <Space
                                                    style={{ position: "relative" }}>
                                                    <Form.Item
                                                        hasFeedback
                                                        {...field}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        rules={[{ required: true, message: 'Please input your music tag!' }]}
                                                        noStyle
                                                    >
                                                        <Input style={{ width: 100 }} placeholder="Enter tag" type='text' />
                                                    </Form.Item>
                                                    {fields.length > 1 && <MinusCircleOutlined
                                                        style={{
                                                            position: "absolute",
                                                            top: -5,
                                                            right: 0,
                                                            color: "#2d3436"
                                                        }}
                                                        onClick={() => remove(field.name)} />}
                                                </Space>
                                            </Form.Item>
                                        ))}
                                    </Space>
                                </div>
                            )}
                        </Form.List>
                    </Row>
                    <Form.Item
                        name="musicMP3"
                        label="Music"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Must be .jpg, .png, .jpeg"
                        rules={[
                            {
                                validator: (_, fileList) => {
                                    if (fileList && fileList.length > 0) {
                                        const isImage = fileList[0].type === 'image/png' || fileList[0].type === 'image/jpeg';
                                        if (!isImage) {
                                            return Promise.reject(new Error('You can only upload PNG or JPG images!'));
                                        }
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Please upload an image!'));
                                }
                            }
                        ]}
                    >
                        <Upload
                            {...propsUpload}
                        >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>

                    </Form.Item>
                    <Form.Item
                        name="musicThumbnail"
                        label="Thumbnail"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Must be .jpg, .png, .jpeg"
                        rules={[
                            {
                                validator: (_, fileList) => {
                                    if (fileList && fileList.length > 0) {
                                        const isImage = fileList[0].type === 'image/png' || fileList[0].type === 'image/jpeg';
                                        if (!isImage) {
                                            return Promise.reject(new Error('You can only upload PNG or JPG images!'));
                                        }
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Please upload an image!'));
                                }
                            }
                        ]}
                    >
                        <Upload
                            {...propsUpload}
                        >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>

                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="musicDescription"
                        rules={[{ required: true, message: 'Please input your product description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}

export default AddMusicModal;