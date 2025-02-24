"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies()
const token = cookieStore.get("token")?.value

export const handleGetAllMusic = async (current: string, pageSize: string) => {
    try {
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

export const handleFilterSearchMusic = async (current: string, pageSize: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/filter-search?current=${current}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["filter-search-music"] }
        });
        const result: IBackendRes<any> = await res.json();
        return result;
    } catch (error) {
        return null;
    }
};

export const createFavoriteMusic = async (musicId: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/create-favorite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ musicId }) 
        });
        const result: IBackendRes<any> = await res.json();
        return result;
    } catch (error) {
        return null;
    }
};

export const handleGetAllFavoriteMusic = async (userId: string, current: string, pageSize: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/list-favorite-music/${userId}?current=${current}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["list-favorite-music"] }
        })
        const result: IBackendRes<any> = await res.json();
        return result;
    } catch (error) {
        return null;
    }
};

export const handleGetMyMusic = async (userId: string, current: string, pageSize: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/my-musics?userId=${userId}&current=${current}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      const result: IBackendRes<any> = await res.json();
      return result;
    } catch (error) {
      console.error('Error fetching user\'s music:', error);
      return null;
    }
  };
  
  




