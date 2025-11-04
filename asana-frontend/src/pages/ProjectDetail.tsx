import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import BoardView from '../components/BoardView';
import TimelineView from '../components/TimelineView';
import TaskDetail from '../components/TaskDetail';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Task } from '../types/Task';
import type { TaskFilters } from '../components/FilterBar';
import { useTasksApi } from '../context/TaskContextApi';
import projectsApi, { type Project } from '../services/projectsApi';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

type ViewType = 'list' | 'board' | 'timeline';

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tasks, getTasksByProject, joinProjectRoom, leaveProjectRoom } = useTasksApi();

  // Load project data from API
  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await projectsApi.getById(id);
        setProject(projectData);
        
        // Join project room for real-time updates
        if (joinProjectRoom) {
          joinProjectRoom(id);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
        setError(errorMessage);
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();

    // Cleanup: leave project room when component unmounts
    return () => {
      if (id && leaveProjectRoom) {
        leaveProjectRoom(id);
      }
    };
  }, [id, joinProjectRoom, leaveProjectRoom]);

  // Extract available assignees and tags for filter options (project-specific)
  const projectTasks = useMemo(() => {
    return id ? getTasksByProject(id) : tasks;
  }, [tasks, id, getTasksByProject]);

  const availableAssignees = useMemo(() => {
    const assignees = new Set<string>();
    projectTasks.forEach((task) => {
      if (task.assignee) assignees.add(task.assignee);
    });
    return Array.from(assignees).sort();
  }, [projectTasks]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    projectTasks.forEach((task) => {
      task.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projectTasks]);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1E1F21' }}>
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div style={{ padding: '24px', backgroundColor: '#1E1F21', minHeight: '100vh', color: '#ef4444' }}>
          <h2>Error loading project</h2>
          <p>{error || 'Project not found'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ProjectDetailPage" style={{ backgroundColor: '#1E1F21', minHeight: '100vh' }}>
        <div className="PageHeader PageHeader--border HighlightSol HighlightSol--core PageHeaderThemeablePresentation PageHeaderThemeablePresentation--withActionsButtons HighlightSol--buildingBlock Stack Stack--direction-column Stack--display-block Stack--justify-center" style={{ backgroundColor: '#1E1F21' }}>
          <div className="Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-24 Stack--justify-space-between HighlightSol HighlightSol--buildingBlock">
            <div className="PageHeaderThemeablePresentation-avatarAndTitle Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-12 HighlightSol HighlightSol--buildingBlock">
              <div className="PageHeaderThemeablePresentation-titleGroup Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-4 HighlightSol HighlightSol--buildingBlock">
                <div className="PageHeaderThemeablePresentation-title">
                  <h1 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--overflowTruncate TypographyPresentation--h4 TypographyPresentation--fontWeightMedium PageHeaderNonEditableTitle HighlightSol HighlightSol--core HighlightSol--buildingBlock" tabIndex={-1} style={{ color: 'rgb(245, 244, 243)' }}>
                    {project.name}
                  </h1>
                </div>
              </div>
            </div>
            <div className="PageHeaderActionButtonsLayout HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-block">
              <div className="ButtonGroup HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-block Stack--spacing-spacing-4">
                <button
                  onClick={() => setViewType('list')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: `1px solid ${viewType === 'list' ? '#4573d2' : '#e5e7eb'}`,
                    cursor: 'pointer',
                    backgroundColor: viewType === 'list' ? '#4573d2' : '#2A2B2D',
                    color: viewType === 'list' ? 'white' : 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    fontWeight: viewType === 'list' ? 500 : 400,
                    height: '36px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (viewType !== 'list') {
                      e.currentTarget.style.backgroundColor = '#252628';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewType !== 'list') {
                      e.currentTarget.style.backgroundColor = '#2A2B2D';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  List
                </button>
                <button
                  onClick={() => setViewType('board')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: `1px solid ${viewType === 'board' ? '#4573d2' : '#e5e7eb'}`,
                    cursor: 'pointer',
                    backgroundColor: viewType === 'board' ? '#4573d2' : '#2A2B2D',
                    color: viewType === 'board' ? 'white' : 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    fontWeight: viewType === 'board' ? 500 : 400,
                    height: '36px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (viewType !== 'board') {
                      e.currentTarget.style.backgroundColor = '#252628';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewType !== 'board') {
                      e.currentTarget.style.backgroundColor = '#2A2B2D';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  Board
                </button>
                <button
                  onClick={() => setViewType('timeline')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: `1px solid ${viewType === 'timeline' ? '#4573d2' : '#e5e7eb'}`,
                    cursor: 'pointer',
                    backgroundColor: viewType === 'timeline' ? '#4573d2' : '#2A2B2D',
                    color: viewType === 'timeline' ? 'white' : 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    fontWeight: viewType === 'timeline' ? 500 : 400,
                    height: '36px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (viewType !== 'timeline') {
                      e.currentTarget.style.backgroundColor = '#252628';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewType !== 'timeline') {
                      e.currentTarget.style.backgroundColor = '#2A2B2D';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  Timeline
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ProjectDetailContent" style={{ marginTop: '24px', backgroundColor: '#1E1F21', padding: '0 24px 24px 24px' }}>
          {viewType === 'list' && (
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              availableAssignees={availableAssignees}
              availableTags={availableTags}
            />
          )}
          <div className="FullWidthPageStructureWithDetailsOverlay" style={{ backgroundColor: '#1E1F21' }}>
            <div
              className="FullWidthPageStructureWithDetailsOverlay-fullWidth"
              style={{
                width: selectedTask ? '60%' : '100%',
                transition: 'width 0.3s ease',
                backgroundColor: '#1E1F21',
              }}
            >
              <div className="FullWidthPageStructureWithDetailsOverlay-mainContent" style={{ backgroundColor: '#1E1F21' }}>
                {viewType === 'list' ? (
                  <TaskList
                    projectId={id}
                    filters={filters}
                    onTaskClick={(task) => setSelectedTask(task)}
                  />
                ) : viewType === 'board' ? (
                  <BoardView
                    projectId={id}
                    sections={project.sections}
                    onTaskClick={(task) => setSelectedTask(task)}
                  />
                ) : (
                  <TimelineView
                    projectId={id}
                    onTaskClick={(task) => setSelectedTask(task)}
                  />
                )}
              </div>
            </div>
            {selectedTask && (
              <div
                className="FullWidthPageStructureWithDetailsOverlay-detailsOverlay FullWidthPageStructureWithDetailsOverlay-detailsOverlay--fullHeightTaskPane"
                style={{
                  width: '40%',
                  borderLeft: '1px solid #e5e7eb',
                  padding: '24px',
                  backgroundColor: '#252628',
                  overflowY: 'auto',
                  animation: 'slideInRight 0.3s ease-out',
                }}
              >
                <TaskDetail
                  task={selectedTask}
                  onClose={() => setSelectedTask(null)}
                />
              </div>
            )}
            <style>{`
              @keyframes slideInRight {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProjectDetail;
