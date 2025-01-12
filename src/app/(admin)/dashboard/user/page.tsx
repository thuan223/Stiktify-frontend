import { ActionManagerUser, FormatDateTime, StyleStatus } from "@/components/table/user.render.table";
import TableCustomize from "@/components/table/table.dashboard";
import { ColumnsType } from "antd/es/table";

const ManageUserPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams
    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 10;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImljYW92eTIwMDFAZ21haWwuY29tIiwic3ViIjoiNjc2ZDBlOTRlNDQ5YWY3MzA1MGE4NzYxIiwiaWF0IjoxNzM2NjUxMTIyLCJleHAiOjE3MzY3Mzc1MjJ9.KXT_y9HcbiAyEea26e5xkkImxXF1xgLBkHg6lKao-NI"
    const res = await fetch(`http://localhost:8080/api/v1/users/list-user?current=${result}&pageSize=${LIMIT}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        next: { tags: ["list-user"] }
    })

    const data = await res.json()

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
            render: StyleStatus
        },
        {
            title: 'Action',
            dataIndex: 'isBan',
            key: 'isBan',
            render: ActionManagerUser
        }
    ];



    return (
        <div>
            <TableCustomize columns={columns} dataSource={data.data.result} meta={data.data.meta} />
        </div>
    )
}

export default ManageUserPage;