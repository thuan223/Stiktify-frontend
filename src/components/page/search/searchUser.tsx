"use client";

import { handleSearchUserByName } from "@/actions/search.user.action";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // Import icon search

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchUsers = async (search = "") => {
    setLoading(true);
    const response: any = await handleSearchUserByName(search, 1, 10);
    setUsers(response?.data?.result || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(searchTerm);
  };

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div className="flex flex-col items-center w-full h-[95vh] bg-gray-100 py-10 overflow-hidden">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
          Search User
        </h2>
        <div className="relative w-full max-w-lg mx-auto mb-6">
          <input
            type="text"
            placeholder="Enter username..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <FaSearch size={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[300px] border border-gray-300 rounded-lg w-full">
          {loading ? (
            <p className="mt-4 text-gray-500 text-center">Loading...</p>
          ) : users.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border p-3 text-left w-20">Avatar</th>
                  <th className="border p-3 text-left">Full Name</th>
                  <th className="border p-3 text-left">Username</th>
                  <th className="border p-3 text-center w-32">Follow</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border p-3 text-center">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullname}`}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border mx-auto"
                      />
                    </td>
                    <td className="border p-3">{user.fullname}</td>
                    <td className="border p-3">@{user.userName}</td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleFollow(user._id)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          followedUsers[user._id]
                            ? "bg-gray-400 text-white"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {followedUsers[user._id] ? "Following" : "Follow"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4 text-gray-500 text-center">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
