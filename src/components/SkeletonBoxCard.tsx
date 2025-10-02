
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SkeletonBoxCard: React.FC = () => {
  return (
    <Card className="h-full bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
      <CardHeader className="pb-2">
        <Skeleton className="w-full h-40 rounded-lg mb-2 bg-white/20" />
        <Skeleton className="h-6 w-3/4 bg-white/20" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16 bg-white/20" />
          <Skeleton className="h-6 w-12 bg-white/20" />
        </div>
        <Skeleton className="h-8 w-20 mx-auto bg-white/20" />
        <Skeleton className="h-4 w-24 mx-auto bg-white/20" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 bg-white/20" />
          <Skeleton className="h-5 w-12 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonBoxCard;
