import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useTasks } from '../context/useTasks';
import type { Task } from '../types/Task';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import '../styles/d3ki9tyy5l5ruj_cloudfront_net__root.css';

interface Section {
  id: string;
  name: string;
  position: number;
}

interface BoardViewProps {
  projectId?: string;
  sections?: Section[];
  onTaskClick?: (task: Task) => void;
}

function BoardView({ projectId, sections: providedSections, onTaskClick }: BoardViewProps) {
  const { tasks, updateTask, getTasksByProject } = useTasks();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Default sections if not provided
  const defaultSections: Section[] = [
    { id: 'todo', name: 'To Do', position: 0 },
    { id: 'in-progress', name: 'In Progress', position: 1 },
    { id: 'done', name: 'Done', position: 2 },
  ];

  const sections = providedSections || defaultSections;

  // Get tasks for this project
  const projectTasks = useMemo(() => {
    let filtered = projectId ? getTasksByProject(projectId) : tasks;
    return filtered.filter((task) => !task.completed || task.sectionId);
  }, [tasks, projectId, getTasksByProject]);

  // Group tasks by section
  const tasksBySection = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    sections.forEach((section) => {
      grouped[section.id] = projectTasks.filter((task) => {
        if (section.id === 'done') {
          return task.completed;
        }
        return task.sectionId === section.id && !task.completed;
      });
    });

    // Tasks without section go to first section
    const unassigned = projectTasks.filter(
      (task) => !task.sectionId && !task.completed
    );
    if (unassigned.length > 0 && sections.length > 0) {
      grouped[sections[0].id] = [
        ...(grouped[sections[0].id] || []),
        ...unassigned,
      ];
    }

    return grouped;
  }, [projectTasks, sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setIsDragging(false);
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping on a section (not a task)
    if (sections.some((s) => s.id === overId)) {
      const task = projectTasks.find((t) => t.id === activeId);
      if (task) {
        updateTask(activeId, { sectionId: overId, completed: overId === 'done' });
      }
      return;
    }

    // If dropping on another task, find the section
    const overTaskForSection = projectTasks.find((t) => t.id === overId);
    if (overTaskForSection) {
      const activeTask = projectTasks.find((t) => t.id === activeId);
      if (activeTask) {
        updateTask(activeId, {
          sectionId: overTaskForSection.sectionId || sections[0]?.id,
          completed: overTaskForSection.sectionId === 'done',
        });
      }
    }

    // Handle reordering within same section
    const activeTask = projectTasks.find((t) => t.id === activeId);
    const overTask = projectTasks.find((t) => t.id === overId);
    
    if (activeTask && overTask && activeTask.sectionId === overTask.sectionId) {
      const sectionId = activeTask.sectionId || sections[0]?.id;
      const sectionTasks = tasksBySection[sectionId] || [];
      const oldIndex = sectionTasks.findIndex((t) => t.id === activeId);
      const newIndex = sectionTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(sectionTasks, oldIndex, newIndex);
        // Update positions in context if needed
      }
    }
  };

  const activeTask = activeId ? projectTasks.find((t) => t.id === activeId) : null;

  return (
    <div className="BoardView" style={{ 
      display: 'flex', 
      gap: '16px', 
      padding: '24px',
      overflowX: 'auto',
      minHeight: 'calc(100vh - 200px)',
      backgroundColor: '#1E1F21',
    }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {sections.map((section) => (
          <BoardColumn
            key={section.id}
            section={section}
            tasks={tasksBySection[section.id] || []}
            onTaskClick={onTaskClick}
          />
        ))}
        <DragOverlay>
          {activeTask ? (
            <div style={{ opacity: 0.5, transform: 'rotate(5deg)' }}>
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default BoardView;

