import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function SetupTasks() {
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [task3, setTask3] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('onboardingProjectIdea') || '';
    setProjectTitle(stored.trim());
    // restore tasks if present
    setTask1(localStorage.getItem('onboardingTask1') || '');
    setTask2(localStorage.getItem('onboardingTask2') || '');
    setTask3(localStorage.getItem('onboardingTask3') || '');
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('onboardingTask1', task1);
    localStorage.setItem('onboardingTask2', task2);
    localStorage.setItem('onboardingTask3', task3);
    navigate('/setup-sections');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #cfcfcf',
    outline: 'none',
    marginBottom: 12,
    color: '#000000'
  };

  return (
    <div className="onboarding-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 38%', padding: '40px 60px', backgroundColor: '#ffffff' }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <img src={asanaLogo} alt="Asana" style={{ height: 28 }} />
        </div>

        {/* Progress Bar */}
        <div style={{ height: 8, backgroundColor: '#e7e7e7', borderRadius: 999, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ width: '45%', height: '100%', backgroundColor: '#5bb68d' }} />
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1e1f21', margin: 0, lineHeight: 1.4 }}>
          What are a few tasks that you have to do for {projectTitle || 'your project'}?
        </h1>

        {/* Inputs */}
        <form onSubmit={handleContinue} style={{ marginTop: 24 }}>
          <input value={task1} onChange={(e) => { setTask1(e.target.value); localStorage.setItem('onboardingTask1', e.target.value); }} placeholder="e.g. Draft project brief" style={inputStyle} />
          <input value={task2} onChange={(e) => { setTask2(e.target.value); localStorage.setItem('onboardingTask2', e.target.value); }} placeholder="e.g. Schedule kickoff meeting" style={inputStyle} />
          <input value={task3} onChange={(e) => { setTask3(e.target.value); localStorage.setItem('onboardingTask3', e.target.value); }} placeholder="e.g. Share timeline with teammates" style={inputStyle} />

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
              marginTop: 12
            }}
          >
            Continue
          </button>
        </form>
      </div>

      {/* Right Preview */}
      <div style={{ flex: '1 1 auto', backgroundColor: '#ffedef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          width: '88%',
          maxWidth: 980,
          height: '80%',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          position: 'relative'
        }}>
          <div style={{ height: 48, backgroundColor: '#f2f1f0', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#cfcfcf' }} />
          </div>

          <div style={{ padding: 24 }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#bceae1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: '#1e1f21', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 4, top: 4, width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: 4, top: 9, width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: 4, top: 14, width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
                </div>
              </div>
              <h2 style={{ fontSize: 28, margin: 0, color: '#1e1f21' }}>{(projectTitle || 'your project').toLowerCase()}</h2>
            </div>

            {/* Task rows preview */}
            {[task1, task2, task3].map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                <div style={{ width: 22, height: 22, border: '2px solid #c7c7c7', borderRadius: 999 }} />
                <div style={{ flex: '0 0 520px', height: 14, backgroundColor: '#efeded', borderRadius: 999, display: 'flex', alignItems: 'center', padding: '0 12px', overflow: 'hidden' }}>
                  <span style={{ fontSize: 14, color: '#5f6368', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                    {t && t.trim().length > 0 ? t : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupTasks;
