"use client";
import Header from "@/components/page/trending/header";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import VideoFooter from "@/components/page/trending/video-footer";
import CommentSection from "@/components/page/trending/comment_section";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import React, { useContext, useEffect, useState } from "react";
import { useShowComment } from "@/context/showCommentContext";

const TrendingPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [videoData, setVideoData] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};

  // const [showComments, setShowComments] = useState<boolean>(false);
  const { showComments, setShowComments } = useShowComment();

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  useEffect(() => {
    getVideoData();
  }, [accessToken, user]);

  const getVideoData = async () => {
    if (!accessToken || !user) return;

    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/trending-user-videos`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user._id,
        },
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
      console.log("Failed to fetch trending videos:", error);
    }
  };

  const handleScroll = (event: React.WheelEvent) => {
    if (showComments) {
      event.preventDefault();
      return;
    }
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
    if (currentVideo === null) setCurrentVideo(videoData[0] || null);
  }, [videoData]);

  const handleVideoWatched = async () => {
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/short-videos/create-wishlist-videos`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user._id,
          videoId: currentVideo?._id,
        },
      });
      createViewingHistory();
    } catch (error) {
      console.error("Failed to fetch wishlist videos:", error);
    }
  };

  const createViewingHistory = async () => {
    try {
      const res = await sendRequest<IBackendRes<IVideo[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/viewinghistory`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          userId: user._id,
          videoId: currentVideo?._id,
        },
      });
    } catch (error) {
      console.error("Failed to create Viewing History:", error);
    }
  };
  const onCommentAdded = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalComment: (currentVideo.totalComment || 0) + 1,
      });
    }
  };
  const onReactionAdded = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalReaction: (currentVideo.totalReaction || 0) + 1,
      });
    }
  };
  const onReactionRemove = () => {
    if (currentVideo) {
      setCurrentVideo({
        ...currentVideo,
        totalReaction: (currentVideo.totalReaction || 0) - 1,
      });
    }
  };
  return (
    <div onWheel={handleScroll}>
      <Header
        isGuest={false}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
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
        createAt={currentVideo?.createAt?.toString() || ""}
      />
      <InteractSideBar
        creatorId={currentVideo?.userId.fullname || ""}
        userId={currentVideo?.userId._id || ""}
        onCommentClick={toggleComments}
        videoId={currentVideo?._id}
        numberComment={currentVideo?.totalComment}
        numberReaction={currentVideo?.totalReaction}
        onReactionAdded={onReactionAdded}
        onReactionRemove={onReactionRemove}
        isHidden={showComments}
      />

      {showComments && (
        <CommentSection
          onCommentClick={toggleComments}
          videoId={currentVideo?._id}
          showComments={showComments}
          onCommentAdded={onCommentAdded}
        />
      )}
    </div>
  );
};

export default TrendingPage;
