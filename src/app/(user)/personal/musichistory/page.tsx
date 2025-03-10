"use client";

import { useState } from "react";
import ListenedHistory from "@/components/personal/history/listened-history";
import SettingListenHistory from "@/components/personal/history/setting-listen-history";
import Header from "@/components/page/trending/header";
import { handleSearchHistory } from "@/actions/music.action"; // Import API search action

const HistoryMusicPage = () => {
  const [videoList, setVideoList] = useState<any[]>([]); // Lưu danh sách video
  const [watchedDate, setWatchedDate] = useState<string>(""); // Lưu ngày đã xem
  const [searchValue, setSearchValue] = useState<string>(""); // Lưu giá trị tìm kiếm
  const [searchedMusic, setSearchedMusic] = useState<any[]>([]); // Lưu kết quả tìm kiếm

  // Xử lý khi người dùng thay đổi ngày
  const handleFilterDate = (date: string) => {
    setWatchedDate(date);
  };

  const handleSearchMusic = async (search: string) => {
    if (search.trim()) {
      const result = await handleSearchHistory(search);
      if (result?.data?.result) {
        setSearchedMusic(result.data.result); // Lưu kết quả tìm kiếm
      } else {
        setSearchedMusic([]); // Nếu không có kết quả, trả về mảng rỗng
      }
    }
  };

  // Hiển thị tất cả music history khi không tìm kiếm
  const handleClearSearch = () => {
    setSearchValue("");
    setSearchedMusic([]); // Đặt lại kết quả tìm kiếm
  };

  return (
    <div>
      <div>
        <Header
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isGuest={false}
          onClick={() => handleSearchMusic(searchValue)} // Gọi API khi nhấn tìm kiếm
        />
      </div>
      <div className="flex p-4">
        <div className="flex-1 mr-8">
          {/* Hiển thị tất cả lịch sử hoặc kết quả tìm kiếm */}
          {searchedMusic.length > 0 || searchValue.trim() ? (
            <div className="space-y-4">
              {searchedMusic.map((item) => {
                const music = item.musicId;
                return (
                  <div
                    key={item._id}
                    className="flex items-center bg-white shadow-md rounded-lg p-4"
                  >
                    <img
                      src={music.musicThumbnail}
                      className="w-32 h-32 object-cover rounded-md shadow-sm cursor-pointer"
                      alt={music.musicDescription}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {music.musicDescription}
                      </h3>
                      <p className="text-sm text-gray-700">
                        Views: {music.totalListener || 0}
                      </p>
                      <p className="text-sm text-gray-700">
                        Reactions: {music.totalReactions || 0}
                      </p>
                      <p className="text-sm text-gray-700">
                        View At: {new Date(item.createdAt).toLocaleTimeString()}{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ListenedHistory />
          )}
        </div>
        <div className="w-[30%] p-20">
          <SettingListenHistory
            setVideoList={setVideoList}
            onChange={handleFilterDate}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryMusicPage;
