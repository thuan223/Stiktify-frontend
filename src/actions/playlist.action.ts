"use server"

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
                next: { tags: ["list-music"] }
            })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}