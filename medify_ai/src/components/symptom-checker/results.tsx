'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { DiagnosisResults } from "@/hooks/use-symptoms"

interface ResultsDisplayProps {
  results: DiagnosisResults
  onBack: () => void
}

const ResultsDisplay = ({ results, onBack }: ResultsDisplayProps) => {
  const router = useRouter()
  const confidencePercentage = Math.round(results.Confidence * 100)

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Diagnosis Complete
            </h2>
          </div>
          <p className="text-base text-muted-foreground">
            Here are your results based on the symptoms you provided
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Diagnosis */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Primary Diagnosis</h3>
            <div className="p-4 rounded-lg border-green-500 border">
              <p className="text-lg font-medium text-primary">{results.Disease}</p>
            </div>
          </div>

          {/* Description */}
          {results.Description && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Description</h3>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm leading-relaxed text-muted-foreground">{results.Description}</p>
              </div>
            </div>
          )}

          {/* Confidence */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">Confidence Level</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence</span>
                <span className="font-medium">{confidencePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${confidencePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Precautions */}
          {results.Precautions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Precautions</h3>
              <ul className="space-y-2">
                {results.Precautions.map((precaution: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4  border border-green-500 rounded-lg">
            <p className="text-sm">
              <strong>Disclaimer:</strong> This is an AI-powered preliminary assessment and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Start New Assessment
            </Button>
            <Button 
              onClick={() => router.push('/home')}
              variant="default"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <Home className="w-4 h-4 text-white" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultsDisplay
