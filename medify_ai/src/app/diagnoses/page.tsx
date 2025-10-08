'use client'
import React, { useEffect, useState } from 'react';
import { usePastDiagnoses } from '@/hooks/use-past-diagnoses';
import { useAuth } from '../../../context/AuthContext';
import { 
  DiagnosesHeader, 
  DiagnosesList, 
  DiagnosesEmptyState, 
  DiagnosesLoadingState, 
  DiagnosesErrorState 
} from '@/components/diagnoses';

const Diagnoses = () => {
  const { user } = useAuth();
  const { diagnoses, isLoading, error, hasMore, fetchDiagnoses, loadMore, deleteDiagnosis } = usePastDiagnoses();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.uid) {
      fetchDiagnoses(user.uid, 20);
    }
  }, [user?.uid, fetchDiagnoses]);

  const filteredDiagnoses = diagnoses.filter(diagnosis =>
    diagnosis.Disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagnosis.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    if (user?.uid) {
      loadMore(user.uid);
    }
  };

  const handleRetry = () => {
    if (user?.uid) {
      fetchDiagnoses(user.uid, 20);
    }
  };

  const handleDelete = async (diagnosisId: string) => {
    if (user?.uid) {
      await deleteDiagnosis(user.uid, diagnosisId);
    }
  };

  // Loading state
  if (isLoading && diagnoses.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <DiagnosesLoadingState />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <DiagnosesErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <DiagnosesHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalDiagnoses={diagnoses.length}
      />

      {filteredDiagnoses.length === 0 && diagnoses.length > 0 ? (
        <DiagnosesEmptyState type="no-results" searchTerm={searchTerm} />
      ) : filteredDiagnoses.length === 0 ? (
        <DiagnosesEmptyState type="no-diagnoses" />
      ) : (
        <DiagnosesList 
          diagnoses={filteredDiagnoses}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Diagnoses;