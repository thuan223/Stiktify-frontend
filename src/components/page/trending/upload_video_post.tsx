"use client";

import React, { useState, useContext } from "react";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequestFile } from "@/utils/api";

interface IUploadResponse {
  statusCode: number;
  message: string;
  data?: any;
}

const UploadVideoPost: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!accessToken) {
      notification.error({ message: "Bạn chưa đăng nhập. Hãy đăng nhập lại." });
      return;
    }

    if (!user || !user._id) {
      notification.error({ message: "Không xác định được thông tin user." });
      return;
    }

    if (!videoFile) {
      notification.error({ message: "Bạn chưa chọn file video." });
      return;
    }

    if (!title.trim()) {
      notification.error({ message: "Tiêu đề không được để trống." });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("userId", user._id);

      const res = await sendRequestFile<IUploadResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-video`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (res.statusCode === 201) {
        notification.success({ message: "Upload thành công!" });
        setTitle("");
        setDescription("");
        setVideoFile(null);
      } else {
        notification.error({ message: res.message || "Upload thất bại." });
      }
    } catch (error) {
      notification.error({
        message: "Đã có lỗi xảy ra trong quá trình upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Video</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tiêu đề</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Chọn video</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full"
        />
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
        {loading ? "Đang Upload..." : "Upload Video"}
      </button>
    </div>
  );
};

export default UploadVideoPost;
