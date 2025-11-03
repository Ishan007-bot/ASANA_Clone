import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../types/Task';
import TaskCard from './TaskCard';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface Section {
  id: string;
  name: string;
  position: number;
}

interface BoardColumnProps {
  section: Section;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

function BoardColumn({ section, tasks, onTaskClick }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: section.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="BoardColumn"
      style={{
        minWidth: '280px',
        width: '280px',
        backgroundColor: '#2A2B2D',
        borderRadius: '8px',
        padding: '16px',
        border: isOver ? '2px dashed #4573d2' : '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: 'calc(100vh - 250px)',
        overflowY: 'auto',
      }}
    >
      <div
        className="BoardColumn-header"
        style={{
          paddingBottom: '12px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '8px',
        }}
      >
        <h3
          className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--medium TypographyPresentation--fontWeightMedium HighlightSol HighlightSol--buildingBlock"
          style={{ margin: 0, color: 'rgb(245, 244, 243)' }}
        >
          {section.name}
        </h3>
        <span
          className="TypographyPresentation TypographyPresentation--colorWeak TypographyPresentation--small HighlightSol HighlightSol--buildingBlock"
          style={{ marginTop: '4px', display: 'block' }}
        >
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {tasks.length === 0 ? (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              No tasks
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default BoardColumn;


