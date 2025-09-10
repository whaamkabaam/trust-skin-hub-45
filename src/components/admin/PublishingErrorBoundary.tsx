import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PublishingErrorBoundaryProps {
  children: ReactNode;
  operatorId?: string;
  onReset?: () => void;
  fallback?: ReactNode;
}

interface PublishingErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  isRecovering: boolean;
}

export class PublishingErrorBoundary extends Component<PublishingErrorBoundaryProps, PublishingErrorBoundaryState> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: PublishingErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): PublishingErrorBoundaryState {
    console.error('PublishingErrorBoundary caught error:', error);
    
    // Detect specific publishing-related errors
    if (error.message.includes('not a function')) {
      toast.error('Publishing system error detected - attempting recovery');
    } else if (error.message.includes('TypeError')) {
      toast.error('System state error - publishing may need to restart');
    }
    
    return { 
      hasError: true, 
      error,
      isRecovering: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PublishingErrorBoundary detailed error:', {
      error,
      errorInfo,
      operatorId: this.props.operatorId,
      retryCount: this.retryCount,
      componentStack: errorInfo.componentStack
    });

    this.setState({ errorInfo });

    // Log specific publishing errors for diagnosis
    if (error.message.includes('not a function')) {
      console.error('CRITICAL: Function reference became invalid during publishing');
      console.error('Stack trace:', error.stack);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  handleReset = async () => {
    this.setState({ isRecovering: true });
    
    try {
      // Clear any publishing state
      const publishingState = await import('@/hooks/usePublishingState');
      publishingState.usePublishingState.getState().clearPublishing();
      
      // Clear any queued operations
      const publishingQueue = await import('@/hooks/usePublishingQueue');
      const queue = publishingQueue.usePublishingQueue.getState();
      if (this.props.operatorId) {
        queue.removeFromQueue(this.props.operatorId);
        queue.clearError(this.props.operatorId);
      }
      
      // Call custom reset handler
      if (this.props.onReset && typeof this.props.onReset === 'function') {
        await this.props.onReset();
      }
      
      // Reset component state
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined, 
        isRecovering: false 
      });
      
      this.retryCount++;
      toast.success('Publishing system recovered successfully');
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      toast.error('Recovery failed - please refresh the page');
      this.setState({ isRecovering: false });
    }
  };

  handleRefreshPage = () => {
    // Save current form data before refresh
    try {
      const currentPath = window.location.pathname;
      localStorage.setItem('lastErrorPage', currentPath);
      localStorage.setItem('publishingErrorTime', Date.now().toString());
      window.location.reload();
    } catch (error) {
      console.error('Error saving state before refresh:', error);
      window.location.reload();
    }
  };

  handleGoBack = () => {
    try {
      // Clear publishing state before navigation
      const publishingState = import('@/hooks/usePublishingState');
      publishingState.then(module => {
        module.usePublishingState.getState().clearPublishing();
      });
      
      window.history.back();
    } catch (error) {
      console.error('Error going back:', error);
      // Fallback to admin operators page
      window.location.href = '/admin/operators';
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Custom fallback UI
    if (this.props.fallback) {
      return this.props.fallback;
    }

    // Default error UI
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Publishing System Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              The publishing system encountered an error. This usually happens due to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Network connectivity issues</li>
              <li>System state conflicts during publishing</li>
              <li>Browser session expiration</li>
            </ul>
          </div>

          {this.state.error && (
            <div className="bg-destructive/10 p-3 rounded text-sm">
              <p className="font-medium">Error Details:</p>
              <p className="text-destructive">{this.state.error.message}</p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {this.retryCount < this.maxRetries && (
              <Button 
                onClick={this.handleReset}
                disabled={this.state.isRecovering}
                variant="default"
                size="sm"
              >
                {this.state.isRecovering ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {this.state.isRecovering ? 'Recovering...' : 'Try Recovery'}
              </Button>
            )}
            
            <Button 
              onClick={this.handleRefreshPage}
              variant="outline"
              size="sm"
            >
              Refresh Page
            </Button>
            
            <Button 
              onClick={this.handleGoBack}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {this.retryCount >= this.maxRetries && (
            <div className="bg-orange-50 border border-orange-200 p-3 rounded text-sm">
              <p className="text-orange-800 font-medium">Maximum recovery attempts reached</p>
              <p className="text-orange-700">Please refresh the page or contact support if the issue persists.</p>
            </div>
          )}

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-xs">
              <summary className="cursor-pointer font-medium">Developer Details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </CardContent>
      </Card>
    );
  }
}