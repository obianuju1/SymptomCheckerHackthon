'use client'

import { Skeleton } from '@/components/ui/skeleton';
import DiagnosesCard from './card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

interface Diagnosis {
  _id: string;
  Disease: string;
  Date: string;
  Description?: string;
  symptoms?: string[];
  Precautions?: string[];
}

interface DiagnosesListProps {
  diagnoses: Diagnosis[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onDelete?: (diagnosisId: string) => void;
}

const DiagnosesList = ({ diagnoses, hasMore, isLoading, onLoadMore, onDelete }: DiagnosesListProps) => {
  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore
  });

  return (
    <div className="grid gap-4">
      {diagnoses.map((diagnosis, index) => {
        // Attach the ref to the last element
        const isLastElement = index === diagnoses.length - 1;
        return (
          <div
            key={diagnosis._id}
            ref={isLastElement ? lastElementRef : null}
          >
            <DiagnosesCard diagnosis={diagnosis} onDelete={onDelete} />
          </div>
        );
      })}
      
      {/* Loading indicator at the bottom */}
      {isLoading && (
        <div className="grid gap-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="spacing-content">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosesList;
