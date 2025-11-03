import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  projectId?: string;
  onTaskClick?: (task: Task) => void;
}

function CalendarView({ projectId, onTaskClick }: CalendarViewProps) {
  const { tasks, getTasksByProject } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'year' | 'decade'>('month');

  // Get tasks for this project
  const projectTasks = useMemo(() => {
    return projectId ? getTasksByProject(projectId) : tasks;
  }, [tasks, projectId, getTasksByProject]);

  // Group tasks by due date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    projectTasks.forEach((task) => {
      if (task.dueDate) {
        const dateKey = task.dueDate;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [projectTasks]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  }, [selectedDate, tasksByDate]);

  // Custom tile content to show task count
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dateTasks = tasksByDate[dateKey] || [];
      const incompleteCount = dateTasks.filter((t) => !t.completed).length;
      const completedCount = dateTasks.filter((t) => t.completed).length;

      if (dateTasks.length === 0) return null;

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '4px',
          gap: '2px',
        }}>
          {incompleteCount > 0 && (
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }} />
          )}
          {completedCount > 0 && (
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }} />
          )}
        </div>
      );
    }
    return null;
  };

  // Highlight dates with tasks
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dateTasks = tasksByDate[dateKey] || [];
      if (dateTasks.length > 0) {
        const hasOverdue = dateTasks.some(
          (t) => !t.completed && parseISO(t.dueDate!) < new Date() && !isSameDay(parseISO(t.dueDate!), new Date())
        );
        if (hasOverdue) {
          return 'has-overdue-tasks';
        }
        return 'has-tasks';
      }
    }
    return '';
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#f87171';
      case 'medium':
        return '#fbbf24';
      case 'low':
        return '#34d399';
      default:
        return '#4573d2';
    }
  };

  return (
    <div className="CalendarView" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px',
      gap: '24px',
    }}>
      {/* Calendar */}
      <div style={{
        backgroundColor: '#2A2B2D',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-primary)',
      }}>
        <style>{`
          .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
            background-color: #2A2B2D;
            color: rgb(245, 244, 243);
          }
          .react-calendar__tile {
            padding: 8px;
            height: 60px;
            position: relative;
            color: #374151;
          }
          .react-calendar__tile--now {
            background-color: #eff6ff;
          }
          .react-calendar__tile--active {
            background-color: #4573d2;
            color: white;
          }
          .react-calendar__tile.has-tasks {
            background-color: #f0f9ff;
          }
          .react-calendar__tile.has-overdue-tasks {
            background-color: #fef2f2;
          }
          .react-calendar__tile.has-overdue-tasks:hover {
            background-color: #fee2e2;
          }
          .react-calendar__tile.has-tasks:hover {
            background-color: #e0f2fe;
          }
          .react-calendar__navigation {
            margin-bottom: 16px;
          }
          .react-calendar__navigation button {
            font-size: 16px;
            font-weight: 500;
            color: #374151;
          }
          .react-calendar__month-view__weekdays {
            font-weight: 600;
            font-size: 13px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
        `}</style>
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
            } else if (Array.isArray(value) && value[0] instanceof Date) {
              setSelectedDate(value[0]);
            }
          }}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          view={view}
          onViewChange={(newView) => setView((newView as unknown as string) as 'month' | 'year' | 'decade')}
        />
      </div>

      {/* Selected Date Tasks */}
      <div style={{
        flex: 1,
        backgroundColor: '#2A2B2D',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
      }}>
        <div style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'rgb(245, 244, 243)',
            margin: 0,
          }}>
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
          }}>
            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>

        {selectedDateTasks.length === 0 ? (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: '#6b7280',
          }}>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No tasks for this date</div>
            <div style={{ fontSize: '14px' }}>Tasks with due dates will appear here</div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  backgroundColor: task.completed ? '#252628' : '#2A2B2D',
                  transition: 'all 0.2s ease',
                  opacity: task.completed ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4573d2';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(69, 115, 210, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  {/* Priority Indicator */}
                  <div style={{
                    width: '4px',
                    height: '100%',
                    minHeight: '40px',
                    backgroundColor: getPriorityColor(task.priority),
                    borderRadius: '2px',
                    flexShrink: 0,
                  }} />

                  {/* Task Content */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      {task.completed && (
                        <span style={{
                          color: '#10b981',
                          fontSize: '14px',
                        }}>✓</span>
                      )}
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 600,
                        color: task.completed ? '#9ca3af' : 'rgb(245, 244, 243)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}>
                        {task.name}
                      </h3>
                    </div>

                    {task.description && (
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: '1.5',
                      }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}>
                      {task.assignee && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          backgroundColor: '#252628',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}>
                          {task.assignee}
                        </div>
                      )}
                      {task.priority && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          textTransform: 'capitalize',
                        }}>
                          {task.priority} priority
                        </div>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          flexWrap: 'wrap',
                        }}>
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: '11px',
                                color: '#4573d2',
                                backgroundColor: '#252628',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
