import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Wand2, Copy, AlertCircle, CheckCircle, Filter, Zap } from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { ExtractedDataPreview } from './ExtractedDataPreview';
import { EnhancedUnmatchedContentManager } from './EnhancedUnmatchedContentManager';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { analyzeContent } from '@/lib/content-filters';
import { applyAutoAssignmentRules } from '@/lib/auto-assignment-rules';

interface SmartImportDialogProps {
  onImportComplete?: (data: any) => void;
  trigger?: React.ReactNode;
}

interface ParsedData {
  review_data: any;
  operator_info: any;
  metadata: any;
  unmatched_content: string[];
  confidence_scores: {
    review: number;
    operator: number;
    overall: number;
    filtering_effectiveness: number;
  };
}

interface PreprocessingStats {
  original_segments: number;
  filtered_segments: number;
  removed_noise: number;
  auto_assigned: number;
}

export function SmartImportDialog({ onImportComplete, trigger }: SmartImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preprocessingStats, setPreprocessingStats] = useState<PreprocessingStats | null>(null);

  const handleParse = async () => {
    if (!content.trim()) {
      toast.error('Please paste some content to parse');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPreprocessingStats(null);

    try {
      console.log('Starting enhanced content parsing...');
      
      // Step 1: Advanced content preprocessing
      const contentAnalysis = analyzeContent(content);
      console.log('Content analysis:', contentAnalysis);
      
      // Step 2: Apply auto-assignment rules to filtered content
      const autoAssignmentResult = applyAutoAssignmentRules(contentAnalysis.filtered_content);
      console.log('Auto-assignment result:', autoAssignmentResult);
      
      // Step 3: Prepare enhanced content for AI
      const enhancedContent = contentAnalysis.filtered_content.join('\n\n');
      
      // Update preprocessing stats
      setPreprocessingStats({
        original_segments: content.split(/[\n\r]+/).length,
        filtered_segments: contentAnalysis.filtered_content.length,
        removed_noise: contentAnalysis.removed_noise.length,
        auto_assigned: autoAssignmentResult.assignments.length
      });
      
      console.log('Calling AI function with enhanced content length:', enhancedContent.length);
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: enhancedContent,
          mode: 'parse'
        }
      });

      console.log('AI function response:', { data: functionData, error: functionError });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(`Function invocation failed: ${functionError.message || functionError}`);
      }

      if (!functionData) {
        throw new Error('No response received from AI service');
      }

      if (!functionData.success) {
        throw new Error(functionData.error || "AI parsing failed");
      }

      if (!functionData.data) {
        throw new Error('No parsed data received from AI service');
      }

      // Merge AI results with auto-assignment results
      const reviewData = functionData.data.review_data || {};
      const operatorInfo = functionData.data.operator_info || {};
      const metadata = functionData.data.metadata || {};
      
      // Apply auto-assignments to the appropriate fields
      for (const assignment of autoAssignmentResult.assignments) {
        const [category, field] = assignment.field.split('.');
        
        if (category === 'operator' && operatorInfo) {
          if (field === 'pros' || field === 'cons') {
            operatorInfo[field] = operatorInfo[field] || [];
            operatorInfo[field].push(assignment.content);
          } else {
            operatorInfo[field] = assignment.content;
          }
        } else if (category === 'review' && reviewData) {
          if (field === 'pros' || field === 'cons') {
            reviewData[field] = reviewData[field] || [];
            reviewData[field].push(assignment.content);
          } else {
            reviewData[field] = assignment.content;
          }
        } else if (category === 'metadata') {
          metadata[field] = assignment.content;
        }
      }
      
      const transformedData = {
        review_data: reviewData,
        operator_info: operatorInfo,
        metadata: metadata,
        unmatched_content: autoAssignmentResult.unassigned.concat(functionData.data.unmatched_content || []),
        confidence_scores: {
          ...functionData.data.confidence_scores,
          filtering_effectiveness: Math.round((contentAnalysis.removed_noise.length / (content.split(/[\n\r]+/).length || 1)) * 100)
        }
      };

      setParsedData(transformedData);
      
      const reductionPercentage = Math.round((1 - (transformedData.unmatched_content.length / (content.split(/[\n\r]+/).length || 1))) * 100);
      toast.success(`Content parsed successfully! ${reductionPercentage}% auto-categorized`);
      console.log('Successfully parsed enhanced data:', transformedData);
    } catch (err) {
      console.error('Parse error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to parse content: ${errorMessage}`);
      toast.error(`Parsing failed: ${errorMessage}`);
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
    setPreprocessingStats(null);
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
            <Zap className="h-5 w-5 text-primary" />
            Enhanced Smart Import
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Advanced AI parsing with content filtering and auto-categorization
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
                          Enhanced AI processing in progress...
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          <p>• Filtering noise and web elements</p>
                          <p>• Auto-categorizing ratings and metadata</p>
                          <p>• Extracting meaningful content</p>
                        </div>
                        {preprocessingStats && (
                          <div className="mt-3 text-xs text-primary">
                            Preprocessed: {preprocessingStats.filtered_segments} segments, 
                            removed {preprocessingStats.removed_noise} noise items
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-hidden">
              {/* Enhanced Results Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Parsing Confidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <ConfidenceIndicator 
                        label="Review Data" 
                        score={parsedData.confidence_scores.review} 
                        size="sm"
                      />
                      <ConfidenceIndicator 
                        label="Operator Info" 
                        score={parsedData.confidence_scores.operator} 
                        size="sm"
                      />
                      <ConfidenceIndicator 
                        label="Overall Quality" 
                        score={parsedData.confidence_scores.overall} 
                        size="sm"
                      />
                      <ConfidenceIndicator 
                        label="Auto-Filter" 
                        score={parsedData.confidence_scores.filtering_effectiveness || 0} 
                        size="sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {preprocessingStats && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        Processing Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Original segments:</span>
                          <Badge variant="outline">{preprocessingStats.original_segments}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Filtered content:</span>
                          <Badge variant="outline">{preprocessingStats.filtered_segments}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Noise removed:</span>
                          <Badge variant="destructive">{preprocessingStats.removed_noise}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-assigned:</span>
                          <Badge variant="default">{preprocessingStats.auto_assigned}</Badge>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Reduction:</span>
                          <Badge variant="secondary">
                            {Math.round((preprocessingStats.removed_noise / preprocessingStats.original_segments) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Extracted Data Tabs */}
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="review" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="review">Review Data</TabsTrigger>
                    <TabsTrigger value="operator">Operator Info</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="unmatched">
                      Unmatched ({parsedData.unmatched_content.length})
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="review" className="h-full mt-4">
                      <ExtractedDataPreview 
                        data={parsedData.review_data} 
                        type="review"
                      />
                    </TabsContent>

                    <TabsContent value="operator" className="h-full mt-4">
                      <ExtractedDataPreview 
                        data={parsedData.operator_info} 
                        type="operator"
                      />
                    </TabsContent>

                    <TabsContent value="metadata" className="h-full mt-4">
                      <ExtractedDataPreview 
                        data={parsedData.metadata} 
                        type="review"
                      />
                    </TabsContent>

                    <TabsContent value="unmatched" className="h-full mt-4">
                      <EnhancedUnmatchedContentManager 
                        content={parsedData.unmatched_content}
                        onAssign={(content, field) => {
                          // Handle manual assignment
                          console.log('Assigning:', content, 'to:', field);
                        }}
                        onBulkAssign={(assignments) => {
                          // Handle bulk assignment
                          console.log('Bulk assigning:', assignments);
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