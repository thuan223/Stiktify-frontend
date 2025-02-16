import React, { useRef, useEffect } from "react";

interface MainVideoProps {
  videoUrl: string;
  onVideoWatched?: () => void;
}

const MainVideo: React.FC<MainVideoProps> = ({ videoUrl, onVideoWatched }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        const percentage = (video.currentTime / video.duration) * 100;

        if (percentage >= 5 && video.currentTime >= 10) {
          onVideoWatched && onVideoWatched();
          video.removeEventListener("timeupdate", handleTimeUpdate);
        }
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [onVideoWatched]);

  return (
    <div className="w-[73%] bg-white shadow-lg absolute left-30 top-[95px] h-3/4">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        autoPlay
        muted={false}
        className="w-full h-full"
      ></video>
    </div>
  );
};

export default MainVideo;
