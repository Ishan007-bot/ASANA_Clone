import BaseModal from './BaseModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CustomizeModal({ isOpen, onClose }: CustomizeModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Customize view" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Column Visibility */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '12px',
            display: 'block',
          }}>
            Show columns
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Name', 'Due date', 'Assignees', 'Projects', 'Tags', 'Priority', 'Created date'].map((col) => (
              <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span style={{ color: 'rgb(245, 244, 243)', fontSize: '14px' }}>{col}</span>
              </label>
            ))}
          </div>
        </div>

        {/* View Options */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '12px',
            display: 'block',
          }}>
            View options
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ color: 'rgb(245, 244, 243)', fontSize: '14px' }}>Show completed tasks</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ color: 'rgb(245, 244, 243)', fontSize: '14px' }}>Group by project</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ color: 'rgb(245, 244, 243)', fontSize: '14px' }}>Group by assignee</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: 'transparent',
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--accent-primary)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

export default CustomizeModal;


