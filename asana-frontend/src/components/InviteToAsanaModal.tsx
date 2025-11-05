import { useState } from 'react';
import BaseModal from './BaseModal';

interface InviteToAsanaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InviteToAsanaModal({ isOpen, onClose }: InviteToAsanaModalProps) {
  const [emails, setEmails] = useState('');
  const [projects, setProjects] = useState('cross functional');

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Invite people to My workspace" maxWidth="760px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Email addresses</label>
          <textarea
            rows={6}
            placeholder="name@gmail.com, name@gmail.com, ..."
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)', resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Add to projects</label>
          <input
            type="text"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'rgb(245, 244, 243)', marginRight: '8px' }}>Cancel</button>
          <button type="button" onClick={onClose} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: '#fff' }}>Send</button>
        </div>
      </div>
    </BaseModal>
  );
}

export default InviteToAsanaModal;
