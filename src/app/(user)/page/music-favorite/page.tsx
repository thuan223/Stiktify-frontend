"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";  // Lấy user từ AuthContext
import ListFavoriteMusic from "@/components/music/music-favorite/list.favorite";

const MusicFavoritePage = () => {
  const { user } = useContext(AuthContext) ?? {};  // Lấy thông tin người dùng

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-5">🎵 Nhạc yêu thích của bạn 🎵</h1>
      {user ? (
        <ListFavoriteMusic userId={user._id} />
      ) : (
        <p className="text-center text-gray-500">Vui lòng đăng nhập để xem nhạc yêu thích.</p>
      )}
    </div>
  );
};

export default MusicFavoritePage;
