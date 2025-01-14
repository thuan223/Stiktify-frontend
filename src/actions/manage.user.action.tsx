"use server"

import { revalidateTag } from "next/cache";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZZVVVAZ21haWwuY29tIiwic3ViIjoiNjc4M2ZlY2U1ZjE2ZGExYTliYTA2ZTQ0IiwiaWF0IjoxNzM2NzU1MjA4LCJleHAiOjE3MzY4NDE2MDh9.rCPrIeKbg9ebCGace7C4n0jleiF0tz0nIFL2Gt0zIE0"

export const handleBanUserAction = async (id: string) => {
    const res = await fetch(`http://localhost:8080/api/v1/users/ban-user/${id}`, {
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

export const handleUnBanUserAction = async (id: string) => {
    const res = await fetch(`http://localhost:8080/api/v1/users/unbanned-user/${id}`, {
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
    const res = await fetch(`http://localhost:8080/api/v1/users/create-user`, {
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
    const res = await fetch(`http://localhost:8080/api/v1/users/update-user`, {
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