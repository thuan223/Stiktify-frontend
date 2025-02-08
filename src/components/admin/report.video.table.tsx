"use client"
import { ColumnsType } from "antd/es/table";
import TableCustomize from "../table/table.dashboard"
import { useState } from "react";
import { formatNumber } from "@/utils/utils";
import { FlagTwoTone, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Image, notification, Popconfirm, Tooltip } from "antd";
import { handleFlagShortVideoAction } from "@/actions/manage.short.video.action";
import VideoCustomize from "../video/video.customize";
import ModalListReport from "../modal/modal.list.report";

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
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
    const [dataReport, setDataReport] = useState<IDataReport[] | []>([])
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [dataUser, setDataUser] = useState<IShortVideo | null>(null)

    const handleFlagVideo = async (record: IShortVideo) => {
        const res = await handleFlagShortVideoAction(record._id, !record.flag)
        if (res.statusCode === 201) {
            return notification.success({ message: res.message })
        }
        return notification.error({ message: res.message })

    }

    const columns: ColumnsType<IReport> = [
        {
            title: 'Username',
            dataIndex: 'dataVideo',
            key: 'userName',
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
            dataIndex: 'dataVideo',
            key: 'totalViews',
            render: (value: IShortVideo, record, index) => (
                <div>{formatNumber(value.totalViews ?? 0)}</div>
            )
        },
        {
            title: 'Total Report',
            dataIndex: 'total',
            key: 'total',
            render: (value, record, index) => (
                <div>{formatNumber(value ?? 0)}</div>
            )
        },
        {
            title: 'Reasons',
            dataIndex: 'dataReport',
            key: 'dataReport',
            render: (value, record, index) => (
                <>
                    <Tooltip overlayInnerStyle={{ background: "white", color: "#1e272e" }} title="Click here to show list report">
                        <Button onClick={() => {
                            setIsReportModalOpen(true)
                            setDataReport(value)
                        }}><UnorderedListOutlined /></Button>
                    </Tooltip>
                </>
            )
        },
        {
            title: 'Action',
            dataIndex: 'dataVideo',
            key: 'flag',
            render: (value: IShortVideo, record, index) => {
                return (
                    <Popconfirm
                        title="Sure to flag video?"
                        onConfirm={() => handleFlagVideo(value)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FlagTwoTone
                            style={{ fontSize: "20px" }}
                            twoToneColor={value.flag ? "#ff7675" : ""} />
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
                <span>Manager Report Video</span>
                {/* <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UserAddOutlined />
                    <span>Add New</span>
                </Button> */}
            </div >
            <TableCustomize columns={columns} dataSource={dataSource} meta={meta} />
            <ModalListReport data={dataReport} isModalOpen={isReportModalOpen} setIsModalOpen={setIsReportModalOpen} />

        </>
    )
}

export default ManageReportTable