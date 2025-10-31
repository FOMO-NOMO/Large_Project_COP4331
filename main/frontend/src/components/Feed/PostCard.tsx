import React from "react";
import type { Post } from "../../types";
import { AuthAPI } from "../../api/auth";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRSVP?: (postId: string, status: 'going' | 'interested') => void;
  onCancelRSVP?: (postId: string) => void;
}

export default function PostCard(props: PostCardProps) {
  const user = AuthAPI.getCurrentUser();

  const { post, onLike, onComment, onRSVP, onCancelRSVP } = props;

  return (

    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <p><strong>Author:</strong> {post.author?.name || post.authorId}</p>
      <p>
        Likes: {post.likeCount} | Comments: {post.comments.length}
      </p>

      <div className="post-actions">
        <button onClick={() => onLike?.(user?.firstName)}>
          {post.userHasLiked ? "Unlike" : "Like"} ({post.likeCount})
        </button>
        <button onClick={() => onComment?.(user?.firstName)}>Comment</button>
        <button onClick={() => onRSVP?.(user?.firstName, 'going')}>
          I'm going {post.userRSVPStatus === 'going' ? "(✓)" : ""}
        </button>
        <button onClick={() => onRSVP?.(user?.firstName, 'interested')}>
          Interested {post.userRSVPStatus === 'interested' ? "(✓)" : ""}
        </button>
        <button onClick={() => onCancelRSVP?.(user?.firstName)}>Cancel RSVP</button>
      </div>
    </div>
  );
}
