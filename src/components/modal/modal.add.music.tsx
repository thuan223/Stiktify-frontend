import {
    Modal, Input, Form,
    notification,
    Button,
    Space,
    Upload,
    UploadProps,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '@/context/AuthContext';
import { handleCreateMusicAction } from '@/actions/music.action';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    listCate: { _id: string, categoryName: string }[] | []
}

const AddMusicModal = (props: IProps) => {
    const {
        isCreateModalOpen, setIsCreateModalOpen, listCate
    } = props;
    const [form] = Form.useForm();
    const [urlUploadMp3, setUrlUploadMp3] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [listCateChoose, setListCateChoose] = useState<{ _id: string, categoryName: string }[] | []>([])
    const { accessToken, user } = useContext(AuthContext)!
    const [urlUploadImage, setUrlUploadImage] = useState<string>("")


    const handleCloseCreateModal = () => {
        form.resetFields()
        setLoading(false)
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
        if (listCateChoose.length <= 0) {
            notification.warning({ message: "Please choose category of music!" })
        }
        const newListCate = listCateChoose.map(category => category._id);

        const data = {
            musicUrl: urlUploadMp3,
            userId: user._id,
            musicDescription: values.musicDescription,
            musicThumbnail: urlUploadImage,
            musicTag: values.musicTag,
            musicLyric: values.musicLyric,
            categoryId: newListCate
        }

        const res = await handleCreateMusicAction(data)
        if (res?.statusCode === 201) {
            notification.success({ message: "Created successfully" })
            form.resetFields()
            setIsCreateModalOpen(false);
            setUrlUploadImage("")
            setUrlUploadImage("")
            setListCateChoose([])
            return
        }
        notification.error({ message: res?.message })

    };

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const propsUpload: UploadProps = {
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-music`,
        method: 'POST',
        name: "file",
        maxCount: 1,
        accept: "audio/mp3",
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                setUrlUploadMp3(info.file.response.data)
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                notification.error({ message: `${info.file.name} file upload failed.` })
            }
        },
    };

    const propsUploadImage: UploadProps = {
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
        method: 'POST',
        name: "file",
        className: "avatar-uploader",
        maxCount: 1,
        accept: ".jpg,.jpeg,.png",
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
        data: {
            folder: "thumbnail"
        },
        withCredentials: true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
                setUrlUploadImage(info.file.response.data)
            } else if (info.file.status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
                notification.error({ message: `${info.file.name} file upload failed.` })
            }
        },
    };

    useEffect(() => {
        form.setFieldValue("category", listCate)

    }, [isCreateModalOpen, listCate])

    const handleAddCateChoose = (itemP: any) => {
        if (!checkChoose(itemP._id)) {
            return setListCateChoose(prev => [...prev, itemP])
        } else if (checkChoose(itemP._id)) {
            const newList = listCateChoose.filter(x => x._id !== itemP._id)
            return setListCateChoose(newList)
        } else {
            return setListCateChoose([itemP])
        }
    }

    const checkChoose = (id: string): boolean => {
        return listCateChoose?.some(item => item._id === id) ?? false;
    };

    console.log("list>>>>", listCateChoose);

    return (
        <div>
            <Modal
                style={{ top: 50 }}
                title="Add new music"
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
                    <div className='flex justify-between'>
                        <Form.Item
                            name="musicMP3"
                            label="Music"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Must be .mp3"
                            rules={[
                                {
                                    validator: (_, fileList) => {
                                        if (fileList && fileList.length > 0) {
                                            const isMp3 = fileList[0].type === 'audio/mpeg'; // Correct MIME type for MP3
                                            if (!isMp3) {
                                                return Promise.reject(new Error('You can only upload MP3 files!'));
                                            }
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Please upload an MP3 file!'));
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
                                {...propsUploadImage}
                            >
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>

                        </Form.Item>
                    </div>
                    <div className='mb-2 flex gap-1'><span className='text-red-500 text-1xl'>*</span>Category</div>
                    <div className='flex gap-2 flex-wrap mb-2'>
                        {listCate && listCate.length > 0 && listCate.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleAddCateChoose(item)}
                                className={`border ${checkChoose(item._id) ? "border-green-500" : "border-gray-300"} p-2 rounded-md cursor-pointer `}>{item.categoryName}</div>
                        ))}
                    </div>
                    <div className='mb-2 flex gap-1'><span className='text-red-500 text-1xl'>*</span>Tag</div>
                    <Form.List name="musicTag" initialValue={[""]}>
                        {(fields, { add, remove }) => (
                            <div className='mt-3 flex gap-3'>
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


                    <Form.Item
                        label="Lyric"
                        name="musicLyric"
                        rules={[{ required: true, message: 'Please input music lyric!' }]}
                    >
                        <Input.TextArea />
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