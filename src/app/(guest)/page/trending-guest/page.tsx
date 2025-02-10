"use client";
import { handleSearchShortVideos } from "@/actions/manage.short.video.action";
import SearchCard from "@/components/page/search/searchCard";
import Header from "@/components/page/trending/header";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import VideoFooter from "@/components/page/trending/video-footer";
import { sendRequest } from "@/utils/api";
import React, { useEffect, useState } from "react";

const TrendingPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<IVideo[]>([]);
  const [videoDataSearch, setVideoDataSearch] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const getVideoData = async () => {
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-guest-videos`,
        method: "POST",
      });

      if (res.data && Array.isArray(res.data)) {
        if (requestCount === 0) {
          setVideoData(res.data);
          setRequestCount(1);
        } else {
          setVideoData((prev) => [...prev, ...(res.data || [])]);
          setRequestCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch trending videos:", error);
    }
  };

  const fetchSearchVideo = async () => {
    setLoading(true);
    const response: any = await handleSearchShortVideos(searchValue, 1, 10);
    console.log("checkkk searchh", response);
    setVideoDataSearch(response?.data?.result || []);
    setLoading(false);
  };
  const handleScroll = (event: React.WheelEvent) => {
    if (event.deltaY > 0) {
      if (currentVideoIndex < videoData.length - 1) {
        const newIndex = currentVideoIndex + 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);

        if (newIndex === requestCount * 10 - 1) {
          setRequestCount(videoData.length / 10);
          getVideoData();
        }
      }
    } else {
      if (currentVideoIndex > 0) {
        const newIndex = currentVideoIndex - 1;
        setCurrentVideoIndex(newIndex);
        setCurrentVideo(videoData[newIndex]);
      }
    }
  };
  useEffect(() => {
    getVideoData();
  }, []);

  useEffect(() => {
    if (currentVideo) {
      console.log("Current Video:", currentVideo);
    }
  }, [currentVideo]);
  useEffect(() => {
    console.log(videoData);
    console.log(videoData.length);
    console.log(requestCount);
    if (currentVideo === null) setCurrentVideo(videoData[0] || null);
  }, [videoData]);
  const handleVideoWatched = async () => {
    console.log("Watching video");
  };

  return (
    <div onWheel={handleScroll}>
      <Header
        onClick={() => fetchSearchVideo()}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isGuest={true}
      />
      {videoDataSearch && videoDataSearch.length > 0 ? (
        <>
          <SearchCard videos={videoDataSearch} />
        </>
      ) : (
        <>
          {currentVideo ? (
            <MainVideo
              videoUrl={currentVideo.videoUrl}
              onVideoWatched={handleVideoWatched}
            />
          ) : (
            <p>Loading video...</p>
          )}
          <VideoFooter
            videoDescription={currentVideo?.videoDescription || ""}
            totalView={currentVideo?.totalViews || 0}
            videoTag={currentVideo?.videoTag || []}
            createAt={currentVideo?.createAt.toString() || ""}
          />
          {/* <InteractSideBar creatorId={currentVideo?.userId.fullname || ""} /> */}
        </>
      )}
    </div>
  );
};

export default TrendingPage;
