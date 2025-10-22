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

  const blockId = `block-${block.block_type}-${block.order_number}`;

  switch (block.block_type) {
    case 'hero':
      // Skip hero blocks on published pages - using CompactHero instead
      return null;
    case 'text':
      return <div id={blockId}><TextBlock {...commonProps} /></div>;
    case 'mystery_boxes':
      return <div id={blockId}><MysteryBoxesBlock {...commonProps} /></div>;
    case 'table':
      return <div id={blockId}><TableBlock {...commonProps} /></div>;
    default:
      return null;
  }
};
