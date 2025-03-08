"use client"
import { ColumnsType } from "antd/es/table";
import TableCustomize from "../table/table.dashboard"
import { useState } from "react";
import { formatNumber } from "@/utils/utils";
import { DeleteTwoTone, FlagTwoTone, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Image, notification, Popconfirm, Tooltip } from "antd";
import VideoCustomize from "../video/video.customize";
import ModalListReport from "../modal/modal.list.report";
import { handleDeleteReportVideoAction, handleFlagMusicAction } from "@/actions/manage.report.action";
import TagMusic from "../music/tag.music";

interface IProps {
    dataSource: IReportMusic[];
    meta: {
        current: number,
        pageSize: number,
        total: number,
    }
}


const ManageReportMusicTable = (props: IProps) => {
    const { dataSource, meta } = props;
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
    const [dataReport, setDataReport] = useState<IDataReport[] | []>([])

    const handleFlagMusic = async (record: IMusic) => {
        const res = await handleFlagMusicAction(record._id, !record.flag)
        if (res?.statusCode === 201) {
            return notification.success({ message: res?.message })
        }
        return notification.error({ message: res?.message })
    }

    const handleDeleteReportVideo = async (id: string) => {
        const res = await handleDeleteReportVideoAction(id)
        if (res?.statusCode === 200) {
            return notification.success({ message: res?.message })
        }
        return notification.error({ message: res?.message })
    }

    const columns: ColumnsType<IReportMusic> = [
        {
            title: 'Username',
            dataIndex: 'dataMusic',
            key: 'userName',
            render: (value, record, index) => (
                <div>{record.dataMusic.userId.userName}</div>
            )
        },
        {
            title: 'Music',
            dataIndex: 'dataMusic',
            key: 'music',
            render: (value: IMusic, record, index) => (
                <div className="w-64 h-20  bg-gray-900/80  rounded-md flex px-2 mx-1">
                    <TagMusic isOnPlayMusic={true} className=" text-[18px]" animationText={false} item={value} onClick={() => { }} />
                </div>
            ),
        },
        {
            title: 'Listeners',
            dataIndex: 'dataMusic',
            key: 'listening',
            render: (value: IMusic, record, index) => (
                <div>{formatNumber(value.totalListener ?? 0)}</div>
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
            dataIndex: 'dataMusic',
            key: 'flag',
            render: (value: IMusic, record, index) => {
                return (
                    <div style={{ display: "flex", gap: 10 }}>
                        <Popconfirm
                            title="Sure to flag music?"
                            onConfirm={() => handleFlagMusic(value)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <FlagTwoTone
                                style={{ fontSize: "20px" }}
                                twoToneColor={value.flag ? "#ff7675" : ""} />
                        </Popconfirm>
                        {/* <Popconfirm
                            title="Sure to delete video report?"
                            onConfirm={() => handleDeleteReportVideo(record.dataMusic._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteTwoTone
                                style={{ fontSize: "20px" }}
                                twoToneColor={"#ff7675"} />
                        </Popconfirm> */}
                    </div>
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
                <span>Manager Report Music</span>
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

export default ManageReportMusicTable