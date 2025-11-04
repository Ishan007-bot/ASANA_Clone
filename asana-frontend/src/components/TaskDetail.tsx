import { useState, useEffect } from 'react';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import type { Comment } from '../types/Comment';
import TaskForm from './TaskForm';
import Comments from './Comments';
import commentsApi from '../services/commentsApi';
import { useToast } from './Toast';
import LoadingSpinner from './LoadingSpinner';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskDetailProps {
  task: Task;
  onClose?: () => void;
}

function TaskDetail({ task, onClose }: TaskDetailProps) {
  const { toggleTaskCompletion, deleteTask, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const { showToast } = useToast();

  // Load comments from API
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        const fetchedComments = await commentsApi.getByTask(task.id);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error loading comments:', err);
        showToast('Failed to load comments', 'error');
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [task.id, showToast]);

  // Update current task when prop changes
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  const handleAddComment = async (content: string, parentCommentId?: string) => {
    try {
      const newComment = await commentsApi.create({
        task_id: task.id,
        parent_comment_id: parentCommentId,
        content,
      });
      setComments((prev) => [...prev, newComment]);
      showToast('Comment added', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      const updatedComment = await commentsApi.update(commentId, { content });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
      );
      showToast('Comment updated', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update comment';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentsApi.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentCommentId !== commentId));
      showToast('Comment deleted', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      showToast(errorMessage, 'error');
    }
  };

  const handleAddReaction = async (commentId: string, emoji: string) => {
    try {
      await commentsApi.toggleReaction(commentId, emoji);
      // Update local state - toggle reaction
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            const reactions = c.reactions || [];
            const existingReaction = reactions.find((r) => r.emoji === emoji);
            if (existingReaction) {
              // Remove reaction
              return {
                ...c,
                reactions: reactions.filter((r) => r.emoji !== emoji),
              };
            } else {
              // Add reaction
              return {
                ...c,
                reactions: [...reactions, { emoji, count: 1 }],
              };
            }
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      await deleteTask(task.id);
      onClose?.();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleSave = async (updatedTask: Partial<Task>) => {
    try {
      await updateTask(task.id, updatedTask);
      setCurrentTask((prev) => ({ ...prev, ...updatedTask }));
      setIsEditing(false);
      showToast('Task updated', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      showToast(errorMessage, 'error');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="TaskDetail" style={{ color: 'rgb(245, 244, 243)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>Task Details</h2>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgb(245, 244, 243)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '20px',
            }}
          >
            ×
          </button>
        )}
      </div>

      {isEditing ? (
        <TaskForm
          task={currentTask}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Task Info */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                checked={currentTask.completed}
                onChange={() => toggleTaskCompletion(currentTask.id)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 500,
                  textDecoration: currentTask.completed ? 'line-through' : 'none',
                  opacity: currentTask.completed ? 0.6 : 1,
                }}
              >
                {currentTask.name}
              </h3>
            </div>

            {currentTask.description && (
              <p style={{ margin: '16px 0', color: 'rgba(245, 244, 243, 0.8)', lineHeight: '1.6' }}>
                {currentTask.description}
              </p>
            )}

            {/* Task Metadata */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
              {currentTask.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                  <span>{formatDate(currentTask.dueDate)}</span>
                </div>
              )}

              {currentTask.assignee && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>{currentTask.assignee}</span>
                </div>
              )}

              {currentTask.priority && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor:
                        currentTask.priority === 'high'
                          ? '#ef4444'
                          : currentTask.priority === 'medium'
                          ? '#f59e0b'
                          : '#10b981',
                      color: 'white',
                    }}
                  >
                    {currentTask.priority}
                  </span>
                </div>
              )}

              {currentTask.tags && currentTask.tags.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {currentTask.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: '#2A2B2D',
                        color: 'rgb(245, 244, 243)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-primary)',
                  background: '#2A2B2D',
                  color: 'rgb(245, 244, 243)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-primary)',
                  background: showDeleteConfirm ? '#ef4444' : '#2A2B2D',
                  color: 'rgb(245, 244, 243)',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
              </button>
              {showDeleteConfirm && (
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: '#2A2B2D',
                    color: 'rgb(245, 244, 243)',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {loadingComments ? (
            <LoadingSpinner />
          ) : (
            <Comments
              taskId={task.id}
              comments={comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onAddReaction={handleAddReaction}
            />
          )}
        </>
      )}
    </div>
  );
}

export default TaskDetail;
