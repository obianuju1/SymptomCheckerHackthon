"use client";
import React, { useState } from "react";
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const Prediction = () => {
  const [disease, setDisease] = useState("Common Cold");
  const [symptoms, setSymptoms] = useState(
    "Cough, sore throat, runny nose, fatigue"
  );
  const [treatment, setTreatment] = useState(
    "Rest, fluids, over-the-counter medications"
  );
  const [definition, setDefinition] = useState(
    "A viral infection that affects the upper respiratory tract."
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 my-6">
          Your Predicted Disease is:
          <span className="text-blue-600">{disease}</span>
        </h1>

        <Card className="rounded-lg p-8 bg-white shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Disease Overview
            </CardTitle>
            <CardDescription className="text-gray-500">
              A concise breakdown of the disease, symptoms, and treatment options.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-2">Definition:</p>
              <p className="text-gray-700">{definition}</p>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-2">Symptoms:</p>
              <ul className="list-disc list-inside text-gray-700">
                {symptoms.split(", ").map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-2">Treatment:</p>
              <p className="text-gray-700">{treatment}</p>
            </div>
          </CardContent>

          <CardFooter className="text-sm text-gray-500 text-center">
            <p>
              Please seek medical attention if symptoms persist or worsen.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Prediction;
