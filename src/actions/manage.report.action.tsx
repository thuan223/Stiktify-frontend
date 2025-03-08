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

export const handleGetAllReportMusicAction = async (current: string, pageSize: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/report/list-report-music?current=${current}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["list-report-music"] }
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

export const handleFlagMusicAction = async (id: string, flag: boolean) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/flag-music`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    _id: id,
                    flag: flag,
                }),
            }
        );
        revalidateTag("list-music");
        revalidateTag("list-report-music");
        const result: IBackendRes<any> = await res.json();
        return result;
    } catch (error) {
        return null;
    }
};