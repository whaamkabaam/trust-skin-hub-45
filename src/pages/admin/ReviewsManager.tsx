import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Star } from 'lucide-react';

export default function ReviewsManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reviews Manager</h1>
          <p className="text-muted-foreground">Moderate and manage user reviews</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Review Moderation
          </CardTitle>
          <CardDescription>
            Review, approve, and manage user-submitted reviews for operators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Review management coming soon</p>
            <p className="text-sm">Moderate and publish user reviews</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}