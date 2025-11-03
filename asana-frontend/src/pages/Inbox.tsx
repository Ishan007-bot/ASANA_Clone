import { useState } from 'react';
import Layout from '../components/Layout';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface Notification {
  id: string;
  type: 'alert' | 'assignment' | 'message';
  title: string;
  description?: string;
  time: string;
  sender?: string;
  senderIcon?: string;
  overdue?: boolean;
  unread?: boolean;
}

function Inbox() {
  const [activeTab, setActiveTab] = useState<'activity' | 'bookmarks' | 'archive'>('activity');
  const [showSummary, setShowSummary] = useState(true);
  const [timeframe, setTimeframe] = useState('Past week');

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'message',
      title: 'Hi Ishan Ganguly, your favorite tools are here',
      description: 'Integrate your top tools for Engineering in a few clicks.',
      time: '5 hours ago',
      sender: 'Asana',
      senderIcon: 'asana',
      unread: true,
    },
    {
      id: '2',
      type: 'alert',
      title: 'Alert: Asana invitation could not be delivered to w3fwefivrj@gmail.com',
      time: '2 days ago',
      sender: 'Asana',
      senderIcon: 'asana',
      overdue: true,
    },
    {
      id: '3',
      type: 'assignment',
      title: 'Asana assigned to you.',
      time: '2 days ago',
      sender: 'Asana',
      senderIcon: 'asana',
    },
    {
      id: '4',
      type: 'alert',
      title: 'Alert: Asana invitation could not be delivered to gwoidhxc@gmail.com',
      time: '2 days ago',
      sender: 'Asana',
      senderIcon: 'asana',
      overdue: true,
    },
    {
      id: '5',
      type: 'alert',
      title: 'Alert: Asana invitation could not be delivered to qwoidhxc@gmail.com',
      time: '2 days ago',
      sender: 'Asana',
      senderIcon: 'asana',
    },
    {
      id: '6',
      type: 'alert',
      title: 'Alert: Asana invitation could not be delivered to wdkhebwd@gmail.com',
      time: '2 days ago',
      sender: 'Asana',
      senderIcon: 'asana',
      overdue: true,
    },
    {
      id: '7',
      type: 'message',
      title: 'Teamwork makes work happen!',
      description: 'Inbox is where you get updates, notifications, and messages from your teammates. Send an invite to start collaborating.',
      time: '2 days ago',
      sender: 'Yeti',
      senderIcon: 'yeti',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return (
          <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"></path>
          </svg>
        );
      case 'message':
        return (
          <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getSenderIcon = (senderIcon?: string) => {
    if (senderIcon === 'asana') {
      return (
        <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
            <circle cx="8" cy="8" r="2" fill="#F06A6A" />
            <circle cx="16" cy="8" r="2" fill="#F06A6A" />
            <circle cx="12" cy="16" r="2" fill="#F06A6A" />
          </svg>
        </div>
      );
    }
    if (senderIcon === 'yeti') {
      return (
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          👾
        </div>
      );
    }
    return null;
  };

  const groupNotificationsByTime = () => {
    const yesterday = notifications.filter(n => n.time.includes('5 hours ago'));
    const pastWeek = notifications.filter(n => n.time.includes('2 days ago'));
    return { yesterday, pastWeek };
  };

  const { yesterday, pastWeek } = groupNotificationsByTime();

  return (
    <Layout>
      <div className="InboxPageContent" style={{ backgroundColor: '#1E1F21', minHeight: '100vh', padding: 0 }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1E1F21',
          borderBottom: '1px solid var(--border-primary)',
          padding: '12px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h1 style={{
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                color: 'rgb(245, 244, 243)',
                fontSize: '20px',
                lineHeight: '28px',
                margin: 0,
                marginBottom: '8px',
              }}>Inbox</h1>
              
              {/* Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {(['activity', 'bookmarks', 'archive'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '6px 12px',
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
                    {tab}
                  </button>
                ))}
                <button
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-tertiary)',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'transparent',
                color: 'rgb(245, 244, 243)',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 400,
              }}
            >
              Manage notifications
            </button>
          </div>
        </div>

        {/* Control Bar */}
        <div style={{
          backgroundColor: '#1E1F21',
          borderBottom: '1px solid var(--border-primary)',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'transparent',
                color: 'rgb(245, 244, 243)',
                fontSize: '13px',
                cursor: 'pointer',
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
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'transparent',
                color: 'rgb(245, 244, 243)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zm-6-4v-2h2v-2H3v2h2v2zm10-6v-2h6V9h-6V7h-2v6h2z" fill="currentColor"></path>
              </svg>
              Sort: Newest
            </button>
          </div>
          
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
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', paddingTop: '16px', backgroundColor: '#1E1F21' }}>
          {/* Inbox Summary Card */}
          {showSummary && (
            <div style={{
              backgroundColor: '#1E1F21',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              position: 'relative',
            }}>
              <button
                onClick={() => setShowSummary(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"></path>
                </svg>
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'rgb(245, 244, 243)' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  margin: 0,
                }}>Inbox Summary</h3>
              </div>
              
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                marginBottom: '12px',
                marginTop: 0,
              }}>
                Summarize your most important and actionable notifications with Asana AI.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <label style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                }}>
                  Timeframe:
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-primary)',
                    background: '#1E1F21',
                    color: 'rgb(245, 244, 243)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <option>Past week</option>
                  <option>Past month</option>
                </select>
              </div>
              
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1E1F21',
                  color: 'rgb(245, 244, 243)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                View summary
              </button>
            </div>
          )}

          {/* Notifications */}
          <div style={{ backgroundColor: '#1E1F21' }}>
            {/* Yesterday Section */}
            {yesterday.length > 0 && (
              <div style={{ marginBottom: '32px', backgroundColor: '#1E1F21' }}>
                <h2 style={{
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  marginBottom: '16px',
                  marginTop: 0,
                }}>Yesterday</h2>
                
                {yesterday.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '16px 0',
                      borderBottom: '1px solid var(--border-primary)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      backgroundColor: '#1E1F21',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#1E1F21',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-tertiary)',
                      flexShrink: 0,
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: notification.unread ? 'rgb(245, 244, 243)' : 'var(--text-secondary)',
                            fontSize: '14px',
                            fontWeight: notification.unread ? 500 : 400,
                            marginBottom: '4px',
                          }}>
                            {notification.title}
                          </div>
                          {notification.description && (
                            <div style={{
                              color: 'var(--text-tertiary)',
                              fontSize: '13px',
                              marginTop: '4px',
                            }}>
                              {notification.description}
                            </div>
                          )}
                        </div>
                        {notification.unread && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--accent-primary)',
                            flexShrink: 0,
                            marginLeft: '8px',
                            marginTop: '6px',
                          }}></div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '44px' }}>
                        {notification.senderIcon && getSenderIcon(notification.senderIcon)}
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                          {notification.sender} {notification.time}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past 7 Days Section */}
            {pastWeek.length > 0 && (
              <div style={{ backgroundColor: '#1E1F21' }}>
                <h2 style={{
                  fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                  marginBottom: '16px',
                  marginTop: 0,
                }}>Past 7 Days</h2>
                
                {pastWeek.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '16px 0',
                      borderBottom: '1px solid var(--border-primary)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      backgroundColor: '#1E1F21',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#1E1F21',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-tertiary)',
                      flexShrink: 0,
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{
                          color: 'var(--text-secondary)',
                          fontSize: '14px',
                          fontWeight: 400,
                        }}>
                          {notification.title}
                        </div>
                        {notification.overdue && (
                          <span style={{
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: 500,
                            marginLeft: '8px',
                          }}>Overdue</span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '44px' }}>
                        {notification.senderIcon && getSenderIcon(notification.senderIcon)}
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                          {notification.sender} {notification.time}
                        </span>
                      </div>
                      
                      {notification.description && (
                        <div style={{
                          color: 'var(--text-tertiary)',
                          fontSize: '13px',
                          marginTop: '8px',
                          marginLeft: '44px',
                        }}>
                          {notification.description}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"></path>
                        </svg>
                      </button>
                      <button style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        <svg aria-hidden="true" className="Icon" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Archive all link */}
            <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)', backgroundColor: '#1E1F21' }}>
              <button
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--accent-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Archive all notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Inbox;
