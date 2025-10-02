
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SkeletonStatsCard: React.FC = () => {
  return (
    <Card className="glass-edge border-purple-200/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32 bg-gray-200" />
        <Skeleton className="h-5 w-5 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2 bg-gray-200" />
        <Skeleton className="h-3 w-24 bg-gray-200" />
      </CardContent>
    </Card>
  );
};

export default SkeletonStatsCard;
