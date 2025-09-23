import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Wand2, Copy, AlertCircle, CheckCircle, Filter, Zap, Upload, Eye, Download } from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { analyzeContent } from '@/lib/content-filters';
import { applyAutoAssignmentRules } from '@/lib/auto-assignment-rules';

interface OperatorSmartImportProps {
  onDataExtracted?: (data: ExtractedOperatorData) => void;
  currentOperatorData?: any;
}

interface ExtractedOperatorData {
  basic_info: {
    name?: string;
    site_type?: string;
    launch_year?: number;
    company_background?: string;
    verdict?: string;
    categories?: string[];
    pros?: string[];
    cons?: string[];
  };
  ratings: {
    overall?: number;
    trust?: number;
    ux?: number;
    support?: number;
    payments?: number;
    offering?: number;
    value?: number;
  };
  bonuses: Array<{
    bonus_type: string;
    title: string;
    description?: string;
    value?: string;
    terms?: string;
  }>;
  payments: Array<{
    payment_method: string;
    method_type: 'deposit' | 'withdrawal';
    processing_time?: string;
    minimum_amount?: number;
    maximum_amount?: number;
    fee_percentage?: number;
  }>;
  security: {
    ssl_enabled?: boolean;
    ssl_provider?: string;
    license_info?: string;
    provably_fair?: boolean;
    provably_fair_description?: string;
    responsible_gaming_info?: string;
    data_protection_info?: string;
    compliance_certifications?: string[];
  };
  features: Array<{
    feature_type: string;
    feature_name: string;
    description?: string;
    is_highlighted?: boolean;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
    category?: string;
    is_featured?: boolean;
  }>;
  unmatched_content: string[];
  confidence_scores: {
    basic_info: number;
    bonuses: number;
    payments: number;
    security: number;
    overall: number;
  };
}

interface PreprocessingStats {
  original_segments: number;
  filtered_segments: number;
  removed_noise: number;
  auto_assigned: number;
}

export function OperatorSmartImport({ onDataExtracted, currentOperatorData }: OperatorSmartImportProps) {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedOperatorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preprocessingStats, setPreprocessingStats] = useState<PreprocessingStats | null>(null);

  const handleParse = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please paste some content to parse');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPreprocessingStats(null);

    try {
      console.log('Starting operator content parsing...');
      
      // Step 1: Content preprocessing
      const contentAnalysis = analyzeContent(content);
      console.log('Content analysis:', contentAnalysis);
      
      // Step 2: Auto-assignment rules
      const autoAssignmentResult = applyAutoAssignmentRules(contentAnalysis.filtered_content);
      console.log('Auto-assignment result:', autoAssignmentResult);
      
      const enhancedContent = contentAnalysis.filtered_content.join('\n\n');
      
      // Update preprocessing stats
      setPreprocessingStats({
        original_segments: content.split(/[\n\r]+/).length,
        filtered_segments: contentAnalysis.filtered_content.length,
        removed_noise: contentAnalysis.removed_noise.length,
        auto_assigned: autoAssignmentResult.assignments.length
      });
      
      // Step 3: AI processing with operator-focused prompt
      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: enhancedContent,
          mode: 'operator-parse'
        }
      });

      console.log('AI function response:', { data: functionData, error: functionError });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(`AI parsing failed: ${functionError.message || functionError}`);
      }

      if (!functionData?.success || !functionData?.data) {
        throw new Error('No valid data received from AI service');
      }

      // Transform and merge AI results with auto-assignments
      const transformedData = {
        basic_info: {
          ...functionData.data.basic_info,
          name: autoAssignmentResult.assignments.find(a => a.field === 'operator.name')?.content || functionData.data.basic_info?.name,
          pros: [
            ...(functionData.data.basic_info?.pros || []),
            ...autoAssignmentResult.assignments.filter(a => a.field === 'operator.pros').map(a => a.content)
          ],
          cons: [
            ...(functionData.data.basic_info?.cons || []),
            ...autoAssignmentResult.assignments.filter(a => a.field === 'operator.cons').map(a => a.content)
          ]
        },
        ratings: functionData.data.ratings || {},
        bonuses: functionData.data.bonuses || [],
        payments: functionData.data.payments || [],
        security: functionData.data.security || {},
        features: functionData.data.features || [],
        faqs: functionData.data.faqs || [],
        unmatched_content: autoAssignmentResult.unassigned.concat(functionData.data.unmatched_content || []),
        confidence_scores: functionData.data.confidence_scores || {
          basic_info: 0,
          bonuses: 0,
          payments: 0,
          security: 0,
          overall: 0
        }
      };

      setExtractedData(transformedData);
      
      const reductionPercentage = Math.round((1 - (transformedData.unmatched_content.length / (content.split(/[\n\r]+/).length || 1))) * 100);
      toast.success(`Operator data extracted successfully! ${reductionPercentage}% auto-categorized`);
      
    } catch (err) {
      console.error('Parse error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to parse content: ${errorMessage}`);
      toast.error(`Parsing failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [content]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
      toast.success('Content pasted from clipboard');
    } catch (err) {
      toast.error('Failed to access clipboard');
    }
  };

  const handleApplyData = () => {
    if (extractedData && onDataExtracted) {
      onDataExtracted(extractedData);
      toast.success('Extracted data applied to operator form');
    }
  };

  const handleReset = () => {
    setContent('');
    setExtractedData(null);
    setError(null);
    setPreprocessingStats(null);
  };

  const renderBasicInfo = () => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {extractedData?.basic_info?.name && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Name:</span>
            <p className="text-sm">{extractedData.basic_info.name}</p>
          </div>
        )}
        {extractedData?.basic_info?.site_type && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Type:</span>
            <Badge variant="outline" className="ml-2">{extractedData.basic_info.site_type}</Badge>
          </div>
        )}
        {extractedData?.basic_info?.launch_year && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Launch Year:</span>
            <p className="text-sm">{extractedData.basic_info.launch_year}</p>
          </div>
        )}
        {extractedData?.basic_info?.verdict && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Verdict:</span>
            <p className="text-sm line-clamp-3">{extractedData.basic_info.verdict}</p>
          </div>
        )}
        {extractedData?.basic_info?.pros && extractedData.basic_info.pros.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Pros:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {extractedData.basic_info.pros.slice(0, 3).map((pro, idx) => (
                <Badge key={idx} variant="default" className="text-xs">{pro}</Badge>
              ))}
              {extractedData.basic_info.pros.length > 3 && (
                <Badge variant="outline" className="text-xs">+{extractedData.basic_info.pros.length - 3}</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderExtractedCounts = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{extractedData?.bonuses?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Bonuses</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{extractedData?.payments?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Payment Methods</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{extractedData?.features?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Features</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{extractedData?.faqs?.length || 0}</div>
          <p className="text-xs text-muted-foreground">FAQs</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Smart Import for Operators
          </CardTitle>
          <CardDescription>
            Paste editorial review content to automatically extract operator information, ratings, bonuses, payments, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!extractedData ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Review Content to Parse</label>
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
                  placeholder="Paste your editorial review content here (e.g., from Cases.gg review article)..."
                  className="min-h-[200px] resize-none"
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
                  Extract Operator Data
                </Button>
              </div>

              {isProcessing && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-y-2">
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-sm text-muted-foreground">
                          Extracting operator data from editorial content...
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          <p>• Analyzing content structure</p>
                          <p>• Extracting ratings and scores</p>
                          <p>• Identifying bonuses and features</p>
                          <p>• Mapping payment methods</p>
                        </div>
                        {preprocessingStats && (
                          <div className="mt-3 text-xs text-primary">
                            Processed: {preprocessingStats.filtered_segments} segments, 
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
            <div className="space-y-6">
              {/* Confidence & Stats Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Extraction Confidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <ConfidenceIndicator 
                        label="Basic Info" 
                        score={extractedData.confidence_scores.basic_info} 
                        size="sm"
                      />
                      <ConfidenceIndicator 
                        label="Bonuses" 
                        score={extractedData.confidence_scores.bonuses} 
                        size="sm"
                      />
                      <ConfidenceIndicator 
                        label="Payments" 
                        score={extractedData.confidence_scores.payments} 
                        size="sm"
                      />
                      <ConfidenceIndicator 
                        label="Overall" 
                        score={extractedData.confidence_scores.overall} 
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
                          <span>Processed:</span>
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
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Extracted Data Count Cards */}
              {renderExtractedCounts()}

              {/* Data Preview */}
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="ratings">Ratings</TabsTrigger>
                  <TabsTrigger value="bonuses">Bonuses ({extractedData.bonuses?.length || 0})</TabsTrigger>
                  <TabsTrigger value="payments">Payments ({extractedData.payments?.length || 0})</TabsTrigger>
                  <TabsTrigger value="features">Features ({extractedData.features?.length || 0})</TabsTrigger>
                  <TabsTrigger value="unmatched">Unmatched ({extractedData.unmatched_content?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-4">
                  {renderBasicInfo()}
                </TabsContent>

                <TabsContent value="ratings" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Extracted Ratings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(extractedData.ratings).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm capitalize">{key}:</span>
                            <Badge variant="outline">{value || 'N/A'}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bonuses" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Extracted Bonuses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {extractedData.bonuses.length > 0 ? (
                        <div className="space-y-3">
                          {extractedData.bonuses.map((bonus, idx) => (
                            <div key={idx} className="border rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">{bonus.bonus_type}</Badge>
                                {bonus.value && <Badge>{bonus.value}</Badge>}
                              </div>
                              <h4 className="font-medium text-sm">{bonus.title}</h4>
                              {bonus.description && <p className="text-xs text-muted-foreground mt-1">{bonus.description}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No bonuses extracted</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Extracted Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {extractedData.payments.length > 0 ? (
                        <div className="space-y-2">
                          {extractedData.payments.map((payment, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{payment.payment_method}</span>
                              <div className="flex gap-2">
                                <Badge variant="outline">{payment.method_type}</Badge>
                                {payment.processing_time && <Badge variant="secondary">{payment.processing_time}</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No payment methods extracted</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Extracted Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {extractedData.features.length > 0 ? (
                        <div className="space-y-2">
                          {extractedData.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <span className="text-sm font-medium">{feature.feature_name}</span>
                                {feature.description && <p className="text-xs text-muted-foreground">{feature.description}</p>}
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline">{feature.feature_type}</Badge>
                                {feature.is_highlighted && <Badge>Featured</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No features extracted</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="unmatched" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Unmatched Content</CardTitle>
                      <CardDescription>Content that couldn't be automatically categorized</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {extractedData.unmatched_content.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {extractedData.unmatched_content.map((item, idx) => (
                            <div key={idx} className="p-2 bg-muted rounded text-sm">
                              "{item}"
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">All content was successfully categorized!</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Changes
                  </Button>
                  <Button onClick={handleApplyData}>
                    <Upload className="h-4 w-4 mr-2" />
                    Apply to Form
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}