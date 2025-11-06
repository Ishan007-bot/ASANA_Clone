import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

function SetupInvite() {
  const [emails, setEmails] = useState<string[]>(['', '', '', '']);
  const [projectTitle, setProjectTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setProjectTitle(localStorage.getItem('onboardingProjectIdea') || '');
  }, []);

  const updateEmail = (idx: number, value: string) => {
    setEmails(prev => prev.map((e, i) => (i === idx ? value : e)));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark onboarding as completed
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/home');
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
    <div className="onboarding-page" style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif' }}>
      {/* Left */}
      <div style={{ flex: '0 0 38%', padding: '40px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <img src={asanaLogo} alt="Asana" style={{ height: 28 }} />
        </div>
        <div style={{ height: 8, background: '#e7e7e7', borderRadius: 999, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ width: '92%', height: '100%', background: '#5bb68d' }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1e1f21', margin: 0, lineHeight: 1.4 }}>Invite a teammate to try Asana together</h1>
        <p style={{ color: '#575e66', fontSize: 14, marginTop: 8 }}>You can start small by inviting a trusted teammate to learn how Asana works with you.</p>

        <form onSubmit={handleContinue} style={{ marginTop: 16 }}>
          <div style={{ color: '#1e1f21', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Email address</div>
          {emails.map((v, i) => (
            <input key={i} value={v} onChange={(e) => updateEmail(i, e.target.value)} placeholder={i === 0 ? "Teammate’s email" : "Teammate’s email"} style={inputStyle} />
          ))}
          <button type="submit" style={{ marginTop: 8, padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#0069ff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Take me to my project</button>
        </form>
      </div>

      {/* Right preview */}
      <div style={{ flex: '1 1 auto', background: '#ffedef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '92%', background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ height: 48, background: '#f2f1f0', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#bceae1' }} />
              <h2 style={{ margin: 0, fontSize: 24, color: '#1e1f21' }}>{(projectTitle || 'your project').toLowerCase()}</h2>
            </div>
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>List &nbsp; Board &nbsp; Timeline &nbsp; Calendar</div>

            {/* Simple rows preview like before */}
            {["draft", "schedule", "share"].map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 100px 120px', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid #f1f1f1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 999, border: '2px solid #c7c7c7' }} />
                  <span style={{ fontSize: 14, color: '#374151' }}>{t}</span>
                </div>
                <div style={{ height: 10, background: '#efefef', borderRadius: 999 }} />
                <div style={{ height: 24, background: '#eaf2ff', borderRadius: 999, width: 60 }} />
                <div style={{ height: 24, background: '#fdf1d5', borderRadius: 999, width: 70 }} />
                <div style={{ height: 10, background: '#efefef', borderRadius: 999 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupInvite;
