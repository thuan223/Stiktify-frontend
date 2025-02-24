"use client";

import { useEffect, useState } from "react";
import CardMusic from "@/components/music/card.music";
import { handleGetMyMusic } from "@/actions/music.action";

interface IProps {
  userId: string;
}

const ListMyMusic = ({ userId }: IProps) => {
  const [myMusic, setMyMusic] = useState<any[]>([]); 

  const currentPage = "1"; 
  const pageSize = "30"; 

  useEffect(() => {
    const fetchMyMusic = async () => {
      const response = await handleGetMyMusic(userId, currentPage, pageSize);
      if (response?.data) {
        setMyMusic(response.data.result); 
      } else {
        setMyMusic([]);
      }
    };
    if (userId) {
      fetchMyMusic();
    }
  }, [userId]);

  return (
    <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
      {myMusic.length > 0 ? (
        myMusic.map((item: any) => (
          <CardMusic
            key={item._id}
            handlePlayer={() => {}}
            isPlaying={false}
            item={item}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center w-full">
          Not music!
        </p>
      )}
    </div>
  );
};

export default ListMyMusic;
