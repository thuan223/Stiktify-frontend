"use client"
import { ColumnsType } from "antd/es/table";
import TableCustomize from "../table/table.dashboard"
import { useState } from "react";
import { formatNumber } from "@/utils/utils";
import { FlagTwoTone } from "@ant-design/icons";
import { Image, notification, Popconfirm } from "antd";
import { handleFlagShortVideoAction } from "@/actions/manage.short.video.action";
import VideoCustomize from "../video/video.customize";

interface IProps {
    dataSource: IReport[];
    meta: {
        current: number,
        pageSize: number,
        total: number,
    }
}



const ManageReportTable = (props: IProps) => {
    const { dataSource, meta } = props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [dataUser, setDataUser] = useState<IShortVideo | null>(null)

    const handleFlagVideo = async (record: IShortVideo) => {
        const res = await handleFlagShortVideoAction(record._id, !record.flag)
        notification.success({ message: res.message })
    }

    const columns: ColumnsType<IReport> = [
        {
            title: 'Username',
            dataIndex: 'dataVideo',
            key: 'userId',
            render: (value, record, index) => (
                <div>{record.dataVideo.userId.userName}</div>
            )
        },
        {
            title: 'Video',
            dataIndex: 'dataVideo',
            key: 'videoThumbnail',
            render: (value: IShortVideo, record, index) => (
                <VideoCustomize videoThumbnail={value.videoThumbnail} videoUrl={value.videoUrl} />
            ),
        },
        {
            title: 'Views',
            dataIndex: 'totalViews',
            key: 'totalViews',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Reactions',
            dataIndex: 'totalReaction',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Comments',
            dataIndex: 'totalComment',
            key: 'totalComment',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Favorite',
            dataIndex: 'totalFavorite',
            key: 'totalFavorite',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Action',
            dataIndex: 'flag',
            key: 'flag',
            render: (value, record, index) => {
                return (
                    <Popconfirm
                        title="Sure to flag video?"
                        // onConfirm={() => handleFlagVideo(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FlagTwoTone style={{ fontSize: "20px" }} twoToneColor={value ? "#ff7675" : ""} />
                    </Popconfirm>
                )
            },
        }
    ];

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                fontWeight: 600,
                fontSize: 20
            }}>
                <span>Manager Short Video</span>
                {/* <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UserAddOutlined />
                    <span>Add New</span>
                </Button> */}
            </div >
            <TableCustomize columns={columns} dataSource={dataSource} meta={meta} />
        </>
    )
}

export default ManageReportTable