"use client";

import React, { useState, useContext, useEffect } from "react";
import { notification } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequestFile, sendRequest } from "@/utils/api";

interface IUploadResponse {
  statusCode: number;
  message: string;
  data?: any;
}

interface ICategory {
  _id: string;
  name: string;
}

const UploadVideoPost: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]); // danh sách id category đã chọn
  const [allCategories, setAllCategories] = useState<ICategory[]>([]); // danh sách category từ API
  const [loading, setLoading] = useState(false);

  // Lấy danh sách categories từ database khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await sendRequest<{
          statusCode: number;
          data: ICategory[];
          message: string;
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.statusCode === 200) {
          setAllCategories(res.data);
        } else {
          notification.error({
            message: res.message || "Lấy danh sách categories thất bại.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Đã có lỗi xảy ra khi lấy danh sách categories.",
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

    setLoading(true);
    try {
      // 1. Upload file video
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
          message: uploadRes.message || "Upload thất bại.",
        });
        setLoading(false);
        return;
      }

      notification.success({ message: "Upload thành công!" });
      const videoUrl = uploadRes.data?.url;

      // 2. Tạo bài post video với thông tin bổ sung
      const postData = {
        title,
        description,
        videoUrl,
        userId: user._id,
        uploadAt: new Date().toISOString(),
        hashtags: generateHashtags(title),
        categories, // danh sách id category đã chọn
      };

      const postRes = await sendRequest<IUploadResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: postData,
      });

      if (postRes.statusCode === 201) {
        notification.success({ message: "Tạo bài post thành công!" });
        setTitle("");
        setDescription("");
        setVideoFile(null);
        setCategories([]);
      } else {
        notification.error({
          message: postRes.message || "Tạo bài post thất bại.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đã có lỗi xảy ra trong quá trình upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo hashtag đơn giản từ tiêu đề
  const generateHashtags = (title: string): string[] => {
    if (!title) return [];
    return title.split(" ").map((word) => "#" + word.trim());
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
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Chọn Category Video</label>
        <select
          multiple
          value={categories}
          onChange={(e) =>
            setCategories(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="w-full border p-2 rounded"
        >
          {allCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
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
