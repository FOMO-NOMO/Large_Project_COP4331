// Component: Feed List
// Purpose: List container for feed posts
import React, { useCallback, useEffect, useState } from "react";
import type { Post } from "../../types";
import { PostsAPI } from "../../api/posts";

interface FeedListProps {
  posts: Post[];
  loading?: boolean;
  onLoadMore?: () => void;
  onPostLike?: (postId: string) => void;
  onPostComment?: (postId: string) => void;
  onPostRSVP?: (postId: string, status: 'going' | 'interested') => void;
}

export default function FeedList(props: FeedListProps) {
  const userId = localStorage?.getItem("userId");

  const [allPosts, setAllPosts] = useState<Post[]>([]);



  const getAllPosts = useCallback(async () => {
    try{
      const data = await PostsAPI.getPosts();
      setAllPosts(data.posts);
      console.log("Fetched posts:", allPosts);
    }
    catch(e){
      console.error("Error fetching posts:", e);
    }
  }, []);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts])
  // TODO: implement feed list functionality
  // Render PostCard components for each post
  return (
    <div className="feed-list">
      {allPosts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        allPosts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p><strong>Tags:</strong> {post.tags.join(", ")}</p>
            <small>Capacity: {post.capacity}</small>
          </div>
        ))
      )}
    </div>
  );
}
