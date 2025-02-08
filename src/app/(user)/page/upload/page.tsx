"use client";

import { useState, useContext } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { accessToken } = useContext(AuthContext) ?? {};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!accessToken) {
      setError("You need to be logged in to upload files.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("videoDescription", videoDescription);

    try {
      const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/upload`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }) as { success: boolean; message?: string };

      if (res.success) {
        setSuccessMessage("Video uploaded successfully!");
        setFile(null);
      } else {
        setError(res.message || "Upload failed.");
      }
    } catch (error) {
      setError("An error occurred while uploading.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Upload Video Post</h2>

      <div className="w-full mb-6">
        <label htmlFor="video" className="text-lg text-gray-700 mb-2 block">Choose a video file</label>
        <input
          id="video"
          type="file"
          onChange={handleFileChange}
          className="w-full p-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full mb-6">
        <label htmlFor="videoUrl" className="text-lg text-gray-700 mb-2 block">Video URL</label>
        <input
          id="videoUrl"
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="w-full p-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full mb-6">
        <label htmlFor="videoDescription" className="text-lg text-gray-700 mb-2 block">Video Description</label>
        <textarea
          id="videoDescription"
          placeholder="Enter a brief description of the video"
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          className="w-full p-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>


      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
    </div>
  );
};

export default UploadPage;
