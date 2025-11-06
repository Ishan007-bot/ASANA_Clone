import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function WhatToolsDoYouUse() {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const navigate = useNavigate();

  // Tool icon components
  const ToolIcon = ({ toolId }: { toolId: string }) => {
    const iconStyle = { width: '18px', height: '18px' };
    
    switch (toolId) {
      case 'gmail':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#EA4335', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>M</div>
        );
      case 'google-drive':
        return (
          <svg style={iconStyle} viewBox="0 0 24 24" fill="none">
            <path d="M7.71 2L2 7.71L4.29 10L10 4.29L7.71 2Z" fill="#4285F4"/>
            <path d="M12 4.29L17.71 10L22 5.71L16.29 0L12 4.29Z" fill="#34A853"/>
            <path d="M2 7.71V16.29L7.71 22H16.29L22 16.29V7.71L16.29 2H7.71L2 7.71Z" fill="#FBBC04"/>
          </svg>
        );
      case 'onedrive':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#0078D4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 3C6.48 3 2 6.48 2 11C2 15.52 6.48 19 12 19C17.52 19 22 15.52 22 11C22 6.48 17.52 3 12 3Z"/>
            </svg>
          </div>
        );
      case 'outlook':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#0078D4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M3 4H21V6H3V4ZM3 8H21V20H3V8ZM5 10V18H19V10H5Z"/>
            </svg>
          </div>
        );
      case 'teams':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#6264A7', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>T</div>
        );
      case 'slack':
        return (
          <svg style={iconStyle} viewBox="0 0 24 24" fill="none">
            <path d="M5 15.5C5 16.33 4.33 17 3.5 17S2 16.33 2 15.5 2.67 14 3.5 14H5V15.5ZM6.5 15.5C6.5 14.67 7.17 14 8 14S9.5 14.67 9.5 15.5V20.5C9.5 21.33 8.83 22 8 22S6.5 21.33 6.5 20.5V15.5Z" fill="#4A154B"/>
            <path d="M8.5 5C7.67 5 7 4.33 7 3.5S7.67 2 8.5 2 10 2.67 10 3.5V5H8.5ZM8.5 6.5C9.33 6.5 10 7.17 10 8S9.33 9.5 8.5 9.5H3.5C2.67 9.5 2 8.83 2 8S2.67 6.5 3.5 6.5H8.5Z" fill="#4A154B"/>
            <path d="M19 8.5C19 7.67 19.67 7 20.5 7S22 7.67 22 8.5 21.33 10 20.5 10H19V8.5ZM17.5 8.5C17.5 9.33 16.83 10 16 10S14.5 9.33 14.5 8.5V3.5C14.5 2.67 15.17 2 16 2S17.5 2.67 17.5 3.5V8.5Z" fill="#4A154B"/>
            <path d="M15.5 19C16.33 19 17 19.67 17 20.5S16.33 22 15.5 22 14 21.33 14 20.5V19H15.5ZM15.5 17.5C14.67 17.5 14 16.83 14 16S14.67 14.5 15.5 14.5H20.5C21.33 14.5 22 15.17 22 16S21.33 17.5 20.5 17.5H15.5Z" fill="#4A154B"/>
          </svg>
        );
      case 'zoom':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#2D8CFF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" fill="none"/>
              <line x1="16" y1="16" x2="20" y2="20" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'dropbox':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#0061FF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '14px', height: '11px', border: '1.5px solid white', borderRadius: '2px' }}></div>
          </div>
        );
      case 'github':
        return (
          <svg style={iconStyle} viewBox="0 0 24 24" fill="#181717">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 4.87 20.17 8.84 21.49C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.16 21.49C19.13 20.17 22 16.42 22 12C22 6.48 17.52 2 12 2Z"/>
          </svg>
        );
      case 'figma':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#F24E1E', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>F</div>
        );
      case 'canva':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#00C4CC', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>C</div>
        );
      case 'jira':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#0052CC', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        );
      case 'notion':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#000000', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>N</div>
        );
      case 'salesforce':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#00A1E0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 3C6.48 3 2 6.48 2 11C2 15.52 6.48 19 12 19C17.52 19 22 15.52 22 11C22 6.48 17.52 3 12 3Z"/>
            </svg>
          </div>
        );
      case 'zendesk':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#03363D', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>Z</div>
        );
      case 'hubspot':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#FF7A59', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>H</div>
        );
      case 'zapier':
        return (
          <div style={{ ...iconStyle, backgroundColor: '#FF4A00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>⚡</div>
        );
      case 'other':
        return (
          <div style={{ ...iconStyle, border: '1px solid #646f79', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#646f79', fontSize: '12px' }}>+</div>
        );
      default:
        return <div style={iconStyle}></div>;
    }
  };

  const tools = [
    { id: 'gmail', name: 'Gmail' },
    { id: 'google-drive', name: 'Google Drive' },
    { id: 'onedrive', name: 'Microsoft OneDrive' },
    { id: 'outlook', name: 'Microsoft Outlook' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'slack', name: 'Slack' },
    { id: 'zoom', name: 'Zoom' },
    { id: 'dropbox', name: 'Dropbox' },
    { id: 'github', name: 'GitHub' },
    { id: 'figma', name: 'Figma' },
    { id: 'canva', name: 'Canva' },
    { id: 'jira', name: 'Jira Cloud' },
    { id: 'notion', name: 'Notion' },
    { id: 'salesforce', name: 'Salesforce' },
    { id: 'zendesk', name: 'Zendesk' },
    { id: 'hubspot', name: 'HubSpot' },
    { id: 'zapier', name: 'Zapier' },
    { id: 'other', name: 'Other' },
  ];

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to setup first project page
    navigate('/setup-first-project');
  };

  const handleBack = () => {
    navigate('/tell-us-about-work');
  };

  return (
    <div className="onboarding-page" style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      {/* Left Section - Form */}
      <div style={{
        flex: '0 0 60%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 24px',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <img
            src={asanaLogo}
            alt="Asana"
            style={{
              height: '28px',
              width: 'auto'
            }}
          />
        </div>

        {/* Back Button and Heading */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '16px',
              fontSize: '16px',
              color: '#646f79',
              fontFamily: 'inherit'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '8px' }}>
              <path
                d="M12 5L7 10L12 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 500,
            color: '#3d3d3d',
            margin: '0',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            fontFamily: '"Ghost", "Helvetica Neue", "Helvetica", sans-serif'
          }}>
            What tools do you use?
          </h1>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#646f79',
          margin: '0 0 32px 0',
          lineHeight: '1.5'
        }}>
          Asana connects to tools your team uses every day. Understanding your tools will help us tailor Asana and help you find the right features for your team.
        </p>

        {/* Tools Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          marginBottom: '12px'
        }}>
          {tools.map((tool) => {
            const isSelected = selectedTools.includes(tool.id);
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => toggleTool(tool.id)}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: isSelected ? '2px solid #3d3d3d' : '1px solid #e7e7e7',
                  backgroundColor: isSelected ? '#f5f5f5' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#b7bfc6';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#e7e7e7';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <ToolIcon toolId={tool.id} />
                <span style={{
                  fontSize: '10px',
                  color: '#3d3d3d',
                  fontWeight: 500,
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 500,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#008ce3',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0078d4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#008ce3';
          }}
        >
          Continue
        </button>
      </div>

      {/* Right Section - Decorative Illustration */}
      <div style={{
        flex: '0 0 40%',
        backgroundColor: '#ffedef',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Puzzle Pieces Illustration */}
        <svg
          width="400"
          height="400"
          viewBox="0 0 200 200"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          {/* Three white puzzle pieces (bottom-left) */}
          {/* Piece 1 - Bottom left */}
          <g transform="translate(50, 120)">
            <path
              d="M 0 0 L 30 0 L 30 20 L 40 20 L 40 30 L 30 30 L 30 50 L 0 50 L 0 30 L -10 30 L -10 20 L 0 20 Z"
              fill="#ffffff"
              stroke="#690031"
              strokeWidth="2"
            />
          </g>

          {/* Piece 2 - Bottom center */}
          <g transform="translate(70, 120)">
            <path
              d="M 0 0 L 30 0 L 30 20 L 40 20 L 40 30 L 30 30 L 30 50 L 0 50 L 0 30 L -10 30 L -10 20 L 0 20 Z"
              fill="#ffffff"
              stroke="#690031"
              strokeWidth="2"
            />
          </g>

          {/* Piece 3 - Bottom right */}
          <g transform="translate(90, 120)">
            <path
              d="M 0 0 L 30 0 L 30 20 L 40 20 L 40 30 L 30 30 L 30 50 L 0 50 L 0 30 L -10 30 L -10 20 L 0 20 Z"
              fill="#ffffff"
              stroke="#690031"
              strokeWidth="2"
            />
          </g>

          {/* Coral-red puzzle piece (falling/placing) */}
          <g transform="translate(100, 60)">
            <path
              d="M 0 0 L 30 0 L 30 20 L 40 20 L 40 30 L 30 30 L 30 50 L 0 50 L 0 30 L -10 30 L -10 20 L 0 20 Z"
              fill="#FF584A"
              stroke="#690031"
              strokeWidth="2"
            />
            {/* Movement lines above */}
            <line x1="15" y1="-5" x2="15" y2="-15" stroke="#690031" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="-8" x2="10" y2="-18" stroke="#690031" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="-8" x2="20" y2="-18" stroke="#690031" strokeWidth="1.5" strokeLinecap="round"/>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default WhatToolsDoYouUse;

