import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

export default function ContentSections() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Sections</h1>
          <p className="text-muted-foreground">Manage content sections for operator pages</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Section
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Management
          </CardTitle>
          <CardDescription>
            Create and manage rich content sections for operator reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Content sections management coming soon</p>
            <p className="text-sm">Create rich text content for operator pages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}