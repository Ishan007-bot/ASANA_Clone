// Comments API Service
import { api } from './api';
import type { Comment } from '../types/Comment';

export interface CreateCommentData {
  task_id: string;
  parent_comment_id?: string;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface AddReactionData {
  emoji: string;
}

const commentsApi = {
  // Get comments for a task
  async getByTask(taskId: string): Promise<Comment[]> {
    const comments = await api.get<Comment[]>(`/comments/task/${taskId}`);
    return comments;
  },

  // Create comment
  async create(data: CreateCommentData): Promise<Comment> {
    return api.post<Comment>('/comments', data);
  },

  // Update comment
  async update(commentId: string, data: UpdateCommentData): Promise<Comment> {
    return api.put<Comment>(`/comments/${commentId}`, data);
  },

  // Delete comment
  async delete(commentId: string): Promise<void> {
    return api.delete<void>(`/comments/${commentId}`);
  },

  // Add/remove reaction
  async toggleReaction(commentId: string, emoji: string): Promise<void> {
    return api.post<void>(`/comments/${commentId}/reactions`, { emoji });
  },
};

export default commentsApi;

