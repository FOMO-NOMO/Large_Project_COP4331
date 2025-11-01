// Page: Feed
// Purpose: Main feed page displaying posts
import React, { useState, useEffect } from "react";
import FeedList from "../components/Feed/FeedList";
import CreatePostModal from "../components/CreatePostModal";
import type { Post } from "../types";
import BottomNavigation from "../components/BottomNavigation";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    // TODO: Fetch posts from API
    // For now, set empty array and loading false
    setLoading(false);
  }, []);

  const handleLoadMore = () => {
    // TODO: Load more posts
  };

  const handlePostLike = (postId: string) => {
    // TODO: Handle post like
  };

  const handlePostComment = (postId: string) => {
    // TODO: Handle post comment
  };

  const handlePostRSVP = (postId: string, status: 'going' | 'interested') => {
    // TODO: Handle post RSVP
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1 className="page-title">Feed</h1>
        <CreatePostModal />
      </div>
      <div className="feed-list-container">
        <FeedList
          posts={posts}
          loading={loading}
          onLoadMore={handleLoadMore}
          onPostLike={handlePostLike}
          onPostComment={handlePostComment}
          onPostRSVP={handlePostRSVP}
        />
      </div>
      <BottomNavigation></BottomNavigation>
    </div>
  );
}
