import BaseModal from './BaseModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function OptionsModal({ isOpen, onClose }: OptionsModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Options" maxWidth="400px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          'Export as CSV',
          'Export as PDF',
          'Print',
          'Duplicate',
          'Archive',
          'Delete',
        ].map((option) => (
          <button
            key={option}
            onClick={() => {
              if (option === 'Delete') {
                if (window.confirm('Are you sure you want to delete this?')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: option === 'Delete' ? '#ef4444' : 'rgb(245, 244, 243)',
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

export default OptionsModal;


