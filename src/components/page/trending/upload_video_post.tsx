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

interface IMusic {
  _id: string;
  musicDescription?: string;
}

const UploadVideoPost: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const [allMusic, setAllMusic] = useState<IMusic[]>([]);
  const [loading, setLoading] = useState(false);
  const [hashtagsInput, setHashtagsInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) return;
      try {
        const res = await sendRequest<{ statusCode: number; data: any }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("Categories API response:", res);
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          const categoryData = res.data.map((item: any) => ({
            _id: item._id || "unknown",
            categoryName: item.categoryName || "Unnamed Category",
          }));
          setAllCategories(categoryData);
        } else {
          notification.error({ message: "Failed to fetch categories." });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        notification.error({
          message: "An error occurred while retrieving categories.",
        });
      }
    };

    fetchCategories();
  }, [accessToken]);

  useEffect(() => {
    const fetchMusic = async () => {
      if (!accessToken) return;
      try {
        const res = await sendRequest<{ statusCode: number; data: any }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("Music API response:", res);
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          const musicData = res.data.map((item: any) => {
            const id = typeof item === "string" ? item : item._id || "unknown";
            const description =
              typeof item === "string"
                ? id
                : item.musicDescription || item.name || item.title || id; // Thêm các trường khác nếu cần
            return {
              _id: id,
              musicDescription: description,
            };
          });
          setAllMusic(musicData);
          console.log("Mapped allMusic:", musicData); // Log để kiểm tra dữ liệu
        } else {
          notification.error({ message: "Failed to fetch music." });
        }
      } catch (error) {
        console.error("Error fetching music:", error);
        notification.error({
          message: "An error occurred while retrieving music.",
        });
      }
    };

    fetchMusic();
  }, [accessToken]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleUpload = async () => {
    if (!accessToken) {
      notification.error({
        message: "You are not logged in. Please log in again.",
      });
      return;
    }

    if (!user || !user._id || !videoFile || !selectedCategory) {
      notification.error({ message: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    try {
      const uploadVideoForm = new FormData();
      uploadVideoForm.append("file", videoFile);

      const videoUploadForm = new FormData();
      videoUploadForm.append("file", videoFile);

      const tagVideoForm = new FormData();
      tagVideoForm.append("file", videoFile);

      const [videoUploadRes, getTagByAIRes] = await Promise.all([
        sendRequestFile<IUploadResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-video`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: videoUploadForm,
        }),
        sendRequestFile<IUploadResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/get-tag-by-ai`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: tagVideoForm,
        }),
      ]);

      if (videoUploadRes.statusCode !== 201) {
        throw new Error(videoUploadRes.message || "Video upload failed");
      }

      const videoUrl = videoUploadRes.data;
      let thumbnailUrl = "";

      if (videoThumbnail) {
        const uploadThumbnailForm = new FormData();
        uploadThumbnailForm.append("file", videoThumbnail);
        uploadThumbnailForm.append("folder", "thumbnails");

        const thumbnailUploadRes = await sendRequestFile<IUploadResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: uploadThumbnailForm,
        });

        if (thumbnailUploadRes.statusCode === 201) {
          thumbnailUrl = thumbnailUploadRes.data;
        } else {
          console.warn("Thumbnail upload failed, proceeding without thumbnail");
        }
      }

      const videoInputTag = hashtagsInput
        .split(" ")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const videoTag = [...new Set([...videoInputTag, ...getTagByAIRes.data])];
      const postData = {
        videoDescription,
        videoUrl,
        videoThumbnail: thumbnailUrl,
        userId: user._id,
        videoTag,
        categories: [selectedCategory],
        musicId: selectedMusic || undefined,
      };

      const postRes = await sendRequest<IUploadResponse>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/create`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: postData,
      });

      if (postRes.statusCode === 201) {
        notification.success({ message: "Post created successfully!" });
        setVideoDescription("");
        setVideoFile(null);
        setVideoThumbnail(null);
        setSelectedCategory("");
        setSelectedMusic("");
        setHashtagsInput("");
        router.push(`/page/detail_user/${user._id}`);
      } else {
        notification.error({
          message: postRes.message || "Post creation failed.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      notification.error({
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during upload.",
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
          onChange={(e) => handleFileChange(e, setVideoFile)}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Choose Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setVideoThumbnail)}
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
          placeholder="Example: fun travel music"
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

      <div className="mb-4">
        <label className="block font-medium mb-1">Add Music</label>
        <Select
          showSearch
          placeholder="Search and select music"
          optionFilterProp="children"
          style={{ width: "100%" }}
          value={selectedMusic || undefined}
          onChange={(value) => setSelectedMusic(value)}
          filterOption={(input, option) =>
            (option?.children as unknown as string)
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {allMusic.map((music) => (
            <Option key={music._id} value={music._id}>
              {music.musicDescription || "Unnamed Music"}
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
