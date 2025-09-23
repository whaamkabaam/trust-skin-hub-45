import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceIndicator({ score, label, size = 'md' }: ConfidenceIndicatorProps) {
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { level: 'high', color: 'success', icon: CheckCircle };
    if (score >= 60) return { level: 'medium', color: 'warning', icon: AlertTriangle };
    return { level: 'low', color: 'destructive', icon: XCircle };
  };

  const confidence = getConfidenceLevel(score);
  const Icon = confidence.icon;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`font-medium ${sizeClasses[size]}`}>{label}</span>
        <div className="flex items-center gap-1">
          <Icon className={`${iconSizes[size]} text-${confidence.color}`} />
          <span className={`${sizeClasses[size]} font-mono`}>{score}%</span>
        </div>
      </div>
      
      <Progress 
        value={score} 
        className="h-2"
      />
      
      <div className="flex justify-center">
        <Badge 
          variant={confidence.color === 'success' ? 'default' : 
                  confidence.color === 'warning' ? 'secondary' : 'destructive'}
          className={sizeClasses[size]}
        >
          {confidence.level.toUpperCase()} CONFIDENCE
        </Badge>
      </div>
    </div>
  );
}