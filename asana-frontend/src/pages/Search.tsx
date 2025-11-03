import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import TaskDetail from '../components/TaskDetail';
import type { Task } from '../types/Task';
import type { TaskFilters } from '../components/FilterBar';
import { useTasks } from '../context/useTasks';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { tasks } = useTasks();
  const navigate = useNavigate();

  // Parse advanced search syntax (assignee:, project:, tag:)
  const parseAdvancedSearch = (query: string): TaskFilters => {
    const filters: TaskFilters = {};
    const remainingParts: string[] = [];

    // Match assignee:username pattern
    const assigneeMatch = query.match(/assignee:(\S+)/i);
    if (assigneeMatch) {
      filters.assignee = assigneeMatch[1];
      query = query.replace(/assignee:\S+/gi, '').trim();
    }

    // Match project:id pattern
    const projectMatch = query.match(/project:(\S+)/i);
    if (projectMatch) {
      filters.projectId = projectMatch[1];
      query = query.replace(/project:\S+/gi, '').trim();
    }

    // Match tag:tagname pattern
    const tagMatches = query.match(/tag:(\S+)/gi);
    if (tagMatches) {
      filters.tags = tagMatches.map((match) => match.replace(/tag:/i, ''));
      query = query.replace(/tag:\S+/gi, '').trim();
    }

    // Match priority:high|medium|low pattern
    const priorityMatch = query.match(/priority:(high|medium|low)/i);
    if (priorityMatch) {
      filters.priority = priorityMatch[1] as Task['priority'];
      query = query.replace(/priority:(high|medium|low)/gi, '').trim();
    }

    // Match completed:true|false pattern
    const completedMatch = query.match(/completed:(true|false)/i);
    if (completedMatch) {
      filters.completed = completedMatch[1] === 'true';
      query = query.replace(/completed:(true|false)/gi, '').trim();
    }

    // Remaining text is the search term
    if (query) {
      filters.search = query;
    }

    return filters;
  };

  const filters = useMemo(() => {
    return parseAdvancedSearch(searchQuery);
  }, [searchQuery]);

  // Get all matching tasks
  const searchResults = useMemo(() => {
    let results = tasks;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter((task) =>
        task.name.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply assignee filter
    if (filters.assignee) {
      results = results.filter((task) => task.assignee === filters.assignee);
    }

    // Apply project filter
    if (filters.projectId) {
      results = results.filter((task) => task.projectId === filters.projectId);
    }

    // Apply priority filter
    if (filters.priority) {
      results = results.filter((task) => task.priority === filters.priority);
    }

    // Apply completed filter
    if (filters.completed !== null && filters.completed !== undefined) {
      results = results.filter((task) => task.completed === filters.completed);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((task) =>
        task.tags && filters.tags!.some((tag) => task.tags!.includes(tag))
      );
    }

    return results;
  }, [tasks, filters]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    // Navigate to project if task has projectId
    if (task.projectId) {
      // Optionally navigate, or just show detail
    }
  };

  return (
    <Layout>
      <div className="SearchPageContent">
        <div className="PageHeader PageHeader--border HighlightSol HighlightSol--core PageHeaderThemeablePresentation HighlightSol--buildingBlock Stack Stack--direction-column Stack--display-block Stack--justify-center">
          <h1 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--h4 TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock" style={{ color: 'rgb(245, 244, 243)' }}>
            Search
          </h1>
        </div>

        {/* Search Input */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search tasks, projects... (e.g., 'design assignee:IG tag:review')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Search is handled automatically via filters
                }
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#2A2B2D',
                color: 'rgb(245, 244, 243)',
                fontSize: '16px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#2A2B2D',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Help */}
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280' }}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>Advanced search:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <span><code style={{ backgroundColor: '#252628', padding: '2px 6px', borderRadius: '4px' }}>assignee:username</code> - Filter by assignee</span>
              <span><code style={{ backgroundColor: '#252628', padding: '2px 6px', borderRadius: '4px' }}>project:id</code> - Filter by project</span>
              <span><code style={{ backgroundColor: '#252628', padding: '2px 6px', borderRadius: '4px' }}>tag:tagname</code> - Filter by tag</span>
              <span><code style={{ backgroundColor: '#252628', padding: '2px 6px', borderRadius: '4px' }}>priority:high</code> - Filter by priority</span>
              <span><code style={{ backgroundColor: '#252628', padding: '2px 6px', borderRadius: '4px' }}>completed:true</code> - Filter by completion</span>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ padding: '0 24px', marginBottom: '16px' }}>
            <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--medium HighlightSol HighlightSol--buildingBlock">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          </div>

          {searchQuery ? (
            <div className="FullWidthPageStructureWithDetailsOverlay">
              <div
                className="FullWidthPageStructureWithDetailsOverlay-fullWidth"
                style={{
                  width: selectedTask ? '60%' : '100%',
                  transition: 'width 0.3s ease',
                }}
              >
                <div className="FullWidthPageStructureWithDetailsOverlay-mainContent">
                  {searchResults.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                      <div className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--large HighlightSol HighlightSol--buildingBlock">
                        No results found
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                        Try adjusting your search query or filters
                      </div>
                    </div>
                  ) : (
                    <TaskList
                      filters={{ ...filters, search: filters.search }}
                      onTaskClick={handleTaskClick}
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
          ) : (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--large HighlightSol HighlightSol--buildingBlock">
                Search across all your tasks, projects, and conversations
              </p>
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
                Enter a search query above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Search;
