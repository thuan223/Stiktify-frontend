"use server";

import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;
export const fetchMyVideos = async (
  userId: string,
  current: number,
  pageSize: number
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/videos/my-videos?current=${current}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
    }
  );

  if (!res.ok) {
    console.error("Error fetching videos:", res.statusText);
    return [];
  }

  const data = await res.json();
  return data.data.result;
};
