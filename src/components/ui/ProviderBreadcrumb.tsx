
import React from 'react';
import { Link } from 'react-router-dom';
import { PROVIDER_CONFIGS } from '@/types/filters';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronRight, Home } from 'lucide-react';

interface ProviderBreadcrumbProps {
  providerId?: keyof typeof PROVIDER_CONFIGS;
  boxName?: string;
  className?: string;
}

const ProviderBreadcrumb: React.FC<ProviderBreadcrumbProps> = ({
  providerId,
  boxName,
  className = ''
}) => {
  const config = providerId ? PROVIDER_CONFIGS[providerId] : null;
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto py-3 px-1 ${className}`}>
        {/* Hub Link - Compact Pill */}
        <Link 
          to="/mystery-boxes" 
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200 shadow-sm flex-shrink-0"
        >
          <Home className="w-4 h-4" />
          <span>Hub</span>
        </Link>

        {boxName && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            
            {/* Box Name - Current Page Pill */}
            <div className="bg-gray-100 border border-gray-300 rounded-full px-3 py-2 text-sm font-bold text-gray-900 shadow-sm flex-shrink-0">
              <span className="truncate max-w-[120px]">{boxName}</span>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop Layout - Simplified without provider section
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      <Link 
        to="/mystery-boxes" 
        className="flex items-center gap-2 hover:text-purple-600 transition-colors text-base font-medium text-gray-600"
      >
        <Home className="w-4 h-4" />
        <span>Hub</span>
      </Link>
      
      {boxName && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-gray-900 text-lg max-w-[300px] truncate">
            {boxName}
          </span>
        </>
      )}
    </nav>
  );
};

export default ProviderBreadcrumb;
