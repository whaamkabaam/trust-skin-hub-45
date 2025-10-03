import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImportResult {
  success: boolean;
  rowsProcessed: number;
  rowsInserted: number;
  rowsSkipped: number;
  errors: Array<{ row: number; error: string }>;
  categoryMappings: Record<string, string>;
}

export default function MysteryBoxImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<string>('rillabox');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setResult(null);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('provider', provider);
      formData.append('skipDuplicates', String(skipDuplicates));

      const { data, error } = await supabase.functions.invoke('import-mystery-boxes', {
        body: formData,
      });

      if (error) throw error;

      setResult(data as ImportResult);
      
      if (data.success) {
        toast.success(`Successfully imported ${data.rowsInserted} mystery boxes!`);
      } else {
        toast.error(`Import completed with ${data.errors.length} errors`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import CSV file');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mystery Box CSV Import</h1>
          <p className="text-muted-foreground mt-2">
            Import mystery box data from CSV files into your database
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Select a CSV file containing mystery box data and choose the provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div>
              <Label htmlFor="csv-file">CSV File</Label>
              <div className="mt-2">
                <label
                  htmlFor="csv-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedFile ? (
                      <>
                        <FileText className="w-8 h-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">CSV files only</p>
                      </>
                    )}
                  </div>
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <Label>Provider</Label>
              <RadioGroup value={provider} onValueChange={setProvider} className="mt-2 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rillabox" id="rillabox" />
                  <Label htmlFor="rillabox" className="cursor-pointer">RillaBox</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hypedrop" id="hypedrop" />
                  <Label htmlFor="hypedrop" className="cursor-pointer">HypeDrop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casesgg" id="casesgg" />
                  <Label htmlFor="casesgg" className="cursor-pointer">Cases.GG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxdrop" id="luxdrop" />
                  <Label htmlFor="luxdrop" className="cursor-pointer">LuxDrop</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <Label htmlFor="skip-duplicates">Skip duplicate boxes</Label>
              <Switch
                id="skip-duplicates"
                checked={skipDuplicates}
                onCheckedChange={setSkipDuplicates}
              />
            </div>

            {/* Import Button */}
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="w-full"
              size="lg"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Processed</p>
                  <p className="text-2xl font-bold">{result.rowsProcessed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inserted</p>
                  <p className="text-2xl font-bold text-green-500">{result.rowsInserted}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Skipped</p>
                  <p className="text-2xl font-bold text-yellow-500">{result.rowsSkipped}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Errors ({result.errors.length})</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="text-sm text-red-500">
                        Row {err.row}: {err.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(result.categoryMappings).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Category Mappings</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(result.categoryMappings).map(([csv, slug]) => (
                      <div key={csv}>
                        <span className="text-muted-foreground">{csv}</span> → {slug}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
