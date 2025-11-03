import BaseModal from './BaseModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

function ShareModal({ isOpen, onClose, title = 'Share' }: ShareModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Share Link Section */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Share link
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value="https://app.asana.com/share/..."
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: '#1E1F21',
                color: 'rgb(245, 244, 243)',
                fontSize: '14px',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            />
            <button
              onClick={() => navigator.clipboard.writeText('https://app.asana.com/share/...')}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'transparent',
                color: 'rgb(245, 244, 243)',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Permission Settings */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Who can access
          </label>
          <select
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: '#1E1F21',
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            <option value="public">Anyone with the link</option>
            <option value="workspace">People in My workspace</option>
            <option value="private">Only invited people</option>
          </select>
        </div>

        {/* Add People Section */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Add people
          </label>
          <input
            type="text"
            placeholder="Enter email addresses"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: '#1E1F21',
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          />
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
            Share
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

export default ShareModal;


