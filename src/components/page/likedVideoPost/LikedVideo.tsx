"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

interface LikedVideoReaction {
  videoId: string;
}

interface ShortVideo {
  _id: string;
  videoURL: string;
  videoDescription: string;
  videoTag: string;
  totalViews: number;
  totalReaction: number;
}

const LikedVideo = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [likedVideos, setLikedVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && accessToken) {
      fetchLikedVideos();
    }
  }, [id, accessToken]);

  const fetchLikedVideos = async () => {
    try {
      // Get list of liked video IDs
      const res = await sendRequest<{ data: LikedVideoReaction[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/user/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const reactions = res.data || [];

      // For each videoId, fetch video details
      const videos: ShortVideo[] = await Promise.all(
        reactions.map(async (reaction) => {
          const videoRes = await sendRequest<{ data: ShortVideo }>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/${reaction.videoId}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return videoRes.data;
        })
      );

      setLikedVideos(videos);
    } catch (err) {
      setError("Failed to fetch liked videos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-600 text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (likedVideos.length === 0)
    return <p className="text-gray-600 text-center">No liked videos</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">List of Liked Videos</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {likedVideos.map((video) => (
          <div
            key={video._id}
            className="p-2 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <video controls className="w-full h-40 object-cover">
              <source src={video.videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="mt-2">
              <p className="text-gray-800 font-medium text-sm">
                {video.videoDescription}
              </p>
              <p className="text-gray-600 text-xs">
                Views: {video.totalViews} - Reactions: {video.totalReaction}
              </p>
              <p className="text-gray-600 text-xs">
                <span className="flex flex-wrap">
                  {Array.isArray(video.videoTag)
                    ? video.videoTag.map((tag, index) => (
                        <span key={index} className="mr-2">
                          #{tag}
                        </span>
                      ))
                    : video.videoTag}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedVideo;
