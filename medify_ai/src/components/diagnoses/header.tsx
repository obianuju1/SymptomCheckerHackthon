'use client'

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DiagnosesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalDiagnoses: number;
}

const DiagnosesHeader = ({ searchTerm, onSearchChange, totalDiagnoses }: DiagnosesHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/home');
  };

  return (
    <div className="spacing-section">
      <div className="flex items-center justify-start mb-6">
        <button
          onClick={handleBackClick}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <div className="text-center spacing-content">
        <h1 className="text-heading-gradient">Past Diagnoses</h1>
        <p className="text-body text-muted-foreground">
          View your medical diagnosis history and track your health over time.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 text-white" />
          <Input
            placeholder="Search diagnoses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input pl-10 text-white"
          />
        </div>
        <div className="flex items-center gap-2 text-small text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{totalDiagnoses} total diagnoses</span>
        </div>
      </div>
    </div>
  );
};

export default DiagnosesHeader;
