"use client";

import { useState, useEffect } from "react";
import { fetchMyVideos } from "@/actions/videoPosted.video.action";
import { formatNumber } from "@/utils/utils";

const MyVideo = () => {
  const [videos, setVideos] = useState<IShortVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const response = await fetchMyVideos(1, 20); // Gọi API lấy video

      console.log("Videos from API:", response); // Debug log
      setVideos(response ?? []); // Chắc chắn response không bị undefined
      setLoading(false);
    };

    loadVideos();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-40 mt-[-22px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-20">My Videos</h2>
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : videos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Thumbnail</th>
                <th className="border px-4 py-2 text-left">Views</th>
                <th className="border px-4 py-2 text-left">Reactions</th>
                <th className="border px-4 py-2 text-left">Comments</th>
                <th className="border px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <div className="w-[150px] h-[100px] rounded-md shadow-lg overflow-hidden">
                      <img
                        src={video.videoThumbnail}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {formatNumber(video.totalViews ?? 0)}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {formatNumber(video.totalReaction ?? 0)}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {formatNumber(video.totalComment ?? 0)}
                  </td>
                  <td className="border px-4 py-2 text-gray-700">
                    {video.videoDescription
                      ? video.videoDescription
                      : "No description"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No videos found.</p>
      )}
    </div>
  );
};

export default MyVideo;
