"use client";

import { useState } from "react";
import ListenedHistory from "@/components/personal/history/listened-history";
import SettingListenHistory from "@/components/personal/history/setting-listen-history";
import Header from "@/components/page/trending/header";
import { handleSearchHistory } from "@/actions/music.action";

const HistoryMusicPage = () => {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [watchedDate, setWatchedDate] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedMusic, setSearchedMusic] = useState<any[]>([]);

  const handleFilterDate = (date: string) => {
    setWatchedDate(date);
  };

  const handleSearchMusic = async (search: string) => {
    if (search.trim()) {
      const result = await handleSearchHistory(search);
      if (result?.data?.result) {
        setSearchedMusic(result.data.result);
      } else {
        setSearchedMusic([]);
      }
    }
  };
  const handleClearSearch = () => {
    setSearchValue("");
    setSearchedMusic([]);
  };

  return (
    <div>
      <div>
        <Header
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isGuest={false}
          onClick={() => handleSearchMusic(searchValue)}
        />
      </div>
      <div className="flex p-4">
        <div className="flex-1 mr-8">
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
        <div className="w-[30%] p-5">
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
