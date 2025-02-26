"use client";

import { useContext, useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { handleCreateCommentAction } from "@/actions/music.action";

interface Comment {
  _id: string;
  username: string;
  musicId: string;
  parentId?: string;
  CommentDescription: string;
}

const CommentSection = ({
  musicId,
  onNewComment,
}: {
  musicId: string;
  onNewComment: () => void;
}) => {
  const { user, accessToken } = useContext(AuthContext) || {};
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/music/${musicId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setComments(res.data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [musicId]);

  const handleSubmit = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await handleCreateCommentAction(musicId, newComment)

      if (res) {
        setComments([
          ...comments,
          {
            _id: res._id,
            username: user.name,
            musicId,
            CommentDescription: newComment,
          },
        ]);
        setNewComment("");
        onNewComment(); // Gọi hàm callback để tăng số lượng bình luận
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="relative h-[46vh] border rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Bình luận</h3>

      {/* Danh sách bình luận có thể cuộn */}
      <div className="overflow-y-auto max-h-[30vh] space-y-3 pr-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="p-3 border rounded bg-gray-100">
              <p className="text-sm font-bold">{comment.username}</p>
              <p className="text-gray-700">{comment.CommentDescription}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có bình luận nào.</p>
        )}
      </div>

      {/* Ô nhập bình luận - cố định dưới cùng */}
      <div className="absolute w-[98%] bottom-0 left-0 right-0 bg-white border-t mx-2 p-2 flex justify-between items-center mr-8">
        <textarea
          className="w-5/6 p-2 border rounded h-10 resize-none"
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 h-10 text-white px-4 py-1 rounded w-16"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
