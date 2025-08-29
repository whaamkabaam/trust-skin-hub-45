import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TrustIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

const getTrustLevel = (score: number) => {
  if (score >= 4.0) return {
    level: 'high',
    label: 'High Trust',
    description: 'Excellent security record, transparent operations, and strong community reputation.',
    icon: CheckCircle,
    color: 'bg-success text-success-foreground',
    iconColor: 'text-success'
  };
  if (score >= 3.0) return {
    level: 'medium',
    label: 'Medium Trust',
    description: 'Good security practices with minor concerns or limited track record.',
    icon: AlertTriangle,
    color: 'bg-warning text-warning-foreground',
    iconColor: 'text-warning'
  };
  return {
    level: 'low',
    label: 'Low Trust',
    description: 'Significant security concerns, poor transparency, or negative community feedback.',
    icon: XCircle,
    color: 'bg-destructive text-destructive-foreground',
    iconColor: 'text-destructive'
  };
};

const TrustIndicator = ({ 
  score, 
  size = 'md', 
  showLabel = true, 
  showTooltip = true 
}: TrustIndicatorProps) => {
  const trust = getTrustLevel(score);
  const Icon = trust.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const component = (
    <div className="inline-flex items-center gap-2">
      <Badge className={cn(trust.color, sizeClasses[size])}>
        <Shield className={cn("mr-1", iconSizes[size])} />
        {score.toFixed(1)}
      </Badge>
      {showLabel && (
        <div className="flex items-center gap-1">
          <Icon className={cn(trust.iconColor, iconSizes[size])} />
          <span className={cn("font-medium", trust.iconColor)}>
            {trust.label}
          </span>
        </div>
      )}
    </div>
  );

  if (!showTooltip) {
    return component;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {component}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={cn(trust.iconColor, "w-4 h-4")} />
              <span className="font-medium">{trust.label}</span>
            </div>
            <p className="text-sm">{trust.description}</p>
            <div className="text-xs text-muted-foreground">
              Trust Score: {score.toFixed(1)}/5.0
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TrustIndicator;