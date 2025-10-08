'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DiagnosesErrorStateProps {
  error: string;
  onRetry: () => void;
}

const DiagnosesErrorState = ({ error, onRetry }: DiagnosesErrorStateProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center spacing-content">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-subheading">Error Loading Diagnoses</h2>
        <p className="text-body text-muted-foreground">{error}</p>
        <Button 
          onClick={onRetry}
          className="form-button bg-green-500 hover:bg-green-600"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default DiagnosesErrorState;


