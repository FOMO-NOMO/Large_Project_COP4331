// Page: Feed
// Purpose: Main feed page displaying posts
import React, { useState, useEffect } from "react";
import FeedList from "../components/Feed/FeedList";
import CreatePostModal from "../components/CreatePostModal";
import type { Post } from "../types";
import Navbar from "../components/Nav/Navbar";

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
    <div className="page-container">
      <div className="feed-header">
        <h1 className="page-title">Feed</h1>
        <CreatePostModal />
      </div>
      <FeedList
        posts={posts}
        loading={loading}
        onLoadMore={handleLoadMore}
        onPostLike={handlePostLike}
        onPostComment={handlePostComment}
        onPostRSVP={handlePostRSVP}
      />
      <Navbar></Navbar>
    </div>
  );
}
