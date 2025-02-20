import React, { useState, useEffect, useRef } from "react";
import { sendRequest } from "@/utils/api";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiThumbsUp,
  FiMessageCircle,
} from "react-icons/fi";

interface CommentSectionProps {
  videoId: string | undefined;
  onCommentClick: () => void;
  showComments: boolean;
  onCommentAdded?: () => void;
}

interface Comment {
  _id: string;
  username: string;
  avatar?: string;
  parentId: string | null;
  CommentDescription: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  videoId,
  onCommentClick,
  showComments,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const commentSectionRef = useRef<HTMLDivElement | null>(null);

  const { accessToken, user } = useContext(AuthContext) ?? {};
  const userAvatar =
    user?.avatar ||
    "https://drive.google.com/thumbnail?id=1K8L721DKwYnSHIzyG7-OSgeLhNR_V---"; // Avatar tạm thời

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/video/${videoId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.statusCode === 200) {
          setComments(
            res.data.map((comment: Comment) => ({
              ...comment,
              avatar:
                // comment.avatar ||
                "https://drive.google.com/thumbnail?id=1K8L721DKwYnSHIzyG7-OSgeLhNR_V---",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/create`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { videoId, CommentDescription: newComment },
      });
      if (res.statusCode === 201) {
        setComments([
          ...comments,
          {
            _id: res.data._id,
            username: user.name,
            avatar: userAvatar,
            parentId: null,
            CommentDescription: res.data.CommentDescription,
          },
        ]);
        setNewComment("");
        onCommentAdded?.();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    showComments && (
      <div
        ref={commentSectionRef}
        className="w-[25%] bg-white shadow-lg absolute right-0 top-[95px] pt-10 pl-2 h-[87%] flex flex-col justify-between"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Comments</h3>
          <button onClick={onCommentClick} className="text-sm text-blue-500">
            Hide
          </button>
        </div>

        <div className="comments-list p-4 overflow-y-auto flex-1">
          {loading ? (
            <p>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="comment flex gap-3 p-3 mb-3 bg-gray-100 rounded-lg relative group hover:bg-gray-200 transition-all"
              >
                <img
                  src={comment.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{comment.username}</p>
                  <p>{comment.CommentDescription}</p>
                  <div className="flex justify-between mt-2 space-x-28 transition-all opacity-0 group-hover:opacity-100">
                    <div className="flex">
                      <button className="text-blue-500 flex items-center ">
                        <FiThumbsUp /> Like
                      </button>
                      <button className="text-green-500 flex items-center ml-3">
                        <FiMessageCircle /> Reply
                      </button>
                    </div>
                    <button
                      className="text-gray-600 relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu((prev) =>
                          prev === comment._id ? null : comment._id
                        );
                      }}
                    >
                      <FiMoreHorizontal />
                      {activeMenu === comment._id && (
                        <div className="absolute z-10 top-full right-0 bg-white shadow-md rounded-md w-24 p-2">
                          <button className="flex items-center gap-1 w-full p-1 hover:bg-gray-200">
                            <FiEdit /> Edit
                          </button>
                          <button className="flex items-center gap-1 w-full p-1 hover:bg-red-200">
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        <div className="comment-input w-full flex items-center gap-3 p-3 border-t bg-white">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePostComment();
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="Write a comment..."
            rows={1}
          />
          <button
            onClick={handlePostComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </div>
      </div>
    )
  );
};

export default CommentSection;
