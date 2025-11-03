import { useState } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import type { Comment } from '../types/Comment';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CommentsProps {
  taskId: string;
  comments: Comment[];
  currentUserId?: string;
  onAddComment: (content: string, parentCommentId?: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddReaction?: (commentId: string, emoji: string) => void;
}

function Comments({
  taskId,
  comments,
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onAddReaction,
}: CommentsProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Separate top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parentCommentId);

  return (
    <div className="Comments" style={{ marginTop: '24px' }}>
      <div className="Comments-header" style={{ marginBottom: '16px' }}>
        <h3
          className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock"
          style={{ margin: 0 }}
        >
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form for new top-level comment */}
      <CommentForm
        taskId={taskId}
        placeholder="Add a comment..."
        onSubmit={(content) => {
          onAddComment(content);
        }}
        onCancel={() => {}}
      />

      {/* Comments List */}
      <div className="Comments-list" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topLevelComments.length === 0 ? (
          <div
            className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
            style={{ padding: '24px', textAlign: 'center' }}
          >
            No comments yet. Start the conversation!
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={comments}
              currentUserId={currentUserId}
              onReply={(parentId) => setReplyingTo(parentId)}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onAddReaction={onAddReaction}
              onAddComment={onAddComment}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;



