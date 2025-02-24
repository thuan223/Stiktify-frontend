"use client";

import { useEffect, useState } from "react";
import CardMusic from "@/components/music/card.music";
import { handleGetAllFavoriteMusic } from "@/actions/music.action";

interface IProps {
  userId: string;
}

const ListFavoriteMusic = ({ userId }: IProps) => {
  const [favoriteMusic, setFavoriteMusic] = useState<any[]>([]);

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

  console.log("checkkkk", favoriteMusic);
  return (
    <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
      {favoriteMusic.length > 0 ? (
        favoriteMusic.map((item: any) => (
          <CardMusic
            key={item._id}
            handlePlayer={() => {}}
            isPlaying={false}
            item={item}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center w-full">Not music favorite!</p>
      )}
    </div>
  );
};

export default ListFavoriteMusic;
