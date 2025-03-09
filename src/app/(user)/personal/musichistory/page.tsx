"use client";

import ListenedHistory from "@/components/personal/history/listened-history";
import SettingListenHistory from "@/components/personal/history/setting-listen-history";

const HistoryMusicPage = () => {
  return (
    <div className="p-4">
      <SettingListenHistory />
      <ListenedHistory />
    </div>
  );
};

export default HistoryMusicPage;
