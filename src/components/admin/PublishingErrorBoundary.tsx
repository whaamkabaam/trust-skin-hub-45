import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface PublishingErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  operatorId?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class PublishingErrorBoundary extends Component<PublishingErrorBoundaryProps, State> {
  constructor(props: PublishingErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Publishing Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Check for the specific "n is not a function" error pattern
    const isStaleClosureError = error.message?.includes('is not a function') || 
                               error.stack?.includes('is not a function');
    
    if (isStaleClosureError) {
      console.warn('Detected stale closure error - likely due to state cleanup timing');
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Add safety delay for reset operations
    setTimeout(() => {
      try {
        // Call onRetry first, then onReset as fallback
        if (this.props.onRetry) {
          this.props.onRetry();
        } else if (this.props.onReset) {
          this.props.onReset();
        }
      } catch (error) {
        console.error('Error in retry handler:', error);
        // Ultimate fallback
        window.location.reload();
      }
    }, 50);
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Publishing Error</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              An error occurred during the publishing process. This may be due to a temporary issue.
            </p>
            
            {this.state.error && (
              <div className="bg-muted p-3 rounded text-sm mb-4">
                <strong>Error:</strong> {this.state.error.message}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}