"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleGetPlaylistAction = async (id: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/list-playlist/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                next: { tags: ["list-playlist"] }
            })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}

export const handleAddMusicInPlaylistAction = async (playlistId: string, musicId: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/store-playlist/create-store-playlist`,
            {
                method: "POST",
                body: JSON.stringify({ playlistId, musicId }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
        const result: IBackendRes<any> = await res.json();
        revalidateTag("list-playlist")
        return result
    } catch (error) {
        return null
    }
}

export const handleAddPlaylistAction = async (userId: string, name: string, description: string, image: string) => {
    try {
        const cookieStore = cookies()
        const token = cookieStore.get("token")?.value
        const res = await fetch(`
            ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/add-playlist`,
            {
                method: "POST",
                body: JSON.stringify({ userId: userId, name: name, description: description, image: image }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
        const result: IBackendRes<any> = await res.json();
        revalidateTag("list-playlist")
        return result
    } catch (error) {
        return null
    }
}