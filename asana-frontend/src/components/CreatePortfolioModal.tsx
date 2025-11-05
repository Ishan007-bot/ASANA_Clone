import { useState } from 'react';
import BaseModal from './BaseModal';
import portfoliosApi, { type Portfolio } from '../services/portfoliosApi';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPortfolioCreated?: (portfolio: Portfolio) => void;
}

function CreatePortfolioModal({ isOpen, onClose, onPortfolioCreated }: CreatePortfolioModalProps) {
  const [portfolioName, setPortfolioName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const newPortfolio = await portfoliosApi.create({
        name: portfolioName.trim(),
        description: description.trim() || undefined,
      });
      
      onPortfolioCreated?.(newPortfolio);
      setPortfolioName('');
      setDescription('');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create portfolio';
      setError(errorMessage);
      console.error('Error creating portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create portfolio" maxWidth="600px">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Portfolio Name */}
          <div>
            <label style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'block',
            }}>
              Portfolio name *
            </label>
            <input
              type="text"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="e.g., Q4 Initiatives"
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
              placeholder="What's this portfolio about?"
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
              disabled={loading || !portfolioName.trim()}
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
                opacity: loading || !portfolioName.trim() ? 0.6 : 1,
              }}
            >
              {loading ? 'Creating...' : 'Create portfolio'}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default CreatePortfolioModal;


