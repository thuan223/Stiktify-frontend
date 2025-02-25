"use client";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { LuDot } from "react-icons/lu";
import { useRouter } from "next/navigation";
import ButtonPlayer from "./button.player";
import { useGlobalContext } from "@/library/global.context";
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { BiFlag } from "react-icons/bi";
import { capitalizeWords, formatNumber } from "@/utils/utils";
import { useState } from "react";
import ReportModal from "./comment/report_music";

interface IProps {
  item: IMusic;
}

const DisplayMusicDetail = ({ item }: IProps) => {
  const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying } =
    useGlobalContext()!;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavigate = () => {
    router.back();
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
      return setIsPlaying(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReport = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-[40vh] w-full bg-gray-900 rounded-sm shadow-gray-400/50 flex items-center px-16 relative">
      <div
        onClick={handleNavigate}
        className="absolute left-2 top-3 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer"
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
          <div>
            <div className="text-white text-[100px] font-roboto font-bold">
              {item.musicDescription}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                {item.musicTag?.map((tag, index) => (
                  <div key={index} className="text-white flex items-center">
                    {index !== 0 && <LuDot size={40} />}
                    <span>{capitalizeWords(tag)}</span>
                  </div>
                ))}
                <div className="text-white flex items-center">
                  <LuDot size={40} />
                  <span>{formatNumber(item.totalListener)}</span>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex gap-2 items-center cursor-pointer">
                  <MdFavoriteBorder size={20} className="text-gray-400" />
                  <span className="text-gray-400">
                    {formatNumber(item.totalFavorite)}
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
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={handleReport}
                >
                  <BiFlag size={20} className="text-gray-400" />
                  <span className="text-gray-400">Report</span>
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
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ReportModal onClose={handleCloseModal} musicId={item._id} />
        </div>
      )}
    </div>
  );
};

export default DisplayMusicDetail;
