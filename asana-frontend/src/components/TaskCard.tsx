import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

function TaskCard({ task, onTaskClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#3b82f6';
      default:
        return 'transparent';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#2A2B2D',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
      }}
    >
      <div
        className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock"
        style={{
          marginBottom: task.description ? '8px' : '0',
          lineHeight: '1.4',
        }}
      >
        {task.name}
      </div>
      
      {task.description && (
        <div
          className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
          style={{
            marginBottom: '8px',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: '8px',
        }}
      >
        {task.priority && (
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getPriorityColor(task.priority),
              display: 'inline-block',
              flexShrink: 0,
            }}
            title={`Priority: ${task.priority}`}
          />
        )}
        
        {task.dueDate && (
          <span
            className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: '#252628',
              fontSize: '11px',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(task.dueDate)}
          </span>
        )}

        {task.assignee && (
          <span
            className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--xsmall AvatarPhoto--color0 HighlightSol HighlightSol--core"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#4573d2',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title={`Assigned to ${task.assignee}`}
          >
            <span
              className="AvatarPhoto-initials"
              style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}
            >
              {task.assignee.substring(0, 2).toUpperCase()}
            </span>
          </span>
        )}

        {task.tags && task.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {task.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
                style={{
                  fontSize: '10px',
                  color: '#6b7280',
                }}
              >
                #{tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span
                className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
                style={{ fontSize: '10px', color: '#6b7280' }}
              >
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;

