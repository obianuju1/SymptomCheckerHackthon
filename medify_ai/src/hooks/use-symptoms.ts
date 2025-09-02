import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, APP_CONFIG } from '@/lib/constants';

export interface SymptomOption {
  label: string;
  value: string;
}

export interface DiagnosisResults {
  Precautions: string[];
  Disease: string;
  Description: string;
  Disease_Normalized: string;
  Confidence: number;
}

export interface UseSymptomsReturn {
  symptoms: string[];
  displayOptions: SymptomOption[];
  selectedOptions: string[];
  isLoading: boolean;
  setSelectedOptions: (symptoms: string[]) => void;
  addSymptom: (symptom: string) => void;
  removeSymptom: (symptom: string) => void;
  submitSymptoms: () => Promise<DiagnosisResults>;
  fetchSymptoms: () => Promise<void>;
}

export const useSymptoms = (): UseSymptomsReturn => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [displayOptions, setDisplayOptions] = useState<SymptomOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSymptoms = useCallback(async () => {
    setIsLoading(true);
    
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
      console.error('Error fetching symptoms:', err);
      throw new Error('Failed to load symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch symptoms on mount
  useEffect(() => {
    fetchSymptoms().catch(console.error);
  }, [fetchSymptoms]);

  const addSymptom = useCallback((symptom: string) => {
    if (selectedOptions.length >= APP_CONFIG.MAX_SYMPTOMS) {
      throw new Error(`You can only select up to ${APP_CONFIG.MAX_SYMPTOMS} symptoms.`);
    }
    
    if (!selectedOptions.includes(symptom)) {
      setSelectedOptions(prev => [...prev, symptom]);
    }
  }, [selectedOptions]);

  const removeSymptom = useCallback((symptom: string) => {
    setSelectedOptions(prev => prev.filter(s => s !== symptom));
  }, []);

  const submitSymptoms = useCallback(async () => {
    if (selectedOptions.length === 0) {
      throw new Error('Please select at least one symptom.');
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.PREDICT, {
        symptoms: selectedOptions
      });
      console.log('Symptoms submitted successfully:', response.data);
      return response.data;
      // Handle successful submission (navigation, etc.)
    } catch (err) {
      console.error('Error submitting symptoms:', err);
      throw new Error('Failed to submit symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedOptions]);



  return {
    symptoms,
    displayOptions,
    selectedOptions,
    isLoading,
    setSelectedOptions,
    addSymptom,
    removeSymptom,
    submitSymptoms,
    fetchSymptoms,
  };
};
