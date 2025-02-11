"use client";
import HistoryList from "@/components/page/history/history-list";
import SettingHistory from "@/components/page/history/setting-history";
import Header from "@/components/page/trending/header";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import React, { useContext, useEffect, useState } from "react";

const ViewingHistory = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [videoList, setVideoList] = useState<VideoHistoryProps[]>([]);
  const [isFetch, setIsFetch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxLength, setMaxLength] = useState(false);
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  useEffect(() => {
    getViewingHistoryList()
  }, [accessToken, user])

  const getViewingHistoryList = async () => {
    if (accessToken && user) {
      const filter = JSON.stringify({ userId: user._id });
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/v1/viewinghistory/list-viewing-history?query=${encodeURIComponent(
            filter
          )}&current=${currentPage}&pageSize=10&`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsFetch(false);
      if (res.data.result.length === 0) {
        setMaxLength(true);
      }
      if (videoList.length == 0) {
        setVideoList(res?.data?.result);
      } else {
        setVideoList((prev) => [...prev, ...(res?.data?.result || [])]);
      }
    }

  };

  useEffect(() => {
    if (isFetch) getViewingHistoryList();
  }, [isFetch]);

  return (
    <div>
      <Header
        isGuest={false}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <HistoryList
        videoList={videoList}
        maxLength={maxLength}
        setIsFetch={setIsFetch}
        setCurrentPage={setCurrentPage}
      />
      <SettingHistory />
    </div>
  );
};

export default ViewingHistory;