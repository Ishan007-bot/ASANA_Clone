import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import type { Task } from '../types/Task';
import { useTasks } from '../context/useTasks';
import { format } from 'date-fns';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import ShareModal from '../components/ShareModal';
import CustomizeModal from '../components/CustomizeModal';
import OptionsModal from '../components/OptionsModal';
import CreateTaskModal from '../components/CreateTaskModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

type ViewType = 'list' | 'board' | 'calendar' | 'dashboard' | 'files';

interface Section {
  id: string;
  name: string;
  collapsed: boolean;
}

function MyTasks() {
  const { tasks, toggleTaskCompletion } = useTasks();
  const [viewType, setViewType] = useState<ViewType>('list');
  const [sections, setSections] = useState<Section[]>([
    { id: 'recently-assigned', name: 'Recently assigned', collapsed: false },
    { id: 'do-today', name: 'Do today', collapsed: false },
    { id: 'do-next-week', name: 'Do next week', collapsed: false },
    { id: 'do-later', name: 'Do later', collapsed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState<{ [key: string]: string }>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter tasks into sections
  const getTasksForSection = (sectionId: string): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (sectionId) {
      case 'recently-assigned':
        return tasks.filter((task) => !task.completed && task.dueDate);
      case 'do-today':
        return tasks.filter((task) => {
          if (task.completed) return false;
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      case 'do-next-week':
        return tasks.filter((task) => {
          if (task.completed) return false;
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          return dueDate > today && dueDate <= nextWeek;
        });
      case 'do-later':
        return tasks.filter((task) => {
          if (task.completed) return false;
          if (!task.dueDate) return true;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate > today;
        });
      default:
        return [];
    }
  };

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, collapsed: !section.collapsed } : section
      )
    );
  };

  const formatDueDate = (task: Task) => {
    if (!task.dueDate) return '';
    const date = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      if (diffDays === -1) return 'Yesterday';
      return format(date, 'MMM d');
    }
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 4);
      return `Today - ${format(endDate, 'MMM d')}`;
    }
    return format(date, 'MMM d');
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <Layout>
      <div className="MyTasksPageWrapper" style={{ 
        backgroundColor: '#1E1F21',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '0',
        marginRight: '0',
        boxSizing: 'border-box',
      }}>
        {/* Top Header */}
        <div style={{
          backgroundColor: '#2E2E30',
          borderBottom: '1px solid var(--border-primary)',
          padding: '12px 24px 12px 24px',
          paddingRight: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Avatar and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--avatar-pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '12px', fontWeight: 500 }}>IG</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                margin: 0,
              }}>My tasks</h1>
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)', cursor: 'pointer' }} viewBox="0 0 32 32">
                <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>

          {/* Right: Share, Customize, and Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setShowShareModal(true)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: '#252628',
                color: 'rgb(245, 244, 243)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="currentColor"></path>
              </svg>
              Share
            </button>
            <button 
              onClick={() => setShowCustomizeModal(true)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: '#252628',
                color: 'rgb(245, 244, 243)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" fill="currentColor"></path>
              </svg>
              Customize
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <button 
                onClick={() => setShowFilterModal(true)}
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="currentColor"></path>
                </svg>
              </button>
              <button 
                onClick={() => setShowSortModal(true)}
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                  <path d="M3 18h6v-2H3v2zM7 6v2h13V6H7zm-4 5h13v-2H3v2zM3 18h13v-2H3v2zm0-5h13v-2H3v2z" fill="currentColor"></path>
                </svg>
              </button>
              <button 
                onClick={() => setShowSortModal(true)}
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" fill="currentColor"></path>
                </svg>
              </button>
              <button 
                onClick={() => setShowSortModal(true)}
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor"></path>
                </svg>
              </button>
              <button 
                onClick={() => setShowOptionsModal(true)}
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 32 32">
                  <path d="M13.999 28c3.5 0 6.697-1.3 9.154-3.432l6.139 6.139a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414l-6.139-6.139A13.93 13.93 0 0 0 27.999 14c0-7.72-6.28-14-14-14s-14 6.28-14 14 6.28 14 14 14Zm0-26c6.617 0 12 5.383 12 12s-5.383 12-12 12-12-5.383-12-12 5.383-12 12-12Z" fill="currentColor"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* View Selector Tabs */}
        <div style={{
          backgroundColor: '#2E2E30',
          borderBottom: '1px solid var(--border-primary)',
          padding: '0 24px 0 24px',
          paddingRight: '0',
          display: 'flex',
          gap: '0',
        }}>
          {(['list', 'board', 'calendar', 'dashboard', 'files'] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              style={{
                padding: '12px 16px',
                border: 'none',
                borderBottom: `2px solid ${viewType === view ? 'var(--accent-primary)' : 'transparent'}`,
                background: 'transparent',
                color: viewType === view ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                fontSize: '14px',
                fontWeight: viewType === view ? 500 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
                marginBottom: '-1px',
              }}
            >
              {view === 'files' ? '+' : view}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="MyTasksContent" style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'visible',
          paddingTop: '24px',
          paddingBottom: '24px',
          paddingLeft: '24px',
          paddingRight: '0px',
          marginRight: '0px',
          marginLeft: '0px',
          background: '#1E1F21',
          width: '100%',
          maxWidth: 'none',
          boxSizing: 'border-box',
          position: 'relative',
          right: '0',
        }}>
          {/* Add Task Button */}
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                background: 'var(--accent-primary)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
              </svg>
              Add task
              <svg aria-hidden="true" className="Icon" style={{ width: '12px', height: '12px' }} viewBox="0 0 32 32">
                <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
              </svg>
            </button>
          </div>


          {/* Sections */}
          {viewType === 'list' && sections.map((section) => {
            const sectionTasks = getTasksForSection(section.id);
            return (
              <div key={section.id} style={{ marginBottom: '40px' }}>
                {/* Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-primary)',
                }}>
                  <svg
                    onClick={() => toggleSection(section.id)}
                    aria-hidden="true"
                    className="Icon"
                    style={{
                      width: '12px',
                      height: '12px',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      transform: section.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                    viewBox="0 0 32 32"
                  >
                    <path d="M12.375 24.75a1.5 1.5 0 0 0 2.121 0l7.25-7.25a1.5 1.5 0 0 0 0-2.121l-7.25-7.25a1.5 1.5 0 0 0-2.121 2.121L18.254 16l-5.879 5.879a1.5 1.5 0 0 0 0 2.871Z" fill="currentColor"></path>
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="Icon"
                    style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)', cursor: 'grab' }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
                  </svg>
                  <h3 style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)',
                    margin: 0,
                    flex: 1,
                  }}>{section.name}</h3>
                </div>

                {/* Section Tasks Table */}
                {!section.collapsed && (
                  <div>
                    {/* Table Header Row - Only for "Recently assigned" section */}
                    {section.id === 'recently-assigned' && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                        gap: '16px',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-primary)',
                        marginBottom: '8px',
                      }}>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>Name</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>Due date</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>Collaborators</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>Projects</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 500 }}>Task visibility</div>
                      </div>
                    )}
                    
                    {/* Task Rows */}
                    {sectionTasks.length > 0 ? (
                      <div>
                        {sectionTasks.map((task) => (
                          <div
                            key={task.id}
                            style={{
                              display: section.id === 'recently-assigned' ? 'grid' : 'block',
                              gridTemplateColumns: section.id === 'recently-assigned' ? '2fr 1fr 1fr 1fr 1fr' : 'none',
                              gap: section.id === 'recently-assigned' ? '16px' : '0',
                              padding: '12px 0',
                              borderBottom: '1px solid var(--border-primary)',
                              alignItems: 'center',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {section.id === 'recently-assigned' ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                  />
                                  <span style={{
                                    color: task.completed ? 'var(--text-disabled)' : 'rgb(245, 244, 243)',
                                    fontSize: '14px',
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                  }}>{task.name}</span>
                                </div>
                                <div style={{ color: isOverdue(task) ? '#ef4444' : 'var(--text-tertiary)', fontSize: '13px' }}>
                                  {formatDueDate(task)}
                                </div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>-</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {task.projectId && (
                                    <div style={{
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      background: 'var(--accent-success)',
                                      color: 'white',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                    }}>NA</div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                                  <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                    <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27Z" fill="currentColor"></path>
                                  </svg>
                                  Only me
                                </div>
                              </>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '30px' }}>
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTaskCompletion(task.id)}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{
                                  color: task.completed ? 'var(--text-disabled)' : 'rgb(245, 244, 243)',
                                  fontSize: '14px',
                                  textDecoration: task.completed ? 'line-through' : 'none',
                                }}>{task.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    
                    {/* Add Task Input */}
                    <div style={{
                      display: section.id === 'recently-assigned' ? 'grid' : 'block',
                      gridTemplateColumns: section.id === 'recently-assigned' ? '2fr 1fr 1fr 1fr 1fr' : 'none',
                      gap: section.id === 'recently-assigned' ? '16px' : '0',
                      padding: '8px 0',
                      paddingLeft: section.id === 'recently-assigned' ? '30px' : '30px',
                      borderBottom: sectionTasks.length > 0 ? '1px solid var(--border-primary)' : 'none',
                    }}>
                      <input
                        type="text"
                        placeholder="Add task..."
                        value={newTaskText[section.id] || ''}
                        onChange={(e) => setNewTaskText({ ...newTaskText, [section.id]: e.target.value })}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-tertiary)',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Section Button */}
          <button style={{
            marginTop: '16px',
            padding: '8px 0',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
              <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
            </svg>
            Add section
          </button>
        </div>

        {/* Modals */}
        <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} />
        <SortModal isOpen={showSortModal} onClose={() => setShowSortModal(false)} />
        <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
        <CustomizeModal isOpen={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} />
        <OptionsModal isOpen={showOptionsModal} onClose={() => setShowOptionsModal(false)} />
        {showCreateModal && (
          <CreateTaskModal
            onClose={() => setShowCreateModal(false)}
            onTaskCreated={() => {
              setShowCreateModal(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

export default MyTasks;
