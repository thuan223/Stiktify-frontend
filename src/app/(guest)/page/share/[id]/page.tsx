"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

interface Video {
  videoUrl: string | undefined;
}

const VideoDetail = () => {
  const { id } = useParams(); 
  const { accessToken } = useContext(AuthContext) ?? {};
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && accessToken) fetchVideoSharel();
  }, [id, accessToken]);
  useEffect(() => {
    fetchVideoSharel();
  }, []);

  const fetchVideoSharel = async () => {
    try {
      const res = await sendRequest<{ videoUrl: string }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/share/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log("Video response:", res);
  
      if (res && res.videoUrl) {
        setVideoData(res);
      } else {
        setError("Video not found or missing videoUrl");
      }
    } catch (err) {
      setError("Failed to fetch video details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!videoData) return <p>No video data</p>;

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Video Player</h1>
      <video className="w-full rounded-lg" controls>
        <source src={videoData.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoDetail;
