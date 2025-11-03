import { useState } from 'react';
import Layout from '../components/Layout';
import OptionsModal from '../components/OptionsModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

function Reporting() {
  const [isRecentsCollapsed, setIsRecentsCollapsed] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const dashboards = [
    {
      id: '1',
      title: 'My impact',
      description: 'See the impact of your work',
      iconColor: '#ec4899',
      owner: 'IG',
      ownedBy: 'you',
    },
    {
      id: '2',
      title: 'My organization',
      description: 'Metrics across your organization',
      iconColor: '#ec4899',
      owner: 'IG',
      ownedBy: 'you',
    },
  ];

  return (
    <Layout>
      <div className="ReportingPageContent" style={{ backgroundColor: '#1E1F21', minHeight: '100vh', padding: 0 }}>
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
            }}>Reporting</h1>
            
            {/* Dashboards Tab */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'var(--accent-primary)',
                fontSize: '14px',
                padding: '8px 16px',
                borderBottom: '2px solid var(--accent-primary)',
                display: 'inline-block',
              }}>
                Dashboards
              </div>
            </div>
            
            {/* Line below Dashboards */}
            <div style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'var(--border-primary)',
              marginBottom: '16px',
            }}></div>
          </div>
          
          {/* Create Button */}
          <button
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--accent-primary)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 500,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
              <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
            </svg>
            Create
          </button>
          
          {/* Line below Create */}
          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'var(--border-primary)',
            marginBottom: '24px',
          }}></div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '0 48px 24px 48px' }}>
          {/* Recents Header - Left aligned with line start */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
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
              }}>Recents</h2>
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
          </div>
          
          {/* Line below Recents - Same width as cards */}
          <div style={{
            width: '600px',
            height: '1px',
            backgroundColor: 'var(--border-primary)',
            marginBottom: '16px',
            margin: '0 auto 16px auto',
          }}></div>

            {/* Dashboard Grid */}
            {!isRecentsCollapsed && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {/* Create Dashboard Card */}
                <div
                  style={{
                    backgroundColor: '#1E1F21',
                    borderRadius: '8px',
                    border: '2px dashed var(--border-primary)',
                    padding: '20px',
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
                  <svg aria-hidden="true" className="Icon" style={{ width: '24px', height: '24px', color: 'var(--text-tertiary)', marginBottom: '8px' }} viewBox="0 0 24 24">
                    <path d="M10,10V4c0-1.1,0.9-2,2-2s2,0.9,2,2v6h6c1.1,0,2,0.9,2,2s-0.9,2-2,2h-6v6c0,1.1-0.9,2-2,2s-2-0.9-2-2v-6H4c-1.1,0-2-0.9-2-2s0.9-2,2-2H10z" fill="currentColor"></path>
                  </svg>
                  <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500,
                    color: 'rgb(245, 244, 243)',
                    fontSize: '14px',
                  }}>
                    Create dashboard
                  </div>
                </div>

                {/* My impact Card - First dashboard */}
                {dashboards[0] && (
                  <div
                    style={{
                      backgroundColor: '#2A2B2D',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      minHeight: '200px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2E2E30';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2A2B2D';
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: dashboards[0].iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      flexShrink: 0,
                    }}>
                      <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px', color: 'white' }} viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"></path>
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
                      {dashboards[0].title}
                    </h3>
                    
                    {/* Description */}
                    <p style={{
                      color: 'var(--text-tertiary)',
                      fontSize: '13px',
                      margin: 0,
                    marginBottom: '12px',
                    flex: 1,
                  }}>
                    {dashboards[0].description}
                  </p>
                  
                  {/* Owner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--avatar-pink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: 'var(--text-inverse)',
                        flexShrink: 0,
                      }}>
                        {dashboards[0].owner}
                      </div>
                      <span style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '12px',
                      }}>
                        owned by {dashboards[0].ownedBy}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My organization Card - Below the first row */}
            {!isRecentsCollapsed && dashboards[1] && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                maxWidth: '600px',
                margin: '16px auto 0 auto',
              }}>
                <div
                  style={{
                    backgroundColor: '#2A2B2D',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    padding: '16px',
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
                  {/* Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: dashboards[1].iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    flexShrink: 0,
                  }}>
                    <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px', color: 'white' }} viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"></path>
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
                    {dashboards[1].title}
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '13px',
                    margin: 0,
                    marginBottom: '12px',
                    flex: 1,
                  }}>
                    {dashboards[1].description}
                  </p>
                  
                  {/* Owner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--avatar-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'var(--text-inverse)',
                      flexShrink: 0,
                    }}>
                      {dashboards[1].owner}
                    </div>
                    <span style={{
                      color: 'var(--text-tertiary)',
                      fontSize: '12px',
                    }}>
                      owned by {dashboards[1].ownedBy}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
      <OptionsModal isOpen={showOptionsModal} onClose={() => setShowOptionsModal(false)} />
    </Layout>
  );
}

export default Reporting;
