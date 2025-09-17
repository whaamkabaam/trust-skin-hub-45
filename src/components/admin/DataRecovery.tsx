import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';

interface DataRecoveryProps {
  operatorId: string;
  onDataRecover?: (data: any) => void;
}

export function DataRecovery({ operatorId, onDataRecover }: DataRecoveryProps) {
  const [isRecovering, setIsRecovering] = useState(false);
  const [availableBackups, setAvailableBackups] = useState<string[]>([]);

  const scanForBackups = useCallback(() => {
    const backups: string[] = [];
    
    // Scan localStorage for any data related to this operator
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(operatorId)) {
        backups.push(key);
      }
    }
    
    setAvailableBackups(backups);
    return backups;
  }, [operatorId]);

  const exportBackup = useCallback(() => {
    try {
      const backups = scanForBackups();
      const backupData: Record<string, any> = {};
      
      backups.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            backupData[key] = JSON.parse(value);
          } catch {
            backupData[key] = value;
          }
        }
      });
      
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `operator-backup-${operatorId}-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Backup exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export backup');
    }
  }, [operatorId, scanForBackups]);

  const recoverData = useCallback(async () => {
    setIsRecovering(true);
    
    try {
      const backups = scanForBackups();
      const recoveredData: Record<string, any> = {};
      
      backups.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            recoveredData[key] = JSON.parse(value);
          } catch {
            recoveredData[key] = value;
          }
        }
      });
      
      if (Object.keys(recoveredData).length > 0) {
        onDataRecover?.(recoveredData);
        toast.success(`Recovered ${Object.keys(recoveredData).length} data items`);
      } else {
        toast.info('No recoverable data found');
      }
    } catch (error) {
      console.error('Recovery failed:', error);
      toast.error('Data recovery failed');
    } finally {
      setIsRecovering(false);
    }
  }, [operatorId, scanForBackups, onDataRecover]);

  const clearAllBackups = useCallback(() => {
    try {
      const backups = scanForBackups();
      backups.forEach(key => {
        localStorage.removeItem(key);
      });
      
      setAvailableBackups([]);
      toast.success(`Cleared ${backups.length} backup items`);
    } catch (error) {
      console.error('Clear failed:', error);
      toast.error('Failed to clear backups');
    }
  }, [scanForBackups]);

  // Scan on component mount
  useState(() => {
    scanForBackups();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Data Recovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            If you've lost data due to crashes or errors, you can attempt to recover it from local backups.
            Found {availableBackups.length} potential backup items.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={scanForBackups}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Scan for Backups
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportBackup}
            disabled={availableBackups.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Backup
          </Button>
          
          <Button 
            onClick={recoverData}
            disabled={isRecovering || availableBackups.length === 0}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isRecovering ? 'Recovering...' : 'Recover Data'}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={clearAllBackups}
            disabled={availableBackups.length === 0}
          >
            Clear All Backups
          </Button>
        </div>
        
        {availableBackups.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Available backup keys:</p>
            <ul className="list-disc list-inside space-y-1">
              {availableBackups.slice(0, 5).map(key => (
                <li key={key} className="truncate">{key}</li>
              ))}
              {availableBackups.length > 5 && (
                <li>... and {availableBackups.length - 5} more</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}