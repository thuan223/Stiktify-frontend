"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";



export const handleGetAllMusic = async (current: string, pageSize: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-music?current=${current}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["list-music"] }
        })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleDisPlayMusicAction = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/display-music/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: ["display-music"] }
        })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleUpdateListenerAction = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/update-listener/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const result: IBackendRes<any> = await res.json();
        if (result.statusCode === 200) {
            revalidateTag("display-music")
        }
        return result
    } catch (error) {
        return null
    }
}

