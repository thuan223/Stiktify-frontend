"use server"

import { revalidateTag } from "next/cache";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImljYW92eTIwMDFAZ21haWwuY29tIiwic3ViIjoiNjc2ZDBlOTRlNDQ5YWY3MzA1MGE4NzYxIiwiaWF0IjoxNzM2NjUxMTIyLCJleHAiOjE3MzY3Mzc1MjJ9.KXT_y9HcbiAyEea26e5xkkImxXF1xgLBkHg6lKao-NI"

export const handleBanUserAPI = async (id: string) => {
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

export const handleUnBanUserAPI = async (id: string) => {
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