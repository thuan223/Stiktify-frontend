"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notification, Select } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequestFile, sendRequest } from "@/utils/api";

const { Option } = Select;

interface IUploadResponse {
  statusCode: number;
  message: string;
  data?: any;
}

interface ICategory {
  _id: string;
  categoryName: string;
}

const UploadVideoPost: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  // Lưu tên của Category được chọn
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  // State mới để lưu hashtag nhập từ người dùng
  const [hashtagsInput, setHashtagsInput] = useState("");

  // Lấy danh sách categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await sendRequest<{
          statusCode: number;
          data: any;
          message: string;
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.statusCode === 200) {
          const categoriesArray = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.categories)
            ? res.data.categories
            : [];
          setAllCategories(categoriesArray);
        } else {
          notification.error({
            message: res.message || "Get list of categories failed.",
          });
        }
      } catch (error) {
        notification.error({
          message: "An error occurred while retrieving the categories list.",
        });
      }
    };

    if (accessToken) {
      fetchCategories();
    }
  }, [accessToken]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!accessToken) {
      notification.error({
        message: "You are not logged in. Please log in again.",
      });
      return;
    }

    if (!user || !user._id) {
      notification.error({ message: "User information not identified." });
      return;
    }

    if (!videoFile) {
      notification.error({ message: "You have not selected a video file." });
      return;
    }

    if (!selectedCategory) {
      notification.error({ message: "You have not selected Video Category." });
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file video từ local
      const formDataUpload = new FormData();
      formDataUpload.append("file", videoFile);

      const uploadRes = await sendRequestFile<IUploadResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-video`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataUpload,
      });

      if (uploadRes.statusCode !== 201) {
        notification.error({
          message: uploadRes.message || "Upload failed.",
        });
        setLoading(false);
        return;
      }

      // Lấy video URL theo cấu trúc đúng của API
      const videoUrl = uploadRes.data?.data?.data?.downloadURL;

      if (!videoUrl || typeof videoUrl !== "string") {
        notification.error({
          message: "Video URL is invalid. Please check your upload file again.",
        });
        setLoading(false);
        return;
      }

      // 2. Tạo bài post video với thông tin bổ sung
      const videoTag = hashtagsInput
        ? hashtagsInput
            .split(" ")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [];

      const postData = {
        videoDescription,
        videoUrl,
        userId: typeof user._id === "string" ? user._id : String(user._id),
        videoTag,
        categories: [selectedCategory],
      };

      const postRes = await sendRequest<IUploadResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: postData,
      });

      if (postRes.statusCode === 201) {
        notification.success({ message: "Post created successfully!" });
        // Reset form
        setVideoDescription("");
        setVideoFile(null);
        setSelectedCategory("");
        setHashtagsInput("");

        // Sau khi upload thành công, chuyển hướng đến trang user detail
        router.push(`/page/detail_user/${user._id}`);
      } else {
        notification.error({
          message: postRes.message || "Post creation failed.",
        });
      }
    } catch (error) {
      notification.error({
        message: "An error occurred during upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Video File</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Choose Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Hashtags</label>
        <input
          type="text"
          value={hashtagsInput}
          onChange={(e) => setHashtagsInput(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Example: fun, travel, music"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Choose Category Video</label>
        <Select
          placeholder="Choose Category Video"
          style={{ width: "100%" }}
          value={selectedCategory || undefined}
          onChange={(value) => setSelectedCategory(value)}
        >
          {allCategories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.categoryName}
            </Option>
          ))}
        </Select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full p-2 rounded-md text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
};

export default UploadVideoPost;
