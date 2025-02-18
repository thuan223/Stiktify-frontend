"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Clipboard, ClipboardCheck } from "lucide-react";

interface Video {
  videoUrl: string | undefined;
}

const ShareVideo = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
      const res = await sendRequest<{ data: Video }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/share/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res?.data && res.data.videoUrl) {
        setVideoData(res.data);
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

  const handleCopy = () => {
    if (videoData?.videoUrl) {
      navigator.clipboard.writeText(videoData.videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 text-lg font-semibold">{error}</p>;
  if (!videoData)
    return <p className="text-center text-gray-700 text-lg">No video data</p>;

  return (
    <div className="p-15 max-w-5xl mx-auto border border-gray-400 rounded-3xl shadow-xl bg-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
        🎬 Video Player
      </h1>

      {/* Video Player */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-300">
        <video className="w-full rounded-2xl" controls>
          <source src={videoData.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Display Video URL with Copy Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl shadow-inner border border-gray-300">
        <span className="text-lg font-medium text-gray-700 break-all max-w-full truncate">
          {videoData.videoUrl}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
        >
          {copied ? <ClipboardCheck size={24} /> : <Clipboard size={24} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default ShareVideo;
