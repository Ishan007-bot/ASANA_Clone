import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';
import CreatePortfolioModal from './CreatePortfolioModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface SidebarProps {
  isCollapsed?: boolean;
}

function Sidebar({ isCollapsed = false }: SidebarProps) {
  const location = useLocation();
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  
  const handleCreateNewProject = () => {
    setShowCreateMenu(false);
    setShowCreateProjectModal(true);
  };
  
  const handleCreateNewPortfolio = () => {
    setShowCreateMenu(false);
    setShowCreatePortfolioModal(true);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCreateMenu(false);
      }
    };
    
    if (showCreateMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateMenu]);
  
  const projects = [
    { id: '1', name: 'NA', iconColor: 'aqua' },
  ];
  
  const portfolios = [
    { id: '1', name: 'My first portfolio' },
  ];

  return (
    <div className={`SidebarResizableContainer AsanaMain-sidebarResizableContainer ${isCollapsed ? 'collapsed' : ''}`} id="asana_sidebar" style={{ width: isCollapsed ? '0' : '240px', backgroundColor: '#2E2E30' }}>
      <div className="SidebarResizableContainer-sidebarWrapper" style={{ flex: '0 0 240px', backgroundColor: '#2E2E30' }}>
        <div className="Sidebar SidebarResizableContainer-sidebar" style={{ backgroundColor: '#2E2E30' }}>
          <nav aria-label="Global" className="SidebarCollapsibleSection--isFirstSection SidebarCollapsibleSection SidebarTopNavLinks" tabIndex={-1}>
            <div className="RightClickMenu-contextMenuEventListener HighlightSol HighlightSol--core">
              <Link
                to="/home"
                aria-label="Home"
                className={`ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--is${isActive('/home') ? 'Selected' : 'NotSelected'} ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-homeButton`}
              >
                <div className="SidebarNavigationLinkCard-icon">
                  <svg aria-hidden="true" className="NavIcon HomeNavIcon HighlightSol HighlightSol--core" data-testid="HomeNavIcon" focusable="false" viewBox="0 0 40 40">
                    <path d="M37.9,15L22.2,3.8c-1.3-1-3.1-1-4.4-0.1L2.2,14.4c-0.7,0.5-0.9,1.4-0.4,2.1c0.5,0.7,1.4,0.9,2.1,0.4L6,15.4v12.3c0,4.6,3.7,8.3,8.3,8.3h11.4c4.6,0,8.3-3.7,8.3-8.3V15.9l2.1,1.5c0.3,0.2,0.6,0.3,0.9,0.3c0.5,0,0.9-0.2,1.2-0.6C38.7,16.4,38.5,15.5,37.9,15z M31,27.7c0,2.9-2.4,5.3-5.3,5.3H14.3C11.4,33,9,30.6,9,27.7V13.3l10.6-7.2c0.2-0.2,0.5-0.2,0.8,0L31,13.7V27.7z"></path>
                  </svg>
                </div>
                <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">Home</span>
                <div className="SidebarNavigationLinkCard-spacer"></div>
              </Link>
            </div>
            <div className="RightClickMenu-contextMenuEventListener HighlightSol HighlightSol--core">
              <Link
                to="/my-tasks"
                aria-label="My tasks"
                className={`ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--is${isActive('/my-tasks') ? 'Selected' : 'NotSelected'} ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-myTasksButton`}
              >
                <div className="SidebarNavigationLinkCard-icon">
                  <svg aria-hidden="true" className="NavIcon CheckNavIcon HighlightSol HighlightSol--core" data-testid="CheckNavIcon" focusable="false" viewBox="0 0 40 40">
                    <path d="M20,2.5C10.4,2.5,2.5,10.4,2.5,20S10.4,37.5,20,37.5S37.5,29.6,37.5,20S29.6,2.5,20,2.5z M20,34.5C12,34.5,5.5,28,5.5,20S12,5.5,20,5.5S34.5,12,34.5,20S28,34.5,20,34.5z M27.7,15c0.6,0.6,0.6,1.5,0,2.1l-10,10c-0.2,0.2-0.6,0.3-1,0.3c-0.4,0-0.8-0.1-1.1-0.4l-4.1-4.1c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l3.1,3.1l8.9-8.9C26.2,14.4,27.1,14.4,27.7,15z"></path>
                  </svg>
                </div>
                <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">My tasks</span>
                <div className="SidebarNavigationLinkCard-spacer"></div>
              </Link>
            </div>
            <div className="RightClickMenu-contextMenuEventListener HighlightSol HighlightSol--core">
              <Link
                to="/inbox"
                aria-label="Inbox"
                className={`ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--is${isActive('/inbox') ? 'Selected' : 'NotSelected'} ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-notificationsButton`}
              >
                <div className="SidebarNavigationLinkCard-icon">
                  <svg aria-hidden="true" className="NavIcon BellNavIcon HighlightSol HighlightSol--core" data-testid="BellNavIcon" focusable="false" viewBox="0 0 40 40">
                    <path d="M7.5,32L7.5,32h-1c-1.5,0-2.8-0.8-3.4-2c-0.8-1.5-0.4-3.4,0.9-4.5c1.2-1,1.9-2.4,2-3.9v-6.1C6,8.1,12.3,2,20,2s14,6.1,14,13.5V22c0.2,1.4,0.9,2.6,2,3.5c1.3,1.1,1.7,2.9,0.9,4.5c-0.6,1.2-2,2-3.4,2h-0.9H7.5z M7.6,29h25.8c0.3,0,0.7-0.2,0.8-0.4c0.2-0.4,0-0.7-0.2-0.8l0,0c-1.6-1.4-2.7-3.3-3-5.5c0-0.1,0-0.1,0-0.2v-6.6C31,9.7,26.1,5,20,5S9,9.7,9,15.5v6.1v0.1c-0.2,2.4-1.3,4.5-3.1,6c-0.2,0.2-0.3,0.5-0.2,0.8C5.9,28.8,6.2,29,6.5,29H7.6L7.6,29z M24.7,34c-0.7,1.9-2.5,3.2-4.7,3.2s-4-1.3-4.7-3.2H24.7z"></path>
                  </svg>
                </div>
                <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">Inbox</span>
                <div className="SidebarNavigationLinkCard-spacer"></div>
              </Link>
            </div>
          </nav>
          <div className="CustomScrollbarScrollable Sidebar-customScrollbarScrollable">
            <div className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical CustomScrollbarScrollable-scrollable" data-testid="VerticalScroller" role="presentation" tabIndex={-1}>
              <div className="CustomScrollbarScrollable-content">
                <div className="LinearSortableList Sidebar-sectionsSortableList">
                  <div className="SortableItem LinearSortableList-sortableItem">
                    <nav aria-label="Insights" className="SidebarCollapsibleSection SidebarInsightsSection" tabIndex={-1}>
                      <div className="SidebarUpdatedCollapsibleHeader">
                        <div className="SidebarUpdatedCollapsibleHeader-leftItems">
                          <div aria-expanded="true" aria-label="Collapse section" className="SidebarUpdatedCollapsibleHeader-toggleButton" role="button" tabIndex={0}>
                            <svg aria-hidden="true" className="Icon--small Icon SidebarUpdatedCollapsibleHeader-toggleIcon RightTriangleIcon HighlightSol HighlightSol--core" data-testid="RightTriangleIcon" focusable="false" viewBox="0 0 32 32">
                              <path d="M12.617 6.576A1 1 0 0 0 12 7.5v17a1 1 0 0 0 1.707.707l8.5-8.5a.999.999 0 0 0 0-1.414l-8.5-8.5a.998.998 0 0 0-1.09-.217Z"></path>
                            </svg>
                          </div>
                          <h2 className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--h6 TypographyPresentation--fontWeightMedium SidebarUpdatedCollapsibleHeader-dropdownMenuLabel HighlightSol HighlightSol--buildingBlock HighlightSol--core">Insights</h2>
                        </div>
                      </div>
                      <Link to="/reporting" className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-reportingButton">
                        <div className="SidebarNavigationLinkCard-icon">
                          <svg aria-hidden="true" className="NavIcon ReportingNavIcon HighlightSol HighlightSol--core" data-testid="ReportingNavIcon" focusable="false" viewBox="0 0 40 40">
                            <path d="M34.5,6c-2.48,0-4.5,2.02-4.5,4.5,0,1.13.43,2.14,1.11,2.93l-4.28,7.55s-.03.06-.04.09c-.26-.05-.52-.08-.79-.08-.85,0-1.64.25-2.32.66l-4.46-3.65c.17-.48.28-.98.28-1.51,0-2.48-2.02-4.5-4.5-4.5s-4.5,2.02-4.5,4.5c0,.94.29,1.81.79,2.54l-4.51,6.17c-.41-.12-.83-.21-1.28-.21-2.48,0-4.5,2.02-4.5,4.5s2.02,4.5,4.5,4.5,4.5-2.02,4.5-4.5c0-.94-.29-1.81-.79-2.54l4.51-6.17c.41.12.83.21,1.28.21.85,0,1.64-.25,2.32-.66l4.46,3.65c-.17.48-.28.98-.28,1.51,0,2.48,2.02,4.5,4.5,4.5s4.5-2.02,4.5-4.5c0-1.13-.43-2.15-1.12-2.94.02-.03.05-.06.07-.09l4.27-7.54c.26.05.51.08.78.08,2.48,0,4.5-2.02,4.5-4.5s-2.02-4.5-4.5-4.5ZM5.5,31c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5,1.5.67,1.5,1.5-.67,1.5-1.5,1.5Zm9.5-13c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5,1.5.67,1.5,1.5-.67,1.5-1.5,1.5Zm11,9c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5,1.5.67,1.5,1.5-.67,1.5-1.5,1.5Zm8.5-15c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5,1.5.67,1.5,1.5-.67,1.5-1.5,1.5Z"></path>
                          </svg>
                        </div>
                        <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">Reporting</span>
                        <div className="SidebarNavigationLinkCard-spacer"></div>
                      </Link>
                      <Link to="/portfolios" className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-myPortfoliosbutton">
                        <div className="SidebarNavigationLinkCard-icon">
                          <svg aria-hidden="true" className="NavIcon PortfolioNavIcon HighlightSol HighlightSol--core" data-testid="PortfolioNavIcon" focusable="false" viewBox="0 0 40 40">
                            <path d="M35,12c1.7,0,3,1.3,3,3v16c0,2.8-2.2,5-5,5H7c-2.8,0-5-2.2-5-5V7c0-1.7,1.3-3,3-3h11.9c0.4,0,0.8,0.2,0.9,0.6  l2.4,5.6c0.5,1.1,1.6,1.8,2.8,1.8H35z M35,15v16c0,1.1-0.9,2-2,2H7c-1.1,0-2-0.9-2-2V15H35z M17.8,12c-0.1-0.2-0.2-0.4-0.3-0.7  L15.6,7H5v5H17.8z"></path>
                          </svg>
                        </div>
                        <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">Portfolios</span>
                        <div className="SidebarNavigationLinkCard-spacer"></div>
                      </Link>
                      <Link to="/goals" className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-goalsButton">
                        <div className="SidebarNavigationLinkCard-icon">
                          <svg aria-hidden="true" className="NavIcon GoalNavIcon HighlightSol HighlightSol--core" data-testid="GoalNavIcon" focusable="false" viewBox="0 0 40 40">
                            <path d="M35.6,30.1l-6.2-9.6C31,18.5,32,15.9,32,13c0-6.6-5.4-12-12-12C13.4,1,8,6.4,8,13c0,2.9,1,5.5,2.7,7.6l-6.2,9.6  c-1.2,1.8-1.3,4-0.2,5.9c1,1.9,2.9,3,5.1,3h21.5c2.1,0,4-1.1,5.1-3S36.7,31.9,35.6,30.1z M11,13c0-5,4-9,9-9c5,0,9,4,9,9  c0,1.8-0.5,3.5-1.4,4.9l-2.7-4.2c-1.1-1.6-2.9-2.6-4.8-2.6c-1.9,0-3.7,1-4.8,2.6l-2.7,4.2C11.5,16.5,11,14.8,11,13z M25.5,20.2  C23.9,21.3,22.1,22,20,22s-3.9-0.7-5.5-1.9l3.2-4.8c0.5-0.8,1.4-1.2,2.3-1.2c0.9,0,1.8,0.5,2.3,1.2L25.5,20.2z M33.2,34.6  c-0.5,0.9-1.4,1.4-2.4,1.4H9.2c-1,0-1.9-0.5-2.4-1.4c-0.5-0.9-0.4-1.9,0.1-2.8l6-9.1c2,1.5,4.4,2.3,7.1,2.3c2.7,0,5.1-0.9,7.1-2.3  l6,9.1C33.6,32.6,33.7,33.7,33.2,34.6z"></path>
                          </svg>
                        </div>
                        <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">Goals</span>
                        <div className="SidebarNavigationLinkCard-spacer"></div>
                      </Link>
                    </nav>
                  </div>
                  <div className="SortableItem LinearSortableList-sortableItem">
                    <nav aria-label="Projects" className="SidebarCollapsibleSection SidebarProjectsSectionCleanAndClear" tabIndex={-1}>
                      <div className="SidebarUpdatedCollapsibleHeader">
                        <div className="SidebarUpdatedCollapsibleHeader-leftItems">
                          <div 
                            aria-expanded={projectsExpanded} 
                            aria-label={projectsExpanded ? "Collapse section" : "Expand section"} 
                            className="SidebarUpdatedCollapsibleHeader-toggleButton" 
                            role="button" 
                            tabIndex={0}
                            onClick={() => setProjectsExpanded(!projectsExpanded)}
                            style={{ cursor: 'pointer' }}
                          >
                            <svg 
                              aria-hidden="true" 
                              className="Icon--small Icon SidebarUpdatedCollapsibleHeader-toggleIcon RightTriangleIcon HighlightSol HighlightSol--core" 
                              data-testid="RightTriangleIcon" 
                              focusable="false" 
                              viewBox="0 0 32 32"
                              style={{
                                transform: projectsExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                              }}
                            >
                              <path d="M12.617 6.576A1 1 0 0 0 12 7.5v17a1 1 0 0 0 1.707.707l8.5-8.5a.999.999 0 0 0 0-1.414l-8.5-8.5a.998.998 0 0 0-1.09-.217Z"></path>
                            </svg>
                          </div>
                          <h2 className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--h6 TypographyPresentation--fontWeightMedium SidebarUpdatedCollapsibleHeader-dropdownMenuLabel HighlightSol HighlightSol--buildingBlock HighlightSol--core">Projects</h2>
                        </div>
                        <div className="SidebarUpdatedCollapsibleHeader-extraButtons" style={{ position: 'relative' }} ref={menuRef}>
                          <div 
                            aria-expanded={showCreateMenu} 
                            aria-haspopup="menu" 
                            aria-label="New project or portfolio" 
                            className="IconButtonThemeablePresentation--isEnabled IconButtonThemeablePresentation IconButtonThemeablePresentation--small SidebarProjectsHeader-addButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" 
                            role="button" 
                            tabIndex={0}
                            onClick={() => setShowCreateMenu(!showCreateMenu)}
                            style={{ cursor: 'pointer' }}
                          >
                            <svg aria-hidden="true" className="MiniIcon PlusMiniIcon HighlightSol HighlightSol--core" data-testid="PlusMiniIcon" focusable="false" viewBox="0 0 24 24">
                              <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z"></path>
                            </svg>
                          </div>
                          
                          {/* Dropdown Menu */}
                          {showCreateMenu && (
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              right: '0',
                              marginTop: '4px',
                              backgroundColor: '#2A2B2D',
                              borderRadius: '8px',
                              border: '1px solid var(--border-primary)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                              zIndex: 1000,
                              minWidth: '180px',
                              overflow: 'hidden',
                            }}>
                              <button
                                onClick={handleCreateNewProject}
                                style={{
                                  width: '100%',
                                  padding: '10px 16px',
                                  border: 'none',
                                  background: 'transparent',
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
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                                  <path d="M5 5C5 6.3805 3.8805 7.5 2.5 7.5C1.1195 7.5 0 6.3805 0 5C0 3.6195 1.1195 2.5 2.5 2.5C3.8805 2.5 5 3.6195 5 5ZM2.5 9.5C1.1195 9.5 0 10.6195 0 12C0 13.3805 1.1195 14.5 2.5 14.5C3.8805 14.5 5 13.3805 5 12C5 10.6195 3.8805 9.5 2.5 9.5ZM2.5 16.5C1.1195 16.5 0 17.6195 0 19C0 20.3805 1.1195 21.5 2.5 21.5C3.8805 21.5 5 20.3805 5 19C5 17.6195 3.8805 16.5 2.5 16.5ZM9 3V7H24V3H9ZM9 14H24V10H9V14ZM9 21H24V17H9V21Z" fill="currentColor"></path>
                                </svg>
                                New project
                              </button>
                              <button
                                onClick={handleCreateNewPortfolio}
                                style={{
                                  width: '100%',
                                  padding: '10px 16px',
                                  border: 'none',
                                  background: 'transparent',
                                  color: 'rgb(245, 244, 243)',
                                  fontSize: '14px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  borderTop: '1px solid var(--border-primary)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="currentColor"></path>
                                </svg>
                                New portfolio
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {projectsExpanded && (
                        <div>
                          {/* Projects */}
                          {projects.map((project) => (
                            <Link
                              key={project.id}
                              to={`/projects/${project.id}`}
                              className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarProjectsSection-projectLink"
                            >
                              <div className="SidebarNavigationLinkCard-icon">
                                <div style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '4px',
                                  background: '#06b6d4', // Teal color (aqua)
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}></div>
                              </div>
                              <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">{project.name}</span>
                              <div className="SidebarNavigationLinkCard-spacer"></div>
                            </Link>
                          ))}
                          
                          {/* Portfolios */}
                          {portfolios.map((portfolio) => (
                            <Link
                              key={portfolio.id}
                              to={`/portfolios/${portfolio.id}`}
                              className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarProjectsSection-projectLink"
                            >
                              <div className="SidebarNavigationLinkCard-icon">
                                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'rgba(245, 244, 243, 0.6)' }} viewBox="0 0 24 24">
                                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="currentColor"></path>
                                </svg>
                              </div>
                              <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarNavigationLinkCard-label HighlightSol HighlightSol--buildingBlock">{portfolio.name}</span>
                              <div className="SidebarNavigationLinkCard-spacer"></div>
                              <svg aria-hidden="true" className="Icon" style={{ width: '12px', height: '12px', color: 'rgba(245, 244, 243, 0.6)', marginRight: '8px' }} viewBox="0 0 24 24">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"></path>
                              </svg>
                            </Link>
                          ))}
                        </div>
                      )}
                    </nav>
                  </div>
                  <div className="SortableItem LinearSortableList-sortableItem">
                    <nav aria-label="Teams" className="SidebarCollapsibleSection SidebarTeamsList" tabIndex={-1}>
                      <div className="SidebarUpdatedCollapsibleHeader">
                        <div className="SidebarUpdatedCollapsibleHeader-leftItems">
                          <div aria-expanded="true" aria-label="Collapse section" className="SidebarUpdatedCollapsibleHeader-toggleButton" role="button" tabIndex={0}>
                            <svg aria-hidden="true" className="Icon--small Icon SidebarUpdatedCollapsibleHeader-toggleIcon RightTriangleIcon HighlightSol HighlightSol--core" data-testid="RightTriangleIcon" focusable="false" viewBox="0 0 32 32">
                              <path d="M12.617 6.576A1 1 0 0 0 12 7.5v17a1 1 0 0 0 1.707.707l8.5-8.5a.999.999 0 0 0 0-1.414l-8.5-8.5a.998.998 0 0 0-1.09-.217Z"></path>
                            </svg>
                          </div>
                          <h2 className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--h6 TypographyPresentation--fontWeightMedium SidebarUpdatedCollapsibleHeader-dropdownMenuLabel HighlightSol HighlightSol--buildingBlock HighlightSol--core">Team</h2>
                        </div>
                      </div>
                      <div className="SidebarTeamsList-content">
                        <div className="DropTargetRow SidebarTeamMembership SidebarTeamMembership-dropTargetRow">
                          <div className="RightClickMenu-contextMenuEventListener HighlightSol HighlightSol--core">
                            <div className="SidebarFlyoutSplitDropdownButton SidebarItemRow" tabIndex={-1}>
                              <Link to="/home" className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarFlyoutSplitDropdownButton-navigationLinkButton">
                                <div className="SidebarFlyoutSplitDropdownButton-icon">
                                  <div className="SidebarItemIcon">
                                    <svg aria-hidden="true" className="Icon SidebarItemIcon--iconWithoutCustomizationColor UserFillIcon HighlightSol HighlightSol--core" data-testid="UserFillIcon" focusable="false" viewBox="0 0 32 32">
                                      <path d="M31,30H11c-.552,0-1-.448-1-1v-2c0-3.866,3.134-7,7-7h8c3.866,0,7,3.134,7,7v2c0,.552-.448,1-1,1Zm-23-3c0-2.029,.676-3.901,1.814-5.407,.495-.656,.023-1.593-.799-1.593h-2.015c-3.866,0-7,3.134-7,7v2c0,.552,.448,1,1,1H7c.552,0,1-.448,1-1v-2ZM28.5,10c0-4.142-3.358-7.5-7.5-7.5s-7.5,3.358-7.5,7.5,3.358,7.5,7.5,7.5,7.5-3.358,7.5-7.5Zm-17,0c0-2.125,.698-4.087,1.878-5.67,.431-.579,.176-1.413-.522-1.594-1.074-.278-2.24-.324-3.45-.067-2.917,.619-5.248,2.996-5.779,5.93-.86,4.758,2.773,8.901,7.373,8.901,.632,0,1.245-.08,1.831-.23,.71-.181,.984-1.013,.546-1.601-1.179-1.582-1.877-3.544-1.877-5.669Z"></path>
                                    </svg>
                                  </div>
                                </div>
                                <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium SidebarFlyoutSplitDropdownButton-label HighlightSol HighlightSol--buildingBlock">My workspace</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="SidebarFooter">
            <div className="SidebarFooter-content">
              <div className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large SidebarInvite HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center" role="button" tabIndex={0}>
                <svg aria-hidden="true" className="Icon ButtonThemeablePresentation-leftIcon SidebarInvite-icon EmailIcon HighlightSol HighlightSol--core" data-testid="EmailIcon" focusable="false" viewBox="0 0 32 32">
                  <path d="M25.998 4h-20c-3.309 0-6 2.691-6 6v12c0 3.309 2.691 6 6 6h20c3.31 0 6-2.691 6-6V10c0-3.309-2.69-6-6-6Zm-20 2h20c.74 0 1.424.215 2.02.567L16.704 17.879a1 1 0 0 1-1.414 0L3.98 6.567A3.96 3.96 0 0 1 6 6Zm24 16c0 2.206-1.794 4-4 4h-20c-2.206 0-4-1.794-4-4V10c0-.74.215-1.424.567-2.019l11.312 11.313a2.993 2.993 0 0 0 2.121.876 2.99 2.99 0 0 0 2.121-.877L29.431 7.981A3.96 3.96 0 0 1 29.998 10v12Z"></path>
                </svg>
                <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--medium TypographyPresentation--fontWeightNormal HighlightSol HighlightSol--buildingBlock">Invite teammates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateProjectModal 
        isOpen={showCreateProjectModal} 
        onClose={() => setShowCreateProjectModal(false)}
      />
      <CreatePortfolioModal 
        isOpen={showCreatePortfolioModal} 
        onClose={() => setShowCreatePortfolioModal(false)}
      />
    </div>
  );
}

export default Sidebar;

