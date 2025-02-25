"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies()
const token = cookieStore.get("token")?.value

export const handleGetAllUser = async (current: string, pageSize: string) => {
    try {
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
    } catch (error) {
        return null
    }
}

export const handleBanUserAction = async (id: string, isBan: boolean) => {
    try {
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
        return result
    } catch (error) {
        return null
    }
}

export const handleUnBanUserAction = async (id: string) => {
    try {
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
    } catch (error) {
        return null
    }
}

export const handleCreateUserAction = async (data: ICreateUserByManager) => {
    try {
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
    } catch (error) {
        return null
    }
}

export const handleUpdateUserAction = async (data: IUpdateUserByManager) => {
    try {
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
    } catch (error) {
        return null
    }
}

export const handleFilterAndSearchAction = async (current: number, pageSize: number, search: string, filterRes: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/filter-search?current=${current}&pageSize=${pageSize}&search=${search}&filterReq=${filterRes}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["list-user"] }   
        })
        const result: IBackendRes<any> = await res.json();
        return result
    } catch (error) {
        return null
    }
}


export const handleUploadImage = async (formData: FormData) => {
    try {
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;
      if (!formData) {
        throw new Error("FormData is required.");
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData, 
      });
      const result: IBackendRes<any> = await res.json();
      return result;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  

