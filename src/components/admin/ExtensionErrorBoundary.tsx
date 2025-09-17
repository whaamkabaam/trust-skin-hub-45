import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ExtensionErrorBoundaryProps {
  children: ReactNode;
  extensionName: string;
  onReset?: () => void;
  fallback?: ReactNode;
}

interface ExtensionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
  retryCount: number;
}

export class ExtensionErrorBoundary extends Component<
  ExtensionErrorBoundaryProps,
  ExtensionErrorBoundaryState
> {
  private resetTimeout?: NodeJS.Timeout;

  constructor(props: ExtensionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): ExtensionErrorBoundaryState {
    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Extension Error in ${this.props.extensionName}:`, error);
    console.error('Error Info:', errorInfo);
    
    // Log specific function reference errors
    if (error.message.includes('is not a function')) {
      console.error('Function reference error detected:', {
        extensionName: this.props.extensionName,
        errorMessage: error.message,
        stack: error.stack
      });
      
      toast.error(`Extension ${this.props.extensionName} encountered a function reference error`);
    }

    this.setState({
      errorInfo: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    const { onReset } = this.props;
    const { retryCount } = this.state;

    // Prevent infinite retry loops
    if (retryCount >= 3) {
      toast.error('Maximum retry attempts reached. Please refresh the page.');
      return;
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: retryCount + 1,
    });

    if (onReset) {
      try {
        onReset();
      } catch (error) {
        console.error('Error in reset handler:', error);
      }
    }

    // Auto-reset after successful manual reset
    this.resetTimeout = setTimeout(() => {
      this.setState({ retryCount: 0 });
    }, 30000);
  };

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { children, extensionName, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {extensionName} Extension Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The {extensionName} extension encountered an error and couldn't load properly.
              This is likely due to a temporary function reference issue.
            </p>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={this.handleReset} 
                variant="outline" 
                size="sm"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryCount >= 3 ? 'Max Retries Reached' : `Retry (${retryCount}/3)`}
              </Button>
              {retryCount >= 3 && (
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="default" 
                  size="sm"
                >
                  Refresh Page
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-destructive/10 p-3 rounded text-xs font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{error.stack}</pre>
                    </div>
                  )}
                  {errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{errorInfo}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return children;
  }
}