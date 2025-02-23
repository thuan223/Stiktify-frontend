"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { FaUser, FaRegEnvelope, FaEllipsisH } from "react-icons/fa";
import { FiMessageSquare, FiShare2, FiUserPlus } from "react-icons/fi";

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
  followersCount: number;
}

const UserDetail = () => {
  const { id } = useParams();
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"video" | "repost" | "like">(
    "video"
  );
  // So sánh có phải người dùng hiện tại không
  const isCurrent = user?._id === id;

  useEffect(() => {
    if (id && accessToken) fetchUserDetail();
  }, [id, accessToken]);

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
  if (!userData)
    return <p className="text-center text-gray-600">No user data</p>;

  return (
    <div className="max-w-9xl mx-auto p-10 bg-white/90 border rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 h-[90vh] flex flex-col">
      {/* Phần trên (30%) */}
      <div className="flex-1 flex items-center space-x-6 mb-6">
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-400 to-red-500 text-white flex items-center justify-center text-6xl shadow-lg">
          <FaUser />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            {userData.fullname} {isCurrent && "(You)"}
          </h1>
          <p className="flex items-center text-lg font-medium mt-1">
            <span
              className={`w-3 h-3 mr-2 rounded-full ${
                userData.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            {userData.isActive ? "Online" : "Offline"}
          </p>
          <p className="text-lg text-gray-600 flex items-center space-x-2">
            <FaRegEnvelope className="text-gray-500" />{" "}
            <span>{userData.email}</span>
          </p>
          {!isCurrent && (
            <div className="flex space-x-4 mt-3">
              <Button
                icon={<FiUserPlus />}
                text="Follow"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />
              <Button
                icon={<FiMessageSquare />}
                text="Message"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
              <Button
                icon={<FiShare2 />}
                text="Share"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
              <Button
                icon={<FaEllipsisH />}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Phần dưới (70%) */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex justify-around border-b-2 pb-2">
          {["video", "repost", "like"].map((tab) => (
            <button
              key={tab}
              className={`text-lg font-semibold p-2 flex-1 text-center ${
                activeTab === tab
                  ? "border-b-4 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab as "video" | "repost" | "like")}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Nội dung tab */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "video" && <VideoTab />}
          {activeTab === "repost" && <RepostTab />}
          {activeTab === "like" && <LikeTab />}
        </div>
      </div>
    </div>
  );
};

const Button = ({
  icon,
  text,
  className,
}: {
  icon: JSX.Element;
  text?: string;
  className: string;
}) => (
  <button
    className={`px-5 py-3 rounded-lg flex items-center space-x-2 shadow-md transition-all duration-300 ${className}`}
  >
    {icon} {text && <span>{text}</span>}
  </button>
);

const VideoTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Videos</h2>
    <p className="text-gray-600">Danh sách video người dùng đăng.</p>
  </div>
);
const RepostTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Reposts</h2>
    <p className="text-gray-600">Danh sách video người dùng đã chia sẻ.</p>
  </div>
);
const LikeTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Liked Videos</h2>
    <p className="text-gray-600">Danh sách video người dùng đã thích.</p>
  </div>
);

export default UserDetail;
