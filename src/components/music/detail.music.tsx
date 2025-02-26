"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { LuDot } from "react-icons/lu";
import { useRouter } from "next/navigation";
import ButtonPlayer from "./button.player";
import { useGlobalContext } from "@/library/global.context";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { GrAssistListening } from "react-icons/gr";
import { capitalizeWords, formatNumber } from "@/utils/utils";
import { sendRequest } from "@/utils/api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

interface IProps {
  item: IMusic;
}
const DisplayMusicDetail = (props: IProps) => {
  const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying } =
    useGlobalContext()!;
  const router = useRouter();
  const { item } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [totalFavorite, setTotalFavorite] = useState(item.totalFavorite);
  const { accessToken } = useContext(AuthContext) || {};

  const handleNavigate = () => {
    router.back();
  };

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/check-favorite/${item._id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsLiked(res.data);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    checkLikeStatus();
  }, [item._id]);

  const handleLike = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/music-favorite/favorite/${item._id}`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setIsLiked(!isLiked);
      setTotalFavorite(isLiked ? totalFavorite - 1 : totalFavorite + 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      const data = {
        _id: track._id,
        musicDescription: track.musicDescription,
        musicThumbnail: track.musicThumbnail,
        musicUrl: track.musicUrl,
      };
      setTrackCurrent(data);
      localStorage.setItem("trackCurrent", JSON.stringify(data));
      return setIsPlaying(isPlaying ? true : !isPlaying);
    }
    return setIsPlaying(!isPlaying);
  };
  return (
    <div className="h-[40vh] w-full bg-gray-900 rounded-sm shadow-gray-400/50 flex items-center px-16 relative">
      <div
        onClick={() => handleNavigate()}
        className="absolute left-2 top-3 bg-gray-800 rounded-full hover:bg-gray-700"
      >
        <IoMdArrowRoundBack color="white" className="m-2" size={20} />
      </div>
      <div className="flex w-full justify-between items-end">
        <div className="flex gap-5 items-center justify-around">
          <Image
            alt="thumbnail"
            src={item.musicThumbnail}
            width={200}
            height={100}
            className="rounded-md"
          />
          <div className="">
            <div className="text-white text-[100px] font-roboto font-bold">
              {item.musicDescription}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                {item.musicTag &&
                  item.musicTag.length > 0 &&
                  item.musicTag.map((i, index) => (
                    <div key={index} className="text-white flex items-center">
                      {index !== 0 && <LuDot size={40} />}
                      <span>{capitalizeWords(i)}</span>
                    </div>
                  ))}
                <div className="text-white flex items-center">
                  <LuDot size={40} />
                  <span>{formatNumber(item.totalListener)}</span>
                </div>
              </div>
              <div className="flex gap-5">
                {/* Nút like */}
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleLike}
                >
                  {isLiked ? (
                    <MdFavorite size={20} className="text-red-500" /> // Icon like (đã like)
                  ) : (
                    <MdFavoriteBorder size={20} className="text-gray-400" /> // Icon like (chưa like)
                  )}
                  <span className="text-gray-400">
                    {formatNumber(totalFavorite)}
                  </span>
                </div>
                <div className="flex gap-2 items-center cursor-pointer">
                  <FaRegComment size={20} className="text-gray-400" />
                  <span className="text-gray-400">
                    {formatNumber(item.totalComment)}
                  </span>
                </div>
                <div className="flex gap-2 items-center cursor-pointer">
                  <RiShareForwardLine size={20} className="text-gray-400" />
                  <span className="text-gray-400">
                    {formatNumber(item.totalShare)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ButtonPlayer
            className="w-16 h-16"
            current={item._id}
            isPlaying={isPlaying}
            togglePlay={() => handlePlayer(item)}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayMusicDetail;
