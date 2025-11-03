import BaseModal from './BaseModal';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FilterModal({ isOpen, onClose }: FilterModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Filter" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Assignee Filter */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Assignee
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
            <option value="all">All assignees</option>
            <option value="me">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Due date
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
            <option value="all">All dates</option>
            <option value="today">Due today</option>
            <option value="tomorrow">Due tomorrow</option>
            <option value="this-week">Due this week</option>
            <option value="overdue">Overdue</option>
            <option value="no-date">No due date</option>
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Project
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
            <option value="all">All projects</option>
            <option value="na">NA</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            marginBottom: '8px',
            display: 'block',
          }}>
            Status
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ color: 'rgb(245, 244, 243)', fontSize: '14px' }}>Incomplete</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ color: 'rgb(245, 244, 243)', fontSize: '14px' }}>Completed</span>
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
            Clear
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

export default FilterModal;


