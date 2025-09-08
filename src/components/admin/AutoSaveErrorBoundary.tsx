import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AutoSaveErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface AutoSaveErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class AutoSaveErrorBoundary extends Component<
  AutoSaveErrorBoundaryProps,
  AutoSaveErrorBoundaryState
> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: AutoSaveErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): AutoSaveErrorBoundaryState {
    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AutoSaveErrorBoundary caught an error:', error, errorInfo);
    
    // Special handling for function reference errors
    if (error.message.includes('not a function') || error.name === 'TypeError') {
      console.error('Function reference error detected - likely auto-save related');
      toast.error('Auto-save temporarily unavailable. Your work is saved locally.');
      
      // Automatically retry after a short delay for function reference errors
      this.resetTimeoutId = setTimeout(() => {
        this.handleReset(true);
      }, 3000);
    } else {
      toast.error('An error occurred with auto-save functionality');
    }
  }

  handleReset = (isAutomatic = false) => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    const newRetryCount = this.state.retryCount + 1;
    
    if (newRetryCount > 3) {
      toast.error('Multiple errors detected. Please refresh the page.');
      return;
    }

    this.setState({
      hasError: false,
      error: undefined,
      retryCount: newRetryCount
    });

    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (error) {
        console.error('Error during reset callback:', error);
      }
    }

    if (!isAutomatic) {
      toast.success('Auto-save functionality restored');
    }
  };

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Auto-Save Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Auto-save functionality encountered an error. Your work is saved locally and will be restored.
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.handleReset()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Auto-Save
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}