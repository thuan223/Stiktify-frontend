"use client";
import React, { useState } from "react";
import { FiEdit, FiTrash2, FiThumbsUp, FiMessageCircle } from "react-icons/fi";
import ReplyCommentModal from "./reply-comment-modal";

interface CommentProps {
  comment: {
    _id: string;
    username: string;
    avatar?: string;
    parentId: string | null;
    CommentDescription: string;
    totalOfChildComments: number;
    user?: any;
  };
  user: any;
  userAvatar: string;
  toggleChildComments: (parentId: string) => void;
  expandedComments: Set<string>;
  childComments: Map<string, any[]>;
  videoId: string | undefined;
  setChildComments: any;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  user,
  userAvatar,
  toggleChildComments,
  expandedComments,
  childComments,
  videoId,
  setChildComments,
}) => {
  const [isReplyModalOpen, setReplyModalOpen] = useState(false);
  const handleNewReply = (newReply: any) => {
    setChildComments((prev: Map<string, any[]>) => {
      const updatedMap = new Map(prev);
      const existingReplies: any[] = updatedMap.get(comment._id) || [];
      updatedMap.set(comment._id, [...existingReplies, newReply]);

      // Tự động mở comment con nếu chưa mở
      if (!expandedComments.has(comment._id)) {
        toggleChildComments(comment._id);
      }

      return updatedMap;
    });
  };

  const handleReplyClick = () => {
    setReplyModalOpen((prev) => !prev);
    if (!expandedComments.has(comment._id)) {
      toggleChildComments(comment._id);
    }
  };

  return (
    <div key={comment._id} className="mb-4">
      <div className="comment flex gap-3 p-3 bg-gray-100 rounded-lg group hover:bg-gray-200 transition-all">
        <img
          src={comment.avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{comment.username}</p>
          <p>{comment.CommentDescription}</p>
          {comment?.user?._id === user._id ? (
            <div className="flex justify-end w-full opacity-0 group-hover:opacity-100">
              <button className="flex  p-1 hover:bg-gray-200">
                <FiEdit />
              </button>
              <button className="flex p-1 hover:bg-red-200">
                <FiTrash2 />
              </button>
            </div>
          ) : (
            <div className="flex justify-start opacity-0 group-hover:opacity-100">
              <button className="text-blue-500 flex items-center">
                <FiThumbsUp />
              </button>

              <button
                className="text-green-500 flex items-center ml-3"
                onClick={handleReplyClick}
              >
                <FiMessageCircle />
              </button>
            </div>
          )}
          {isReplyModalOpen && (
            <ReplyCommentModal
              onCancel={() => setReplyModalOpen(false)}
              parentId={comment._id}
              userId={user._id}
              videoId={videoId}
              userAvatar={userAvatar}
              onReplySuccess={handleNewReply} // Cập nhật UI
            />
          )}
          {comment.totalOfChildComments > 0 && (
            <button
              className="text-sm text-gray-500 mt-2 hover:underline"
              onClick={() => toggleChildComments(comment._id)}
            >
              {expandedComments.has(comment._id)
                ? "Hide replies"
                : `View ${comment.totalOfChildComments} replies`}
            </button>
          )}
        </div>
      </div>
      {expandedComments.has(comment._id) &&
        childComments.get(comment._id)?.map((child) => (
          <div key={child._id} className="ml-10">
            <div className="comment flex gap-3 p-3 bg-gray-100 rounded-lg group hover:bg-gray-200 transition-all">
              <img
                src={child.avatar || userAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{child.username}</p>
                <p>{child.CommentDescription}</p>
                <div className="flex justify-between mt-2 space-x-10 opacity-0 group-hover:opacity-100">
                  {comment.username !== user.username ? (
                    <div className="flex">
                      <button className="text-blue-500 flex items-center">
                        <FiThumbsUp />
                      </button>
                      <button className="text-green-500 flex items-center ml-3">
                        <FiMessageCircle />
                      </button>
                    </div>
                  ) : (
                    <div className="flex">
                      <button className="flex items-center gap-1 w-full p-1 hover:bg-gray-200">
                        <FiEdit />
                      </button>
                      <button className="flex items-center gap-1 w-full p-1 hover:bg-red-200">
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Comment;
