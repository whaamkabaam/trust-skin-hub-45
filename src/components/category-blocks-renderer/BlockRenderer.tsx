import { HeroBlock } from '@/components/category-blocks/HeroBlock';
import { TextBlock } from '@/components/category-blocks/TextBlock';
import { MysteryBoxesBlock } from '@/components/category-blocks/MysteryBoxesBlock';
import { CategoryContentBlock } from '@/hooks/useCategoryContent';

interface BlockRendererProps {
  block: CategoryContentBlock;
}

export const BlockRenderer = ({ block }: BlockRendererProps) => {
  const commonProps = {
    data: block.block_data,
    isEditing: false,
  };

  switch (block.block_type) {
    case 'hero':
      // Skip hero blocks on published pages - using CompactHero instead
      return null;
    case 'text':
      return <TextBlock {...commonProps} />;
    case 'mystery_boxes':
      return <MysteryBoxesBlock {...commonProps} />;
    default:
      return null;
  }
};
