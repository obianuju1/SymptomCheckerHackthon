'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DiagnosesLoadingState = () => {
  return (
    <div className="spacing-section">
      <div className="text-center spacing-content">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="spacing-content">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiagnosesLoadingState;


