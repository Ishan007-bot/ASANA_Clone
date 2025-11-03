import { useMemo } from 'react';
import { useTasks } from '../context/useTasks';
import { LoadingSpinner } from './LoadingSpinner';
import type { Task } from '../types/Task';
import type { TaskFilters } from './FilterBar';
import TaskRow from './TaskRow';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskListProps {
  projectId?: string;
  showCompleted?: boolean;
  filters?: TaskFilters;
  onTaskClick?: (task: Task) => void;
}

function TaskList({ projectId, showCompleted = true, filters, onTaskClick }: TaskListProps) {
  const { tasks, getTasksByProject, loading } = useTasks();
  
  const displayTasks = useMemo(() => {
    let filtered = projectId ? getTasksByProject(projectId) : tasks;
    
    // Apply filters
    if (filters) {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter((task) =>
          task.name.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
        );
      }

      // Assignee filter
      if (filters.assignee) {
        filtered = filtered.filter((task) => task.assignee === filters.assignee);
      }

      // Priority filter
      if (filters.priority) {
        filtered = filtered.filter((task) => task.priority === filters.priority);
      }

      // Completed filter
      if (filters.completed !== null && filters.completed !== undefined) {
        filtered = filtered.filter((task) => task.completed === filters.completed);
      } else if (!showCompleted) {
        filtered = filtered.filter((task) => !task.completed);
      }

      // Due date filters
      if (filters.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filters.dueDate.overdue) {
          filtered = filtered.filter((task) => {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            return due < today && !task.completed;
          });
        }

        if (filters.dueDate.start) {
          const start = new Date(filters.dueDate.start);
          start.setHours(0, 0, 0, 0);
          filtered = filtered.filter((task) => {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            return due >= start;
          });
        }

        if (filters.dueDate.end) {
          const end = new Date(filters.dueDate.end);
          end.setHours(23, 59, 59, 999);
          filtered = filtered.filter((task) => {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            return due <= end;
          });
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter((task) =>
          task.tags && filters.tags!.some((tag) => task.tags!.includes(tag))
        );
      }
    } else if (!showCompleted) {
      filtered = filtered.filter((task) => !task.completed);
    }

    return filtered;
  }, [tasks, projectId, getTasksByProject, showCompleted, filters]);

  // Group tasks by section (if needed in future)
  const groupedTasks = useMemo(() => {
    return displayTasks.reduce((acc, task) => {
      const section = task.sectionId || 'none';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [displayTasks]);

  if (loading) {
    return (
      <div style={{ padding: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="PotListPage MyTasksPage-listInner" style={{ backgroundColor: '#1E1F21' }}>
      <div className="PageToolbarStructure--withoutTopBorder PageToolbarStructure--withoutBottomBorder PageToolbarStructure PageToolbarStructure--large" style={{ backgroundColor: '#1E1F21' }}>
        <div className="PageToolbarStructure-leftChildren">
          <div></div>
        </div>
        <div className="PageToolbarStructure-rightChildren">
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="SpreadsheetGridScroller-container" role="treegrid" style={{ backgroundColor: '#1E1F21' }}>
        <div className="SpreadsheetHeaderStructure ProjectDirectoryTableHeader" role="row" style={{ backgroundColor: '#1E1F21' }}>
          <div className="SpreadsheetHeaderStructure-left" style={{ width: '376px', position: 'absolute', backgroundColor: '#1E1F21' }}>
            <div className="SpreadsheetHeaderLeftStructure ProjectDirectoryTableHeader-leftColumnHeader" style={{ backgroundColor: '#1E1F21' }}>
              <div className="SpreadsheetHeaderColumn SpreadsheetHeaderLeftStructure-headerColumn" role="columnheader" tabIndex={0} style={{ backgroundColor: '#1E1F21' }}>
                <div className="SpreadsheetHeaderColumn-heading">
                  <span className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--overflowTruncate TypographyPresentation--small SpreadsheetHeaderColumn-columnName HighlightSol HighlightSol--buildingBlock">
                    Task
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical SpreadsheetGridScroller-verticalScroller" data-testid="VerticalScroller" role="presentation" tabIndex={-1} style={{ backgroundColor: '#1E1F21' }}>
          <div className="Scrollable Scrollable--horizontal SpreadsheetGridScroller-horizontalScroller" role="presentation" tabIndex={-1} style={{ backgroundColor: '#1E1F21' }}>
            {displayTasks.length === 0 ? (
              <div className="SpreadsheetPotGridBodyPlaceholder SpreadsheetPotGridBodyPlaceholder--hasSubtaskToggle" style={{ padding: '48px', textAlign: 'center', backgroundColor: '#1E1F21' }}>
                <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock" style={{ color: 'rgb(245, 244, 243)' }}>
                  No tasks yet. Create one to get started!
                </div>
              </div>
            ) : (
              <div className="SpreadsheetPotGridBody" style={{ width: '100%', backgroundColor: '#1E1F21' }}>
                {Object.entries(groupedTasks).map(([sectionId, sectionTasks]) => (
                  <div key={sectionId} style={{ width: '100%' }}>
                    {sectionTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;

