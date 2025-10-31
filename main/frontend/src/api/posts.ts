// API: Posts
// Purpose: Posts management API calls
import { buildPath } from '../Path.js';
import type { Post, CreatePostRequest, CreateCommentRequest } from '../types';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

export class PostsAPI {
  static async getPosts(): Promise<Post[]> {
    try {
      const response = await fetch(buildPath('api/posts'), {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      const response = await fetch(buildPath('api/posts/create'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async likePost(postId: string): Promise<void> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}/like`), {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to like post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  static async unlikePost(postId: string): Promise<void> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}/like`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to unlike post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  static async markRSVP(postId: string, status: 'going' | 'interested'): Promise<void> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}/rsvp`), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to RSVP: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking RSVP:', error);
      throw error;
    }
  }

  static async cancelRSVP(postId: string): Promise<void> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}/rsvp`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel RSVP: ${response.status}`);
      }
    } catch (error) {
      console.error('Error canceling RSVP:', error);
      throw error;
    }
  }

  static async deletePost(postId: string): Promise<void> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  static async addComment(postId: string, commentData: CreateCommentRequest): Promise<Post> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}/comments`), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.status}`);
      }

      // Returns the updated post with the new comment embedded
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  static async deleteComment(postId: string, commentId: string): Promise<Post> {
    try {
      const response = await fetch(buildPath(`api/posts/${postId}/comments/${commentId}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }

      // Returns the updated post with the comment removed
      return await response.json();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}
