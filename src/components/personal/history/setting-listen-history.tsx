"use client";

import {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import Cookies from "js-cookie";
import { FaPause, FaPlay } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";
import { DatePicker, Button } from "antd";
import { sendRequest } from "@/utils/api";
import { handleClearAllListeningHistory } from "@/actions/music.action"; // Thêm import action

interface SettingListenHistoryProps {
  setVideoList: Dispatch<SetStateAction<VideoHistoryProps[]>>;
  onChange?: (value: string) => void;
}

const SettingListenHistory: React.FC<SettingListenHistoryProps> = ({
  setVideoList,
  onChange,
}) => {
  const [isMusicPaused, setIsMusicPaused] = useState(false);
  const [watchedDate, setWatchedDate] = useState<string | undefined>("");

  const { user, accessToken } = useContext(AuthContext) ?? {};

  useEffect(() => {
    const musicPauseStatus = Cookies.get("isMusicPause") === "true";
    setIsMusicPaused(musicPauseStatus);
  }, []);

  const handlePauseResumeHistory = () => {
    const newPauseStatus = !isMusicPaused;
    Cookies.set("isMusicPause", newPauseStatus.toString(), { expires: 365 });
    setIsMusicPaused(newPauseStatus);
  };

  const handleDateChange = (date: any) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : "";
    setWatchedDate(formattedDate);
    if (onChange) onChange(formattedDate);
  };

  const handleClearAllHistory = async () => {
    if (user?._id) {
      try {
        const result = await handleClearAllListeningHistory(user._id);
        if (result) {
          console.log("Clear all listening history successful!");
          setVideoList([]);
        } else {
          console.error("Failed to clear all listening history.");
        }
      } catch (err) {
        console.error("Error during clear all history:", err);
      }
    }
  };

  return (
    <div className="w-[25%] bg-white p-4 rounded-lg">
      <div className="mb-4 flex items-center gap-2">
        <label className="text-md font-medium">Date: </label>
        <DatePicker className="w-[200px] mt-1" onChange={handleDateChange} />
      </div>
      <div
        className="mb-4 w-[300px] flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
        onClick={handlePauseResumeHistory}
      >
        {isMusicPaused ? <FaPlay size={20} /> : <FaPause size={20} />}
        <span className="text-sm font-medium">
          {isMusicPaused ? "Resume Listen History" : "Pause Listen History"}
        </span>
      </div>

      <div
        onClick={handleClearAllHistory} 
        className="mb-4 w-[300px] flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 448 512"
        >
          <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.7 23.7 0 0 0 -21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0 -16-16z" />
        </svg>
        <span className="text-sm font-medium">Clear all listen history</span>
      </div>
    </div>
  );
};

export default SettingListenHistory;
