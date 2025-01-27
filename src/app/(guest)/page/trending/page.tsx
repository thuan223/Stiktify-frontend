"use client";
import Header from "@/components/page/trending/header";
import InteractSideBar from "@/components/page/trending/interact_sidebar";
import MainVideo from "@/components/page/trending/main_video";
import VideoFooter from "@/components/page/trending/video-footer";
import React, { useState } from "react";

const TrendingPage = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <MainVideo />
      <VideoFooter
        videoDescription="We Don't Talk Anymore & I Hate U I Love U ( MASHUP cover by J.Fla )"
        totalView={5000}
        videoCategory={["Pop muisc", "Mashup", "Cover"]}
        createAt="2025-01-23T00:00:00.000+00:00"
      />
      <InteractSideBar />
    </div>
  );
};

export default TrendingPage;
