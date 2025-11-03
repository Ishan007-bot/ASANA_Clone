import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface TaskFormProps {
  projectId?: string;
  initialTask?: Task;
  onCancel?: () => void;
  onSubmit?: (task: Task) => void;
}

function TaskForm({ projectId, initialTask, onCancel, onSubmit }: TaskFormProps) {
  const { createTask, updateTask } = useTasks();
  const [name, setName] = useState(initialTask?.name || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [assignee, setAssignee] = useState(initialTask?.assignee || '');
  const [priority, setPriority] = useState<Task['priority']>(initialTask?.priority || 'medium');
  const [tags, setTags] = useState(initialTask?.tags?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        name: name.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        assignee: assignee.trim() || undefined,
        priority,
        tags: tags.trim() ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        projectId,
        completed: initialTask?.completed || false,
      };

      let task: Task;
      if (initialTask) {
        const updated = await Promise.resolve(updateTask(initialTask.id, taskData));
        if (!updated) throw new Error('Failed to update task');
        task = updated;
      } else {
        task = await Promise.resolve(createTask(taskData));
      }

      onSubmit?.(task);
      
      // Reset form if creating new task
      if (!initialTask) {
        setName('');
        setDescription('');
        setDueDate('');
        setAssignee('');
        setPriority('medium');
        setTags('');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="TaskForm" onSubmit={handleSubmit}>
      <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ marginBottom: '16px' }}>
        <div className="FormRowLayout-label">
          <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="task-name">
            Task name <span style={{ color: '#f87171' }}>*</span>
          </label>
        </div>
        <div className="FormRowLayout-contents">
          <div className="ValidatedInput HighlightSol HighlightSol--core">
            <input
              id="task-name"
              type="text"
              className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              required
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ marginBottom: '16px' }}>
        <div className="FormRowLayout-label">
          <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="task-description">
            Description
          </label>
        </div>
        <div className="FormRowLayout-contents">
          <div className="ValidatedInput HighlightSol HighlightSol--core">
            <textarea
              id="task-description"
              className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ flex: 1 }}>
          <div className="FormRowLayout-label">
            <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="task-due-date">
              Due date
            </label>
          </div>
          <div className="FormRowLayout-contents">
            <div className="ValidatedInput HighlightSol HighlightSol--core">
              <input
                id="task-due-date"
                type="date"
                className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ flex: 1 }}>
          <div className="FormRowLayout-label">
            <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="task-assignee">
              Assignee
            </label>
          </div>
          <div className="FormRowLayout-contents">
            <div className="ValidatedInput HighlightSol HighlightSol--core">
              <input
                id="task-assignee"
                type="text"
                className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Enter initials or name"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ flex: 1 }}>
          <div className="FormRowLayout-label">
            <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="task-priority">
              Priority
            </label>
          </div>
          <div className="FormRowLayout-contents">
            <div className="ValidatedInput HighlightSol HighlightSol--core">
              <select
                id="task-priority"
                className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="FormRowLayout--labelPlacementTop FormRowLayout" style={{ flex: 1 }}>
          <div className="FormRowLayout-label">
            <label className="LabelPresentation HighlightSol HighlightSol--core" htmlFor="task-tags">
              Tags
            </label>
          </div>
          <div className="FormRowLayout-contents">
            <div className="ValidatedInput HighlightSol HighlightSol--core">
              <input
                id="task-tags"
                type="text"
                className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium HighlightSol HighlightSol--core"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        {onCancel && (
          <div
            className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large ButtonSecondaryPresentation ButtonSecondaryPresentation--sentimentDefault SecondaryButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
            role="button"
            tabIndex={0}
            onClick={onCancel}
          >
            Cancel
          </div>
        )}
        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          className="ButtonThemeablePresentation--isEnabled ButtonThemeablePresentation ButtonThemeablePresentation--large ButtonPrimaryPresentation ButtonPrimaryPresentation--sentimentSelectedStrong ButtonPrimaryPresentation--enabled PrimaryButton HighlightSol HighlightSol--core HighlightSol--buildingBlock Stack Stack--align-center Stack--direction-row Stack--display-inline Stack--justify-center"
          style={{ opacity: (!name.trim() || isSubmitting) ? 0.6 : 1, cursor: (!name.trim() || isSubmitting) ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;

