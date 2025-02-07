"use client";

import { useState, useEffect } from "react";
import UserProfile from "@/components/page/profile/UserProfile";
import { sendRequest } from "@/utils/api";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null); // Chắc chắn profileData là một object hợp lệ
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      let token = localStorage.getItem("token");

      if (!token) {
        console.error("🚨 Token is missing! User might not be logged in.");
        setLoading(false);
        return;
      }

      token = token.trim();

      console.log("🔍 Sending token:", token);

      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/users/get-user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
  }, []);

  const handleUpdateProfile = async (updatedProfile: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("🚨 Token is missing!");
        return;
      }

      const res = await sendRequest<IBackendRes<any>>({
        url: "http://localhost:8080/api/v1/users/update-profile",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
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
