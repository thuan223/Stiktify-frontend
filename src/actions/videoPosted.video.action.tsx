"use server";

import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

export const fetchMyVideos = async (current: number, pageSize: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/my-videos?current=${current}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["my-videos"] },
    }
  );

  if (!res.ok) {
    console.error("Error fetching videos:", res.statusText);
    return { data: [] };
  }

  const result: IBackendRes<any> = await res.json();
  return result;
};
