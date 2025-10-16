import React from 'react';
import { Button } from '@/components/ui/button';
import { Table } from 'lucide-react';

interface TableInsertButtonProps {
  onInsertTable: () => void;
}

export function TableInsertButton({ onInsertTable }: TableInsertButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onInsertTable}
      className="mb-2 gap-2"
    >
      <Table className="h-4 w-4" />
      Insert Table (3x3)
    </Button>
  );
}
