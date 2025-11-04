import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTasks } from '../context/useTasks';
import tasksApi from '../services/tasksApi';
import projectsApi from '../services/projectsApi';
import type { Task } from '../types/Task';
import type { Project } from '../services/projectsApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setTasks([]);
      setProjects([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        // Search tasks
        const taskResults = await tasksApi.getAll({
          search: searchQuery,
          limit: 50,
        });
        setTasks(taskResults);

        // Search projects
        const projectResults = await projectsApi.getAll({
          search: searchQuery,
          limit: 20,
        });
        setProjects(projectResults);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search';
        setError(errorMessage);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleTaskClick = (task: Task) => {
    if (task.projectId) {
      navigate(`/projects/${task.projectId}`);
    }
  };

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Layout>
      <div style={{ backgroundColor: '#1E1F21', minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: 'rgb(245, 244, 243)', fontSize: '24px', fontWeight: 500, marginBottom: '24px' }}>
            Search
          </h1>

          {/* Search Input */}
          <div style={{ marginBottom: '32px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, projects... (e.g., 'design assignee:IG tag:review')"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-primary)',
                background: '#2A2B2D',
                color: 'rgb(245, 244, 243)',
                fontSize: '16px',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '6px',
            }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <LoadingSpinner />
            </div>
          )}

          {!loading && searchQuery.trim() && (
            <>
              {/* Tasks Results */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: 'rgb(245, 244, 243)', fontSize: '18px', fontWeight: 500, marginBottom: '16px' }}>
                  Tasks ({tasks.length})
                </h2>
                {tasks.length === 0 ? (
                  <div style={{ color: 'rgba(245, 244, 243, 0.6)', padding: '24px', textAlign: 'center' }}>
                    No tasks found
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-primary)',
                          background: '#2A2B2D',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#252628';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#2A2B2D';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            readOnly
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: task.completed ? 'rgba(245, 244, 243, 0.5)' : 'rgb(245, 244, 243)',
                              fontSize: '14px',
                              textDecoration: task.completed ? 'line-through' : 'none',
                            }}>
                              {task.name}
                            </div>
                            {task.description && (
                              <div style={{
                                color: 'rgba(245, 244, 243, 0.6)',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}>
                                {task.description.substring(0, 100)}
                                {task.description.length > 100 ? '...' : ''}
                              </div>
                            )}
                          </div>
                          {task.assignee && (
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: '#252628',
                              color: 'rgb(245, 244, 243)',
                              fontSize: '12px',
                            }}>
                              {task.assignee}
                            </div>
                          )}
                          {task.projectId && (
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: '#4573d2',
                              color: 'white',
                              fontSize: '12px',
                            }}>
                              Project
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Results */}
              <div>
                <h2 style={{ color: 'rgb(245, 244, 243)', fontSize: '18px', fontWeight: 500, marginBottom: '16px' }}>
                  Projects ({projects.length})
                </h2>
                {projects.length === 0 ? (
                  <div style={{ color: 'rgba(245, 244, 243, 0.6)', padding: '24px', textAlign: 'center' }}>
                    No projects found
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        style={{
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-primary)',
                          background: '#2A2B2D',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#252628';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#2A2B2D';
                        }}
                      >
                        <div style={{
                          color: 'rgb(245, 244, 243)',
                          fontSize: '16px',
                          fontWeight: 500,
                          marginBottom: '8px',
                        }}>
                          {project.name}
                        </div>
                        {project.description && (
                          <div style={{
                            color: 'rgba(245, 244, 243, 0.6)',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}>
                            {project.description.substring(0, 100)}
                            {project.description.length > 100 ? '...' : ''}
                          </div>
                        )}
                        {project.sections && (
                          <div style={{
                            color: 'rgba(245, 244, 243, 0.5)',
                            fontSize: '12px',
                          }}>
                            {project.sections.length} sections
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!searchQuery.trim() && (
            <div style={{ color: 'rgba(245, 244, 243, 0.6)', padding: '40px', textAlign: 'center' }}>
              Start typing to search for tasks and projects...
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Search;
