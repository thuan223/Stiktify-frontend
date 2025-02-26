"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Copy, Check, Loader2, AlertCircle } from "lucide-react";

interface Video {
  videoUrl: string | undefined;
  videoDescription: string | undefined;
}

const ShareVideo = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideoShare();
    } else {
      setError("Invalid video ID");
      setLoading(false);
    }
  }, [id]);

  const fetchVideoShare = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/share/${id}`,
        method: "GET",
      });

      if (res?.data?.videoUrl) {
        setVideoData({
          videoUrl: res.data.videoUrl,
          videoDescription: res.data.videoDescription,
        });
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

  const handleCopyLink = () => {
    const url = `${window.location.origin}${pathname}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full border border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 font-serif">
          Video Player
        </h1>

        {loading && (
          <div className="flex flex-col items-center text-gray-700">
            <Loader2 className="animate-spin w-8 h-8" />
            <p className="mt-2 text-lg">Loading video...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-400">
            <AlertCircle className="w-8 h-6 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {videoData && (
          <div className="mt-6">
            <video className="w-full h-[500px] rounded-lg shadow-md" controls>
              <source src={videoData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="mt-4 text-gray-700 text-lg font-medium">
              {videoData.videoDescription}
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 active:scale-95 transition flex items-center"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <span className="ml-2">Copy Link</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareVideo;
