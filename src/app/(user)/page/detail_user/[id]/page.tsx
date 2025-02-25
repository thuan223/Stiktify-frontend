"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { FaUser, FaRegEnvelope, FaEllipsisH } from "react-icons/fa";
import { FiEdit, FiMessageSquare, FiShare2, FiUserPlus } from "react-icons/fi";
import MyVideo from "@/components/page/myvideo/MyVideo";
import LikedVideo from "@/components/page/likedVideoPost/LikedVideo";
// ======= Interfaces for User & Video =======
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
  const [activeTab, setActiveTab] = useState<
    "video" | "music" | "likedVideo" | "likedMusic"
  >("video");
  const isCurrent = user?._id === id;

  useEffect(() => {
    if (id && accessToken) fetchUserDetail();
  }, [id, accessToken]);

  const fetchUserDetail = async () => {
    try {
      const res = await sendRequest<{ data: User }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user/${id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
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

  const tabLabels: Record<
    "video" | "music" | "likedVideo" | "likedMusic",
    string
  > = {
    video: "Video",
    music: "Music",
    likedVideo: "Liked Video",
    likedMusic: "Liked Music",
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white border rounded-2xl shadow-2xl transition-shadow duration-300 min-h-screen max-h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-6 mb-6">
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
          {isCurrent ? (
            <div className="flex space-x-4 mt-3">
              <Button
                icon={<FiEdit />}
                text="Edit Profile"
                className="bg-green-500 hover:bg-green-600 text-white"
              />
              <Button
                icon={<FiShare2 />}
                text="Share"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              />
            </div>
          ) : (
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

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex justify-around border-b-2 pb-2">
          {(["video", "music", "likedVideo", "likedMusic"] as const).map(
            (tab) => (
              <button
                key={tab}
                className={`text-lg font-semibold p-2 flex-1 text-center ${
                  activeTab === tab
                    ? "border-b-4 border-blue-500 text-blue-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            )
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "video" && <VideoTab />}
          {activeTab === "music" && <MusicTab />}
          {activeTab === "likedVideo" && <LikedVideoTab />}
          {activeTab === "likedMusic" && <LikedMusicTab />}
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
    <MyVideo />
  </div>
);

const MusicTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Music</h2>
    <p className="text-gray-600">
      List of user's music tracks (this feature is under development).
    </p>
  </div>
);

const LikedVideoTab = () => (
  <div>
    <LikedVideo />
  </div>
);
const LikedMusicTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Liked Music</h2>
    <p className="text-gray-600">List of liked music.</p>
  </div>
);

export default UserDetail;
