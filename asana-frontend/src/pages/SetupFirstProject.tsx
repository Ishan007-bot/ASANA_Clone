import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function SetupFirstProject() {
  const [projectIdea, setProjectIdea] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('onboardingProjectIdea');
    if (saved) setProjectIdea(saved);
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('onboardingProjectIdea', projectIdea);
    navigate('/setup-tasks');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 38%', padding: '40px 60px', backgroundColor: '#ffffff' }}>
        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <img src={asanaLogo} alt="Asana" style={{ height: 28 }} />
        </div>

        {/* Progress Bar */}
        <div style={{ height: 8, backgroundColor: '#e7e7e7', borderRadius: 999, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ width: '22%', height: '100%', backgroundColor: '#5bb68d' }} />
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 48, fontWeight: 500, color: '#1e1f21', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Let's set up your
          <br />
          first project
        </h1>

        {/* Question */}
        <div style={{ marginTop: 32, marginBottom: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e1f21', margin: 0 }}>What's something you and your team are currently working on?</h3>
        </div>

        {/* Input */}
        <form onSubmit={handleContinue}>
          <input
            type="text"
            value={projectIdea}
            onChange={(e) => {
              setProjectIdea(e.target.value);
              localStorage.setItem('onboardingProjectIdea', e.target.value);
            }}
            placeholder="e.g. Cross-functional project plan"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 16,
              borderRadius: 6,
              border: '1px solid #cfcfcf',
              outline: 'none',
              marginBottom: 16,
              color: '#000000'
            }}
          />

          <button
            type="submit"
            style={{
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#0069ff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Continue
          </button>
        </form>
      </div>

      {/* Right Panel Illustration */}
      <div style={{ flex: '1 1 auto', backgroundColor: '#ffedef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          width: '88%',
          maxWidth: 980,
          height: '70%',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          position: 'relative',
        }}>
          {/* Browser chrome */}
          <div style={{ height: 48, backgroundColor: '#f2f1f0', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#cfcfcf' }} />
          </div>

          {/* Content icon and bar */}
          <div style={{ padding: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, backgroundColor: '#bceae1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#1e1f21', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 6, top: 6, width: 16, height: 3, backgroundColor: '#ffffff', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: 6, top: 12, width: 16, height: 3, backgroundColor: '#ffffff', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: 6, top: 18, width: 16, height: 3, backgroundColor: '#ffffff', borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ flex: '0 0 520px', height: 28, backgroundColor: '#e8e5e4', borderRadius: 999, position: 'relative', display: 'flex', alignItems: 'center', padding: '0 16px', overflow: 'hidden' }}>
                <span style={{
                  fontSize: 14,
                  color: '#5f6368',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  {projectIdea && projectIdea.trim().length > 0 ? projectIdea : 'e.g. Cross-functional project plan'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupFirstProject;
