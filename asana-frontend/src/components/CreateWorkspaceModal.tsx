import { useState } from 'react';
import BaseModal from './BaseModal';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create new workspace" maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Workspace Name</label>
          <input
            type="text"
            placeholder="Company or Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)' }}
          />
        </div>
        <div>
          <label style={{ color: 'rgb(245, 244, 243)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Members</label>
          <textarea
            placeholder="name@company.com, ..."
            rows={5}
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: '#1E1F21', color: 'rgb(245, 244, 243)', resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--border-primary)', background: 'transparent', color: 'rgb(245, 244, 243)', marginRight: '8px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: '#fff' }}
          >
            Create workspace
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

export default CreateWorkspaceModal;
