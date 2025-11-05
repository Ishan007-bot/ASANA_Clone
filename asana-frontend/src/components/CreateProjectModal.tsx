import { useState } from 'react';
import BaseModal from './BaseModal';
import projectsApi, { type Project } from '../services/projectsApi';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: Project) => void;
}

function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('aqua');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = [
    { value: 'aqua', label: 'Aqua', hex: '#06b6d4' },
    { value: 'blue', label: 'Blue', hex: '#3b82f6' },
    { value: 'green', label: 'Green', hex: '#10b981' },
    { value: 'yellow', label: 'Yellow', hex: '#eab308' },
    { value: 'orange', label: 'Orange', hex: '#f97316' },
    { value: 'red', label: 'Red', hex: '#ef4444' },
    { value: 'pink', label: 'Pink', hex: '#ec4899' },
    { value: 'purple', label: 'Purple', hex: '#a855f7' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const newProject = await projectsApi.create({
        name: projectName.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
        view_type: 'list',
      });
      
      onProjectCreated?.(newProject);
      setProjectName('');
      setDescription('');
      setColor('aqua');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create project" maxWidth="600px">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Project Name */}
          <div>
            <label style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'block',
            }}>
              Project name *
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Website Redesign"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: '#1E1F21',
                color: '#000000',
                fontSize: '14px',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'block',
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: '#1E1F21',
                color: '#000000',
                fontSize: '14px',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              marginBottom: '12px',
              display: 'block',
            }}>
              Color
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    border: `2px solid ${color === c.value ? c.hex : 'var(--border-primary)'}`,
                    background: c.hex,
                    cursor: 'pointer',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={c.label}
                >
                  {color === c.value && (
                    <svg aria-hidden="true" className="Icon" style={{ width: '20px', height: '20px', color: 'white' }} viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"></path>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border-primary)' }}>
            <button
              type="button"
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
              type="submit"
              disabled={loading || !projectName.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: loading ? '#4a5568' : 'var(--accent-primary)',
                color: 'white',
                fontSize: '14px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                opacity: loading || !projectName.trim() ? 0.6 : 1,
              }}
            >
              {loading ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default CreateProjectModal;


