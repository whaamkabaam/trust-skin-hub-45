
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems
}) => {
  const isMobile = useIsMobile();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-between items-center text-gray-800 ${
      isMobile ? 'flex-col space-y-4 px-4 py-6' : 'flex-row gap-6 py-8'
    }`}>
      {/* Results text - simplified on mobile */}
      <div className={`text-sm text-gray-600 font-medium ${isMobile ? 'text-center' : ''}`}>
        {isMobile ? (
          <span>Page {currentPage} of {totalPages}</span>
        ) : (
          <span>Showing {startIndex}-{endIndex} of {totalItems} mystery boxes</span>
        )}
      </div>
      
      {/* Pagination controls */}
      <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`bg-white border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50 ${
            isMobile ? 'min-h-[44px] px-4' : ''
          }`}
        >
          <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
          {!isMobile && <span className="ml-1">Previous</span>}
        </Button>
        
        {!isMobile && (
          <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-800 border border-gray-300">
            Page {currentPage} of {totalPages}
          </span>
        )}
        
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`bg-white border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50 ${
            isMobile ? 'min-h-[44px] px-4' : ''
          }`}
        >
          {!isMobile && <span className="mr-1">Next</span>}
          <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
