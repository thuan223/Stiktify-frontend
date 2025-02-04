import { formatDateTimeVn } from "@/utils/utils";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface HistoryListProps {
  videoList: VideoHistoryProps[];
  maxLength: Boolean;
  setIsFetch: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const HistoryList: React.FC<HistoryListProps> = ({
  videoList,
  maxLength,
  setIsFetch,
  setCurrentPage,
}) => {
  const lastVideoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !maxLength) {
            setCurrentPage((prev) => prev + 1);
            setIsFetch(true);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (lastVideoRef.current) {
      observer.observe(lastVideoRef.current);
    }

    return () => {
      if (lastVideoRef.current) {
        observer.unobserve(lastVideoRef.current);
      }
    };
  }, [videoList]);

  return (
    <div className="w-[60%] bg-white absolute left-30 top-[95px] p-4">
      {videoList.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videoList.map((history, index) => (
          <div
            key={index}
            className="mb-[10px] p-[10px] pl-[20px] border-b flex items-center gap-4 cursor-pointer"
            ref={index === videoList?.length - 1 ? lastVideoRef : null}
          >
            <img
              src={history.videoId?.videoThumbnail}
              alt="Thumbnail"
              className="w-[250px] h-[150px] object-cover border-3 border-gray-300 rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {history?.videoId?.videoDescription}
              </h3>
              <p className="text-gray-600 text-sm">{`Tags:#${history?.videoId?.videoTag?.join(
                " #"
              )}`}</p>
              <p>{`Views: ${history?.videoId?.totalViews}`}</p>
              <p>{`Reactions: ${history?.videoId?.totalReaction}`}</p>
              <p>{`View At: ${formatDateTimeVn(history?.createdAt + "")}`}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryList;
