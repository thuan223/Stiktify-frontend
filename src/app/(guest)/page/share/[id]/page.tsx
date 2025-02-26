"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Copy, Check, Loader2, AlertCircle } from "lucide-react";

interface Video {
  videoUrl: string;
  videoDescription: string;
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

      if (res?.data) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#22C55E] p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E] to-[#a1e9b0] opacity-50 blur-3xl"></div>
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-2xl w-full border border-white/20 relative z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 font-serif text-center">
          Video Player
        </h1>

        {loading && (
          <div className="flex flex-col items-center justify-center text-white">
            <Loader2 className="animate-spin w-6 h-6" />
            <p className="mt-2">Loading video...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-500/50">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {videoData && (
          <div className="mt-4 text-center">
            <video
              className="w-full rounded-xl shadow-md border border-white/10"
              controls
            >
              <source src={videoData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h2 className="text-2xl font-bold text-white mt-4 drop-shadow-md">
              {videoData.videoDescription}
            </h2>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1 rounded-md transition duration-300 border border-white/20 text-white bg-white/20 hover:bg-white/30 active:scale-95 flex items-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white-300" />
                    <span className="ml-2">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="ml-2">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareVideo;
