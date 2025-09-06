import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentSectionManager } from '@/components/admin/ContentSectionManager';
import { useOperators } from '@/hooks/useOperators';

export default function ContentSections() {
  const { operators } = useOperators();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Sections</h1>
          <p className="text-muted-foreground">Manage content sections for operators</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose an operator to manage content..." />
            </SelectTrigger>
            <SelectContent>
              {operators.length === 0 ? (
                <SelectItem value="none" disabled>No operators available</SelectItem>
              ) : (
                operators.map(operator => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedOperatorId && (
        <ContentSectionManager operatorId={selectedOperatorId} />
      )}
    </div>
  );
}