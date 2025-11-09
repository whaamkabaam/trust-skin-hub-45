import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ReviewSubmissionFormProps {
  operatorId: string;
  operatorName: string;
}

export function ReviewSubmissionForm({ operatorId, operatorName }: ReviewSubmissionFormProps) {
  const [rating, setRating] = useState([8]);
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (content.length < 20) {
      toast.error('Review must be at least 20 characters long');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          operator_id: operatorId,
          rating: rating[0],
          username: username.trim(),
          title: title.trim() || null,
          content: content.trim(),
          status: 'pending',
          verification_status: 'unverified',
          subscores: {
            trust: rating[0],
            fees: rating[0],
            ux: rating[0],
            support: rating[0]
          },
          helpful_votes: {
            up: 0,
            down: 0
          }
        });

      if (error) throw error;

      toast.success('Review submitted!', {
        description: 'Your review will be published after moderation.'
      });

      // Reset form
      setRating([8]);
      setUsername('');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: 'Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Write a Review for {operatorName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Slider */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Your Rating: <span className={cn(
                "text-2xl font-bold ml-2",
                rating[0] >= 9 ? "text-green-600" :
                rating[0] >= 8 ? "text-blue-600" :
                rating[0] >= 7 ? "text-yellow-600" :
                rating[0] >= 6 ? "text-orange-600" :
                "text-red-600"
              )}>{rating[0]}/10</span>
            </label>
            <Slider
              value={rating}
              onValueChange={setRating}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Poor</span>
              <span>Average</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="text-sm font-medium mb-2 block">
              Username <span className="text-destructive">*</span>
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={50}
              required
            />
          </div>

          {/* Title (Optional) */}
          <div>
            <label htmlFor="title" className="text-sm font-medium mb-2 block">
              Review Title <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              maxLength={100}
            />
          </div>

          {/* Review Content */}
          <div>
            <label htmlFor="content" className="text-sm font-medium mb-2 block">
              Your Review <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this operator... (minimum 20 characters)"
              rows={6}
              maxLength={2000}
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              {content.length}/2000 characters
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your review will be reviewed by our team before being published.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
