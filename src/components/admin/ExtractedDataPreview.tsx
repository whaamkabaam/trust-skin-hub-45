import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from '../StarRating';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Building, User, Shield, CreditCard, Gift, HelpCircle } from 'lucide-react';

interface ExtractedDataPreviewProps {
  data: any;
  type: 'operator' | 'review' | 'extensions';
}

export function ExtractedDataPreview({ data, type }: ExtractedDataPreviewProps) {
  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No data extracted</p>
        </CardContent>
      </Card>
    );
  }

  const renderOperatorData = (operatorData: any) => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {operatorData.name && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Name</span>
                <p className="text-sm">{operatorData.name}</p>
              </div>
            )}
            {operatorData.site_type && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Site Type</span>
                <Badge variant="outline" className="ml-2">{operatorData.site_type}</Badge>
              </div>
            )}
            {operatorData.launch_year && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Launch Year</span>
                <p className="text-sm">{operatorData.launch_year}</p>
              </div>
            )}
            {operatorData.verification_status && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Verification</span>
                <Badge 
                  variant={operatorData.verification_status === 'verified' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {operatorData.verification_status}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ratings */}
        {operatorData.ratings && Object.values(operatorData.ratings).some(v => v !== null) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ratings (0-10 scale)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(operatorData.ratings).map(([key, value]) => 
                  value !== null && (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs font-medium capitalize">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{String(value)}/10</span>
                        <div className="w-16">
                          <StarRating rating={Number(value) / 2} />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pros and Cons */}
        {(operatorData.pros?.length > 0 || operatorData.cons?.length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pros & Cons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {operatorData.pros?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-success">Pros</span>
                  <ul className="mt-1 space-y-1">
                    {operatorData.pros.map((pro: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">• {pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {operatorData.cons?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-destructive">Cons</span>
                  <ul className="mt-1 space-y-1">
                    {operatorData.cons.map((con: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">• {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {operatorData.verdict && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Verdict</span>
                <p className="text-sm mt-1">{operatorData.verdict}</p>
              </div>
            )}
            {operatorData.bonus_terms && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Bonus Terms</span>
                <p className="text-sm mt-1">{operatorData.bonus_terms}</p>
              </div>
            )}
            {operatorData.company_background && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Company Background</span>
                <p className="text-sm mt-1">{operatorData.company_background}</p>
              </div>
            )}
            {operatorData.kyc_required !== null && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">KYC Required</span>
                <Badge variant={operatorData.kyc_required ? 'destructive' : 'default'} className="ml-2">
                  {operatorData.kyc_required ? 'Yes' : 'No'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );

  const renderReviewData = (reviewData: any) => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Review Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewData.rating && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Overall Rating</span>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={reviewData.rating} />
                  <span className="text-sm font-mono">{reviewData.rating}/5</span>
                </div>
              </div>
            )}
            {reviewData.title && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Title</span>
                <p className="text-sm mt-1 font-medium">{reviewData.title}</p>
              </div>
            )}
            {reviewData.username && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Username</span>
                <p className="text-sm mt-1">{reviewData.username}</p>
              </div>
            )}
            {reviewData.verification_status && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">Verification</span>
                <Badge variant="outline" className="ml-2">{reviewData.verification_status}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {reviewData.content && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Review Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{reviewData.content}</p>
            </CardContent>
          </Card>
        )}

        {reviewData.subscores && Object.values(reviewData.subscores).some(v => v !== null) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Subscores (1-5 scale)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(reviewData.subscores).map(([key, value]) => 
                  value !== null && (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs font-medium capitalize">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{String(value)}/5</span>
                        <div className="w-16">
                          <StarRating rating={Number(value)} />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );

  const renderExtensionsData = (extensionsData: any) => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {/* Bonuses */}
        {extensionsData.bonuses?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Bonuses ({extensionsData.bonuses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extensionsData.bonuses.map((bonus: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {bonus.title && <span className="font-medium text-sm">{bonus.title}</span>}
                      {bonus.bonus_type && <Badge variant="outline">{bonus.bonus_type}</Badge>}
                    </div>
                    {bonus.value && <p className="text-sm text-muted-foreground">Value: {bonus.value}</p>}
                    {bonus.terms && <p className="text-xs text-muted-foreground mt-1">{bonus.terms}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods */}
        {extensionsData.payments?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Methods ({extensionsData.payments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extensionsData.payments.map((payment: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {payment.payment_method && <span className="font-medium text-sm">{payment.payment_method}</span>}
                      {payment.method_type && <Badge variant="outline">{payment.method_type}</Badge>}
                    </div>
                    {payment.processing_time && <p className="text-sm text-muted-foreground">Processing: {payment.processing_time}</p>}
                    {(payment.minimum_amount || payment.maximum_amount) && (
                      <p className="text-xs text-muted-foreground">
                        Limits: {payment.minimum_amount ? `$${payment.minimum_amount}` : 'N/A'} - {payment.maximum_amount ? `$${payment.maximum_amount}` : 'N/A'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        {extensionsData.features?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Features ({extensionsData.features.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {extensionsData.features.map((feature: any, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {feature.feature_name && <span className="text-sm font-medium">{feature.feature_name}</span>}
                        {feature.feature_type && <Badge variant="outline" className="text-xs">{feature.feature_type}</Badge>}
                        {feature.is_highlighted && <Badge variant="default" className="text-xs">Highlighted</Badge>}
                      </div>
                      {feature.description && <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security */}
        {extensionsData.security && Object.values(extensionsData.security).some(v => v !== null && v !== undefined) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {extensionsData.security.ssl_enabled !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs">SSL Enabled</span>
                  <Badge variant={extensionsData.security.ssl_enabled ? 'default' : 'destructive'}>
                    {extensionsData.security.ssl_enabled ? 'Yes' : 'No'}
                  </Badge>
                </div>
              )}
              {extensionsData.security.provably_fair !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs">Provably Fair</span>
                  <Badge variant={extensionsData.security.provably_fair ? 'default' : 'secondary'}>
                    {extensionsData.security.provably_fair ? 'Yes' : 'No'}
                  </Badge>
                </div>
              )}
              {extensionsData.security.license_info && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">License</span>
                  <p className="text-sm mt-1">{extensionsData.security.license_info}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* FAQs */}
        {extensionsData.faqs?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs ({extensionsData.faqs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {extensionsData.faqs.map((faq: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {faq.category && <Badge variant="outline" className="text-xs">{faq.category}</Badge>}
                      {faq.is_featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                    </div>
                    {faq.question && <p className="text-sm font-medium mb-1">{faq.question}</p>}
                    {faq.answer && <p className="text-xs text-muted-foreground">{faq.answer}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );

  switch (type) {
    case 'operator':
      return renderOperatorData(data);
    case 'review':
      return renderReviewData(data);
    case 'extensions':
      return renderExtensionsData(data);
    default:
      return <div>Unknown data type</div>;
  }
}