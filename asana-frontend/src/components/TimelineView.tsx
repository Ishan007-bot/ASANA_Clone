import { useMemo, useState, useRef } from 'react';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, differenceInDays, parseISO } from 'date-fns';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TimelineViewProps {
  projectId?: string;
  onTaskClick?: (task: Task) => void;
}

interface TimelineTask extends Task {
  startDate: Date;
  endDate: Date;
  duration: number;
  left: number;
  width: number;
  row: number;
}

const DAY_WIDTH = 40; // Width of each day column in pixels
const ROW_HEIGHT = 60; // Height of each task row
const HEADER_HEIGHT = 80;

function TimelineView({ projectId, onTaskClick }: TimelineViewProps) {
  const { tasks, getTasksByProject } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = day view, 0.5 = 2-day view, 2 = half-day view
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get tasks for this project
  const projectTasks = useMemo(() => {
    return projectId ? getTasksByProject(projectId) : tasks;
  }, [tasks, projectId, getTasksByProject]);

  // Calculate timeline range (show 8 weeks)
  const timelineStart = useMemo(() => {
    return startOfWeek(subWeeks(currentDate, 4), { weekStartsOn: 1 }); // Monday
  }, [currentDate]);

  const timelineEnd = useMemo(() => {
    return endOfWeek(addWeeks(currentDate, 4), { weekStartsOn: 1 }); // Sunday
  }, [currentDate]);

  // Process tasks for timeline display
  const timelineTasks: TimelineTask[] = useMemo(() => {
    const processed: TimelineTask[] = [];
    const rowMap = new Map<string, number>(); // Track row assignments to avoid overlaps
    
    projectTasks.forEach((task) => {
      if (!task.dueDate && !task.createdAt) return;

      // Use dueDate as end date, createdAt as start date (or dueDate - 7 days if no createdAt)
      const endDate = task.dueDate ? parseISO(task.dueDate) : parseISO(task.createdAt);
      const startDate = task.createdAt 
        ? parseISO(task.createdAt)
        : new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Default 7-day duration

      // Skip if outside timeline range
      if (endDate < timelineStart || startDate > timelineEnd) return;

      const duration = Math.max(1, differenceInDays(endDate, startDate) + 1);
      const left = differenceInDays(startDate, timelineStart) * DAY_WIDTH * zoomLevel;
      const width = duration * DAY_WIDTH * zoomLevel;

      // Find available row (avoid overlaps)
      let row = 0;
      let overlap = true;
      while (overlap) {
        overlap = processed.some((t) => {
          if (t.row !== row) return false;
          // Check if ranges overlap
          return !(endDate < t.startDate || startDate > t.endDate);
        });
        if (overlap) row++;
      }

      processed.push({
        ...task,
        startDate,
        endDate,
        duration,
        left,
        width,
        row,
      });
    });

    return processed.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [projectTasks, timelineStart, timelineEnd, zoomLevel]);

  const maxRow = useMemo(() => {
    return timelineTasks.length > 0
      ? Math.max(...timelineTasks.map((t) => t.row)) + 1
      : 1;
  }, [timelineTasks]);

  // Generate date headers
  const dateHeaders = useMemo(() => {
    const headers: { date: Date; label: string; isWeekend: boolean }[] = [];
    let current = new Date(timelineStart);
    
    while (current <= timelineEnd) {
      headers.push({
        date: new Date(current),
        label: format(current, 'EEE d'),
        isWeekend: current.getDay() === 0 || current.getDay() === 6,
      });
      current = addDays(current, 1);
    }
    
    return headers;
  }, [timelineStart, timelineEnd]);

  // Week headers
  const weekHeaders = useMemo(() => {
    const weeks: { start: Date; label: string }[] = [];
    let current = new Date(timelineStart);
    
    while (current <= timelineEnd) {
      weeks.push({
        start: new Date(current),
        label: `Week of ${format(current, 'MMM d')}`,
      });
      current = addWeeks(current, 1);
    }
    
    return weeks;
  }, [timelineStart, timelineEnd]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#f87171'; // Red
      case 'medium':
        return '#fbbf24'; // Yellow
      case 'low':
        return '#34d399'; // Green
      default:
        return '#4573d2'; // Default blue
    }
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="TimelineView" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Timeline Controls */}
      <div className="TimelineControls" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#2A2B2D',
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handlePreviousWeek}
            className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonSecondaryPresentation"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: '#2A2B2D',
            }}
          >
            ← Previous
          </button>
          <button
            onClick={handleToday}
            className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonSecondaryPresentation"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: '#2A2B2D',
            }}
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonSecondaryPresentation"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: '#2A2B2D',
            }}
          >
            Next →
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '8px' }}>Zoom:</span>
          <button
            onClick={() => setZoomLevel(0.5)}
            className={`ButtonThemeablePresentation ButtonThemeablePresentation--small ${zoomLevel === 0.5 ? 'ButtonPrimaryPresentation' : 'ButtonSecondaryPresentation'}`}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: zoomLevel === 0.5 ? '#4573d2' : '#2A2B2D',
              color: zoomLevel === 0.5 ? 'white' : '#374151',
            }}
          >
            2d
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className={`ButtonThemeablePresentation ButtonThemeablePresentation--small ${zoomLevel === 1 ? 'ButtonPrimaryPresentation' : 'ButtonSecondaryPresentation'}`}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: zoomLevel === 1 ? '#4573d2' : '#2A2B2D',
              color: zoomLevel === 1 ? 'white' : '#374151',
            }}
          >
            1d
          </button>
          <button
            onClick={() => setZoomLevel(2)}
            className={`ButtonThemeablePresentation ButtonThemeablePresentation--small ${zoomLevel === 2 ? 'ButtonPrimaryPresentation' : 'ButtonSecondaryPresentation'}`}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              backgroundColor: zoomLevel === 2 ? '#4573d2' : '#2A2B2D',
              color: zoomLevel === 2 ? 'white' : '#374151',
            }}
          >
            0.5d
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div
        ref={timelineRef}
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          backgroundColor: '#252628',
        }}
      >
        {/* Week Headers */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backgroundColor: '#2A2B2D',
            borderBottom: '2px solid #e5e7eb',
            display: 'flex',
            height: `${HEADER_HEIGHT}px`,
          }}
        >
          <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #e5e7eb', padding: '12px' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'rgb(245, 244, 243)' }}>Tasks</div>
          </div>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {weekHeaders.map((week, idx) => {
              const weekStart = differenceInDays(week.start, timelineStart);
              const weekWidth = 7 * DAY_WIDTH * zoomLevel;
              return (
                <div
                  key={idx}
                  style={{
                    width: `${weekWidth}px`,
                    flexShrink: 0,
                    borderRight: '1px solid #e5e7eb',
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#6b7280',
                  }}
                >
                  {week.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Date Headers */}
        <div
          style={{
            position: 'sticky',
            top: `${HEADER_HEIGHT}px`,
            zIndex: 20,
            backgroundColor: '#2A2B2D',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
          }}
        >
          <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #e5e7eb' }}></div>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {dateHeaders.map((header, idx) => (
              <div
                key={idx}
                style={{
                  width: `${DAY_WIDTH * zoomLevel}px`,
                  flexShrink: 0,
                  borderRight: '1px solid #e5e7eb',
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: header.isWeekend ? 400 : 500,
                  color: header.isWeekend ? '#9ca3af' : 'rgb(245, 244, 243)',
                  backgroundColor: header.isWeekend ? '#252628' : '#2A2B2D',
                }}
              >
                <div>{header.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        <div style={{ position: 'relative', minHeight: `${maxRow * ROW_HEIGHT}px` }}>
          {timelineTasks.map((task) => (
            <div
              key={task.id}
              style={{
                position: 'absolute',
                top: `${task.row * ROW_HEIGHT + 8}px`,
                left: `${200 + task.left}px`,
                width: `${Math.max(task.width, 80)}px`,
                height: `${ROW_HEIGHT - 16}px`,
                zIndex: 10,
              }}
            >
              <div
                onClick={() => onTaskClick?.(task)}
                style={{
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: task.completed ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                  opacity: task.completed ? 0.6 : 1,
                  border: task.completed ? '2px dashed white' : 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.zIndex = '15';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.zIndex = '10';
                }}
              >
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: '4px',
                }}>
                  {task.completed ? '✓ ' : ''}{task.name}
                </div>
                <div style={{ 
                  fontSize: '11px',
                  opacity: 0.9,
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}>
                  {task.assignee && (
                    <span>{task.assignee}</span>
                  )}
                  {task.dueDate && (
                    <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Row Backgrounds */}
          {Array.from({ length: maxRow }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'flex',
                height: `${ROW_HEIGHT}px`,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  width: '200px',
                  flexShrink: 0,
                  borderRight: '1px solid #e5e7eb',
                  padding: '12px',
                  backgroundColor: rowIdx % 2 === 0 ? '#2A2B2D' : '#252628',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {timelineTasks.find((t) => t.row === rowIdx) && (
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                    {timelineTasks.find((t) => t.row === rowIdx)?.name}
                  </div>
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  position: 'relative',
                  backgroundColor: rowIdx % 2 === 0 ? '#2A2B2D' : '#252628',
                }}
              >
                {dateHeaders.map((_, dayIdx) => (
                  <div
                    key={dayIdx}
                    style={{
                      width: `${DAY_WIDTH * zoomLevel}px`,
                      flexShrink: 0,
                      borderRight: '1px solid #e5e7eb',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Today Indicator */}
          {(() => {
            const today = new Date();
            if (today >= timelineStart && today <= timelineEnd) {
              const todayLeft = differenceInDays(today, timelineStart) * DAY_WIDTH * zoomLevel;
              return (
                <div
                  style={{
                    position: 'absolute',
                    left: `${200 + todayLeft}px`,
                    top: `${HEADER_HEIGHT * 2}px`,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: '#ef4444',
                    zIndex: 25,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '-6px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Today
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}

export default TimelineView;

