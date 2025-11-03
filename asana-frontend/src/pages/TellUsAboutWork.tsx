import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function TellUsAboutWork() {
  const [role, setRole] = useState('');
  const [functionType, setFunctionType] = useState('');
  const [useCase, setUseCase] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to What Tools Do You Use page
    navigate('/what-tools-do-you-use');
  };

  const isContinueDisabled = !role || !functionType || !useCase;

  return (
    <div style={{
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
        padding: '40px 60px',
        position: 'relative'
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

        {/* Main Heading */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 500,
          color: '#3d3d3d',
          margin: '0 0 16px 0',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          fontFamily: '"Ghost", "Helvetica Neue", "Helvetica", sans-serif'
        }}>
          Tell us about your work
        </h1>

        {/* Descriptive Text */}
        <p style={{
          fontSize: '16px',
          color: '#646f79',
          margin: '0 0 40px 0',
          lineHeight: '1.5'
        }}>
          This will help us tailor Asana for you. We may also reach out to help you find the right Asana products for your team.
        </p>

        {/* Form Fields */}
        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          {/* Role Dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: 500,
              color: '#3d3d3d',
              marginBottom: '12px'
            }}>
              What's your role?
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: '1px solid #cfcfcf',
                  backgroundColor: '#ffffff',
                  color: '#3d3d3d',
                  fontFamily: 'inherit',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="">Select your role</option>
                <option value="executive">Executive</option>
                <option value="manager">Manager</option>
                <option value="individual-contributor">Individual Contributor</option>
                <option value="project-manager">Project Manager</option>
                <option value="team-lead">Team Lead</option>
                <option value="administrator">Administrator</option>
              </select>
              {/* Chevron Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#646f79"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Function Dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: 500,
              color: '#3d3d3d',
              marginBottom: '12px'
            }}>
              Which function best describes your work?
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={functionType}
                onChange={(e) => setFunctionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: '1px solid #cfcfcf',
                  backgroundColor: '#ffffff',
                  color: '#3d3d3d',
                  fontFamily: 'inherit',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="">Select a function</option>
                <option value="engineering">Engineering</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
              {/* Chevron Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#646f79"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Use Case Dropdown */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '18px',
              fontWeight: 500,
              color: '#3d3d3d',
              marginBottom: '12px'
            }}>
              What do you want to use Asana for?
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: '1px solid #cfcfcf',
                  backgroundColor: '#ffffff',
                  color: '#3d3d3d',
                  fontFamily: 'inherit',
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="">Select a use case</option>
                <option value="project-management">Project Management</option>
                <option value="task-tracking">Task Tracking</option>
                <option value="team-collaboration">Team Collaboration</option>
                <option value="workflow-automation">Workflow Automation</option>
                <option value="goals-tracking">Goals Tracking</option>
                <option value="portfolio-management">Portfolio Management</option>
                <option value="reporting">Reporting</option>
                <option value="other">Other</option>
              </select>
              {/* Chevron Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#646f79"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isContinueDisabled}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: 500,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isContinueDisabled ? '#e7e7e7' : '#3d3d3d',
              color: isContinueDisabled ? '#868686' : '#ffffff',
              cursor: isContinueDisabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s, color 0.2s',
              marginTop: '8px'
            }}
          >
            Continue
          </button>
        </form>
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
        {/* Folder with Documents Illustration */}
        <svg
          width="400"
          height="400"
          viewBox="0 0 200 200"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          {/* Folder base */}
          <path
            d="M151.29 50.396v147.967H43.512V50.396c0-26.883 24.254-48.899 53.895-48.899s53.883 22.016 53.883 48.9Z"
            fill="#ffeaec"
            stroke="#690031"
            strokeWidth="2"
          />
          
          {/* Folder tab */}
          <path
            d="M97.395 50.396H43.512c0-26.883 24.254-48.899 53.895-48.899"
            fill="#ffeaec"
            stroke="#690031"
            strokeWidth="2"
          />

          {/* Document 1 - Bar chart */}
          <g transform="translate(110, 70)">
            <rect x="0" y="0" width="40" height="50" fill="#ffffff" stroke="#690031" strokeWidth="1.5" rx="2"/>
            {/* Bar chart bars */}
            <rect x="8" y="35" width="8" height="10" fill="#FF584A" stroke="#690031" strokeWidth="0.5"/>
            <rect x="20" y="30" width="8" height="15" fill="#FF584A" stroke="#690031" strokeWidth="0.5"/>
            <rect x="32" y="25" width="8" height="20" fill="#FF584A" stroke="#690031" strokeWidth="0.5"/>
          </g>

          {/* Document 2 - Pie chart */}
          <g transform="translate(75, 85)">
            <rect x="0" y="0" width="35" height="45" fill="#ffffff" stroke="#690031" strokeWidth="1.5" rx="2"/>
            {/* Pie chart */}
            <circle cx="17.5" cy="22" r="12" fill="#ffffff" stroke="#690031" strokeWidth="1.5"/>
            <path
              d="M 17.5 22 L 17.5 10 A 12 12 0 0 1 26.5 17 Z"
              fill="#FF584A"
              stroke="#690031"
              strokeWidth="0.5"
            />
          </g>

          {/* Document 3 - Lines */}
          <g transform="translate(130, 100)">
            <rect x="0" y="0" width="30" height="40" fill="#ffffff" stroke="#690031" strokeWidth="1.5" rx="2"/>
            {/* Horizontal lines */}
            <line x1="6" y1="12" x2="24" y2="12" stroke="#690031" strokeWidth="1"/>
            <line x1="6" y1="18" x2="24" y2="18" stroke="#690031" strokeWidth="1"/>
            <line x1="6" y1="24" x2="20" y2="24" stroke="#690031" strokeWidth="1"/>
            {/* Circle */}
            <circle cx="10" cy="10" r="3" fill="#ffffff" stroke="#690031" strokeWidth="1"/>
          </g>

          {/* Document 4 - Circle with lines */}
          <g transform="translate(90, 120)">
            <rect x="0" y="0" width="32" height="42" fill="#ffffff" stroke="#690031" strokeWidth="1.5" rx="2"/>
            {/* Circle */}
            <circle cx="16" cy="15" r="6" fill="#ffffff" stroke="#690031" strokeWidth="1"/>
            <line x1="16" y1="9" x2="16" y2="3" stroke="#690031" strokeWidth="1"/>
            <line x1="16" y1="21" x2="16" y2="27" stroke="#690031" strokeWidth="1"/>
            <line x1="10" y1="15" x2="4" y2="15" stroke="#690031" strokeWidth="1"/>
            <line x1="22" y1="15" x2="28" y2="15" stroke="#690031" strokeWidth="1"/>
          </g>

          {/* Vertical bar chart on folder */}
          <g transform="translate(85, 140)">
            <rect x="0" y="0" width="8" height="25" fill="#FF584A" stroke="#690031" strokeWidth="0.5"/>
            <rect x="12" y="5" width="8" height="20" fill="#FF584A" stroke="#690031" strokeWidth="0.5"/>
            <rect x="24" y="10" width="8" height="15" fill="#FF584A" stroke="#690031" strokeWidth="0.5"/>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default TellUsAboutWork;

