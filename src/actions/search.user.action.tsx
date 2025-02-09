"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

export const handleSearchUserByName = async (
  search: string,
  current: number,
  pageSize: number
) => {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/v1/users/search-name?search=${search}&current=${current}&pageSize=${pageSize}&sort=${encodeURIComponent(
      JSON.stringify({ fullname: 1 })
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["search-user"] },
    }
  );

  if (!res.ok) {
    console.error("Error fetching data:", res.statusText);
    return { data: [] };
  }

  const result: IBackendRes<any> = await res.json();
  console.log("API response:", result); // Log the result to debug
  return result;
};


