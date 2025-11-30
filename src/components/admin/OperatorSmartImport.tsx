import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Clipboard, Zap, RotateCcw, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface OperatorSmartImportProps {
  onDataExtracted?: (data: ExtractedOperatorData) => void;
  currentOperatorData?: any;
}

interface ExtractedOperatorData {
  name?: string;
  slug?: string;
  site_type?: string;
  launch_year?: number;
  verification_status?: string;
  promo_code?: string;
  categories?: string[];
  pros?: string[];
  cons?: string[];
  ratings?: {
    overall?: number;
    trust?: number;
    value?: number;
    payments?: number;
    offering?: number;
    ux?: number;
    support?: number;
  };
  kyc_required?: boolean;
  withdrawal_time_crypto?: string;
  withdrawal_time_skins?: string;
  withdrawal_time_fiat?: string;
  support_channels?: string[];
  bonuses?: Array<{
    bonus_type: string;
    title: string;
    value?: string;
    description?: string;
    terms?: string;
    is_active?: boolean;
  }>;
  payments?: Array<{
    payment_method: string;
    method_type: 'deposit' | 'withdrawal' | 'both';
    min_amount?: string;
    max_amount?: string;
    fees?: string;
    processing_time?: string;
  }>;
  features?: Array<{
    feature_name: string;
    description?: string;
    is_highlighted?: boolean;
  }>;
  security?: {
    ssl_enabled?: boolean;
    provably_fair?: boolean;
    license_info?: string;
    security_measures?: string;
  };
  faqs?: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
  content_sections?: Array<{
    section_key: string;
    heading: string;
    rich_text_content: string;
    order_number: number;
  }>;
  confidence_score?: number;
  unmatched_content?: string;
}

export function OperatorSmartImport({ onDataExtracted, currentOperatorData }: OperatorSmartImportProps) {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedOperatorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to parse');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Limit content to 50k characters
      const limitedContent = content.length > 50000 ? content.substring(0, 50000) : content;
      
      console.log('Sending content to AI:', { 
        contentLength: limitedContent.length,
        preview: limitedContent.substring(0, 200) + '...'
      });
      
      const { data, error: functionError } = await supabase.functions.invoke('ai', {
        body: { 
          message: limitedContent,
          mode: 'operator-parse'
        }
      });

      console.log('Full AI Response:', data);

      if (functionError) {
        console.error('Function Error:', functionError);
        throw new Error(functionError.message || "Failed to get AI response");
      }

      if (!data?.success || !data?.data) {
        console.error('Invalid AI Response Structure:', data);
        throw new Error("Invalid response from AI service");
      }

      console.log('Extracted Data Structure:', {
        hasName: !!data.data.name,
        hasSlug: !!data.data.slug,
        bonusCount: data.data.bonuses?.length || 0,
        paymentCount: data.data.payments?.length || 0,
        confidenceScore: data.data.confidence_score,
        unmatchedLength: data.data.unmatched_content?.length || 0
      });

      setExtractedData(data.data);
      toast.success(`Content parsed! Confidence: ${data.data.confidence_score || 0}%`);
      
    } catch (error) {
      console.error('Parse error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse content';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setContent(clipboardText);
      toast.success('Content pasted from clipboard');
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Failed to access clipboard');
    }
  };

  const handleApplyData = async () => {
    if (!extractedData || !onDataExtracted) return;
    
    console.log('Applying extracted data:', extractedData);
    
    // Generate slug from name if name exists
    if (extractedData.name) {
      const generatedSlug = extractedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      extractedData.slug = generatedSlug;
    }
    
    // Validate required fields before applying
    if (!extractedData.name) {
      toast.error('Missing operator name. Please extract data again.');
      return;
    }
    
    if (!extractedData.slug) {
      toast.error('Missing operator slug. Please extract data again.');
      return;
    }

    // Process payment methods - auto-create if they don't exist
    if (extractedData.payments && extractedData.payments.length > 0) {
      try {
        const processedPayments = [];
        
        for (const payment of extractedData.payments) {
          const methodName = payment.payment_method.trim();
          const slug = methodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          // Check if payment method exists
          const { data: existing } = await supabase
            .from('payment_methods')
            .select('id, name')
            .eq('slug', slug)
            .maybeSingle();

          let paymentMethodId: string;

          if (existing) {
            paymentMethodId = existing.id;
          } else {
            // Create new payment method
            const { data: newMethod, error } = await supabase
              .from('payment_methods')
              .insert({
                name: methodName,
                slug,
                description_rich: '',
                display_order: 999,
                is_featured: false
              })
              .select()
              .single();

            if (error || !newMethod) {
              console.error('Error creating payment method:', error);
              continue;
            }

            paymentMethodId = newMethod.id;
            console.log(`Created payment method: ${methodName}`);
          }

          processedPayments.push({
            payment_method_id: paymentMethodId,
            method_type: payment.method_type || 'both',
            minimum_amount: payment.min_amount ? parseFloat(payment.min_amount) : undefined,
            maximum_amount: payment.max_amount ? parseFloat(payment.max_amount) : undefined,
            processing_time: payment.processing_time || 'Instant',
            is_available: true
          });
        }

        // Replace payments array with processed data
        extractedData.payments = processedPayments as any;
      } catch (error) {
        console.error('Error processing payment methods:', error);
        toast.error('Some payment methods could not be processed');
      }
    }
    
    // Apply data to form - localStorage storage now handled by OperatorForm
    onDataExtracted(extractedData);
    
    // Build detailed import summary
    const importedTabs = [];
    if (extractedData.bonuses?.length) importedTabs.push(`Bonuses (${extractedData.bonuses.length})`);
    if (extractedData.payments?.length) importedTabs.push(`Payments (${extractedData.payments.length})`);
    if (extractedData.content_sections?.length) importedTabs.push(`Review Content (${extractedData.content_sections.length} sections)`);
    if (extractedData.faqs?.length) importedTabs.push(`FAQs (${extractedData.faqs.length})`);
    if (extractedData.features?.length) importedTabs.push(`Features (${extractedData.features.length})`);
    
    toast.success(
      importedTabs.length > 0 
        ? `✓ Imported to: ${importedTabs.join(', ')}. Check these tabs to review.`
        : 'Basic info applied! Check all tabs.'
    );
    
    // Clear the imported data to prevent reapplication
    setExtractedData(null);
    setContent('');
  };

  const handleReset = () => {
    setContent('');
    setExtractedData(null);
    setError(null);
  };

  const renderBasicInfo = () => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {extractedData?.name && (
          <div>
            <span className="text-xs text-muted-foreground">Name:</span>
            <p className="font-medium">{extractedData.name}</p>
          </div>
        )}
        {extractedData?.site_type && (
          <div>
            <span className="text-xs text-muted-foreground">Type:</span>
            <Badge variant="outline" className="ml-2">{extractedData.site_type}</Badge>
          </div>
        )}
        {extractedData?.launch_year && (
          <div>
            <span className="text-xs text-muted-foreground">Launch Year:</span>
            <p className="font-medium">{extractedData.launch_year}</p>
          </div>
        )}
        {extractedData?.verification_status && (
          <div>
            <span className="text-xs text-muted-foreground">Status:</span>
            <Badge variant={extractedData.verification_status === 'verified' ? 'default' : 'secondary'} className="ml-2">
              {extractedData.verification_status}
            </Badge>
          </div>
        )}
        {extractedData?.categories && extractedData.categories.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground">Categories:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {extractedData.categories.map((cat, i) => (
                <Badge key={i} variant="outline" className="text-xs">{cat}</Badge>
              ))}
            </div>
          </div>
        )}
        {extractedData?.pros && extractedData.pros.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground">Pros ({extractedData.pros.length}):</span>
            <div className="space-y-1 mt-1">
              {extractedData.pros.slice(0, 3).map((pro, i) => (
                <p key={i} className="text-xs text-green-600">✓ {pro}</p>
              ))}
            </div>
          </div>
        )}
        {extractedData?.cons && extractedData.cons.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground">Cons ({extractedData.cons.length}):</span>
            <div className="space-y-1 mt-1">
              {extractedData.cons.slice(0, 3).map((con, i) => (
                <p key={i} className="text-xs text-red-600">✗ {con}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStats = () => {
    const overallConfidence = extractedData?.confidence_score || 0;
    
    // Calculate category-specific confidence based on actual extraction
    const basicInfoConfidence = extractedData?.name && extractedData?.ratings ? 
      Math.min(95, Math.max(70, overallConfidence)) : 
      Math.max(0, overallConfidence - 30);
    
    const bonusConfidence = extractedData?.bonuses && extractedData.bonuses.length > 0 ? 
      Math.min(95, Math.max(80, overallConfidence)) : 
      Math.max(0, overallConfidence - 40);
    
    const paymentConfidence = extractedData?.payments && extractedData.payments.length > 0 ? 
      Math.min(95, Math.max(75, overallConfidence)) : 
      Math.max(0, overallConfidence - 35);

    const bonusCount = extractedData?.bonuses?.length || 0;
    const paymentCount = extractedData?.payments?.length || 0;
    const featureCount = extractedData?.features?.length || 0;
    const faqCount = extractedData?.faqs?.length || 0;
    const contentSectionCount = extractedData?.content_sections?.length || 0;

    // Calculate unmatched percentage more accurately
    const totalExtracted = bonusCount + paymentCount + featureCount + faqCount + contentSectionCount +
      (extractedData?.pros?.length || 0) + (extractedData?.cons?.length || 0) +
      (extractedData?.ratings ? Object.keys(extractedData.ratings).length : 0);
    
    const unmatchedItems = extractedData?.unmatched_content ? 
      extractedData.unmatched_content.split('\n').filter(line => line.trim()).length : 0;

    return (
      <div className="space-y-4">
        {/* Confidence Indicators */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">Extraction Confidence</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Basic Info</span>
                <span className={`font-bold ${basicInfoConfidence > 60 ? 'text-green-600' : basicInfoConfidence > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {Math.round(basicInfoConfidence)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Bonuses</span>
                <span className={`font-bold ${bonusConfidence > 60 ? 'text-green-600' : bonusConfidence > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {Math.round(bonusConfidence)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Payments</span>
                <span className={`font-bold ${paymentConfidence > 60 ? 'text-green-600' : paymentConfidence > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {Math.round(paymentConfidence)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Overall</span>
                <span className={`font-bold ${overallConfidence > 60 ? 'text-green-600' : overallConfidence > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {Math.round(overallConfidence)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {overallConfidence > 80 ? 'HIGH CONFIDENCE' : 
                 overallConfidence > 50 ? 'MEDIUM CONFIDENCE' : 'LOW CONFIDENCE'}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">Processing Stats</div>
            <div className="space-y-1 text-xs">
              <div>Extracted items: <span className="font-bold text-green-600">{totalExtracted}</span></div>
              <div>Unmatched: <span className="font-bold text-orange-600">{unmatchedItems}</span></div>
              <div>Success rate: <span className="font-bold text-blue-600">
                {totalExtracted + unmatchedItems > 0 ? Math.round((totalExtracted / (totalExtracted + unmatchedItems)) * 100) : 0}%
              </span></div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{bonusCount}</div>
                <div className="text-xs text-muted-foreground">Bonuses</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{paymentCount}</div>
                <div className="text-xs text-muted-foreground">Payment Methods</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{featureCount}</div>
                <div className="text-xs text-muted-foreground">Features</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{faqCount}</div>
                <div className="text-xs text-muted-foreground">FAQs</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-teal-600">{contentSectionCount}</div>
                <div className="text-xs text-muted-foreground">Content Sections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Debug:</strong> Overall Confidence: {overallConfidence}%, 
            Name: {extractedData?.name ? '✓' : '✗'}, 
            Ratings: {extractedData?.ratings ? '✓' : '✗'}, 
            Slug: {extractedData?.slug || 'Not generated'}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Smart Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              placeholder="Paste review content here (up to 50,000 characters)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePasteFromClipboard} variant="outline" size="sm">
              <Clipboard className="w-4 h-4 mr-2" />
              Paste from Clipboard
            </Button>
            <Button onClick={handleParse} disabled={isProcessing || !content.trim()}>
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Parse Content
            </Button>
            {(extractedData || error) && (
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Characters: {content.length.toLocaleString()} / 50,000
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {extractedData && (
          <div className="space-y-4">
            {renderStats()}
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
                <TabsTrigger value="bonuses">Bonuses ({extractedData.bonuses?.length || 0})</TabsTrigger>
                <TabsTrigger value="payments">Payments ({extractedData.payments?.length || 0})</TabsTrigger>
                <TabsTrigger value="content">Content ({extractedData.content_sections?.length || 0})</TabsTrigger>
                <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {renderBasicInfo()}
              </TabsContent>

              <TabsContent value="ratings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Extracted Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extractedData.ratings ? (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(extractedData.ratings).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm capitalize">{key}:</span>
                            <span className="font-medium">{value?.toFixed(1) || 'N/A'}/10</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No ratings extracted</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bonuses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Extracted Bonuses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extractedData.bonuses && extractedData.bonuses.length > 0 ? (
                      <div className="space-y-3">
                        {extractedData.bonuses.map((bonus, i) => (
                          <div key={i} className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{bonus.bonus_type}</Badge>
                              <span className="font-medium">{bonus.title}</span>
                            </div>
                            {bonus.value && <p className="text-sm text-green-600">Value: {bonus.value}</p>}
                            {bonus.description && <p className="text-sm text-muted-foreground">{bonus.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No bonuses extracted</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Extracted Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extractedData.payments && extractedData.payments.length > 0 ? (
                      <div className="space-y-3">
                        {extractedData.payments.map((payment, i) => (
                          <div key={i} className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{payment.method_type}</Badge>
                              <span className="font-medium">{payment.payment_method}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              {payment.processing_time && <div>Time: {payment.processing_time}</div>}
                              {payment.fees && <div>Fees: {payment.fees}</div>}
                              {payment.min_amount && <div>Min: {payment.min_amount}</div>}
                              {payment.max_amount && <div>Max: {payment.max_amount}</div>}
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

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Extracted Content Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extractedData.content_sections && extractedData.content_sections.length > 0 ? (
                      <div className="space-y-3">
                        {extractedData.content_sections.map((section, i) => (
                          <div key={i} className="border rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{section.section_key}</Badge>
                              <span className="font-medium">{section.heading}</span>
                            </div>
                            <div className="text-sm text-muted-foreground max-h-20 overflow-y-auto">
                              <div dangerouslySetInnerHTML={{ __html: section.rich_text_content.substring(0, 200) + '...' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No content sections extracted</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="unmatched" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Unmatched Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {extractedData.unmatched_content ? (
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {extractedData.unmatched_content}
                      </div>
                    ) : (
                      <p className="text-sm text-green-600">All content successfully categorized! 🎉</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleApplyData} className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Apply to Form
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}