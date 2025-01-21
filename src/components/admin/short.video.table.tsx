"use client"
import { ColumnsType } from "antd/es/table";
import TableCustomize from "../table/table.dashboard"
import { useState } from "react";

interface IProps {
    dataSource: IShortVideo[];
    meta: {
        current: number,
        pageSize: number,
        total: number,
    }
}



const ManageShortVideoTable = (props: IProps) => {
    const { dataSource, meta } = props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [dataUser, setDataUser] = useState<IShortVideo | null>(null)
    const columns: ColumnsType<IShortVideo> = [
        {
            title: 'Username',
            dataIndex: 'userId',
            key: 'userId',
            render: (value, record, index) => {
                return (
                    <div>{value.userName}</div>
                )
            },
        },
        {
            title: 'Type',
            dataIndex: 'videoType',
            key: 'videoType',
        },
        {
            title: 'Code',
            dataIndex: 'activeCode',
            key: 'activeCode',
        },
        {
            title: 'Code Expired',
            dataIndex: 'codeExpired',
            key: 'codeExpired',
            // render: 
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // render: (value: string) => StyleStatus({ value })
        },
        {
            title: 'Action',
            dataIndex: 'isBan',
            key: 'isBan',
            // render: (
            //     value: boolean,
            //     record: IUser,
            //     index: number,

            // ) => ActionManagerUser(value, record, index, setIsUpdateModalOpen, setDataUser)
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

export default ManageShortVideoTable