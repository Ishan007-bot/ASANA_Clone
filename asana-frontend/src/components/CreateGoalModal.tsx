import { useState } from 'react';
import BaseModal from './BaseModal';
import goalsApi, { type Goal } from '../services/goalsApi';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated?: (goal: Goal) => void;
}

function CreateGoalModal({ isOpen, onClose, onGoalCreated }: CreateGoalModalProps) {
  const [goalTitle, setGoalTitle] = useState('');
  const [timePeriod, setTimePeriod] = useState('Q4 FY25');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const newGoal = await goalsApi.create({
        title: goalTitle.trim(),
        timePeriod,
      });
      
      onGoalCreated?.(newGoal);
      setGoalTitle('');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal';
      setError(errorMessage);
      console.error('Error creating goal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create goal" maxWidth="600px">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Goal Title */}
          <div>
            <label style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'block',
            }}>
              Goal title *
            </label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g., Launch new product"
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

          {/* Time Period */}
          <div>
            <label style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              marginBottom: '8px',
              display: 'block',
            }}>
              Time period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
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
            >
              <option value="Q4 FY25">Q4 FY25</option>
              <option value="Q1 FY26">Q1 FY26</option>
              <option value="Q2 FY26">Q2 FY26</option>
              <option value="Q3 FY26">Q3 FY26</option>
            </select>
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
              disabled={loading || !goalTitle.trim()}
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
                opacity: loading || !goalTitle.trim() ? 0.6 : 1,
              }}
            >
              {loading ? 'Creating...' : 'Create goal'}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default CreateGoalModal;


