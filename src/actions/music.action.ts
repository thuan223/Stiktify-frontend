"use server";

import { sendRequest } from "@/utils/api";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const handleGetAllMusic = async (current: string, pageSize: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-music?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleDisPlayMusicAction = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/display-music/${id}`,
      {
        method: "GET",
        next: { tags: ["display-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};


export const handleUpdateListenerAction = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/update-listener/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result: IBackendRes<any> = await res.json();
    if (result.statusCode === 200) {
      revalidateTag("display-music");
    }
    return result;
  } catch (error) {
    return null;
  }
};
export const handleFilterSearchMusic = async (
  current: string,
  pageSize: string
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/filter-search?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["filter-search-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const createFavoriteMusic = async (musicId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/create-favorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ musicId }),
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetAllFavoriteMusic = async (
  userId: string,
  current: string,
  pageSize: string
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/list-favorite-music/${userId}?current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-favorite-music"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleGetMyMusic = async (
  userId: string,
  current: string,
  pageSize: string
) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/my-musics?userId=${userId}&current=${current}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching user's music:", error);
    return null;
  }
};

export const handleLikeMusicAction = async (id: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/favorite/${id}`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    revalidateTag("display-music");
    return res
  } catch (error) {
    return null
  }
}

export const handleCreateCommentAction = async (musicId: string, newComment: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/create-music-comment`,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { musicId, CommentDescription: newComment },
    });
    revalidateTag("display-music");
    return res
  } catch (error) {
    return null
  }
}

export const handleCreateMusicAction = async (data: any) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/upload-music`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result: IBackendRes<any> = await res.json();
    if (result.statusCode === 201) {
      revalidateTag("list-music");
    }
    return result;
  } catch (error) {
    return null;
  }
}

export const handleFilterAndSearchMusicAction = async (current: number, pageSize: number, search: string, filterRes: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-categories/filter-search?search=${search}&filterReq=${filterRes}&current=${current}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
    const result: IBackendRes<any> = await res.json();
    return result
  } catch (error) {
    return null
  }
}

export const handleGetMusic = async (current: string, pageSize: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/list-music-admin?current=${current}&pageSize=${pageSize}`, {
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

export const handleGetRecommendMusic = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/recommend-music/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ["list-recommend"] },
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const handleListenNeo4j = async (musicId: string, userId: string) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/listen-music-in-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ musicId, userId }),
      }
    );
    const result: IBackendRes<any> = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};