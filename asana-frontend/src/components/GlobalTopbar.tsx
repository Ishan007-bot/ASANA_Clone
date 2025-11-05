import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';
import type { Task } from '../types/Task';
import { useKeyboardShortcuts, COMMON_SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import { authService } from '../services/authApi';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';
import HelpModal from './HelpModal';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import InviteToAsanaModal from './InviteToAsanaModal';
import SettingsModal from './SettingsModal';
import { useRef } from 'react';

interface GlobalTopbarProps {
  onToggleSidebar?: () => void;
  sidebarVisible?: boolean;
  onTaskCreated?: (task: Partial<Task> | Task) => void;
}

function GlobalTopbar({ onToggleSidebar, sidebarVisible = true, onTaskCreated }: GlobalTopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(authService.getUser());
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load user on mount
  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser && authService.isAuthenticated()) {
      // Try to fetch user from API
      authService.getCurrentUser().then(setUser).catch(() => {
        // If fetch fails, logout
        authService.logout();
        navigate('/login');
      });
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Close user menu on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showUserMenu]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...COMMON_SHORTCUTS.CREATE_TASK,
      callback: () => setShowCreateModal(true),
    },
    {
      ...COMMON_SHORTCUTS.SEARCH,
      callback: () => {
        navigate('/search');
        // Focus search input after navigation
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          searchInput?.focus();
        }, 100);
      },
    },
  ]);

  // Focus search on '/' key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        const searchInput = document.querySelector('.GlobalTopbar-searchInput') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Navigate to search page if query is entered
    if (e.target.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (user) {
      return user.initials || user.name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="GlobalTopbarStructure--onBrowser GlobalTopbarStructure GlobalTopbar" style={{ marginBottom: '0px', backgroundColor: '#2E2E30' }}>
      <div className="GlobalTopbarStructure-leftSide--shouldAlignNavButtons GlobalTopbarStructure-leftSide">
        <div className="GlobalTopbarStructure-leftChildren GlobalTopbarStructure-noDrag">
          <div className="GlobalTopbarSidebarToggleButtonContainer Stack Stack--direction-row Stack--display-block Stack--justify-center HighlightSol HighlightSol--buildingBlock">
            <div
              aria-expanded={sidebarVisible}
              aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              className="IconButtonThemeablePresentation--isEnabled IconButtonThemeablePresentation IconButtonThemeablePresentation--medium GlobalTopbar-toggleSidebarButton--inverseTheme GlobalTopbar-toggleSidebarButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
              role="button"
              tabIndex={0}
              onClick={onToggleSidebar}
            >
              <svg
                aria-hidden="true"
                className="Icon BurgerExpand HighlightSol HighlightSol--core"
                data-testid="BurgerExpand"
                focusable="false"
                viewBox="0 0 32 32"
              >
                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h29a1.5 1.5 0 1 1 0 3h-29A1.5 1.5 0 0 1 0 4.5ZM30.5 15h-29a1.5 1.5 0 1 0 0 3h29a1.5 1.5 0 1 0 0-3Zm0 12h-29a1.5 1.5 0 1 0 0 3h29a1.5 1.5 0 1 0 0-3Z"></path>
              </svg>
            </div>
          </div>
          <div
            aria-expanded={showCreateModal}
            aria-haspopup="menu"
            aria-label="Create"
            className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation OmnibuttonButtonCard Omnibutton GlobalTopbar-omnibutton"
            role="button"
            tabIndex={0}
            onClick={() => setShowCreateModal(true)}
          >
            <div className="OmnibuttonButtonCard-iconContainer">
              <svg aria-hidden="true" className="MiniIcon OmnibuttonButtonCard-icon PlusMiniIcon HighlightSol HighlightSol--core" data-testid="PlusMiniIcon" focusable="false" viewBox="0 0 24 24">
                <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z"></path>
              </svg>
            </div>
            <span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--medium OmnibuttonButtonCard-label HighlightSol HighlightSol--buildingBlock">Create</span>
          </div>
        </div>
      </div>
      <div className="GlobalTopbarStructure-search">
        <div className="GlobalTopbarStructure-middleChildren GlobalTopbarStructure-noDrag"></div>
        <div
          aria-multiselectable="true"
          className="TopbarSearchFilterTokenizer--onBrowser TopbarSearchFilterTokenizer"
          role="listbox"
        >
          <div
            className="TopbarSearchTypeahead--redesigned TopbarSearchTypeahead TopbarSearchTypeahead--onBrowser"
            role="search"
          >
            <div className="TopbarSearchTypeahead-background">
              <div
                aria-label="Search"
                className="TopbarSearchInputButton-buttonBase--redesigned TopbarSearchInputButton-buttonBase--isInverse TopbarSearchInputButton-buttonBase--onBrowser TopbarSearchInputButton-buttonBase"
                role="button"
                tabIndex={0}
              >
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="TopbarSearchInputButton-input GlobalTopbar-searchInput"
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', width: '100%' }}
                />
              </div>
              <svg
                aria-hidden="true"
                className="Icon TopbarSearchTypeahead-icon--isInverse TopbarSearchTypeahead-icon MagnifyerIcon HighlightSol HighlightSol--core"
                data-testid="MagnifyerIcon"
                focusable="false"
                viewBox="0 0 32 32"
              >
                <path d="M13.999 28c3.5 0 6.697-1.3 9.154-3.432l6.139 6.139a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414l-6.139-6.139A13.93 13.93 0 0 0 27.999 14c0-7.72-6.28-14-14-14s-14 6.28-14 14 6.28 14 14 14Zm0-26c6.617 0 12 5.383 12 12s-5.383 12-12 12-12-5.383-12-12 5.383-12 12-12Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="GlobalTopbarStructure-rightSide">
        <div className="GlobalTopbarStructure-rightChildren GlobalTopbarStructure-noDrag">
          <div
            aria-label="Help with Asana"
            className="IconButtonThemeablePresentation--isEnabled IconButtonThemeablePresentation IconButtonThemeablePresentation--medium LearningHubTopbarButton HighlightSol HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
            role="button"
            tabIndex={0}
            onClick={() => setShowHelp(true)}
          >
            <svg
              aria-hidden="true"
              className="MiniIcon QuestionMarkMiniIcon HighlightSol HighlightSol--core"
              data-testid="QuestionMarkMiniIcon"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path d="M13.749 20a1.75 1.75 0 1 1-3.499.001A1.75 1.75 0 0 1 13.75 20Zm-1.75-18c-4.139 0-6 3-6 5.131V8a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-.869c0-.45.509-2.131 3-2.131 2.783 0 3 2.095 3 2.736 0 1.375-1.021 2.073-1.463 2.311-1.209.651-3.037 1.635-3.037 4.347V15.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.106c0-.835.276-1.068 1.461-1.705C16.863 11.665 18 9.813 18 7.737c0-2.763-1.878-5.737-6-5.737Z"></path>
            </svg>
          </div>
          <div className="GlobalTopbarPlaceholder-ownerAvatar">
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowUserMenu((v) => !v)}
                className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small AvatarPhoto--color0 HighlightSol HighlightSol--core"
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: user ? '#eab308' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <span aria-label="User" className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '12px' }}>{getUserInitials()}</span>
              </div>
              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '40px',
                    width: '280px',
                    background: '#1E1F21',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
                    zIndex: 2000,
                    overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="Avatar AvatarPhoto AvatarPhoto--default AvatarPhoto--small" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="AvatarPhoto-initials" style={{ color: 'var(--text-inverse)', fontSize: '12px' }}>{getUserInitials()}</span>
                    </div>
                    <div>
                      <div style={{ color: 'rgb(245, 244, 243)', fontWeight: 600, fontSize: '14px' }}>My workspace</div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{user?.email || 'user@example.com'}</div>
                    </div>
                  </div>

                  {/* Items */}
                  {[
                    { label: 'Admin console', action: () => window.open('https://app.asana.com/admin/1211818969602074/members', '_blank') },
                    { label: 'New workspace', action: () => setShowCreateWorkspace(true) },
                    { label: 'Invite to Asana', action: () => setShowInvite(true) },
                    { divider: true },
                    { label: 'Profile', action: () => navigate('/home') },
                    { label: 'Settings', action: () => setShowSettings(true) },
                    { label: 'Add another account', action: () => window.open('/login', '_blank') },
                    { divider: true },
                    { label: 'Log out', action: () => { authService.logout(); navigate('/login'); } },
                  ].map((item, idx) => (
                    item.divider ? (
                      <div key={`d_${idx}`} style={{ height: '1px', background: 'var(--border-primary)' }} />
                    ) : (
                      <button
                        key={item.label}
                        onClick={() => { setShowUserMenu(false); item.action(); }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          background: 'transparent',
                          border: 'none',
                          color: 'rgb(245, 244, 243)',
                          textAlign: 'left',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#252628')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={(task) => {
            onTaskCreated?.(task);
            setShowCreateModal(false);
          }}
        />
      )}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <CreateWorkspaceModal isOpen={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} />
      <InviteToAsanaModal isOpen={showInvite} onClose={() => setShowInvite(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default GlobalTopbar;
