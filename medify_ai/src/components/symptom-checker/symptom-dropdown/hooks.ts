import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, APP_CONFIG } from '@/lib/constants';

export interface SymptomOption {
  label: string;
  value: string;
}

export interface UseSymptomsReturn {
  symptoms: string[];
  displayOptions: SymptomOption[];
  selectedOptions: string[];
  isLoading: boolean;
  error: string | null;
  setSelectedOptions: (symptoms: string[]) => void;
  addSymptom: (symptom: string) => void;
  removeSymptom: (symptom: string) => void;
  submitSymptoms: () => Promise<void>;
}

export const useSymptoms = (): UseSymptomsReturn => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [displayOptions, setDisplayOptions] = useState<SymptomOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch symptoms on mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(API_ENDPOINTS.SYMPTOMS);
        const rawSymptoms = response.data.symptoms;
        
        setSymptoms(rawSymptoms);
        setDisplayOptions(
          rawSymptoms.map((symptom: string) => ({
            label: symptom.replaceAll('_', ' '),
            value: symptom
          }))
        );
      } catch (err) {
        setError('Failed to load symptoms. Please try again.');
        console.error('Error fetching symptoms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const addSymptom = useCallback((symptom: string) => {
    if (selectedOptions.length >= APP_CONFIG.MAX_SYMPTOMS) {
      setError(`You can only select up to ${APP_CONFIG.MAX_SYMPTOMS} symptoms.`);
      return;
    }
    
    if (!selectedOptions.includes(symptom)) {
      setSelectedOptions(prev => [...prev, symptom]);
      setError(null);
    }
  }, [selectedOptions]);

  const removeSymptom = useCallback((symptom: string) => {
    setSelectedOptions(prev => prev.filter(s => s !== symptom));
    setError(null);
  }, []);

  const submitSymptoms = useCallback(async () => {
    if (selectedOptions.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.post(API_ENDPOINTS.PREDICT, {
        symptoms: selectedOptions
      });
      // Handle successful submission (navigation, etc.)
    } catch (err) {
      setError('Failed to submit symptoms. Please try again.');
      console.error('Error submitting symptoms:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedOptions]);

  return {
    symptoms,
    displayOptions,
    selectedOptions,
    isLoading,
    error,
    setSelectedOptions,
    addSymptom,
    removeSymptom,
    submitSymptoms,
  };
};
