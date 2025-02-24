"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";  // Lấy user từ AuthContext
import ListFavoriteMusic from "@/components/music/music-favorite/list.favorite";

const MusicFavoritePage = () => {
  const { user } = useContext(AuthContext) ?? {};  // Lấy thông tin người dùng

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-5">🎵 My favorite music 🎵</h1>
      {user ? (
        <ListFavoriteMusic userId={user._id} />
      ) : (
        <p className="text-center text-gray-500">Please, you must login!</p>
      )}
    </div>
  );
};

export default MusicFavoritePage;
