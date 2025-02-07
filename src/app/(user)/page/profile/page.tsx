"use client";

import { useState, useEffect, useContext } from "react";
import UserProfile from "@/components/page/profile/UserProfile";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null); // Chắc chắn profileData là một object hợp lệ
  const [loading, setLoading] = useState(true);
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!accessToken) {
        console.error("🚨 Token is missing! User might not be logged in.");
        setLoading(false);
        return;
      }
      console.log("🔍 Sending accessToken:", accessToken);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("check >>>>>", response);

        if (!response.ok) {
          if (response.status === 401) {
            console.error("🚨 Unauthorized: Token may be invalid or expired");
          }
          throw new Error(`HTTP Error ${response.status}`);
        }

        const result = await response.json();
        setProfileData(result.data);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [accessToken]);

  const handleUpdateProfile = async (updatedProfile: any) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("🚨 Token is missing!");
        return;
      }

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update-profile`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: updatedProfile, // Gửi dữ liệu từ user profile đã có _id
      });

      console.log("Profile updated:", res);
      setProfileData(res.data); // Cập nhật lại dữ liệu sau khi lưu
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        User Profile
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : profileData ? (
        <UserProfile
          profile={profileData}
          onUpdateProfile={handleUpdateProfile}
        />
      ) : (
        <p className="text-red-500">User profile not found</p>
      )}
    </div>
  );
};

export default ProfilePage;
