import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { HeroBlock } from '@/components/category-blocks/HeroBlock';
import { TextBlock } from '@/components/category-blocks/TextBlock';
import { MysteryBoxesBlock } from '@/components/category-blocks/MysteryBoxesBlock';
import { CategoryContentBlock } from '@/hooks/useCategoryContent';
import { useDebounce } from '@/hooks/useDebounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryBlockEditorProps {
  blocks: CategoryContentBlock[];
  onBlocksChange: (blocks: CategoryContentBlock[]) => void;
  onSaveBlock: (block: Partial<CategoryContentBlock>, silent?: boolean) => void;
  onDeleteBlock: (blockId: string) => void;
  categoryId: string;
}

const SortableBlock = ({ 
  block, 
  onUpdate, 
  onDelete 
}: { 
  block: CategoryContentBlock;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlock = () => {
    const commonProps = {
      data: block.block_data,
      onChange: onUpdate,
      isEditing: true,
    };

    switch (block.block_type) {
      case 'hero':
        return <HeroBlock {...commonProps} />;
      case 'text':
        return <TextBlock {...commonProps} />;
      case 'mystery_boxes':
        return <MysteryBoxesBlock {...commonProps} categoryId={block.category_id} />;
      default:
        return <div className="p-4 border rounded">Unknown block type: {block.block_type}</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="flex items-start gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-grab active:cursor-grabbing mt-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          {renderBlock()}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CategoryBlockEditor = ({
  blocks,
  onBlocksChange,
  onSaveBlock,
  onDeleteBlock,
  categoryId,
}: CategoryBlockEditorProps) => {
  const [localBlocks, setLocalBlocks] = useState(blocks);
  const debouncedBlocks = useDebounce(localBlocks, 1000);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync localBlocks with incoming blocks prop (fixes visibility issue)
  useEffect(() => {
    setLocalBlocks(blocks);
  }, [blocks]);

  // Auto-save debounced changes silently
  useEffect(() => {
    if (debouncedBlocks.length > 0 && JSON.stringify(debouncedBlocks) !== JSON.stringify(blocks)) {
      console.log('CategoryBlockEditor - Auto-saving blocks:', debouncedBlocks);
      debouncedBlocks.forEach(block => {
        if (block.id) {
          console.log('CategoryBlockEditor - Saving block:', { id: block.id, block_data: block.block_data });
          // Save silently without toast - pass true as second parameter
          onSaveBlock({
            id: block.id,
            block_data: block.block_data,
            order_number: block.order_number,
            is_visible: block.is_visible,
          }, true);
        }
      });
    }
  }, [debouncedBlocks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localBlocks.findIndex((b) => b.id === active.id);
      const newIndex = localBlocks.findIndex((b) => b.id === over.id);
      const newBlocks = arrayMove(localBlocks, oldIndex, newIndex);
      setLocalBlocks(newBlocks);
      onBlocksChange(newBlocks);
    }
  };

  const addBlock = (blockType: CategoryContentBlock['block_type']) => {
    const newBlock: Partial<CategoryContentBlock> = {
      category_id: categoryId,
      block_type: blockType,
      block_data: {},
      order_number: localBlocks.length,
      is_visible: true,
    };
    onSaveBlock(newBlock);
  };

  const handleBlockUpdate = (blockId: string, data: any) => {
    console.log('CategoryBlockEditor - handleBlockUpdate:', { blockId, data });
    // Update local state only - auto-save will handle persistence
    setLocalBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, block_data: data } : b
    ));
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localBlocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {localBlocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onUpdate={(data) => handleBlockUpdate(block.id, data)}
              onDelete={() => onDeleteBlock(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => addBlock('hero')}>
            Hero Section
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('text')}>
            Text Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock('mystery_boxes')}>
            Mystery Boxes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
