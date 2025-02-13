"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { FaUser, FaRegEnvelope, FaRegClipboard, FaRegUserCircle, FaShieldAlt } from "react-icons/fa";

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
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && accessToken) fetchUserDetail();
  }, [id, accessToken]);

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    try {
      const res = await sendRequest<{ data: User }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!userData) return <p className="text-center text-gray-600">No user data</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-blue-100 border rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <div className="flex items-center justify-center mb-6 space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white flex items-center justify-center text-3xl">
          <FaUser />
        </div>
        <h1 className="text-4xl font-extrabold text-blue-800">{userData.fullname}</h1>
      </div>

      <div className="space-y-6">
        <UserInfo label="Username" value={userData.userName} icon={<FaRegUserCircle />} />
        <UserInfo label="Email" value={userData.email} icon={<FaRegEnvelope />} />
        <UserInfo label="Account Type" value={userData.accountType} icon={<FaRegUserCircle />} />
        <UserInfo label="Status" value={userData.status} icon={<FaShieldAlt />} />

      </div>
    </div>
  );
};

const UserInfo = ({ label, value, icon, isStatus }: { label: string, value: string, icon: JSX.Element, isStatus?: boolean }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-lg hover:scale-105 transition-all duration-300 ease-in-out">
    <div className="flex items-center space-x-3">
      <div className="text-xl text-gray-600">{icon}</div>
      <p className="text-lg font-semibold text-gray-700">{label}:</p>
    </div>
  </div>
);

export default UserDetail;
