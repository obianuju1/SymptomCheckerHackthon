import { useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  deleteDoc, 
  doc,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/firebase';

export interface PastDiagnosis {
  _id: string;
  Disease: string;
  Disease_normalized: string;
  Description: string;
  Precautions: string[];
  Date: string;
  symptoms?: string[];
}

export interface UsePastDiagnosesReturn {
  diagnoses: PastDiagnosis[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchDiagnoses: (userId: string, pageSize?: number) => Promise<void>;
  loadMore: (userId: string) => Promise<void>;
  deleteDiagnosis: (userId: string, diagnosisId: string) => Promise<void>;
}

export const usePastDiagnoses = (): UsePastDiagnosesReturn => {
  const [diagnoses, setDiagnoses] = useState<PastDiagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);

  const fetchDiagnoses = useCallback(async (userId: string, pageSize: number = 10) => {
    console.log('fetchDiagnoses called with userId:', userId, 'pageSize:', pageSize);
    if (!userId) {
      console.log('No userId provided, setting error');
      setError('User ID is required');
      return;
    }

    console.log('Starting to fetch diagnoses from Firebase...');
    setIsLoading(true);
    setError(null);

    try {
      // Create a reference to the user's past_diagnoses collection
      const userDiagnosesRef = collection(db, 'users', userId, 'past_diagnoses');
      
      // Create a query ordered by Date (newest first) with limit
      const q = query(
        userDiagnosesRef,
        orderBy('Date', 'desc'),
        limit(pageSize)
      );
      
      console.log('Executing Firebase query...');
      const querySnapshot = await getDocs(q);
      
      const diagnosesData: PastDiagnosis[] = [];
      let lastDocument: QueryDocumentSnapshot | null = null;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        diagnosesData.push({
          _id: doc.id,
          Disease: data.Disease || '',
          Disease_normalized: data.Disease_normalized || data.Disease?.toLowerCase() || '',
          Description: data.Description || '',
          Precautions: data.Precautions || [],
          Date: data.Date || '',
          symptoms: data.symptoms || []
        });
        lastDocument = doc;
      });
      
      console.log('Firebase diagnoses fetched:', diagnosesData);
      setDiagnoses(diagnosesData);
      setLastDoc(lastDocument);
    } catch (err) {
      console.error('Error fetching past diagnoses from Firebase:', err);
      setError('Failed to load past diagnoses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (userId: string) => {
    if (!userId || !lastDoc || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create a reference to the user's past_diagnoses collection
      const userDiagnosesRef = collection(db, 'users', userId, 'past_diagnoses');
      
      // Create a query starting after the last document
      const q = query(
        userDiagnosesRef,
        orderBy('Date', 'desc'),
        startAfter(lastDoc),
        limit(10)
      );
      
      console.log('Loading more diagnoses from Firebase...');
      const querySnapshot = await getDocs(q);
      
      const newDiagnoses: PastDiagnosis[] = [];
      let newLastDocument: QueryDocumentSnapshot | null = null;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newDiagnoses.push({
          _id: doc.id,
          Disease: data.Disease || '',
          Disease_normalized: data.Disease_normalized || data.Disease?.toLowerCase() || '',
          Description: data.Description || '',
          Precautions: data.Precautions || [],
          Date: data.Date || '',
          symptoms: data.symptoms || []
        });
        newLastDocument = doc;
      });
      
      console.log('More diagnoses loaded:', newDiagnoses);
      setDiagnoses(prev => [...prev, ...newDiagnoses]);
      setLastDoc(newLastDocument);
    } catch (err) {
      console.error('Error loading more diagnoses from Firebase:', err);
      setError('Failed to load more diagnoses');
    } finally {
      setIsLoading(false);
    }
  }, [lastDoc, isLoading]);

  const deleteDiagnosis = useCallback(async (userId: string, diagnosisId: string) => {
    try {
      console.log('Deleting diagnosis from Firebase:', diagnosisId, 'for user:', userId);
      
      // Create a reference to the specific diagnosis document
      const diagnosisRef = doc(db, 'users', userId, 'past_diagnoses', diagnosisId);
      
      // Delete the document from Firebase
      await deleteDoc(diagnosisRef);
      
      console.log('Diagnosis deleted successfully from Firebase');
      
      // Remove the diagnosis from local state
      setDiagnoses(prev => prev.filter(diagnosis => diagnosis._id !== diagnosisId));
    } catch (err) {
      console.error('Error deleting diagnosis from Firebase:', err);
      setError('Failed to delete diagnosis');
    }
  }, []);

  return {
    diagnoses,
    isLoading,
    error,
    hasMore: !!lastDoc,
    fetchDiagnoses,
    loadMore,
    deleteDiagnosis
  };
};
