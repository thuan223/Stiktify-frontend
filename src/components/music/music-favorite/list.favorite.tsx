"use client";

import { useEffect, useState } from "react";
import CardMusic from "@/components/music/card.music";
import { handleGetAllFavoriteMusic } from "@/actions/music.action";
import { FaLock, FaUnlock } from "react-icons/fa"; // Thêm biểu tượng từ react-icons

interface IProps {
  userId: string;
}

const ListFavoriteMusic = ({ userId }: IProps) => {
  const [favoriteMusic, setFavoriteMusic] = useState<any[]>([]);
  const [areItemsHidden, setAreItemsHidden] = useState(false); // Trạng thái ẩn/hiện toàn bộ danh sách

  const currentPage = "1";
  const pageSize = "30";

  useEffect(() => {
    const fetchFavoriteMusic = async () => {
      const response = await handleGetAllFavoriteMusic(
        userId,
        currentPage,
        pageSize
      );
      if (response?.data) {
        setFavoriteMusic(response.data);
      } else {
        setFavoriteMusic([]);
      }
    };
    if (userId) {
      fetchFavoriteMusic();
    }
  }, [userId]);

  // Hàm toggle ẩn/hiện toàn bộ danh sách
  const toggleAllItems = () => {
    setAreItemsHidden((prev) => !prev);
  };

  console.log("checkkkk", favoriteMusic);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mx-20">
        <h2 className="text-xl font-bold">List of Favorite Music</h2>
        <button
          onClick={toggleAllItems}
          className="text-gray-600 hover:text-gray-800"
          title={areItemsHidden ? "Show all music" : "Hide all music"}
        >
          {areItemsHidden ? <FaUnlock size={20} /> : <FaLock size={20} />}
        </button>
      </div>
      <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
        {!areItemsHidden ? (
          favoriteMusic.length > 0 ? (
            favoriteMusic.map((item: any) => (
              <CardMusic
                key={item._id}
                handlePlayer={() => {}}
                isPlaying={false}
                item={item}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              Not music favorite!
            </p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ListFavoriteMusic;
