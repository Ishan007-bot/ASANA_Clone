import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import asanaLogo from '../assets/asana-logo.png';

type LayoutType = 'list' | 'board' | 'timeline' | 'calendar';

function SetupLayout() {
  const [selected, setSelected] = useState<LayoutType>('list');
  const [projectTitle, setProjectTitle] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProjectTitle(localStorage.getItem('onboardingProjectIdea') || '');
    setTasks([
      localStorage.getItem('onboardingTask1') || '',
      localStorage.getItem('onboardingTask2') || '',
      localStorage.getItem('onboardingTask3') || ''
    ].filter(Boolean));
    setSections([
      localStorage.getItem('onboardingSection1') || 'To do',
      localStorage.getItem('onboardingSection2') || 'Doing',
      localStorage.getItem('onboardingSection3') || 'Done'
    ]);
  }, []);

  const Option = ({ id, title, icon }: { id: LayoutType; title: string; icon: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => { setSelected(id); localStorage.setItem('onboardingLayout', id); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, width: 220, height: 100,
        padding: 16, borderRadius: 12,
        border: selected === id ? '2px solid #6b8cff' : '1px solid #e3e3e3',
        background: selected === id ? '#eff2ff' : '#fff', cursor: 'pointer'
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#edf6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: 16, color: '#1e1f21', fontWeight: 600 }}>{title}</div>
    </button>
  );

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('onboardingLayout', selected);
    navigate('/setup-invite');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif' }}>
      {/* Left */}
      <div style={{ flex: '0 0 38%', padding: '40px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <img src={asanaLogo} alt="Asana" style={{ height: 28 }} />
        </div>
        <div style={{ height: 8, background: '#e7e7e7', borderRadius: 999, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ width: '80%', height: '100%', background: '#5bb68d' }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1e1f21', margin: 0, lineHeight: 1.4 }}>
          What layout works best for this project? You can change this later.
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
          <Option id="list" title="List" icon={<div style={{ width: 18, height: 4, background: '#4a6cf7', borderRadius: 2 }} />} />
          <Option id="board" title="Board" icon={<div style={{ width: 18, height: 18, border: '2px solid #4a6cf7', borderRadius: 4 }} />} />
          <Option id="timeline" title="Timeline" icon={<div style={{ width: 24, height: 8, background: '#4a6cf7', borderRadius: 4 }} />} />
          <Option id="calendar" title="Calendar" icon={<div style={{ width: 24, height: 24, border: '2px solid #4a6cf7', borderRadius: 4 }} />} />
        </div>

        <div style={{ color: '#575e66', fontSize: 14, marginTop: 16 }}>
          <span style={{ marginRight: 8 }}>💡</span>
          <span>{selected.charAt(0).toUpperCase() + selected.slice(1)} is great for tracking work.</span>
        </div>

        <button onClick={handleContinue} style={{ marginTop: 24, padding: '10px 16px', fontSize: 14, fontWeight: 600, color: '#fff', background: '#0069ff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Continue</button>
      </div>

      {/* Right Preview */}
      <div style={{ flex: '1 1 auto', background: '#ffedef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '92%', background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ height: 48, background: '#f2f1f0', borderTopLeftRadius: 12, borderTopRightRadius: 12, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
            <span style={{ width: 10, height: 10, borderRadius: 999, background: '#cfcfcf' }} />
          </div>
          {/* Title + tabs */}
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#bceae1' }} />
              <h2 style={{ margin: 0, fontSize: 24, color: '#1e1f21' }}>{(projectTitle || 'your project').toLowerCase()}</h2>
            </div>
            <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
              {(['list','board','timeline','calendar'] as LayoutType[]).map(l => (
                <span key={l} style={{ fontSize: 14, color: selected === l ? '#4a6cf7' : '#6b7280', fontWeight: selected === l ? 700 : 500 }}>{l.charAt(0).toUpperCase()+l.slice(1)}</span>
              ))}
            </div>

            {/* Content preview */}
            {selected === 'list' && (
              <div>
                {[sections[0], sections[1], sections[2]].map((sec, si) => (
                  <div key={si} style={{ marginBottom: 18 }}>
                    <h3 style={{ margin: '10px 0', color: '#1e1f21' }}>{sec}</h3>
                    {(si === 0 ? tasks : []).map((t, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 100px 120px', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid #f1f1f1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 999, border: '2px solid #c7c7c7' }} />
                          <span style={{ fontSize: 14, color: '#374151' }}>{t}</span>
                        </div>
                        <div style={{ height: 10, background: '#efefef', borderRadius: 999 }} />
                        <div style={{ height: 24, background: '#e3f7d4', borderRadius: 999, width: 60, textAlign: 'center', lineHeight: '24px', color: '#1f7a1f', fontSize: 12 }}>Low</div>
                        <div style={{ height: 24, background: '#eaf2ff', borderRadius: 999, width: 70, textAlign: 'center', lineHeight: '24px', color: '#3f5caa', fontSize: 12 }}>On track</div>
                        <div style={{ height: 10, background: '#efefef', borderRadius: 999 }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {selected === 'board' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {sections.map((sec, i) => (
                  <div key={i} style={{ background: '#fafafa', border: '1px solid #efefef', borderRadius: 8, padding: 10 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>{sec}</div>
                    {(i === 0 ? tasks : []).map((t, idx) => (
                      <div key={idx} style={{ background: '#fff', border: '1px solid #e9e9e9', borderRadius: 6, padding: 8, marginBottom: 8, fontSize: 14 }}>{t}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {selected === 'timeline' && (
              <div style={{ height: 140, border: '1px solid #efefef', borderRadius: 8, background: 'linear-gradient(90deg,#fafafa 10%, transparent 10%)', backgroundSize: '60px 100%' }} />
            )}

            {selected === 'calendar' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, border: '1px solid #efefef', padding: 6, borderRadius: 8 }}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} style={{ height: 54, background: '#fafafa', borderRadius: 6 }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupLayout;
