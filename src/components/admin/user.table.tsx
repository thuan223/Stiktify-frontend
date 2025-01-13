"use client"
import { ColumnsType } from "antd/es/table";
import TableCustomize from "../table/table.dashboard"
import { ActionManagerUser, FormatDateTime, StyleStatus } from "../table/user.render.table";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreateUserModal from "./create.user.model";
import UpdateUserModal from "./edit.user.modal";
interface IProps {
    dataSource: IUser[];
    meta: {
        current: number,
        pageSize: number,
        total: number,
    }
}



const ManageUserTable = (props: IProps) => {
    const { dataSource, meta } = props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
    const [dataUser, setDataUser] = useState<IUser | null>(null)
    const columns: ColumnsType<IUser> = [
        {
            title: 'Full name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
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
            render: FormatDateTime
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value: string) => StyleStatus({ value })
        },
        {
            title: 'Action',
            dataIndex: 'isBan',
            key: 'isBan',
            render: (
                value: boolean,
                record: IUser,
                index: number,

            ) => ActionManagerUser(value, record, index, setIsUpdateModalOpen, setDataUser)
        }
    ];

    console.log("check data user: ", dataUser);

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                fontWeight: 600,
                fontSize: 20
            }}>
                <span>Manager Users</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <UserAddOutlined />
                    <span>Add New</span>
                </Button>
            </div >
            <TableCustomize columns={columns} dataSource={dataSource} meta={meta} />
            <CreateUserModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
            <UpdateUserModal setDataUser={setDataUser} dataUser={dataUser} isUpdateModalOpen={isUpdateModalOpen} setIsUpdateModalOpen={setIsUpdateModalOpen} />
        </>
    )
}

export default ManageUserTable