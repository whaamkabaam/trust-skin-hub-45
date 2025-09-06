import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOperators } from '@/hooks/useOperators';
import { useReviews } from '@/hooks/useReviews';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Plus, Star, Filter, Check, X, Edit, Trash2, MessageSquare } from 'lucide-react';

export default function ReviewsManager() {
  const { operators, loading: operatorsLoading } = useOperators();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [newReview, setNewReview] = useState({
    operator_id: '',
    rating: 5,
    content: '',
    status: 'approved' as const,
  });

  const { reviews, loading, createReview, updateReviewStatus, updateReview, deleteReview, bulkUpdateStatus } = useReviews(selectedOperatorId || undefined);

  if (operatorsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredReviews = reviews.filter(review => 
    statusFilter === 'all' || review.status === statusFilter
  );

  const handleCreateReview = async () => {
    await createReview(newReview);
    setIsCreateDialogOpen(false);
    setNewReview({
      operator_id: '',
      rating: 5,
      content: '',
      status: 'approved',
    });
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'pending') => {
    if (selectedReviews.length === 0) return;
    await bulkUpdateStatus(selectedReviews, action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending');
    setSelectedReviews([]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reviews Manager</h1>
          <p className="text-muted-foreground">Moderate and manage user reviews</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Editorial Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Editorial Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Operator</Label>
                <Select value={newReview.operator_id} onValueChange={(value) => setNewReview(prev => ({ ...prev, operator_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(operator => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rating</Label>
                <Select value={newReview.rating.toString()} onValueChange={(value) => setNewReview(prev => ({ ...prev, rating: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-2">
                          {renderStars(rating)}
                          <span>{rating} stars</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Review Content</Label>
                <RichTextEditor
                  value={newReview.content}
                  onChange={(content) => setNewReview(prev => ({ ...prev, content }))}
                  placeholder="Write your editorial review..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReview} disabled={!newReview.operator_id || !newReview.content}>
                  Create Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All operators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All operators</SelectItem>
                {operators.map(operator => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {selectedReviews.length > 0 && (
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                  <Check className="h-3 w-3 mr-1" />
                  Approve ({selectedReviews.length})
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                  <X className="h-3 w-3 mr-1" />
                  Reject ({selectedReviews.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews ({filteredReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reviews found</p>
              <p className="text-sm">Create some editorial reviews or wait for user submissions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => {
                const operator = operators.find(op => op.id === review.operator_id);
                return (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedReviews.includes(review.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedReviews(prev => [...prev, review.id]);
                            } else {
                              setSelectedReviews(prev => prev.filter(id => id !== review.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{operator?.name}</h3>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                            {getStatusBadge(review.status)}
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div
                            className="text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: review.content }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {review.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateReviewStatus(review.id, 'approved')}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateReviewStatus(review.id, 'rejected')}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingReview(review)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteReview(review.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Review Dialog */}
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          {editingReview && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateReview(editingReview.id, {
                rating: parseInt(formData.get('rating') as string),
                content: formData.get('content') as string,
                status: formData.get('status') as any,
              });
              setEditingReview(null);
            }} className="space-y-4">
              <div>
                <Label>Rating</Label>
                <Select name="rating" defaultValue={editingReview.rating.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-2">
                          {renderStars(rating)}
                          <span>{rating} stars</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue={editingReview.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content</Label>
                <input type="hidden" name="content" value={editingReview.content} />
                <RichTextEditor
                  value={editingReview.content}
                  onChange={(content) => setEditingReview(prev => ({ ...prev, content }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingReview(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}