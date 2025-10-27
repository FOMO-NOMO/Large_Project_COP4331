// Component: Feed List
// Purpose: List container for feed posts
import React from "react";
import type { Post } from "../../types";

interface FeedListProps {
  posts: Post[];
  loading?: boolean;
  onLoadMore?: () => void;
  onPostLike?: (postId: string) => void;
  onPostComment?: (postId: string) => void;
  onPostRSVP?: (postId: string, status: 'going' | 'interested') => void;
}

export default function FeedList(props: FeedListProps) {
  // TODO: implement feed list functionality
  // Render PostCard components for each post
  return <></>;
}
