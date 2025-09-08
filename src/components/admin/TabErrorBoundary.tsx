import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabErrorBoundaryProps {
  children: React.ReactNode;
  tabName: string;
  onReset?: () => void;
}

interface TabErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class TabErrorBoundary extends Component<TabErrorBoundaryProps, TabErrorBoundaryState> {
  constructor(props: TabErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TabErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Tab Error Boundary (${this.props.tabName}) caught error:`, error);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-destructive/50 bg-destructive/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <h3 className="text-lg font-semibold text-destructive">
                  {this.props.tabName} Tab Error
                </h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Something went wrong in the {this.props.tabName} tab. This might be due to a 
                  temporary issue during data loading or publishing.
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleReset}
                  className="flex items-center gap-2 w-full"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Tab
                </Button>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      Error Details
                    </summary>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32 mt-2">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}