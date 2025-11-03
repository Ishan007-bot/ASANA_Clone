export interface Comment {
  id: string;
  taskId: string;
  parentCommentId?: string;
  userId: string;
  userName?: string;
  userInitials?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
  reactions?: Reaction[];
  replyCount?: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  users?: string[];
}



