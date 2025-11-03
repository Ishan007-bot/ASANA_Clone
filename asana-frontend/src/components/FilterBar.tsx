import { useState } from 'react';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

export interface TaskFilters {
  search?: string;
  assignee?: string;
  priority?: Task['priority'];
  completed?: boolean | null; // null = show all, true = completed only, false = incomplete only
  projectId?: string;
  dueDate?: {
    start?: string;
    end?: string;
    overdue?: boolean;
  };
  tags?: string[];
}

interface FilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  availableAssignees?: string[];
  availableTags?: string[];
}

function FilterBar({ filters, onFiltersChange, availableAssignees = [], availableTags = [] }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState<TaskFilters>(filters);

  const applyFilters = () => {
    onFiltersChange(tempFilters);
  };

  const clearFilters = () => {
    const cleared: TaskFilters = {
      search: '',
      assignee: undefined,
      priority: undefined,
      completed: null,
      dueDate: undefined,
      tags: undefined,
    };
    setTempFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = 
    filters.search ||
    filters.assignee ||
    filters.priority ||
    filters.completed !== null ||
    filters.dueDate?.start ||
    filters.dueDate?.end ||
    filters.dueDate?.overdue ||
    (filters.tags && filters.tags.length > 0);

  const isIncompleteActive = filters.completed === false;
  const isCompletedActive = filters.completed === true;
  const isOverdueActive = filters.dueDate?.overdue === true;

  return (
    <div className="FilterBar" style={{
      padding: '12px 16px',
      backgroundColor: '#2A2B2D',
      borderBottom: '1px solid var(--border-primary)',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      {/* Search Input */}
      <div style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={tempFilters.search || ''}
          onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              applyFilters();
            }
          }}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            height: '36px',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#4573d2';
            e.currentTarget.style.outline = 'none';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        />
      </div>

      {/* Quick Filters */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => {
            const newCompleted = filters.completed === false ? null : false;
            onFiltersChange({ ...filters, completed: newCompleted });
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: `1px solid ${isIncompleteActive ? '#4573d2' : '#e5e7eb'}`,
            cursor: 'pointer',
            backgroundColor: isIncompleteActive ? '#4573d2' : '#2A2B2D',
            color: isIncompleteActive ? 'white' : '#374151',
            fontSize: '13px',
            fontWeight: isIncompleteActive ? 500 : 400,
            height: '36px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!isIncompleteActive) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (!isIncompleteActive) {
              e.currentTarget.style.backgroundColor = '#2A2B2D';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          Incomplete
        </button>
        <button
          onClick={() => {
            const newCompleted = filters.completed === true ? null : true;
            onFiltersChange({ ...filters, completed: newCompleted });
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: `1px solid ${isCompletedActive ? '#4573d2' : '#e5e7eb'}`,
            cursor: 'pointer',
            backgroundColor: isCompletedActive ? '#4573d2' : '#2A2B2D',
            color: isCompletedActive ? 'white' : '#374151',
            fontSize: '13px',
            fontWeight: isCompletedActive ? 500 : 400,
            height: '36px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!isCompletedActive) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCompletedActive) {
              e.currentTarget.style.backgroundColor = '#2A2B2D';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          Completed
        </button>
        <button
          onClick={() => {
            const newOverdue = !filters.dueDate?.overdue;
            onFiltersChange({
              ...filters,
              dueDate: { ...filters.dueDate, overdue: newOverdue },
            });
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: `1px solid ${isOverdueActive ? '#ef4444' : '#e5e7eb'}`,
            cursor: 'pointer',
            backgroundColor: isOverdueActive ? '#ef4444' : '#2A2B2D',
            color: isOverdueActive ? 'white' : '#374151',
            fontSize: '13px',
            fontWeight: isOverdueActive ? 500 : 400,
            height: '36px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!isOverdueActive) {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
              e.currentTarget.style.color = '#ef4444';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOverdueActive) {
              e.currentTarget.style.backgroundColor = '#2A2B2D';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }
          }}
        >
          Overdue
        </button>
      </div>

      {/* More Filters Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          cursor: 'pointer',
          backgroundColor: isExpanded ? '#252628' : '#2A2B2D',
          color: '#374151',
          fontSize: '13px',
          fontWeight: 400,
          height: '36px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }
        }}
      >
        {isExpanded ? 'Less' : 'More'} Filters
      </button>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #fecaca',
            cursor: 'pointer',
            backgroundColor: '#2A2B2D',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 400,
            height: '36px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#f87171';
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#fecaca';
            e.currentTarget.style.color = '#ef4444';
          }}
        >
          Clear All
        </button>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          marginTop: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Assignee Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Assignee
            </label>
            <select
              value={tempFilters.assignee || ''}
              onChange={(e) => setTempFilters({ ...tempFilters, assignee: e.target.value || undefined })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
              }}
            >
              <option value="">All assignees</option>
              {availableAssignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Priority
            </label>
            <select
              value={tempFilters.priority || ''}
              onChange={(e) => setTempFilters({ ...tempFilters, priority: (e.target.value || undefined) as Task['priority'] })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
              }}
            >
              <option value="">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Due Date Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Due Date Range
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="date"
                value={tempFilters.dueDate?.start || ''}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  dueDate: { ...tempFilters.dueDate, start: e.target.value || undefined },
                })}
                placeholder="Start date"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                }}
              />
              <input
                type="date"
                value={tempFilters.dueDate?.end || ''}
                onChange={(e) => setTempFilters({
                  ...tempFilters,
                  dueDate: { ...tempFilters.dueDate, end: e.target.value || undefined },
                })}
                placeholder="End date"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Tags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableTags.map((tag) => {
                  const isSelected = tempFilters.tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const tags = tempFilters.tags || [];
                        if (isSelected) {
                          setTempFilters({ ...tempFilters, tags: tags.filter((t) => t !== tag) });
                        } else {
                          setTempFilters({ ...tempFilters, tags: [...tags, tag] });
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isSelected ? '#4573d2' : '#e5e7eb'}`,
                        backgroundColor: isSelected ? '#4573d2' : '#2A2B2D',
                        color: isSelected ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={applyFilters}
            className="ButtonThemeablePresentation ButtonThemeablePresentation--medium ButtonPrimaryPresentation"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#4573d2',
              color: 'white',
              fontWeight: 500,
            }}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterBar;

