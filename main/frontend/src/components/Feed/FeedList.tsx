// Component: Feed List
// Purpose: List container for feed posts
import React, { useCallback, useEffect, useState } from "react";
import type { Post } from "../../types";
import { PostsAPI } from "../../api/posts";
import PostCard from "./PostCard";
import { AuthAPI } from "../../api/auth";
import { UsersAPI } from "../../api/users";

interface FeedListProps {
  posts: Post[];
  loading?: boolean;
  onLoadMore?: () => void;
  onPostLike?: (postId: string) => void;
  onPostComment?: (postId: string) => void;
  onPostRSVP?: (postId: string, status: 'going' | 'interested') => void;
}

export default function FeedList(props: FeedListProps) {
  const user = AuthAPI.getCurrentUser();
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const test = useCallback(async () => {
    const data = await UsersAPI.getProfile(user?.id);
    console.log(data);
  }, [])

  const getAllPosts = useCallback(async () => {
    try{
      const data = await PostsAPI.getPosts();
      setAllPosts(data.posts);
      console.log("Fetched posts:", allPosts);
      console.log(data);
    }
    catch(e){
      console.error("Error fetching posts:", e);
    }
  }, []);

  useEffect(() => {
    getAllPosts();
    test();
  }, [getAllPosts])
  // TODO: implement feed list functionality
  // Render PostCard components for each post
  return (
    <div className="feed-list">
      {allPosts.map((post) => (
        <PostCard
            key={post._id}
            post={post}
            onLike={(id) => console.log("Liked post", id)}
            onComment={(id) => console.log("Comment on post", id)}
            onRSVP={(id, status) => console.log(`RSVP ${status} for post ${id}`)}
            onCancelRSVP={(id) => console.log("cancel rsvp for post", id)}
         ></PostCard>
      ))}
    </div>
  );
}
