'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface Diagnosis {
  _id: string;
  Disease: string;
  Date: string;
  Description?: string;
  symptoms?: string[];
  Precautions?: string[];
}

interface DiagnosesCardProps {
  diagnosis: Diagnosis;
  onDelete?: (diagnosisId: string) => void;
}

const DiagnosesCard = ({ diagnosis, onDelete }: DiagnosesCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow border-green-400">
      <CardContent className="p-6">
        <div className="spacing-content">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-subheading">{diagnosis.Disease}</h3>
              <p className="text-small text-muted-foreground">
                {new Date(diagnosis.Date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(diagnosis._id)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-500 hover:text-red-700"
                aria-label="Delete diagnosis"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {diagnosis.Description && (
            <p className="text-body text-muted-foreground">{diagnosis.Description}</p>
          )}
          
          {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
            <div>
              <h4 className="text-body font-medium mb-2">Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {diagnosis.symptoms.map((symptom, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-small"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {diagnosis.Precautions && diagnosis.Precautions.length > 0 && (
            <div>
              <h4 className="text-body font-medium mb-2">Precautions:</h4>
              <ul className="list-disc list-inside space-y-1 text-small text-muted-foreground">
                {diagnosis.Precautions.map((precaution, index) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosesCard;
