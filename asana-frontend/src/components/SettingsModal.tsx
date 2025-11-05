import { useState } from 'react';
import BaseModal from './BaseModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = ['Profile', 'Notifications', 'Email Forwarding', 'Account', 'Display', 'Apps', 'Hacks'] as const;

type Tab = typeof tabs[number];

function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [active, setActive] = useState<Tab>('Profile');

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Settings" maxWidth="900px" height="80vh">
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                background: active === t ? '#252628' : 'transparent',
                border: 'none',
                borderLeft: active === t ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: 'rgb(245, 244, 243)',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ borderLeft: '1px solid var(--border-primary)', paddingLeft: '16px' }}>
          {active === 'Profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Your full name</label>
                <input type="text" placeholder="Your name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)' }} />
              </div>
              <div>
                <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Pronouns</label>
                <input type="text" placeholder="Pronouns" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)' }} />
              </div>
              <div>
                <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Job title</label>
                <input type="text" placeholder="Job title" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)' }} />
              </div>
              <div>
                <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Department or team</label>
                <input type="text" placeholder="Department or team" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)' }} />
              </div>
            </div>
          )}
          {active !== 'Profile' && (
            <div style={{ color: 'var(--text-tertiary)' }}>Settings for {active} not implemented</div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

export default SettingsModal;
