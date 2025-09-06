import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Send } from 'lucide-react';

interface ContentSchedulingProps {
  publishStatus: string;
  publishedAt?: string;
  scheduledPublishAt?: string;
  onStatusChange: (status: string, scheduledDate?: string) => void;
}

export function ContentScheduling({ 
  publishStatus, 
  publishedAt, 
  scheduledPublishAt,
  onStatusChange 
}: ContentSchedulingProps) {
  const [selectedStatus, setSelectedStatus] = useState(publishStatus || 'draft');
  const [scheduledDate, setScheduledDate] = useState(scheduledPublishAt || '');
  const [scheduledTime, setScheduledTime] = useState('');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      scheduled: { variant: 'outline', label: 'Scheduled' },
      published: { variant: 'default', label: 'Published' },
      archived: { variant: 'destructive', label: 'Archived' }
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    
    if (newStatus === 'scheduled') {
      // Don't update yet, wait for date/time selection
      return;
    }
    
    if (newStatus === 'published') {
      onStatusChange(newStatus, new Date().toISOString());
    } else {
      onStatusChange(newStatus, null);
    }
  };

  const handleScheduleSubmit = () => {
    if (!scheduledDate || !scheduledTime) return;
    
    const combinedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    onStatusChange('scheduled', combinedDateTime.toISOString());
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Content Scheduling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Current Status</Label>
          {getStatusBadge(publishStatus)}
        </div>

        {publishedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Published At:</span>
            <span>{formatDateTime(publishedAt)}</span>
          </div>
        )}

        {scheduledPublishAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Scheduled For:</span>
            <span>{formatDateTime(scheduledPublishAt)}</span>
          </div>
        )}

        <div className="space-y-3">
          <Label>Change Status</Label>
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Save as Draft</SelectItem>
              <SelectItem value="scheduled">Schedule Publication</SelectItem>
              <SelectItem value="published">Publish Now</SelectItem>
              <SelectItem value="archived">Archive</SelectItem>
            </SelectContent>
          </Select>

          {selectedStatus === 'scheduled' && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="schedule-date" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date
                  </Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-time" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Time
                  </Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleScheduleSubmit} 
                disabled={!scheduledDate || !scheduledTime}
                className="w-full"
              >
                Schedule Publication
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}