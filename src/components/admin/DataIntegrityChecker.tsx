import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IntegrityResult {
  operatorId: string;
  operatorName: string;
  issues: string[];
  hasExtensionData: {
    bonuses: boolean;
    payments: boolean;
    security: boolean;
    faqs: boolean;
  };
  publishedContentExists: boolean;
  isHealthy: boolean;
}

interface DataIntegrityCheckerProps {
  operatorId?: string;
}

export function DataIntegrityChecker({ operatorId }: DataIntegrityCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<IntegrityResult[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkOperatorIntegrity = useCallback(async (id: string): Promise<IntegrityResult> => {
    const issues: string[] = [];
    
    try {
      // Get operator basic info
      const { data: operator, error: operatorError } = await supabase
        .from('operators')
        .select('id, name, published')
        .eq('id', id)
        .single();
      
      if (operatorError || !operator) {
        throw new Error('Operator not found');
      }
      
      // Check extension data existence
      const [bonusesRes, paymentsRes, securityRes, faqsRes, publishedRes] = await Promise.all([
        supabase.from('operator_bonuses').select('count').eq('operator_id', id),
        supabase.from('operator_payment_methods').select('count').eq('operator_id', id),
        supabase.from('operator_security').select('count').eq('operator_id', id),
        supabase.from('operator_faqs').select('count').eq('operator_id', id),
        supabase.from('published_operator_content').select('count').eq('operator_id', id)
      ]);
      
      const hasExtensionData = {
        bonuses: bonusesRes.data && bonusesRes.data.length > 0,
        payments: paymentsRes.data && paymentsRes.data.length > 0,
        security: securityRes.data && securityRes.data.length > 0,
        faqs: faqsRes.data && faqsRes.data.length > 0
      };
      
      const publishedContentExists = publishedRes.data && publishedRes.data.length > 0;
      
      // Check for common issues
      if (operator.published && !publishedContentExists) {
        issues.push('Operator is marked as published but has no published content');
      }
      
      if (!hasExtensionData.bonuses) {
        issues.push('No bonus data found');
      }
      
      if (!hasExtensionData.payments) {
        issues.push('No payment methods found');
      }
      
      if (!hasExtensionData.security) {
        issues.push('No security settings found');
      }
      
      if (operator.published && (!hasExtensionData.bonuses || !hasExtensionData.payments)) {
        issues.push('Published operator missing critical extension data');
      }
      
      return {
        operatorId: id,
        operatorName: operator.name,
        issues,
        hasExtensionData,
        publishedContentExists,
        isHealthy: issues.length === 0
      };
    } catch (error) {
      console.error('Error checking operator integrity:', error);
      return {
        operatorId: id,
        operatorName: 'Unknown',
        issues: ['Failed to check integrity: ' + (error instanceof Error ? error.message : 'Unknown error')],
        hasExtensionData: { bonuses: false, payments: false, security: false, faqs: false },
        publishedContentExists: false,
        isHealthy: false
      };
    }
  }, []);

  const runIntegrityCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      let operatorIds: string[] = [];
      
      if (operatorId) {
        // Check single operator
        operatorIds = [operatorId];
      } else {
        // Check all operators
        const { data: operators, error } = await supabase
          .from('operators')
          .select('id')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        operatorIds = operators?.map(op => op.id) || [];
      }
      
      if (operatorIds.length === 0) {
        toast.info('No operators found to check');
        return;
      }
      
      const results = await Promise.all(
        operatorIds.map(id => checkOperatorIntegrity(id))
      );
      
      setResults(results);
      setLastCheck(new Date());
      
      const healthyCount = results.filter(r => r.isHealthy).length;
      const totalIssues = results.reduce((acc, r) => acc + r.issues.length, 0);
      
      if (totalIssues === 0) {
        toast.success(`All ${results.length} operators are healthy`);
      } else {
        toast.warning(`Found ${totalIssues} issues across ${results.length - healthyCount} operators`);
      }
    } catch (error) {
      console.error('Error during integrity check:', error);
      toast.error('Integrity check failed');
    } finally {
      setIsChecking(false);
    }
  }, [operatorId, checkOperatorIntegrity]);

  const repairOperatorData = useCallback(async (operatorId: string) => {
    try {
      toast.info('Attempting to repair operator data...');
      
      // Create minimal extension data if missing
      const repairPromises = [];
      
      // Create basic security record if missing
      repairPromises.push(
        supabase.from('operator_security').upsert({
          operator_id: operatorId,
          ssl_enabled: false,
          compliance_certifications: [],
          provably_fair: false
        })
      );
      
      await Promise.all(repairPromises);
      
      // Re-run integrity check for this operator
      const newResult = await checkOperatorIntegrity(operatorId);
      setResults(prev => prev.map(r => r.operatorId === operatorId ? newResult : r));
      
      toast.success('Basic repair completed - please review operator data manually');
    } catch (error) {
      console.error('Error repairing operator:', error);
      toast.error('Failed to repair operator data');
    }
  }, [checkOperatorIntegrity]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Integrity Checker
          {lastCheck && (
            <Badge variant="outline" className="ml-auto">
              Last check: {lastCheck.toLocaleTimeString()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runIntegrityCheck}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking integrity...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              {operatorId ? 'Check This Operator' : 'Check All Operators'}
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Results:</h4>
            {results.map((result) => (
              <div 
                key={result.operatorId} 
                className={`p-3 border rounded-lg ${
                  result.isHealthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.isHealthy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium text-sm">{result.operatorName}</span>
                  </div>
                  {!result.isHealthy && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => repairOperatorData(result.operatorId)}
                    >
                      Repair
                    </Button>
                  )}
                </div>

                {result.issues.length > 0 && (
                  <div className="space-y-1">
                    {result.issues.map((issue, index) => (
                      <p key={index} className="text-xs text-red-700 flex items-center gap-1">
                        • {issue}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <Badge variant={result.hasExtensionData.bonuses ? "default" : "secondary"} className="text-xs">
                    {result.hasExtensionData.bonuses ? "✓" : "✗"} Bonuses
                  </Badge>
                  <Badge variant={result.hasExtensionData.payments ? "default" : "secondary"} className="text-xs">
                    {result.hasExtensionData.payments ? "✓" : "✗"} Payments
                  </Badge>
                  <Badge variant={result.hasExtensionData.security ? "default" : "secondary"} className="text-xs">
                    {result.hasExtensionData.security ? "✓" : "✗"} Security
                  </Badge>
                  <Badge variant={result.publishedContentExists ? "default" : "secondary"} className="text-xs">
                    {result.publishedContentExists ? "✓" : "✗"} Published
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}