import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function SetupSections() {
  const [section1, setSection1] = useState('To do');
  const [section2, setSection2] = useState('Doing');
  const [section3, setSection3] = useState('Done');
  const [projectTitle, setProjectTitle] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProjectTitle(localStorage.getItem('onboardingProjectIdea') || '');
    const t1 = localStorage.getItem('onboardingTask1') || '';
    const t2 = localStorage.getItem('onboardingTask2') || '';
    const t3 = localStorage.getItem('onboardingTask3') || '';
    setTasks([t1, t2, t3].filter(Boolean));
  }, []);

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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('onboardingSection1', section1);
    localStorage.setItem('onboardingSection2', section2);
    localStorage.setItem('onboardingSection3', section3);
    navigate('/setup-layout');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif' }}>
      {/* Left panel */}
      <div style={{ flex: '0 0 38%', padding: '40px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <img src={asanaLogo} alt="Asana" style={{ height: 28 }} />
        </div>
        <div style={{ height: 8, backgroundColor: '#e7e7e7', borderRadius: 999, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ width: '65%', height: '100%', backgroundColor: '#5bb68d' }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1e1f21', margin: 0, lineHeight: 1.4 }}>
          How would you group these tasks into sections or stages?
        </h1>
        <form onSubmit={handleContinue} style={{ marginTop: 24 }}>
          <input style={inputStyle} value={section1} onChange={(e) => setSection1(e.target.value)} />
          <input style={inputStyle} value={section2} onChange={(e) => setSection2(e.target.value)} />
          <input style={inputStyle} value={section3} onChange={(e) => setSection3(e.target.value)} />
          <button type="submit" style={{ padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#0069ff', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 12 }}>Continue</button>
        </form>
      </div>

      {/* Right preview */}
      <div style={{ flex: '1 1 auto', backgroundColor: '#ffedef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '88%', maxWidth: 980, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ height: 48, background: '#f2f1f0', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
          </div>

          <div style={{ padding: 24 }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#bceae1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: '#1e1f21', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 4, top: 4, width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: 4, top: 9, width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: 4, top: 14, width: 12, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
                </div>
              </div>
              <h2 style={{ fontSize: 28, margin: 0, color: '#1e1f21' }}>{(projectTitle || 'your project').toLowerCase()}</h2>
            </div>

            {/* Sections */}
            {[section1, section2, section3].map((sec, idx) => (
              <div key={idx} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderLeft: '2px solid #1e1f21', borderBottom: '2px solid #1e1f21', transform: 'rotate(-45deg)' }} />
                  <h3 style={{ margin: 0, fontSize: 22, color: '#1e1f21' }}>{sec}</h3>
                </div>
                {(idx === 0 ? tasks : []).map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                    <div style={{ width: 22, height: 22, border: '2px solid #c7c7c7', borderRadius: 999 }} />
                    <div style={{ flex: '0 0 520px', height: 14, backgroundColor: '#efeded', borderRadius: 999, display: 'flex', alignItems: 'center', padding: '0 12px', overflow: 'hidden' }}>
                      <span style={{ fontSize: 14, color: '#5f6368', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>{t}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupSections;
