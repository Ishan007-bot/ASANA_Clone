import { useState, useEffect, useMemo } from 'react';
import type { Task } from '../types/Task';
import usersApi from '../services/usersApi';
import type { User } from '../services/usersApi';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskFormProps {
  task?: Task;
  initialTask?: Task;
  projectId?: string;
  onSubmit?: (task: Partial<Task>) => void | Promise<void>;
  onSave?: (task: Partial<Task>) => void | Promise<void>;
  onCancel?: () => void;
}

function TaskForm({ task, initialTask, projectId, onSubmit, onSave, onCancel }: TaskFormProps) {
  const initialData = task || initialTask;
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? initialData.dueDate.split('T')[0] : '');
  const [assignee, setAssignee] = useState(initialData?.assignee || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  
  // User lookup for assignments
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Load users for assignment
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await usersApi.getAll();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };
    loadUsers();
  }, []);

  // Filter users based on search
  useEffect(() => {
    if (!userSearch.trim()) {
      setFilteredUsers(users.slice(0, 10)); // Show first 10 users
    } else {
      const searchLower = userSearch.toLowerCase();
      const filtered = users
        .filter((u) => 
          u.name?.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
        )
        .slice(0, 10);
      setFilteredUsers(filtered);
    }
  }, [userSearch, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const taskData: Partial<Task> = {
        name: name.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        assignee: assignee || undefined,
        priority,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : undefined,
        projectId: projectId || initialData?.projectId,
        sectionId: initialData?.sectionId,
        completed: initialData?.completed || false,
      };

      if (onSubmit) {
        await onSubmit(taskData);
      } else if (onSave) {
        await onSave(taskData);
      }
    } catch (err) {
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setAssignee(user.name || user.email);
    setUserSearch('');
    setShowUserDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'rgb(245, 244, 243)', fontSize: '14px', fontWeight: 500 }}>
          Task Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-primary)',
            background: '#2A2B2D',
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'rgb(245, 244, 243)', fontSize: '14px', fontWeight: 500 }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-primary)',
            background: '#2A2B2D',
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgb(245, 244, 243)', fontSize: '14px', fontWeight: 500 }}>
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: '#2A2B2D',
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgb(245, 244, 243)', fontSize: '14px', fontWeight: 500 }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: '#2A2B2D',
              color: 'rgb(245, 244, 243)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'rgb(245, 244, 243)', fontSize: '14px', fontWeight: 500 }}>
          Assignee
        </label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => {
            setAssignee(e.target.value);
            setUserSearch(e.target.value);
            setShowUserDropdown(true);
          }}
          onFocus={() => setShowUserDropdown(true)}
          placeholder="Enter name or email"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-primary)',
            background: '#2A2B2D',
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
          }}
        />
        {showUserDropdown && filteredUsers.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: '#2A2B2D',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-primary)',
                  color: 'rgb(245, 244, 243)',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#252628';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ fontWeight: 500 }}>{user.name || user.email}</div>
                {user.name && (
                  <div style={{ fontSize: '12px', color: 'rgba(245, 244, 243, 0.6)' }}>
                    {user.email}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {assignee && (
          <button
            type="button"
            onClick={() => {
              setAssignee('');
              setUserSearch('');
            }}
            style={{
              position: 'absolute',
              right: '8px',
              top: '32px',
              background: 'none',
              border: 'none',
              color: 'rgb(245, 244, 243)',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        )}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', color: 'rgb(245, 244, 243)', fontSize: '14px', fontWeight: 500 }}>
          Tags
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-primary)',
            background: '#2A2B2D',
            color: 'rgb(245, 244, 243)',
            fontSize: '14px',
          }}
        />
        <div style={{ marginTop: '4px', fontSize: '12px', color: 'rgba(245, 244, 243, 0.6)' }}>
          Separate tags with commas
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)',
              background: '#2A2B2D',
              color: 'rgb(245, 244, 243)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !name.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: loading ? '#4a5568' : '#4573d2',
            color: 'white',
            cursor: loading ? 'wait' : 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            opacity: loading || !name.trim() ? 0.6 : 1,
          }}
        >
          {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
