import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CreatePortfolioModal from '../components/CreatePortfolioModal';
import FilterModal from '../components/FilterModal';
import OptionsModal from '../components/OptionsModal';
import portfoliosApi, { type Portfolio } from '../services/portfoliosApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function Portfolios() {
  const [activeTab, setActiveTab] = useState<'recent' | 'browse'>('recent');
  const [isRecentsCollapsed, setIsRecentsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        setLoading(true);
        const fetchedPortfolios = await portfoliosApi.getAll();
        setPortfolios(fetchedPortfolios);
      } catch (err) {
        console.error('Error loading portfolios:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolios();
  }, []);

  const handlePortfolioCreated = (newPortfolio: Portfolio) => {
    setPortfolios((prev) => [newPortfolio, ...prev]);
  };

  return (
    <Layout>
      <div className="PortfoliosPageContent" style={{ backgroundColor: '#1E1F21', minHeight: '100vh', padding: 0 }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1E1F21',
          padding: '24px 24px 0 24px',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '20px',
              lineHeight: '28px',
              margin: 0,
              marginBottom: '16px',
            }}>Portfolios</h1>
            
            {/* Tabs */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                {(['recent', 'browse'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
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
                    }}
                  >
                    {tab === 'recent' ? 'Recent and starred' : 'Browse all'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Line below tabs */}
            <div style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'var(--border-primary)',
              marginBottom: '16px',
            }}></div>
            
            {/* Create Button - Only show for browse view */}
            {activeTab === 'browse' && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '16px',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                </svg>
                Create
              </button>
            )}
            
            {/* Create Button for Recent view */}
            {activeTab === 'recent' && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '16px',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                </svg>
                Create
              </button>
            )}
            
            {/* Line below Create */}
            {activeTab === 'recent' && (
              <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'var(--border-primary)',
                marginBottom: '16px',
              }}></div>
            )}
          </div>
        </div>

        {/* Browse All View */}
        {activeTab === 'browse' && (
          <div style={{ padding: '0 24px 24px 24px' }}>
            {/* Search Bar */}
            <div style={{
              marginBottom: '16px',
              position: 'relative',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2A2B2D',
                borderRadius: '8px',
                border: '1px solid var(--border-primary)',
                padding: '10px 16px',
                gap: '12px',
              }}>
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 32 32">
                  <path d="M13.999 28c3.5 0 6.697-1.3 9.154-3.432l6.139 6.139a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414l-6.139-6.139A13.93 13.93 0 0 0 27.999 14c0-7.72-6.28-14-14-14s-14 6.28-14 14 6.28 14 14 14Zm0-26c6.617 0 12 5.383 12 12s-5.383 12-12 12-12-5.383-12-12 5.383-12 12-12Z" fill="currentColor"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Find a portfolio"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            {/* Filter Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              {['Owner', 'Members', 'Status'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setShowFilterModal(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    background: '#2A2B2D',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{filter}</span>
                  <svg aria-hidden="true" className="Icon" style={{ width: '14px', height: '14px', color: 'var(--text-tertiary)' }} viewBox="0 0 32 32">
                    <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
                  </svg>
                </button>
              ))}
            </div>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '12px 0',
              borderBottom: '1px solid var(--border-primary)',
              marginBottom: '8px',
            }}>
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                fontSize: '12px',
                textAlign: 'left',
              }}>Name</div>
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                fontSize: '12px',
                textAlign: 'center',
              }}>Members</div>
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                fontSize: '12px',
                textAlign: 'center',
              }}>Parent portfolios</div>
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                fontSize: '12px',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '4px',
              }}>
                <span>Last modified</span>
                <svg aria-hidden="true" className="Icon" style={{ width: '12px', height: '12px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" fill="currentColor"></path>
                </svg>
                <svg aria-hidden="true" className="Icon" style={{ width: '12px', height: '12px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" fill="currentColor"></path>
                </svg>
              </div>
            </div>

            {/* Table Rows */}
            <div>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <LoadingSpinner />
                </div>
              ) : portfolios.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  <p>No portfolios yet. Create one to get started!</p>
                </div>
              ) : (
                portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '16px',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border-primary)',
                    cursor: 'pointer',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Name Column */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 400,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '14px',
                    }}>
                      {portfolio.name}
                    </div>
                  </div>
                  {/* Members Column - placeholder */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}>
                    -
                  </div>
                  {/* Parent portfolios Column - placeholder */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}>
                    -
                  </div>
                  {/* Last modified Column */}
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-tertiary)',
                    fontSize: '12px',
                    textAlign: 'right',
                  }}>
                    {portfolio.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString() : '-'}
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        )}

        {/* Recent and Starred View */}
        {activeTab === 'recent' && (
          <div style={{ padding: '0 48px 24px 48px' }}>
            {/* Recent Portfolios Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              maxWidth: '600px',
              margin: '0 auto 16px auto',
            }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => setIsRecentsCollapsed(!isRecentsCollapsed)}
              >
                <h2 style={{
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  margin: 0,
                }}>Recent portfolios</h2>
                <svg 
                  aria-hidden="true" 
                  className="Icon" 
                  style={{ 
                    width: '14px', 
                    height: '14px', 
                    color: 'var(--text-tertiary)',
                    transform: isRecentsCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }} 
                  viewBox="0 0 32 32"
                >
                  <path d="M27.874 11.036a1.5 1.5 0 0 0-2.113-.185L16 19.042l-9.761-8.191a1.5 1.5 0 1 0-1.928 2.298l10.726 9a1.498 1.498 0 0 0 1.928 0l10.726-9a1.5 1.5 0 0 0 .185-2.113h-.002Z" fill="currentColor"></path>
                </svg>
              </div>
              
              {/* Grid View Button */}
              <button
                style={{
                  padding: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" fill="currentColor"></path>
                </svg>
              </button>
            </div>
            
            {/* Line below Recent portfolios */}
            <div style={{
              width: '600px',
              height: '1px',
              backgroundColor: 'var(--border-primary)',
              marginBottom: '16px',
              margin: '0 auto 16px auto',
            }}></div>

            {/* Portfolio Grid */}
            {!isRecentsCollapsed && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {/* New Portfolio Card */}
                <div
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    backgroundColor: '#1E1F21',
                    borderRadius: '8px',
                    border: '2px dashed var(--border-primary)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    minHeight: '160px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                >
                  <svg aria-hidden="true" className="Icon" style={{ width: '32px', height: '32px', color: 'var(--text-tertiary)', marginBottom: '12px' }} viewBox="0 0 24 24">
                    <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                  </svg>
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}>
                    New portfolio
                  </div>
                </div>

                {/* Portfolio Cards */}
                {portfolios.slice(0, 3).map((portfolio) => (
                  <div
                    key={portfolio.id}
                    style={{
                      backgroundColor: '#2A2B2D',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      minHeight: '160px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2E2E30';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2A2B2D';
                    }}
                  >
                    {/* Folder Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      flexShrink: 0,
                    }}>
                      <svg aria-hidden="true" className="Icon" style={{ width: '48px', height: '48px', color: 'rgba(245, 244, 243, 0.6)' }} viewBox="0 0 24 24">
                        <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="currentColor"></path>
                      </svg>
                    </div>
                    
                    {/* Title */}
                    <h3 style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      color: 'rgb(245, 244, 243)',
                      fontSize: '16px',
                      margin: 0,
                      marginBottom: '8px',
                    }}>
                      {portfolio.name}
                    </h3>
                    
                    {/* Description */}
                    {portfolio.description && (
                      <div style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}>
                        {portfolio.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Icon - Bottom Left */}
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '280px',
            zIndex: 1000,
          }}
        >
          <div 
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border-primary)',
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => window.open('https://help.asana.com/s/article/portfolios-overview?language=en_US', '_blank')}
          >
            <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px', color: 'var(--text-tertiary)' }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"></path>
            </svg>
            
            {/* Tooltip */}
            {showTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#2A2B2D',
                color: 'rgb(245, 244, 243)',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                pointerEvents: 'none',
              }}>
                Learn how to use portfolios
                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '8px',
                  height: '8px',
                  background: '#2A2B2D',
                  borderRight: '1px solid var(--border-primary)',
                  borderBottom: '1px solid var(--border-primary)',
                }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} />
        <OptionsModal isOpen={showOptionsModal} onClose={() => setShowOptionsModal(false)} />
        <CreatePortfolioModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)}
          onPortfolioCreated={handlePortfolioCreated}
        />
      </div>
    </Layout>
  );
}

export default Portfolios;
