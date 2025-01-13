import CreateUserModal from "@/components/admin/create.user.model";
import ManageUserTable from "@/components/admin/user.table";
import { notification } from "antd";

const ManageUserPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams
    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 5;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZZVVVAZ21haWwuY29tIiwic3ViIjoiNjc4M2ZlY2U1ZjE2ZGExYTliYTA2ZTQ0IiwiaWF0IjoxNzM2NzU1MjA4LCJleHAiOjE3MzY4NDE2MDh9.rCPrIeKbg9ebCGace7C4n0jleiF0tz0nIFL2Gt0zIE0"

    const res = await fetch(`http://localhost:8080/api/v1/users/list-user?current=${result}&pageSize=${LIMIT}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        next: { tags: ["list-user"] }
    })

    const resultRes: IBackendRes<IUserPagination> = await res.json()
    const data = resultRes.data

    if (!data) {
        return notification.error({ message: resultRes.message })
    }
    const meta = {
        current: data.meta.current,
        pageSize: data.meta.pageSize,
        total: data.meta.total,
    }
    return (
        <div>
            {data &&
                <ManageUserTable dataSource={data.result} meta={meta} />
            }
        </div>
    )
}

export default ManageUserPage;