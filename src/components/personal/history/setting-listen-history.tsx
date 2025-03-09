"use client";

import { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { FaPause, FaPlay } from "react-icons/fa";
import { AuthContext } from "@/context/AuthContext";

const SettingListenHistory = () => {
  const [isMusicPaused, setIsMusicPaused] = useState(false); 
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

  return (
    <div className="flex justify-end mt-4 ml-auto">
      <div
        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 transition rounded-lg"
        onClick={handlePauseResumeHistory}
      >
        {isMusicPaused ? <FaPlay size={20} /> : <FaPause size={20} />}
        <span className="text-sm font-medium">
          {isMusicPaused ? "Resume Listen History" : "Pause Listen History"}
        </span>
      </div>
    </div>
  );
};

export default SettingListenHistory;
