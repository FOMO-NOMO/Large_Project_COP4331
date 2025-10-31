// Types: Data Models
// Purpose: TypeScript interfaces matching database schema

export interface User {
  id: string;
  email: string;
  displayName: string;
  profilePhotoUrl?: string;
  bio?: string;
  major?: string;
  classYear?: number;
  interests: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  tags: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  ucfGroupUrl?: string;
}

// need to add to database? possible implementation of messages
export interface Message {
  id: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  author?: User;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author?: User;
  title: string;
  description: string;
  tags: string[];
  capacity?: number;
  likeCount: number;
  comments: Comment[]; // Embedded comments array
  createdAt: string;
  // User interaction status
  userHasLiked?: boolean;
  userRSVPStatus?: 'going' | 'interested' | 'cancelled' | null;
}

export interface RSVP {
  id: string;
  postId: string;
  userId: string;
  status: 'going' | 'interested' | 'cancelled';
  createdAt: string;
}

// API Request/Response types
export interface CreatePostRequest {
  userId: number;
  title: string;
  description: string;
  tags: string[];
  capacity?: number;
}

export interface CreateCommentRequest {
  text: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  major?: string;
  classYear?: number;
  interests?: string[];
}

export interface SurveyData {
  interests: string[];
  major: string;
  classYear: number;
}

export interface SurveySubmissionRequest {
  userId: string;
  interests: string[];
  major: string;
  classYear: number;
}

export interface SurveyResponse {
  message: string;
  error: string;
}
