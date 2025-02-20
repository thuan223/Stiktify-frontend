"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

interface Video {
  videoUrl: string | undefined;
}

const ShareVideo = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && accessToken) {
      fetchVideoShare();
    } else {
      setError("Missing video ID or access token");
      setLoading(false);
    }
  }, [id, accessToken]);

  const fetchVideoShare = async () => {
    try {
      const res = await sendRequest<{ videoUrl: string }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/share/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res && res.videoUrl) {
        setVideoData({ videoUrl: res.videoUrl });
      } else {
        setError("Video not found");
      }
    } catch (err) {
      setError("Failed to fetch video");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!videoData) return <p className="text-center text-gray-600">No video data</p>;

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Video Player</h1>

      {/* Video Player */}
      <video className="w-full rounded-lg" controls>
        <source src={videoData.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Display Video URL */}
      <p className="mt-4 text-sm text-gray-600">
        <strong>Video URL:</strong> {videoData.videoUrl}
      </p>
    </div>
  );
};

export default ShareVideo;
