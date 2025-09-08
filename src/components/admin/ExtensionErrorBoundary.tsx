import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExtensionErrorBoundaryProps {
  type: string;
  children: React.ReactNode;
}

interface ExtensionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ExtensionErrorBoundary extends Component<ExtensionErrorBoundaryProps, ExtensionErrorBoundaryState> {
  constructor(props: ExtensionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ExtensionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`${this.props.type} Manager Error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">
                {this.props.type} Manager Error
              </h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The {this.props.type.toLowerCase()} manager encountered an error and couldn't load properly. 
                This might be due to a temporary issue during publishing or data synchronization.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
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
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Developer Info
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}