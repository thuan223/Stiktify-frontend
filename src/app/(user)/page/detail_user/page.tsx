"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { sendRequest } from "@/utils/api";

interface User {
  _id: string;
  userName: string;
  fullname: string;
  email: string;
  isBan: boolean;
  status: string;
  role: string;
  accountType: string;
  isActive: boolean;
}

const UserDetail = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      const res = await sendRequest<{ data: User }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/detail/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
        },
      });

      if (res.data) {
        setUserData(res.data);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to fetch user details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!userData) return <p>No user data</p>;

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">{userData.fullname}</h1>
      <p><strong>Username:</strong> {userData.userName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Role:</strong> {userData.role}</p>
      <p><strong>Account Type:</strong> {userData.accountType}</p>
      <p><strong>Status:</strong> {userData.status}</p>
      <p><strong>Is Active:</strong> {userData.isActive ? "✅ Active" : "❌ Inactive"}</p>
      <p><strong>Is Banned:</strong> {userData.isBan ? "🚫 Banned" : "✅ Not Banned"}</p>
    </div>
  );
};

export default UserDetail;