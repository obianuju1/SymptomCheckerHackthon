'use client'

import { CheckCircle, Circle } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: 'symptoms' | 'results'
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  const steps = [
    { id: 'symptoms', label: 'Select Symptoms', completed: currentStep === 'symptoms' || currentStep === 'results' },
    { id: 'results', label: 'View Results', completed: currentStep === 'results' }
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 text-gray-300'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs mt-1 ${
                step.completed ? 'text-green-600 font-medium' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressIndicator

