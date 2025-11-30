import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * @deprecated This page has been replaced by the Master Content Editor
 * Content sections are now managed within the operator form under "Review Content" tab
 * This component redirects to the operator edit page
 */
const OperatorContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Redirect to operator edit page with the Review Content tab
      navigate(`/admin/operators/${id}/edit?tab=content`);
    } else {
      navigate('/admin/operators');
    }
  }, [id, navigate]);

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
          <p className="text-sm text-muted-foreground">
            Redirecting you to the operator edit page...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorContent;