import React, { useState } from "react";
import { DatePicker, Button, Divider } from "antd";

const SettingHistory: React.FC<any> = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-[30%] bg-white absolute right-0 top-[95px] p-4 rounded-lg">
      {/* Date Filter */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium">Watched Date</label>
        <DatePicker className="w-[200px] mt-1" />
      </div>

      {/* Pause/Resume Watch History */}
      <div
        className="mb-4 w-[300px] flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 448 512"
          >
            <path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 448 512"
          >
            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
          </svg>
        )}

        <span className="text-sm font-medium">
          {isPaused ? "Resume Watch History" : "Pause Watch History"}
        </span>
      </div>

      {/* Clear Watch History */}
      <div className="mb-4 w-[300px] flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 448 512"
        >
          <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1 -32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.7 23.7 0 0 0 -21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0 -16-16z" />
        </svg>
        <span className="text-sm font-medium">Clear watch history</span>
      </div>
    </div>
  );
};

export default SettingHistory;
