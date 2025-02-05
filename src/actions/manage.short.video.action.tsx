"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies()
const token = cookieStore.get("token")?.value

export const handleGetAllShortVideo = async (current: string, pageSize: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/list-video?current=${current}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        next: { tags: ["list-short-video"] }
    })
    const result: IBackendRes<any> = await res.json();
    return result
}

export const handleFlagShortVideoAction = async (id: string, flag: boolean) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/flag-video`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            _id: id,
            flag: flag
        })
    })

    revalidateTag("list-short-video")
    const result: IBackendRes<any> = await res.json();
    return result
}