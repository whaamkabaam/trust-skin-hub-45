
import React from 'react';
import { Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TargetItemDisplayProps {
  selectedItem: string;
  itemImage?: string;
}

const TargetItemDisplay: React.FC<TargetItemDisplayProps> = ({
  selectedItem,
  itemImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 shadow-sm`}>
      <Target className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-600 flex-shrink-0`} />
      <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center bg-white rounded-lg border-2 border-purple-300 shadow-sm flex-shrink-0`}>
        <img 
          src={itemImage}
          alt={selectedItem}
          className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg object-cover`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Target Item:</p>
        <p className={`font-bold ${isMobile ? 'text-sm' : 'text-base'} text-purple-700 leading-tight`} style={{ wordBreak: 'break-word' }}>
          {selectedItem}
        </p>
      </div>
    </div>
  );
};

export default TargetItemDisplay;
