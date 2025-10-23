import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TableData {
  heading?: string;
  showHeading?: boolean;
  includeInNav?: boolean;
  hasHeader: boolean;
  rows: string[][];
}

interface TableBlockProps {
  data: Partial<TableData>;
  onChange?: (data: TableData) => void;
  isEditing: boolean;
}

export const TableBlock = ({ data, onChange, isEditing }: TableBlockProps) => {
  const [localData, setLocalData] = useState<TableData>({
    heading: data.heading,
    showHeading: data.showHeading ?? true,
    includeInNav: data.includeInNav ?? true,
    hasHeader: data.hasHeader ?? true,
    rows: data.rows ?? [
      ['Header 1', 'Header 2', 'Header 3'],
      ['Cell 1', 'Cell 2', 'Cell 3'],
      ['Cell 4', 'Cell 5', 'Cell 6'],
    ],
  });

  useEffect(() => {
    // Only sync if the incoming data is actually different from our local state
    // This prevents auto-save from wiping out user's current edits
    const incomingData = {
      hasHeader: data.hasHeader ?? true,
      rows: data.rows ?? [
        ['Header 1', 'Header 2', 'Header 3'],
        ['Cell 1', 'Cell 2', 'Cell 3'],
        ['Cell 4', 'Cell 5', 'Cell 6'],
      ],
    };
    
    // Deep comparison - only update if structure actually changed
    if (JSON.stringify(incomingData) !== JSON.stringify(localData)) {
      setLocalData(incomingData);
    }
  }, [data.hasHeader, data.rows, data.heading, data.showHeading, data.includeInNav]);

  const handleChange = (newData: TableData) => {
    setLocalData(newData);
    onChange?.(newData);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...localData.rows];
    newRows[rowIndex][colIndex] = value;
    handleChange({ ...localData, rows: newRows });
  };

  const addRow = (index: number) => {
    const newRows = [...localData.rows];
    const colCount = localData.rows[0]?.length || 3;
    newRows.splice(index + 1, 0, Array(colCount).fill(''));
    handleChange({ ...localData, rows: newRows });
  };

  const deleteRow = (index: number) => {
    if (localData.rows.length <= 1) return;
    const newRows = localData.rows.filter((_, i) => i !== index);
    handleChange({ ...localData, rows: newRows });
  };

  const addColumn = () => {
    const newRows = localData.rows.map(row => [...row, '']);
    handleChange({ ...localData, rows: newRows });
  };

  const deleteColumn = (colIndex: number) => {
    if (localData.rows[0]?.length <= 1) return;
    const newRows = localData.rows.map(row => row.filter((_, i) => i !== colIndex));
    handleChange({ ...localData, rows: newRows });
  };

  const toggleHeader = (checked: boolean) => {
    handleChange({ ...localData, hasHeader: checked });
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {/* Heading Controls */}
          <div className="space-y-3 pb-4 border-b border-border">
            <div className="space-y-2">
              <Label htmlFor="table-heading">Table Heading (Optional)</Label>
              <Input
                id="table-heading"
                value={localData.heading || ''}
                onChange={(e) => handleChange({ ...localData, heading: e.target.value })}
                placeholder="e.g., Price Comparison, Feature Matrix"
                className="text-base font-semibold"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to exclude from navigation
              </p>
            </div>

            {localData.heading && (
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-heading"
                    checked={localData.showHeading !== false}
                    onCheckedChange={(checked) => handleChange({ ...localData, showHeading: checked })}
                  />
                  <Label htmlFor="show-heading" className="text-sm">Show heading on page</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-in-nav"
                    checked={localData.includeInNav !== false}
                    onCheckedChange={(checked) => handleChange({ ...localData, includeInNav: checked })}
                  />
                  <Label htmlFor="include-in-nav" className="text-sm">Include in navigation</Label>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="has-header"
                checked={localData.hasHeader}
                onCheckedChange={toggleHeader}
              />
              <Label htmlFor="has-header">First row is header</Label>
            </div>
            <Button onClick={addColumn} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {localData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-border p-2">
                        <Input
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="w-full min-w-[120px]"
                          placeholder={
                            localData.hasHeader && rowIndex === 0
                              ? `Header ${colIndex + 1}`
                              : 'Cell content'
                          }
                        />
                      </td>
                    ))}
                    <td className="p-2 space-x-2">
                      <Button
                        onClick={() => addRow(rowIndex)}
                        size="sm"
                        variant="ghost"
                        title="Add row below"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {localData.rows.length > 1 && (
                        <Button
                          onClick={() => deleteRow(rowIndex)}
                          size="sm"
                          variant="ghost"
                          title="Delete row"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  {localData.rows[0]?.map((_, colIndex) => (
                    <td key={colIndex} className="p-2">
                      {localData.rows[0].length > 1 && (
                        <Button
                          onClick={() => deleteColumn(colIndex)}
                          size="sm"
                          variant="ghost"
                          title="Delete column"
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    );
  }

  // Display mode
  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Heading Section */}
      {localData.showHeading !== false && localData.heading && (
        <div className="mb-4">
          <h2 
            id={localData.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
            className="text-2xl font-bold text-foreground mb-2"
          >
            {localData.heading}
          </h2>
        </div>
      )}
      
      {/* Wrapper with rounded corners and overflow control */}
      <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {localData.hasHeader && localData.rows.length > 0 && (
              <thead>
                <tr className="bg-muted">
                  {localData.rows[0].map((cell, colIndex) => (
                    <th
                      key={colIndex}
                      className="border-b border-r border-border px-4 py-3 text-left font-semibold last:border-r-0"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {localData.rows
                .slice(localData.hasHeader ? 1 : 0)
                .map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/50 transition-colors">
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border-b border-r border-border px-4 py-3 last:border-r-0">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
