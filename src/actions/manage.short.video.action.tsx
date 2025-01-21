"use server"

const token = process.env.TOKEN

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
