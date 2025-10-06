import { HeroBlock } from '@/components/category-blocks/HeroBlock';
import { TextBlock } from '@/components/category-blocks/TextBlock';
import { MysteryBoxesBlock } from '@/components/category-blocks/MysteryBoxesBlock';
import { ComparisonTableBlock } from '@/components/category-blocks/ComparisonTableBlock';
import { StatsBlock } from '@/components/category-blocks/StatsBlock';
import { FAQBlock } from '@/components/category-blocks/FAQBlock';
import { CTABlock } from '@/components/category-blocks/CTABlock';
import { TrustIndicatorsBlock } from '@/components/category-blocks/TrustIndicatorsBlock';
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
      return <HeroBlock {...commonProps} />;
    case 'text':
      return <TextBlock {...commonProps} />;
    case 'mystery_boxes':
      return <MysteryBoxesBlock {...commonProps} />;
    case 'comparison_table' as any:
      return <ComparisonTableBlock {...commonProps} />;
    case 'stats':
      return <StatsBlock {...commonProps} />;
    case 'faq':
      return <FAQBlock {...commonProps} />;
    case 'cta_banner' as any:
      return <CTABlock {...commonProps} />;
    case 'trust_indicators' as any:
      return <TrustIndicatorsBlock {...commonProps} />;
    default:
      return null;
  }
};
