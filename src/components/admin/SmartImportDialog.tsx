import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Wand2, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { ExtractedDataPreview } from './ExtractedDataPreview';
import { UnmatchedContentManager } from './UnmatchedContentManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface SmartImportDialogProps {
  onImportComplete?: (data: any) => void;
  trigger?: React.ReactNode;
}

interface ParsedData {
  operator_data: any;
  review_data: any;
  extensions: any;
  unmatched_content: string[];
  confidence_scores: {
    operator: number;
    review: number;
    extensions: number;
    overall: number;
  };
}

export function SmartImportDialog({ onImportComplete, trigger }: SmartImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!content.trim()) {
      toast.error('Please paste some content to parse');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: content,
          mode: 'parse'
        }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to parse content");
      }

      if (!functionData.success) {
        throw new Error(functionData.error || "Failed to parse content");
      }

      setParsedData(functionData.data);
      toast.success('Content parsed successfully!');
    } catch (err) {
      console.error('Parse error:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse content');
      toast.error('Failed to parse content');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      toast.success('Content pasted from clipboard');
    } catch (err) {
      toast.error('Failed to access clipboard');
    }
  };

  const handleImport = () => {
    if (parsedData && onImportComplete) {
      onImportComplete(parsedData);
      setIsOpen(false);
      // Reset state
      setContent('');
      setParsedData(null);
      setError(null);
    }
  };

  const handleReset = () => {
    setContent('');
    setParsedData(null);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Wand2 className="h-4 w-4 mr-2" />
            Smart Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Smart Content Import
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Paste any review or operator content and let AI extract structured data
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!parsedData ? (
            <div className="space-y-4 h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Content to Parse</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Paste from Clipboard
                  </Button>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your review content here... (Ctrl+V)"
                  className="min-h-[300px] resize-none"
                />
              </div>

              {error && (
                <Card className="border-destructive">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset}>
                  Clear
                </Button>
                <Button 
                  onClick={handleParse} 
                  disabled={!content.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Parse Content
                </Button>
              </div>

              {isProcessing && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-y-2">
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-sm text-muted-foreground">
                          AI is analyzing your content...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This may take a few seconds
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-hidden">
              {/* Confidence Scores */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Parsing Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <ConfidenceIndicator 
                      label="Operator Data" 
                      score={parsedData.confidence_scores.operator} 
                    />
                    <ConfidenceIndicator 
                      label="Review Data" 
                      score={parsedData.confidence_scores.review} 
                    />
                    <ConfidenceIndicator 
                      label="Extensions" 
                      score={parsedData.confidence_scores.extensions} 
                    />
                    <ConfidenceIndicator 
                      label="Overall" 
                      score={parsedData.confidence_scores.overall} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Data Tabs */}
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="operator" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="operator">Operator Data</TabsTrigger>
                    <TabsTrigger value="review">Review Data</TabsTrigger>
                    <TabsTrigger value="extensions">Extensions</TabsTrigger>
                    <TabsTrigger value="unmatched">
                      Unmatched ({parsedData.unmatched_content.length})
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="operator" className="h-full mt-4">
                      <ExtractedDataPreview 
                        data={parsedData.operator_data} 
                        type="operator"
                      />
                    </TabsContent>

                    <TabsContent value="review" className="h-full mt-4">
                      <ExtractedDataPreview 
                        data={parsedData.review_data} 
                        type="review"
                      />
                    </TabsContent>

                    <TabsContent value="extensions" className="h-full mt-4">
                      <ExtractedDataPreview 
                        data={parsedData.extensions} 
                        type="extensions"
                      />
                    </TabsContent>

                    <TabsContent value="unmatched" className="h-full mt-4">
                      <UnmatchedContentManager 
                        content={parsedData.unmatched_content}
                        onAssign={(content, field) => {
                          // Handle manual assignment
                          console.log('Assigning:', content, 'to:', field);
                        }}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Preview Changes
                  </Button>
                  <Button onClick={handleImport}>
                    Import Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}