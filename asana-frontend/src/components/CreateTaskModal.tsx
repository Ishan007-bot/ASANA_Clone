import { useState } from 'react';
import TaskForm from './TaskForm';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CreateTaskModalProps {
  projectId?: string;
  onClose: () => void;
  onTaskCreated?: (task: Partial<Task> | Task) => void;
}

function CreateTaskModal({ projectId, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  const handleSubmit = (task: Partial<Task>) => {
    onTaskCreated?.(task);
    handleClose();
  };

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
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          animation: isClosing ? 'slideOut 0.2s ease-out' : 'slideIn 0.2s ease-in',
          border: '1px solid var(--border-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '24px' }}>
          <h2 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--h3 TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock" style={{ color: 'rgb(245, 244, 243)' }}>
            Create Task
          </h2>
        </div>
        <TaskForm projectId={projectId} onSubmit={handleSubmit} onCancel={handleClose} />
      </div>
      <style>{`
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
      `}</style>
    </div>
  );
}

export default CreateTaskModal;

