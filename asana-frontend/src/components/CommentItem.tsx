import { useState } from 'react';
import CommentForm from './CommentForm';
import type { Comment } from '../types/Comment';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  currentUserId?: string;
  onReply: (parentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onAddReaction?: (commentId: string, emoji: string) => void;
  onAddComment: (content: string, parentCommentId?: string) => void;
  replyingTo: string | null;
  onCancelReply: () => void;
}

function CommentItem({
  comment,
  allComments,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onAddReaction,
  onAddComment,
  replyingTo,
  onCancelReply,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // Get replies for this comment
  const replies = allComments.filter((c) => c.parentCommentId === comment.id);

  const isOwner = currentUserId === comment.userId;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() && onEdit) {
      onEdit(comment.id, editedContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const commonEmojis = ['👍', '❤️', '😄', '🎉', '👏'];

  return (
    <div className="CommentItem" style={{ display: 'flex', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
      {/* Avatar */}
      <div
        className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0 HighlightSol HighlightSol--core"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#4573d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          className="AvatarPhoto-initials"
          style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}
        >
          {comment.userInitials || (comment.userName?.substring(0, 2).toUpperCase() || 'U')}
        </span>
      </div>

      {/* Comment Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock"
            style={{ fontSize: '14px' }}
          >
            {comment.userName || 'Unknown User'}
          </span>
          <span
            className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
            style={{ fontSize: '12px' }}
          >
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {/* Comment Text */}
        {isEditing ? (
          <div style={{ marginBottom: '8px' }}>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="TextInputBase TextInput TextInput--medium HighlightSol HighlightSol--core"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1px solid #4573d2',
                borderRadius: '4px',
                resize: 'vertical',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={handleSaveEdit}
                className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonPrimaryPresentation HighlightSol HighlightSol--core"
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#4573d2',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonSecondaryPresentation HighlightSol HighlightSol--core"
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#2A2B2D',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
            style={{
              marginBottom: '8px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {comment.content.split(' ').map((word, index) => {
              if (word.startsWith('@')) {
                return (
                  <span key={index} style={{ color: '#4573d2', fontWeight: 500 }}>
                    {word}{' '}
                  </span>
                );
              }
              return <span key={index}>{word} </span>;
            })}
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            {/* Reactions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {comment.reactions && comment.reactions.length > 0 && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {comment.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => onAddReaction?.(comment.id, reaction.emoji)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#252628',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '4px' }}>
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onAddReaction?.(comment.id, emoji)}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '16px',
                      opacity: 0.6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.6';
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Button */}
            <button
              onClick={() => onReply(comment.id)}
              className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Reply
            </button>

            {/* Edit/Delete (only for owner) */}
            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(comment.id)}
                  className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#ef4444',
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div style={{ marginTop: '12px', paddingLeft: '12px', borderLeft: '2px solid #e5e7eb' }}>
            <CommentForm
              taskId={comment.taskId}
              placeholder={`Reply to ${comment.userName || 'comment'}...`}
              onSubmit={(content) => {
                onAddComment(content, comment.id);
                onCancelReply();
              }}
              onCancel={onCancelReply}
            />
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div style={{ marginTop: '12px', paddingLeft: '12px', borderLeft: '2px solid #e5e7eb' }}>
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddReaction={onAddReaction}
                onAddComment={onAddComment}
                replyingTo={replyingTo}
                onCancelReply={onCancelReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;


