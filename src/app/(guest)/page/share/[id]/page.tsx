"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Copy, Check, Loader2, AlertCircle, Play } from "lucide-react";

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
      setError("Invalid video identifier");
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
        setError("Video content could not be retrieved");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        <div className="p-6 bg-neutral-100 border-b border-neutral-200">
          <h1 className="text-2xl font-semibold text-neutral-800 flex items-center justify-center gap-2">
            <Play className="w-6 h-6 text-neutral-600" />
            Video Sharing
          </h1>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center text-neutral-600">
              <Loader2 className="animate-spin w-8 h-8 text-neutral-500" />
              <p className="mt-3 text-sm text-neutral-500">
                Loading video content...
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
              <AlertCircle className="w-6 h-6 mr-3 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {videoData && (
            <div className="space-y-6">
              <div className="bg-neutral-100 rounded-xl p-2 shadow-inner">
                <video
                  className="w-full rounded-lg shadow-lg"
                  controls
                  poster="/api/placeholder/800/450"
                >
                  <source src={videoData.videoUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>

              <div className="text-center">
                <p className="text-lg font-medium text-neutral-800 mb-4">
                  {videoData.videoDescription}
                </p>

                <button
                  onClick={handleCopyLink}
                  className="
                    w-full 
                    py-3 
                    rounded-lg 
                    bg-neutral-800 
                    text-white 
                    hover:bg-neutral-700 
                    transition-colors 
                    flex 
                    items-center 
                    justify-center 
                    space-x-2
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-neutral-500 
                    focus:ring-offset-2
                  "
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy Sharing Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareVideo;
