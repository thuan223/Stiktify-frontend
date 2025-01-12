"use client"
import { handleBanUserAPI, handleUnBanUserAPI } from "@/actions/manage.user.action"
import { formatDateTime } from "@/utils/utils"
import { EditTwoTone, FileSearchOutlined, LockTwoTone, SmileOutlined, UnlockTwoTone } from "@ant-design/icons"
import { notification, Popconfirm } from "antd"

export const ActionManagerUser = (value: any, record: IUser, index: any) => {

    const handleBanUser = async (id: string) => {
        const res = await handleBanUserAPI(id)
        notification.success({ message: res.message })
    }


    const handleUnBannedUser = async (id: string) => {
        const res = await handleUnBanUserAPI(id)
        notification.success({ message: res.message })
    }
    return (
        <div style={{ display: "flex", gap: 20, justifyContent: "start" }}>
            <FileSearchOutlined
                style={{ fontSize: 20, color: "#636e72" }}
                onClick={() => {
                    // setIsUpdateModalOpen(true);
                    // setDataUpdate(record)
                }} />
            <EditTwoTone twoToneColor={"#fdcb6e"}
                style={{ fontSize: 20 }}
                onClick={() => {
                    // setIsUpdateModalOpen(true);
                    // setDataUpdate(record)
                }} />
            {value ?
                <Popconfirm
                    title="Are you sure unlock this user?"
                    onConfirm={() => handleUnBannedUser(record._id)}
                    okText="Yes"
                    cancelText="No"
                >

                    <LockTwoTone
                        twoToneColor={"#ff7675"}
                        style={{ fontSize: 20 }}
                        onClick={() => {
                            // setIsUpdateModalOpen(true);
                            // setDataUpdate(record)
                        }} />
                </Popconfirm>
                :
                <Popconfirm
                    title="Are you sure lock this user?"
                    onConfirm={() => handleBanUser(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <UnlockTwoTone
                        style={{ fontSize: 20 }}
                        onClick={() => {
                            // setIsUpdateModalOpen(true);
                            // setDataUpdate(record)
                        }} />


                </Popconfirm>
            }
        </div>
    )
}

export const FormatDateTime = (value: string) => {
    return formatDateTime(value);
}

export const StyleStatus = (value: string) => {
    return (
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 7 }}>
            {value.toLowerCase() === "online" ?
                <>
                    <SmileOutlined style={{ color: "#78e08f", fontWeight: 600, fontSize: 20 }} />
                    <div style={{ textTransform: "uppercase", color: "#78e08f", fontWeight: 400, fontSize: 15 }}>{value}</div>
                </>
                :
                <>
                    <SmileOutlined rotate={180} style={{ color: "#d0d0d0d0", fontWeight: 600, fontSize: 20 }} />
                    <div style={{ textTransform: "uppercase", color: "#d0d0d0d0", fontWeight: 400, fontSize: 15 }}>{value}</div>
                </>
            }
        </div>
    )
}