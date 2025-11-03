import { useState } from 'react';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import type { Comment } from '../types/Comment';
import TaskForm from './TaskForm';
import Comments from './Comments';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskDetailProps {
  task: Task;
  onClose?: () => void;
}

function TaskDetail({ task, onClose }: TaskDetailProps) {
  const { toggleTaskCompletion, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mock comments state (will be replaced with API later)
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      taskId: task.id,
      userId: 'user1',
      userName: 'IG',
      userInitials: 'IG',
      content: 'This looks great! @w3 can you review the design?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      reactions: [{ emoji: '👍', count: 2 }],
    },
    {
      id: '2',
      taskId: task.id,
      userId: 'user2',
      userName: 'w3',
      userInitials: 'W3',
      content: 'Sure, I\'ll take a look tomorrow.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      reactions: [{ emoji: '👍', count: 1 }],
    },
  ]);

  const handleAddComment = (content: string, parentCommentId?: string) => {
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      taskId: task.id,
      parentCommentId,
      userId: 'current_user',
      userName: 'You',
      userInitials: 'YO',
      content,
      createdAt: new Date().toISOString(),
      reactions: [],
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId: string, content: string) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId && c.parentCommentId !== commentId));
  };

  const handleAddReaction = (commentId: string, emoji: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const reactions = c.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...c,
            reactions: reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        }
        return {
          ...c,
          reactions: [...reactions, { emoji, count: 1 }],
        };
      }
      return c;
    }));
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteTask(task.id);
      onClose?.();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isEditing) {
    return (
      <div className="TaskPane TaskPane--editing" style={{ padding: '24px', maxWidth: '600px' }}>
        <TaskForm
          initialTask={task}
          onSubmit={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="TaskPane" style={{ padding: '24px', maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <h2
              className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--h3 TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock"
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
                flex: 1,
                color: 'rgb(245, 244, 243)',
              }}
            >
              {task.name}
            </h2>
          </div>
          
          {task.description && (
            <div
              className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock"
              style={{ marginBottom: '24px', whiteSpace: 'pre-wrap' }}
            >
              {task.description}
            </div>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="IconButtonThemeablePresentation--isEnabled IconButtonThemeablePresentation IconButtonThemeablePresentation--medium SubtleIconButton--standardTheme SubtleIconButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
            style={{ marginLeft: '16px' }}
            aria-label="Close"
          >
            <svg aria-hidden="true" className="Icon HighlightSol HighlightSol--core" focusable="false" viewBox="0 0 32 32">
              <path d="M24,10.586l-6.293-6.293a1,1,0,0,0-1.414,0L10,10.586,4.293,4.879A1,1,0,0,0,2.879,6.293L8.586,12,2.293,18.293a1,1,0,1,0,1.414,1.414L10,13.414l6.293,6.293a1,1,0,0,0,1.414,0L24,13.414l6.293,6.293a1,1,0,0,0,1.414-1.414L25.414,12l5.707-5.707a1,1,0,0,0,0-1.414Z"></path>
            </svg>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {task.dueDate && (
          <div>
            <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock" style={{ marginBottom: '4px' }}>
              Due date
            </div>
            <div className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">
              {formatDate(task.dueDate)}
            </div>
          </div>
        )}

        {task.assignee && (
          <div>
            <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock" style={{ marginBottom: '4px' }}>
              Assignee
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0 HighlightSol HighlightSol--core"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#4573d2',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="AvatarPhoto-initials" style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                  {task.assignee.substring(0, 2).toUpperCase()}
                </span>
              </span>
              <span className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">
                {task.assignee}
              </span>
            </div>
          </div>
        )}

        {task.priority && (
          <div>
            <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock" style={{ marginBottom: '4px' }}>
              Priority
            </div>
            <div className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock" style={{ textTransform: 'capitalize' }}>
              {task.priority}
            </div>
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div>
            <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock" style={{ marginBottom: '4px' }}>
              Tags
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="PillThemeablePresentation PillThemeablePresentation--small PillPresentation PillPresentation--colorNone HighlightSol HighlightSol--core HighlightSol--buildingBlock"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#252628',
                    fontSize: '12px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <div
          className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large ButtonSecondaryPresentation ButtonSecondaryPresentation--sentimentDefault SecondaryButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
          role="button"
          tabIndex={0}
          onClick={() => setIsEditing(true)}
        >
          Edit
        </div>
        <div
          className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large ButtonSecondaryPresentation ButtonSecondaryPresentation--sentimentDefault SecondaryButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
          role="button"
          tabIndex={0}
          onClick={handleDelete}
          style={{ color: showDeleteConfirm ? '#dc2626' : 'inherit' }}
        >
          {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
        </div>
      </div>

      {/* Comments Section */}
      <Comments
        taskId={task.id}
        comments={comments}
        currentUserId="current_user"
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onAddReaction={handleAddReaction}
      />
    </div>
  );
}

export default TaskDetail;

