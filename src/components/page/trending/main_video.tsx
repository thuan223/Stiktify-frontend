import React from "react";

const MainVideo = () => {
  const videoUrl = "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/videos%2FWe%20Don't%20Talk%20Anymore%20%26%20I%20Hate%20U%20I%20Love%20U%20(%20MASHUP%20cover%20by%20J.Fla%20).mp4?alt=media&token=197a990d-d875-4d5a-af0d-31a1af58ff63"; 
  return (
    <div className="w-[73%] bg-white shadow-lg absolute left-30 top-[95px] h-3/4">
      <video
        src={videoUrl}
        controls
        className="w-full h-full"
      >
      </video>
    </div>
  );
};

export default MainVideo;
