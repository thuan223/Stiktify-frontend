import React, { useContext, useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import {
  FaThumbsUp,
  FaHeart,
  FaSurprise,
  FaSadTear,
  FaAngry,
  FaSmile,
} from "react-icons/fa";

import like_gif from "@/assets/reaction/gif/thumb-up.gif";
import like_img from "@/assets/reaction/image/thumb-up.png";
import surprised_gif from "@/assets/reaction/gif/surprised.gif";
import surprised_img from "@/assets/reaction/image/surprised.png";
import angry_gif from "@/assets/reaction/gif/angry.gif";
import angry_img from "@/assets/reaction/image/angry.png";
import happy_gif from "@/assets/reaction/gif/happy.gif";
import happy_img from "@/assets/reaction/image/happy.png";
import in_love_gif from "@/assets/reaction/gif/in-love.gif";
import in_love_img from "@/assets/reaction/image/in-love.png";
import sad_gif from "@/assets/reaction/gif/sad.gif";
import sad_img from "@/assets/reaction/image/sad.png";

import Image from "next/image";

interface Reaction {
  _id: string;
  icon: JSX.Element;
}

const reactions: Reaction[] = [
  {
    _id: "6741b8a5342097607f012a76",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={like_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          src={like_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 h-100 w-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a77",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={in_love_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          src={in_love_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7b",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={happy_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          src={happy_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a78",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={surprised_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          src={surprised_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a79",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={sad_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          src={sad_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
  {
    _id: "6741b8a5342097607f012a7a",
    icon: (
      <div className="relative w-8 h-8">
        <Image
          src={angry_img}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 transition-opacity duration-300 hover:opacity-0"
        />
        <Image
          src={angry_gif}
          alt="Like GIF"
          width={30}
          height={30}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ scale: 1.5 }}
        />
      </div>
    ),
  },
];

const ReactSection: React.FC<{ videoId: string | undefined }> = ({
  videoId,
}) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null
  );
  const [showReactions, setShowReactions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedReaction(null);
    setLoading(true);
  }, [videoId]);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (!videoId || !accessToken) return;

      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/getReactByUser`,
          method: "POST",
          body: { videoId },
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res && res.data.reactionTypeId) {
          const foundReaction = reactions.find(
            (r) => r._id === res.data.reactionTypeId
          );
          if (foundReaction) setSelectedReaction(foundReaction);
        }
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái reaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReaction();
  }, [videoId, accessToken]);

  const handleReactionClick = async (reaction: Reaction) => {
    if (!videoId || !accessToken) return;

    setSelectedReaction(reaction);
    setShowReactions(false);

    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video-reactions/react`,
        method: "POST",
        body: { videoId, reactionTypeId: reaction._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  return (
    <div className="relative inline-block">
      {loading ? (
        <FaThumbsUp className="text-gray-400 mr-3" size={24} />
      ) : (
        <>
          {showReactions && (
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white border p-2 rounded-md shadow-md flex gap-2"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {reactions.map((reaction) => (
                <div
                  key={reaction._id}
                  className="cursor-pointer p-1 flex items-center justify-center"
                  onClick={() => handleReactionClick(reaction)}
                >
                  {reaction.icon}
                </div>
              ))}
            </div>
          )}
          <div
            className="cursor-pointer pr-3 flex items-center justify-center"
            onMouseEnter={() => setShowReactions(true)}
            // onMouseLeave={() => setShowReactions(false)}
          >
            {selectedReaction ? (
              selectedReaction.icon
            ) : (
              <FaThumbsUp className="text-gray-400" size={24} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReactSection;
