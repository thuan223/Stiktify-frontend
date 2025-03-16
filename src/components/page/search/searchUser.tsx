"use client";

import { handleSearchUserAndVideo } from "@/actions/search.user.action";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SearchUser = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || ""; // Lấy dữ liệu từ URL (?q=keyword)

  const [users, setUsers] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) return;
    const fetchResults = async () => {
      setLoading(true);
      const response: any = await handleSearchUserAndVideo(searchTerm, 1, 10);
      const usersData = response?.data?.users?.result || [];
      const videosData = response?.data?.videos?.result || [];
      setUsers(usersData);
      setVideos(videosData);
      setLoading(false);
    };

    fetchResults();
  }, [searchTerm]); // Gọi API mỗi khi searchTerm thay đổi

  return (
    <div className="flex flex-col items-center w-full h-[95vh] bg-gray-100 py-10 overflow-hidden">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Search Results for: "{searchTerm}"
        </h2>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg w-full p-4">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : (
            <>
              {/* Users */}
              {users.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Users</h3>
                  <ul>
                    {users.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center space-x-4 p-2 border-b"
                      >
                        <img
                          src={user.image}
                          alt={user.fullname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>
                          {user.fullname} (@{user.userName})
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Videos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video._id}
                        className="bg-gray-50 p-3 rounded-lg shadow-md"
                      >
                        <img
                          src={video.videoThumbnail}
                          alt={video.videoThumbnail}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <p className="mt-2 text-sm font-semibold">
                          {video.videoDescription}
                        </p>
                        <p className="text-xs text-gray-500">
                          Views: {video.totalViews}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* No results */}
              {users.length === 0 && videos.length === 0 && (
                <p className="text-gray-500 text-center">No results found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
