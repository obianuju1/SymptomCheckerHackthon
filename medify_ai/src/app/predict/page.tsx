'use client'

import React, { useState } from 'react'
import SymptomDropdown from '@/components/symptom-checker/symptom-dropdown'
import ResultsDisplay from '@/components/symptom-checker/results'
import ProgressIndicator from '@/components/symptom-checker/progress-indicator'
import { DiagnosisResults } from '@/hooks/use-symptoms'

type ProcessStep = 'symptoms' | 'results'

const Predict = () => {
  const [currentStep, setCurrentStep] = useState<ProcessStep>('symptoms')
  const [results, setResults] = useState<DiagnosisResults | null>(null)

  const handleSubmission = (diagnosisResults: DiagnosisResults) => {
    setResults(diagnosisResults)
    setCurrentStep('results')
  }

  const handleBack = () => {
    setCurrentStep('symptoms')
    setResults(null)
  }

  return (
    <div className="container mx-auto p-4">
      <ProgressIndicator currentStep={currentStep} />
      
      {currentStep === 'symptoms' && (
        <SymptomDropdown onSubmission={handleSubmission} />
      )}
      
      {currentStep === 'results' && results && (
        <ResultsDisplay 
          results={results} 
          onBack={handleBack}
        />
      )}
    </div>
  )
}

export default Predict