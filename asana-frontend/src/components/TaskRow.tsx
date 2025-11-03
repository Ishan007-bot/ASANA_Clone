import { useState } from 'react';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskRowProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

function TaskRow({ task, onTaskClick }: TaskRowProps) {
  const { toggleTaskCompletion, updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };

  const handleTaskNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleNameBlur = () => {
    if (editedName.trim() && editedName !== task.name) {
      updateTask(task.id, { name: editedName.trim() });
    } else {
      setEditedName(task.name);
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setEditedName(task.name);
      setIsEditing(false);
    }
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
        return '#f87171'; // red
      case 'medium':
        return '#fbbf24'; // yellow
      case 'low':
        return '#60a5fa'; // blue
      default:
        return 'transparent';
    }
  };

  return (
    <div
      className={`SpreadsheetRow SpreadsheetRow--enabled ProjectDirectoryProjectRow ${task.completed ? 'SpreadsheetRow--completed' : ''}`}
      role="row"
      onClick={() => onTaskClick?.(task)}
      style={{ 
        cursor: 'pointer',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <div className="SpreadsheetRow-stickyCell" style={{ 
        background: 'transparent', 
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <div className="SpreadsheetPotGridBodyPlaceholder-itemRowLeft" style={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          paddingTop: '2px',
        }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="SpreadsheetPotGridBodyPlaceholder-circleCheck"
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="SpreadsheetPotGridBodyPlaceholder-taskContent" style={{ 
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              autoFocus
              className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
              style={{
                width: '100%',
                border: '1px solid #4573d2',
                borderRadius: '4px',
                padding: '4px 8px',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className={`TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--overflowTruncate TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock HighlightSol--core`}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
                cursor: 'text',
                lineHeight: '1.5',
                marginBottom: task.description ? '4px' : '0',
              }}
              onClick={handleTaskNameClick}
            >
              {task.name}
            </div>
          )}
          {task.description && (
            <div
              className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
              style={{ 
                lineHeight: '1.5',
                marginTop: '0',
                marginBottom: '8px',
                wordWrap: 'break-word',
              }}
            >
              {task.description.substring(0, 100)}
              {task.description.length > 100 ? '...' : ''}
            </div>
          )}
          {(task.dueDate || task.priority || task.assignee || (task.tags && task.tags.length > 0)) && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              flexWrap: 'wrap',
              marginTop: '4px',
            }}>
              {task.dueDate && (
                <span
                  className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#252628',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatDate(task.dueDate)}
                </span>
              )}
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
                <span
                  className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
                  style={{ 
                    marginLeft: '0',
                    wordBreak: 'break-word',
                  }}
                >
                  {task.tags.map((tag) => `#${tag}`).join(' ')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskRow;

