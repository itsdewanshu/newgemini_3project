import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCurrentTheme } from '../../hooks/useCurrentTheme';

interface SortableItemProps {
  id: string;
  text: string;
  disabled?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, text, disabled }) => {
  const { theme } = useCurrentTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-4 rounded-xl border mb-3 cursor-grab active:cursor-grabbing touch-none
        ${isDragging ? 'shadow-2xl ring-2 ring-cyan-500 opacity-90' : ''}
        ${theme.colors.card.bg} ${theme.colors.card.border}
        ${disabled ? 'cursor-default opacity-80' : 'hover:bg-white/10'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`${theme.colors.text.primary} text-sm`}>{text}</span>
        {!disabled && (
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        )}
      </div>
    </div>
  );
};

interface MatchQuestionProps {
  leftItems: string[];
  rightItems: string[]; // The correct answers, but we will shuffle them for display
  currentAnswer?: string[];
  onAnswer: (answer: string[]) => void;
  disabled?: boolean;
}

const MatchQuestion: React.FC<MatchQuestionProps> = ({
  leftItems,
  rightItems,
  currentAnswer,
  onAnswer,
  disabled = false,
}) => {
  const { theme } = useCurrentTheme();
  const [items, setItems] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (currentAnswer && currentAnswer.length > 0) {
      setItems(currentAnswer);
    } else {
      // Initial shuffle if no answer yet
      // We need a deterministic shuffle or just a simple shift to ensure it's not already solved
      // For simplicity, let's just reverse it if it's the first load, or random sort
      const shuffled = [...rightItems].sort(() => Math.random() - 0.5);
      // Ensure it's not accidentally correct? (Optional)
      setItems(shuffled);
      // We don't call onAnswer here to avoid auto-answering, 
      // but the user needs to interact to "answer". 
      // However, for match, the state IS the answer. 
      // Maybe we should set the initial state as the answer?
      // Let's wait for user interaction.
    }
  }, [currentAnswer, rightItems]); // Be careful with dependencies to avoid reshuffling

 

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onAnswer(newItems);
        return newItems;
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-8">
      {/* Left Column (Static) */}
      <div className="space-y-3">
        {leftItems.map((item, idx) => (
          <div
            key={idx}
            className={`
              p-4 rounded-xl border mb-3 flex items-center h-[58px]
              bg-white/5 border-transparent
            `}
          >
            <span className={`${theme.colors.text.secondary} text-sm font-medium`}>{item}</span>
          </div>
        ))}
      </div>

      {/* Right Column (Draggable) */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableItem key={item} id={item} text={item} disabled={disabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MatchQuestion;
