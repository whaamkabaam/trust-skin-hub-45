import { HeroBlock } from '@/components/category-blocks/HeroBlock';
import { TextBlock } from '@/components/category-blocks/TextBlock';
import { MysteryBoxesBlock } from '@/components/category-blocks/MysteryBoxesBlock';
import { TableBlock } from '@/components/category-blocks/TableBlock';
import { CategoryContentBlock } from '@/hooks/useCategoryContent';

interface BlockRendererProps {
  block: CategoryContentBlock;
}

export const BlockRenderer = ({ block }: BlockRendererProps) => {
  const commonProps = {
    data: block.block_data,
    isEditing: false,
  };

  // Generate ID from heading if available, otherwise use block type + order
  const blockId = block.block_data?.heading 
    ? block.block_data.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : `block-${block.block_type}-${block.order_number}`;

  switch (block.block_type) {
    case 'hero':
      // Skip hero blocks on published pages - using CompactHero instead
      return null;
    case 'text':
      // TextBlock handles its own heading/id rendering
      return <TextBlock {...commonProps} />;
    case 'mystery_boxes':
      return <div id={blockId}><MysteryBoxesBlock {...commonProps} /></div>;
    case 'table':
      // TableBlock handles its own heading/id rendering if provided
      return <TableBlock {...commonProps} />;
    default:
      return null;
  }
};
