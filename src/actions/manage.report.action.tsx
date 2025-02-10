"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies()
const token = cookieStore.get("token")?.value

export const handleGetAllReportAction = async (current: string, pageSize: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/list-report?current=${current}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["list-report"] }
        })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleDeleteReportVideoAction = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/delete-report/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": `Bearer ${token}`
            },
        })

        revalidateTag("list-report")
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}