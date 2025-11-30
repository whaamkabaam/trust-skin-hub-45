import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * @deprecated This page has been replaced by the Master Content Editor
 * Content sections are now managed within the operator form under "Review Content" tab
 * This component redirects to the operators list
 */
const ContentSections = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to operators list after a brief delay
    const timer = setTimeout(() => {
      navigate('/admin/operators');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <Card className="border-warning">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle>Page Moved</CardTitle>
          </div>
          <CardDescription>
            Content sections are now managed within the Master Content Editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This standalone page has been deprecated. Content sections are now managed directly within each operator's edit form under the "Review Content" tab.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting you to the operators list...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSections;