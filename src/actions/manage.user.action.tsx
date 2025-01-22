"use server"

import { revalidateTag } from "next/cache";
const token = process.env.TOKEN

export const handleGetAllUser = async (current: string, pageSize: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/list-user?current=${current}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        next: { tags: ["list-user"] }
    })
    const result: IBackendRes<any> = await res.json();
    return result
}

export const handleBanUserAction = async (id: string, isBan: boolean) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/ban-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            _id: id,
            isBan: isBan
        })
    })

    revalidateTag("list-user")
    const result: IBackendRes<any> = await res.json();
    console.log("check result: ", result);

    return result
}

export const handleUnBanUserAction = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/unbanned-user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
        },
    })

    revalidateTag("list-user")
    const result: IBackendRes<any> = await res.json();
    return result
}

export const handleCreateUserAction = async (data: ICreateUserByManager) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/create-user`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
        },
    })

    revalidateTag("list-user")
    const result: IBackendRes<any> = await res.json();
    return result
}

export const handleUpdateUserAction = async (data: IUpdateUserByManager) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update-user`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
        },
    })

    revalidateTag("list-user")
    const result: IBackendRes<any> = await res.json();
    return result
}

export const handleFilterAndSearchAction = async (current: number, pageSize: number, search: string, filterRes: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/filter-search?current=${current}&pageSize=${pageSize}&search=${search}&filterReq=${filterRes}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        // next: { tags: ["list-user-by-filter"] }
    })
    const result: IBackendRes<any> = await res.json();
    return result
}