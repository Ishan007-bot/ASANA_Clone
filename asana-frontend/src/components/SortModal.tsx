import BaseModal from './BaseModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SortModal({ isOpen, onClose }: SortModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Sort" maxWidth="400px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {['Newest', 'Oldest', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)', 'Due date', 'Created date'].map((option) => (
          <button
            key={option}
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: 'transparent',
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 400,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </BaseModal>
  );
}

export default SortModal;


