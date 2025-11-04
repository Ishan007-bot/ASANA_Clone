import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTasks } from '../context/useTasks';
import projectsApi, { type Project } from '../services/projectsApi';
import type { Task } from '../types/Task';
import { format } from 'date-fns';
import CreateTaskModal from '../components/CreateTaskModal';
import CustomizeModal from '../components/CustomizeModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function Home() {
  const { tasks, toggleTaskCompletion } = useTasks();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'overdue' | 'completed'>('upcoming');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const periodDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await projectsApi.getAll();
        setProjects(fetchedProjects.slice(0, 10)); // Limit to 10 for home page
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };
    loadProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target as Node)) {
        setShowPeriodDropdown(false);
      }
    };
    
    if (showPeriodDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPeriodDropdown]);

  // Format date
  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');
  const greeting = `Good ${today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'}, Ishan`;

  // Projects are loaded from API above

  // Mock collaborators data with correct colors
  const collaborators = [
    { id: '1', initials: 'wf', email: 'wfoiwebdfwe@gmail.c...', color: 0 }, // blue
    { id: '2', initials: 'wd', email: 'wdkhebwd@gmail.com', color: 1 }, // teal/cyan
    { id: '3', initials: 'w3', email: 'w3fwefivrj@gmail.com', color: 3 }, // purple
    { id: '4', initials: 'qw', email: 'qwoidhxc@gmail.com', color: 2 }, // yellow
  ];

  // Filter tasks based on active tab
  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'upcoming':
        return tasks.filter((task) => {
          if (task.completed) return false;
          if (!task.dueDate) return true;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today;
        });
      case 'overdue':
        return tasks.filter((task) => {
          if (task.completed) return false;
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
      case 'completed':
        return tasks.filter((task) => task.completed);
      default:
        return [];
    }
  }, [tasks, activeTab]);

  const overdueCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter((task) => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
  }, [tasks]);

  const completedCount = useMemo(() => {
    return tasks.filter((task) => task.completed).length;
  }, [tasks]);

  const handleTaskToggle = async (task: Task) => {
    await Promise.resolve(toggleTaskCompletion(task.id));
  };

  const formatDateRange = (task: Task) => {
    if (!task.dueDate) return '';
    const date = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 4);
      return `Today - ${format(endDate, 'MMM d')}`;
    }
    if (diffDays > 0) {
      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - 3);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
    }

    return format(date, 'MMM d');
  };

  const getAvatarColor = (color: number) => {
    switch (color) {
      case 0: return 'var(--avatar-blue)';
      case 1: return 'var(--avatar-cyan)';
      case 2: return 'var(--avatar-yellow)';
      case 3: return 'var(--avatar-purple)';
      default: return 'var(--avatar-pink)';
    }
  };

  return (
    <Layout>
      <div className="HomePageContent" style={{ background: 'linear-gradient(to bottom, #424244, #3A3A3C)', backgroundImage: 'linear-gradient(to bottom, #424244, #3A3A3C)', backgroundColor: '#3A3A3C', paddingTop: '16px', paddingRight: '48px', paddingBottom: '120px', paddingLeft: '48px', marginRight: '0px', right: '0', width: '100%', maxWidth: 'none', boxSizing: 'border-box', overflowX: 'visible', minHeight: '100vh' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '0px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', padding: '0', marginTop: '0px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', gap: '24px' }}>
              {/* Date and Greeting */}
              <div style={{ padding: '0' }}>
                <div style={{ 
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  lineHeight: '22px',
                  marginBottom: '8px',
                  padding: '0'
                }}>{dateString}</div>
                <div style={{ 
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '32px',
                  lineHeight: '40px',
                  padding: '0'
                }}>{greeting}</div>
              </div>

              {/* Top Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '30px' }}>
                {/* Top Controls Card */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '4px 12px',
                  backgroundColor: '#252628',
                  borderRadius: '8px',
                  height: '28px',
                }}>
                  <div style={{ position: 'relative' }} ref={periodDropdownRef}>
                    <div 
                      onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        color: 'rgb(245, 244, 243)', 
                        fontSize: '12px',
                        lineHeight: '28px',
                        cursor: 'pointer',
                      }}
                    >
                      <span>My {selectedPeriod === 'week' ? 'week' : 'month'}</span>
                      <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px', transform: showPeriodDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} viewBox="0 0 32 32">
                        <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
                      </svg>
                    </div>
                    
                    {/* Dropdown Menu */}
                    {showPeriodDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        marginTop: '4px',
                        backgroundColor: '#2A2B2D',
                        borderRadius: '8px',
                        border: '1px solid var(--border-primary)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        zIndex: 1000,
                        minWidth: '140px',
                        overflow: 'hidden',
                      }}>
                        <button
                          onClick={() => {
                            setSelectedPeriod('week');
                            setShowPeriodDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            background: selectedPeriod === 'week' ? 'rgba(69, 115, 210, 0.2)' : 'transparent',
                            color: 'rgb(245, 244, 243)',
                            fontSize: '14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPeriod !== 'week') {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPeriod !== 'week') {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          My week
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPeriod('month');
                            setShowPeriodDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            borderTop: '1px solid var(--border-primary)',
                            background: selectedPeriod === 'month' ? 'rgba(69, 115, 210, 0.2)' : 'transparent',
                            color: 'rgb(245, 244, 243)',
                            fontSize: '14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedPeriod !== 'month') {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedPeriod !== 'month') {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          My month
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)', 
                    fontSize: '12px',
                    lineHeight: '28px'
                  }}>{completedCount} tasks completed</div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)', 
                    fontSize: '12px',
                    lineHeight: '28px'
                  }}>
                    <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"></path>
                    </svg>
                    <span>0 collaborators</span>
                  </div>
                </div>
                {/* Customize Button - Separate Card */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '4px 12px',
                  backgroundColor: '#252628',
                  borderRadius: '8px',
                  height: '28px',
                }}>
                  <button
                    onClick={() => setShowCustomizeModal(true)}
                    style={{
                      padding: '0',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '12px',
                      lineHeight: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '28px',
                    }}
                  >
                    <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" fill="currentColor"></path>
                    </svg>
                    Customize
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Horizontal Separator Line */}
          <div style={{ 
            width: '100%', 
            height: '1px', 
            backgroundColor: 'var(--border-primary)', 
            marginTop: '16px',
            marginBottom: '16px',
            padding: '0',
          }}></div>
        </div>

        {/* My Tasks Card - Full Width */}
        <div style={{
          backgroundColor: '#2A2B2D',
          borderRadius: '8px',
          border: '1px solid var(--border-primary)',
          padding: '32px',
          marginBottom: '48px',
          marginTop: '0px',
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', padding: '0 0 12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--avatar-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '12px', fontWeight: 500 }}>IG</span>
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg aria-hidden="true" className="Icon" style={{ width: '8px', height: '8px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
              <h3 style={{ 
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                fontSize: '20px',
                lineHeight: '28px',
                margin: 0
              }}>My tasks</h3>
            </div>
            <button style={{
              padding: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
            }}>
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px', padding: '0 0 8px 0', marginTop: '0' }}>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'upcoming' ? 'var(--accent-primary)' : 'transparent'}`,
                background: 'transparent',
                color: activeTab === 'upcoming' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                fontSize: '14px',
                fontWeight: activeTab === 'upcoming' ? 500 : 400,
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'overdue' ? 'var(--accent-primary)' : 'transparent'}`,
                background: 'transparent',
                color: activeTab === 'overdue' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                fontSize: '14px',
                fontWeight: activeTab === 'overdue' ? 500 : 400,
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'completed' ? 'var(--accent-primary)' : 'transparent'}`,
                background: 'transparent',
                color: activeTab === 'completed' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                fontSize: '14px',
                fontWeight: activeTab === 'completed' ? 500 : 400,
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              Completed
            </button>
          </div>

          {/* Create Task Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: 'transparent',
              color: 'var(--text-tertiary)',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: 'fit-content',
            }}
          >
            <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
              <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
            </svg>
            Create task
          </button>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' }}>
            {filteredTasks.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', padding: '40px 32px', textAlign: 'center' }}>
                No {activeTab} tasks
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTaskToggle(task);
                    }}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', margin: '0', padding: '0' }}
                  />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, padding: '0' }}>
                    <span style={{ 
                      color: task.completed ? 'var(--text-disabled)' : 'var(--text-primary)', 
                      fontSize: '14px', 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {task.name}
                    </span>
                    {task.projectId && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: 'var(--accent-success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: 'var(--text-inverse)',
                        flexShrink: 0,
                      }}>
                        NA
                      </div>
                    )}
                    {task.dueDate && (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', flexShrink: 0 }}>{formatDateRange(task)}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects and People Cards - Side by Side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '32px', padding: '0' }}>
          {/* Projects Card */}
          <div style={{
            backgroundColor: '#2A2B2D',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', padding: '0 0 16px 0' }}>
              <h3 style={{ 
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                fontSize: '20px',
                lineHeight: '28px',
                margin: 0 
              }}>Projects</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}>
                  <option>Recents</option>
                </select>
                <button style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                }}>
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' }}>
              <button
                onClick={() => navigate('/new-project')}
                style={{
                  padding: '16px',
                  borderRadius: '6px',
                  border: '2px dashed var(--border-primary)',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                </svg>
                Create project
              </button>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'var(--avatar-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-inverse)' }} viewBox="0 0 24 24">
                      <path d="M5 5C5 6.3805 3.8805 7.5 2.5 7.5C1.1195 7.5 0 6.3805 0 5C0 3.6195 1.1195 2.5 2.5 2.5C3.8805 2.5 5 3.6195 5 5ZM2.5 9.5C1.1195 9.5 0 10.6195 0 12C0 13.3805 1.1195 14.5 2.5 14.5C3.8805 14.5 5 13.3805 5 12C5 10.6195 3.8805 9.5 2.5 9.5ZM2.5 16.5C1.1195 16.5 0 17.6195 0 19C0 20.3805 1.1195 21.5 2.5 21.5C3.8805 21.5 5 20.3805 5 19C5 17.6195 3.8805 16.5 2.5 16.5ZM9 3V7H24V3H9ZM9 14H24V10H9V14ZM9 21H24V17H9V21Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div style={{ flex: 1, padding: '0' }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, padding: '0', marginBottom: '4px' }}>{project.name}</div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', padding: '0' }}>{project.taskCount} tasks due soon</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* People Card */}
          <div style={{
            backgroundColor: '#2A2B2D',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', padding: '0 0 16px 0' }}>
              <h3 style={{ 
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                fontSize: '20px',
                lineHeight: '28px',
                margin: 0 
              }}>People</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}>
                  <option>Frequent collaborators</option>
                </select>
                <button style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                }}>
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, padding: '0' }}>
              <button
                style={{
                  padding: '16px',
                  borderRadius: '6px',
                  border: '2px dashed var(--border-primary)',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                </svg>
                Invite
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, padding: '0' }}>
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className={`Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color${collab.color}`} style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: getAvatarColor(collab.color),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '12px' }}>{collab.initials}</span>
                    </div>
                    <div style={{ flex: 1, color: 'var(--text-tertiary)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0' }}>{collab.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={() => {
            setShowCreateModal(false);
          }}
        />
      )}
      <CustomizeModal isOpen={showCustomizeModal} onClose={() => setShowCustomizeModal(false)} />
    </Layout>
  );
}

export default Home;
