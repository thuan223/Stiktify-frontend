import React, { useState, useEffect, useRef } from "react";
import { sendRequest } from "@/utils/api";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface CommentSectionProps {
  videoId: string | undefined;
  onCommentClick: () => void;
  showComments: boolean;
  onCommentAdded?: () => void;
}

interface Comment {
  _id: string;
  username: string;
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
  // const [showComments, setShowComments] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const commentSectionRef = useRef<HTMLDivElement | null>(null);

  const { accessToken, user } = useContext(AuthContext) ?? {};

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/video/${videoId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.statusCode === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentSectionRef.current &&
        !commentSectionRef.current.contains(event.target as Node)
      ) {
        onCommentClick();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [videoId]);

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          videoId,
          CommentDescription: newComment,
        },
      });

      if (res.statusCode === 201) {
        const newCommentData: Comment = {
          _id: res.data._id,
          username: user.name,
          parentId: null,
          CommentDescription: res.data.CommentDescription,
        };

        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment("");

        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <>
      {showComments && (
        <>
          <div
            ref={commentSectionRef}
            className="comment-section fixed bottom-0 left-0 w-full h-3/4 bg-gray-100 z-10 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4">
              <h3 className="text-xl font-semibold">Comments</h3>
              <button
                onClick={onCommentClick}
                className="text-sm text-blue-500"
              >
                Hide Comments
              </button>
            </div>

            <div
              className="comments-list p-4 mb-80"
              style={{ marginBottom: 80 }}
            >
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="comment p-3 mb-3 bg-white rounded-lg shadow-md"
                  >
                    <p className="font-medium">{comment.username}</p>
                    <p>{comment.CommentDescription}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            <div className="comment-input z-10 fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex items-center">
              <textarea
                value={newComment}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Add a comment..."
              />
              <button
                onClick={handlePostComment}
                className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
              >
                Post
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CommentSection;
