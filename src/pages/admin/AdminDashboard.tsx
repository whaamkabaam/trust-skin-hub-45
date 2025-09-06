import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, FileText, Image, Star, Users, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalOperators },
        { count: publishedOperators },
        { count: totalSections },
        { count: totalMedia },
        { count: totalReviews },
        { count: pendingReviews },
      ] = await Promise.all([
        supabase.from('operators').select('*', { count: 'exact', head: true }),
        supabase.from('operators').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('content_sections').select('*', { count: 'exact', head: true }),
        supabase.from('media_assets').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        totalOperators: totalOperators || 0,
        publishedOperators: publishedOperators || 0,
        draftOperators: (totalOperators || 0) - (publishedOperators || 0),
        totalSections: totalSections || 0,
        totalMedia: totalMedia || 0,
        totalReviews: totalReviews || 0,
        pendingReviews: pendingReviews || 0,
      };
    },
  });

  const { data: recentOperators } = useQuery({
    queryKey: ['recent-operators'],
    queryFn: async () => {
      const { data } = await supabase
        .from('operators')
        .select('id, name, slug, published, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 w-20 bg-muted rounded mb-2"></div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Operators',
      value: stats?.totalOperators || 0,
      icon: Building2,
      description: `${stats?.publishedOperators || 0} published, ${stats?.draftOperators || 0} draft`,
      color: 'text-primary',
    },
    {
      title: 'Content Sections',
      value: stats?.totalSections || 0,
      icon: FileText,
      description: 'Across all operators',
      color: 'text-accent',
    },
    {
      title: 'Media Assets',
      value: stats?.totalMedia || 0,
      icon: Image,
      description: 'Images and files',
      color: 'text-success',
    },
    {
      title: 'Reviews',
      value: stats?.totalReviews || 0,
      icon: Star,
      description: `${stats?.pendingReviews || 0} pending approval`,
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild>
              <Link to="/admin/operators/new">
                <Building2 className="h-4 w-4 mr-2" />
                Add New Operator
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/media">
                <Image className="h-4 w-4 mr-2" />
                Upload Media
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/reviews">
                <Star className="h-4 w-4 mr-2" />
                Moderate Reviews
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Operators */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Operators</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOperators && recentOperators.length > 0 ? (
            <div className="space-y-4">
              {recentOperators.map((operator) => (
                <div key={operator.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {operator.published ? (
                        <Eye className="h-4 w-4 text-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{operator.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">/{operator.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(operator.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/operators/${operator.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No operators yet. <Link to="/admin/operators/new" className="text-primary hover:underline">Create your first operator</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}