import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterModal from '../components/FilterModal';
import SortModal from '../components/SortModal';
import ShareModal from '../components/ShareModal';
import OptionsModal from '../components/OptionsModal';
import CreateGoalModal from '../components/CreateGoalModal';
import goalsApi, { type Goal } from '../services/goalsApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function Goals() {
  const [activeTab, setActiveTab] = useState<'strategy' | 'team' | 'my'>('strategy');
  const [goalTitle, setGoalTitle] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [goalCreated, setGoalCreated] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTeamGoalsCollapsed, setIsTeamGoalsCollapsed] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        const fetchedGoals = await goalsApi.getAll();
        setGoals(fetchedGoals);
        if (fetchedGoals.length > 0) {
          setGoalTitle(fetchedGoals[0].title);
          setGoalCreated(true);
        }
      } catch (err) {
        console.error('Error loading goals:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, []);

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    setGoalTitle(newGoal.title);
    setGoalCreated(true);
  };
  
  const createdGoal = goals.length > 0 ? {
    id: goals[0].id,
    title: goals[0].title,
    progress: goals[0].progress || 0,
    hasSubgoals: false,
    timePeriod: goals[0].timePeriod,
    workspace: 'My workspace',
    owner: 'Ishan Ganguly',
  } : {
    id: '1',
    title: goalTitle || 'wepfinnweripcn4',
    progress: 0,
    hasSubgoals: false,
    timePeriod: 'Q4 FY25',
    workspace: 'My workspace',
    owner: 'Ishan Ganguly',
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };
  
  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };
  
  const handleScreenshot = () => {
    // Screenshot functionality - using html2canvas would be ideal, but for now just a placeholder
    alert('Screenshot functionality - would capture the strategy map view');
  };
  
  const handleMapView = () => {
    // Toggle map view mode
    console.log('Map view toggled');
  };
  
  const handleCamera = () => {
    // Camera/photo functionality
    console.log('Camera view toggled');
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Layout>
      <div className="GoalsPageContent" style={{ backgroundColor: '#1E1F21', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1E1F21',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid var(--border-primary)',
        }}>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                fontSize: '20px',
                lineHeight: '28px',
                margin: 0,
                marginBottom: '16px',
              }}>Goals</h1>
            </div>
            <button
              onClick={() => window.open('https://form-beta.asana.com/?k=LWDyFgweaB61-VLyxS8aEQ&d=15793206719', '_blank')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'transparent',
                color: 'rgb(245, 244, 243)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: 'fit-content',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Send feedback"
            >
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"></path>
              </svg>
              Send feedback
            </button>
          </div>
            
            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
              {(['strategy', 'team', 'my'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'team') {
                      setIsTeamGoalsCollapsed(false); // Expand when clicking the tab
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderBottom: `2px solid ${activeTab === tab ? 'var(--accent-primary)' : 'transparent'}`,
                    background: 'transparent',
                    color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    fontSize: '14px',
                    fontWeight: activeTab === tab ? 500 : 400,
                    cursor: 'pointer',
                    marginBottom: '-2px',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{tab === 'strategy' ? 'Strategy map' : tab === 'team' ? 'Team goals' : 'My goals'}</span>
                  {tab === 'team' && (
                    <svg 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsTeamGoalsCollapsed(!isTeamGoalsCollapsed);
                      }}
                      aria-hidden="true" 
                      className="Icon" 
                      style={{ 
                        width: '14px', 
                        height: '14px', 
                        color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                        transform: isTeamGoalsCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer',
                      }} 
                      viewBox="0 0 32 32"
                    >
                      <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
                    </svg>
                  )}
                </button>
              ))}
              <button
                style={{
                  padding: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
              >
                +
              </button>
            </div>
        </div>

        {/* Main Content - Strategy Map View, Team Goals View, or Form View */}
        {activeTab === 'team' ? (
          /* Team Goals Table View */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#1E1F21' }}>
            {/* Control Bar */}
            <div style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-primary)',
              backgroundColor: '#1E1F21',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateGoalModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                  </svg>
                  Create goal
                </button>
                
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Time periods: All</span>
                  <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path>
                  </svg>
                  <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Team: My workspace
                </button>
                
                <button
                  onClick={() => setShowFilterModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M10 18h4v-2h-4v2zm-3-6h10v-2H7v2zm-5-4v2h20V8H2z" fill="currentColor"></path>
                  </svg>
                  Filter
                </button>
                
                <button
                  onClick={() => setShowOptionsModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
                  </svg>
                  Options
                </button>
              </div>
            </div>
            
            {/* Table */}
            {!isTeamGoalsCollapsed && (
            <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px' }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 40px',
                gap: '16px',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-primary)',
                marginBottom: '8px',
                position: 'sticky',
                top: 0,
                backgroundColor: '#1E1F21',
                zIndex: 10,
              }}>
                {['Name', 'Status', 'Progress', 'Time period', 'Accountable team', 'Owner'].map((col) => (
                  <div
                    key={col}
                    style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      color: 'var(--text-tertiary)',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{col}</span>
                    <svg aria-hidden="true" className="Icon" style={{ width: '12px', height: '12px' }} viewBox="0 0 32 32">
                      <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
                    </svg>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                    }}
                  >
                    <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                      <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Table Rows */}
              {goalCreated && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 40px',
                    gap: '16px',
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
                  {/* Name */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}>
                    {createdGoal.title}
                  </div>
                  
                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--text-tertiary)',
                      flexShrink: 0,
                    }}></div>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      fontSize: '14px',
                    }}>
                      No recent up...
                    </span>
                  </div>
                  
                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${createdGoal.progress}%`,
                        background: 'var(--accent-primary)',
                      }}></div>
                    </div>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      fontSize: '12px',
                      minWidth: '35px',
                    }}>
                      {createdGoal.progress}%
                    </span>
                  </div>
                  
                  {/* Time period */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}>
                    {createdGoal.timePeriod}
                  </div>
                  
                  {/* Accountable team */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"></path>
                    </svg>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                    }}>
                      {createdGoal.workspace}
                    </span>
                  </div>
                  
                  {/* Owner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--avatar-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '10px', fontWeight: 500 }}>
                        {createdGoal.owner.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {createdGoal.owner}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div></div>
                </div>
              )}
            </div>
            )}
          </div>
        ) : activeTab === 'my' ? (
          /* My Goals Table View */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#1E1F21' }}>
            {/* Control Bar */}
            <div style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-primary)',
              backgroundColor: '#1E1F21',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setShowCreateGoalModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                  </svg>
                  Create goal
                </button>
                
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Time periods: All</span>
                  <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path>
                  </svg>
                  <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'white' }} viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"></path>
                  </svg>
                  Owner: Ishan Ganguly
                </button>
                
                <button
                  onClick={() => setShowFilterModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M10 18h4v-2h-4v2zm-3-6h10v-2H7v2zm-5-4v2h20V8H2z" fill="currentColor"></path>
                  </svg>
                  Filter
                </button>
                
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"></path>
                  </svg>
                  Options
                </button>
              </div>
            </div>
            
            {/* Table */}
            <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px' }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 40px',
                gap: '16px',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-primary)',
                marginBottom: '8px',
                position: 'sticky',
                top: 0,
                backgroundColor: '#1E1F21',
                zIndex: 10,
              }}>
                {['Name', 'Status', 'Progress', 'Time period', 'Accountable team', 'Owner'].map((col) => (
                  <div
                    key={col}
                    style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      color: 'var(--text-tertiary)',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{col}</span>
                    <svg aria-hidden="true" className="Icon" style={{ width: '12px', height: '12px' }} viewBox="0 0 32 32">
                      <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
                    </svg>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                    }}
                  >
                    <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                      <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Table Rows */}
              {goalCreated && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 40px',
                    gap: '16px',
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
                  {/* Name */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}>
                    {createdGoal.title}
                  </div>
                  
                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--text-tertiary)',
                      flexShrink: 0,
                    }}></div>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      fontSize: '14px',
                    }}>
                      No recent up...
                    </span>
                  </div>
                  
                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${createdGoal.progress}%`,
                        background: 'var(--accent-primary)',
                      }}></div>
                    </div>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      fontSize: '12px',
                      minWidth: '35px',
                    }}>
                      {createdGoal.progress}%
                    </span>
                  </div>
                  
                  {/* Time period */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}>
                    {createdGoal.timePeriod}
                  </div>
                  
                  {/* Accountable team */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"></path>
                    </svg>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                    }}>
                      {createdGoal.workspace}
                    </span>
                  </div>
                  
                  {/* Owner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--avatar-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '10px', fontWeight: 500 }}>
                        {createdGoal.owner.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {createdGoal.owner}
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div></div>
                </div>
              )}
            </div>
          </div>
        ) : goalCreated ? (
          /* Strategy Map View */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Control Bar */}
            <div style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-primary)',
              backgroundColor: '#1E1F21',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                </svg>
                Create goal
              </button>
              
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-primary)',
                  background: 'transparent',
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"></path>
                </svg>
                Time periods: All
              </button>
              
              <button
                style={{
                  padding: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"></path>
                </svg>
              </button>
            </div>
            
            {/* Strategy Map Canvas */}
            <div style={{
              flex: 1,
              backgroundColor: '#1E1F21',
              backgroundImage: `
                radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              position: 'relative',
              overflow: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}>
              {/* Goal Hierarchy */}
              <div style={{ 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease',
              }}>
                {/* Parent Workspace Card */}
                <div style={{
                  backgroundColor: '#2A2B2D',
                  borderRadius: '8px',
                  padding: '24px 28px',
                  width: '500px',
                  minHeight: '180px',
                  marginBottom: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}>Our mission</div>
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '18px',
                  }}>My workspace</div>
                </div>
                
                {/* Connecting Line */}
                <div style={{
                  width: '2px',
                  height: '24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  marginBottom: '24px',
                }}></div>
                
                {/* Child Goal Card */}
                <div style={{
                  backgroundColor: '#2A2B2D',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  width: '500px',
                  minHeight: '180px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        background: '#a855f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '10px', height: '10px', color: 'white' }} viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"></path>
                        </svg>
                      </div>
                      <span style={{
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 400,
                        color: 'var(--text-tertiary)',
                        fontSize: '12px',
                      }}>Goal</span>
                    </div>
                    <div style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      fontSize: '12px',
                    }}>O No recent updates</div>
                  </div>
                  
                  {/* Title */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '16px',
                    marginBottom: '8px',
                  }}>{createdGoal.title}</div>
                  
                  {/* Progress */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    fontSize: '13px',
                    marginBottom: '12px',
                  }}>
                    {createdGoal.progress}% • No subgoals
                  </div>
                  
                  {/* Footer */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    fontSize: '12px',
                  }}>
                    {createdGoal.timePeriod} • {createdGoal.workspace} • {createdGoal.owner}
                  </div>
                </div>
                
                {/* Add Child Button */}
                <button
                  style={{
                    marginTop: '24px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-primary)',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                  </svg>
                  Add child
                </button>
              </div>
              
              {/* Floating Controls - Bottom Right */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#2A2B2D',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'row',
                gap: '4px',
                border: '1px solid var(--border-primary)',
              }}>
                {/* Map Icon */}
                <button 
                  onClick={handleMapView}
                  style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                  title="Map view"
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill="currentColor"></path>
                  </svg>
                </button>
                {/* Camera/Screenshot Icon */}
                <button 
                  onClick={handleScreenshot}
                  style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                  title="Take screenshot"
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"></path>
                  </svg>
                </button>
                {/* Zoom Out (-) */}
                <button 
                  onClick={handleZoomOut}
                  style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                  title="Zoom out"
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M19 13H5v-2h14v2z" fill="currentColor"></path>
                  </svg>
                </button>
                {/* Zoom In (+) */}
                <button 
                  onClick={handleZoomIn}
                  style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                  title="Zoom in"
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"></path>
                  </svg>
                </button>
                {/* Fullscreen */}
                <button 
                  onClick={handleFullscreen}
                  style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                  title="Fullscreen"
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"></path>
                  </svg>
                </button>
                {/* Info Icon */}
                <button 
                  onClick={() => window.open('https://help.asana.com/hc/en-us/articles/360001172578-Goals-in-Asana', '_blank')}
                  style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                  title="Help"
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Two Panel Layout - Form View */
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Panel - Form */}
            <div style={{
              width: '50%',
              backgroundColor: '#1E1F21',
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <div style={{ marginBottom: '24px' }}>
              {/* Back Button - Only show on step 2+ */}
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{
                    padding: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'rgb(245, 244, 243)',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path>
                  </svg>
                </button>
              )}
              
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                color: 'var(--text-tertiary)',
                fontSize: '12px',
                marginBottom: '16px',
              }}>
                {currentStep === 1 ? 'Step 1 of 2' : currentStep === 2 ? 'Step 2 of 3' : 'Step 3 of 3'}
              </div>
              
              <h2 style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                fontSize: '24px',
                lineHeight: '32px',
                margin: 0,
                marginBottom: '16px',
              }}>
                {currentStep === 1 ? 'Welcome to goals strategy map' : currentStep === 2 ? 'Next, create a goal' : 'Give your goal some subgoals'}
              </h2>
              
              {currentStep === 3 ? (
                <>
                  <p style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    margin: 0,
                    marginBottom: '32px',
                  }}>
                    Subgoals break your strategy up into more achievable pieces. Start with two, and add more later.
                  </p>
                  
                  {/* Subgoals */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {subgoals.map((subgoal, index) => (
                      <div key={subgoal.id} style={{
                        padding: '20px',
                        backgroundColor: '#2A2B2D',
                        borderRadius: '8px',
                        border: '1px solid var(--border-primary)',
                      }}>
                        {/* Goal Title */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 400,
                            color: 'rgb(245, 244, 243)',
                            fontSize: '14px',
                            display: 'block',
                            marginBottom: '8px',
                          }}>
                            Goal title
                          </label>
                          <input
                            type="text"
                            value={subgoal.title}
                            onChange={(e) => {
                              const updated = [...subgoals];
                              updated[index].title = e.target.value;
                              setSubgoals(updated);
                            }}
                            placeholder=""
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-primary)',
                              background: '#1E1F21',
                              color: 'rgb(245, 244, 243)',
                              fontSize: '14px',
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                              outline: 'none',
                            }}
                          />
                        </div>
                        
                        {/* Time Period and Team */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}>
                            <span style={{
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                              fontWeight: 400,
                              color: 'rgb(245, 244, 243)',
                              fontSize: '14px',
                            }}>Time period</span>
                            <span style={{
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                              fontWeight: 400,
                              color: 'var(--text-tertiary)',
                              fontSize: '14px',
                            }}>{subgoal.timePeriod}</span>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"></path>
                            </svg>
                            <span style={{
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                              fontWeight: 400,
                              color: 'var(--text-tertiary)',
                              fontSize: '14px',
                            }}>{subgoal.team}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    margin: 0,
                    marginBottom: '32px',
                  }}>
                    Test strategy map by creating a goal that only you can see. You can invite members and add details to the goal later.
                  </p>
                  
                  {/* Goal Title Input */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      Goal title *
                    </label>
                    <input
                      type="text"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder=""
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-primary)',
                        background: '#2A2B2D',
                        color: 'rgb(245, 244, 243)',
                        fontSize: '14px',
                        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                        outline: 'none',
                      }}
                    />
                  </div>
                  
                  {/* Time Period */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                    }}>Time period</span>
                    <span style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      fontSize: '14px',
                    }}>Q4 FY25</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Bottom Bar */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                color: 'var(--text-tertiary)',
                fontSize: '14px',
              }}>
                0 people will be notified
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep === 3 && (
                  <button
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-primary)',
                      background: 'transparent',
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    Skip to map
                  </button>
                )}
                {currentStep === 1 && (
                  <button
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-primary)',
                      background: 'transparent',
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    Skip to map
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentStep === 1) {
                      setCurrentStep(2);
                    } else if (currentStep === 2) {
                      setCurrentStep(3);
                    } else if (currentStep === 3) {
                      setGoalCreated(true);
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  {currentStep === 3 ? 'Create 1 goal' : 'Continue'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Strategy Map Preview */}
          <div style={{
            width: '50%',
            backgroundColor: '#1a2332', // Dark blue background
            padding: '24px',
            overflow: 'auto',
            position: 'relative',
          }}>
            <div style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '16px',
              marginBottom: '32px',
            }}>My workspace</div>
            
            {/* Strategy Map Visualization */}
            <div style={{
              position: 'relative',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {/* Top Card - My workspace */}
              <div style={{
                backgroundColor: '#2A2B2D',
                borderRadius: '8px',
                padding: '16px',
                width: '280px',
                position: 'relative',
                marginBottom: '40px',
              }}>
                <div style={{
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  marginBottom: '8px',
                }}>My workspace</div>
                <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}></div>
                <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '80%' }}></div>
                <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '60%' }}></div>
              </div>
              
              {/* Connecting Lines */}
              <div style={{
                position: 'absolute',
                top: '140px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
              }}></div>
              
              {/* Second Level Cards */}
              <div style={{
                display: 'flex',
                gap: '32px',
                marginTop: '40px',
                marginBottom: '40px',
              }}>
                {/* Left Card */}
                <div style={{
                  backgroundColor: '#2A2B2D',
                  borderRadius: '8px',
                  padding: '16px',
                  width: '240px',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: '#a855f7', // Purple
                      flexShrink: 0,
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}></div>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '80%' }}></div>
                      <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '60%' }}></div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div style={{
                    height: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '2px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: '70%',
                      background: '#10b981', // Green
                    }}></div>
                  </div>
                  {/* Avatar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--avatar-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '10px', fontWeight: 500 }}>IG</span>
                    </div>
                  </div>
                  
                  {/* Connecting Line to Third Level */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}></div>
                </div>
                
                {/* Right Card */}
                <div style={{
                  backgroundColor: '#2A2B2D',
                  borderRadius: '8px',
                  padding: '16px',
                  width: '240px',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderBottom: '20px solid #06b6d4', // Light blue triangle
                      flexShrink: 0,
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}></div>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '80%' }}></div>
                      <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '60%' }}></div>
                    </div>
                  </div>
                  {/* Avatar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'rgb(245, 244, 243)', fontSize: '10px', fontWeight: 500 }}>IG</span>
                    </div>
                  </div>
                  
                  {/* Connecting Line to Third Level */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}></div>
                </div>
              </div>
              
              {/* Third Level Cards */}
              <div style={{
                display: 'flex',
                gap: '32px',
                marginTop: '40px',
              }}>
                {/* Left Card */}
                <div style={{
                  backgroundColor: '#2A2B2D',
                  borderRadius: '8px',
                  padding: '16px',
                  width: '240px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderBottom: '20px solid #06b6d4', // Light blue triangle
                      flexShrink: 0,
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}></div>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '80%' }}></div>
                      <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '60%' }}></div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div style={{
                    height: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '2px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: '70%',
                      background: '#10b981', // Green
                    }}></div>
                  </div>
                  {/* Avatar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'rgb(245, 244, 243)', fontSize: '10px', fontWeight: 500 }}>IG</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Card */}
                <div style={{
                  backgroundColor: '#2A2B2D',
                  borderRadius: '8px',
                  padding: '16px',
                  width: '240px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderBottom: '20px solid #06b6d4', // Light blue triangle
                      flexShrink: 0,
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px' }}></div>
                      <div style={{ height: '12px', marginBottom: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '80%' }}></div>
                      <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', width: '60%' }}></div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div style={{
                    height: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '2px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: '70%',
                      background: '#10b981', // Green
                    }}></div>
                  </div>
                  {/* Avatar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0" style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'rgb(245, 244, 243)', fontSize: '10px', fontWeight: 500 }}>IG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Modals */}
        <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} />
        <SortModal isOpen={showSortModal} onClose={() => setShowSortModal(false)} />
        <OptionsModal isOpen={showOptionsModal} onClose={() => setShowOptionsModal(false)} />
        <CreateGoalModal 
          isOpen={showCreateGoalModal} 
          onClose={() => setShowCreateGoalModal(false)}
          onGoalCreated={handleGoalCreated}
        />
      </div>
    </Layout>
  );
}

export default Goals;
