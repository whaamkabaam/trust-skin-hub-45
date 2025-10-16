import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table } from 'lucide-react';

interface TableInsertDialogProps {
  onInsertTable: (rows: number, cols: number) => void;
}

export function TableInsertDialog({ onInsertTable }: TableInsertDialogProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [open, setOpen] = useState(false);

  const handleInsert = () => {
    onInsertTable(rows, cols);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mb-2 gap-2"
        >
          <Table className="h-4 w-4" />
          Insert Custom Table
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rows" className="text-right">
              Rows
            </Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cols" className="text-right">
              Columns
            </Label>
            <Input
              id="cols"
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleInsert}>Insert Table</Button>
      </DialogContent>
    </Dialog>
  );
}
