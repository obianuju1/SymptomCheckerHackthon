import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/constants';

export interface PastDiagnosis {
  _id: string;
  Disease: string;
  Disease_Normalized: string;
  Description: string;
  Precautions: string[];
  Date: string;
  symptoms?: string[];
}

export interface PastDiagnosesResponse {
  results: PastDiagnosis[];
  next_cursor?: string;
}

export interface UsePastDiagnosesReturn {
  diagnoses: PastDiagnosis[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchDiagnoses: (userId: string, pageSize?: number) => Promise<void>;
  loadMore: (userId: string) => Promise<void>;
}

export const usePastDiagnoses = (): UsePastDiagnosesReturn => {
  const [diagnoses, setDiagnoses] = useState<PastDiagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const fetchDiagnoses = useCallback(async (userId: string, pageSize: number = 10) => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_ENDPOINTS.PREDICT.replace('/predict', '')}/user/past_diagnoses`, {
        params: {
          user_id: userId,
          page_size: pageSize
        }
      });

      const data: PastDiagnosesResponse = response.data;
      setDiagnoses(data.results);
      setNextCursor(data.next_cursor);
    } catch (err) {
      console.error('Error fetching past diagnoses:', err);
      setError('Failed to load past diagnoses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (userId: string) => {
    if (!userId || !nextCursor || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_ENDPOINTS.PREDICT.replace('/predict', '')}/user/past_diagnoses`, {
        params: {
          user_id: userId,
          page_size: 10,
          start_after: nextCursor
        }
      });

      const data: PastDiagnosesResponse = response.data;
      setDiagnoses(prev => [...prev, ...data.results]);
      setNextCursor(data.next_cursor);
    } catch (err) {
      console.error('Error loading more diagnoses:', err);
      setError('Failed to load more diagnoses');
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading]);

  return {
    diagnoses,
    isLoading,
    error,
    hasMore: !!nextCursor,
    fetchDiagnoses,
    loadMore
  };
};
