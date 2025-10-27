// Component: Post Card
// Purpose: Individual post display component, contained by FeedList
import React from "react";
import type { Post } from "../../types";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRSVP?: (postId: string, status: 'going' | 'interested') => void;
  onCancelRSVP?: (postId: string) => void;
}

export default function PostCard(props: PostCardProps) {
  // TODO: implement post card functionality
  // Display: title, description, author, likeCount, commentCount
  // Actions: like, comment, RSVP (i'm going)
  return <></>;
}
