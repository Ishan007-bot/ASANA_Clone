import { useState, useEffect } from 'react';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  maxWidth?: string;
  height?: string;
}

function BaseModal({ isOpen, onClose, title, children, width = '90%', maxWidth = '600px', height = 'auto' }: BaseModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="ModalManager"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
        animation: isClosing ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-in',
      }}
      onClick={handleOverlayClick}
    >
      <div
        className="ThemeableCardPresentation ThemeableCardPresentation--isValid HighlightSol HighlightSol--buildingBlock"
        style={{
          backgroundColor: '#2A2B2D',
          borderRadius: '8px',
          padding: '24px',
          width,
          maxWidth,
          height,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          animation: isClosing ? 'slideOut 0.2s ease-out' : 'slideIn 0.2s ease-in',
          border: '1px solid var(--border-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '20px',
            margin: 0,
          }}>
            {title}
          </h2>
          <button
            onClick={handleClose}
            style={{
              padding: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close"
          >
            <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"></path>
            </svg>
          </button>
        </div>
        {children}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-20px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

export default BaseModal;


