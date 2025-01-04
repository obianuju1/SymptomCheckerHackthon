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
    <div className="w-screen h-screen bg-[#1F2327] text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-[#2A2F36] rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-400 my-6">
          Your Predicted Disease is:
          <h6 className="text-green-600">{disease}</h6>
        </h1>

        <Card className="rounded-lg bg-[#1A1D22] shadow-lg border border-[#333B44]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-green-400">
              Disease Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              A concise breakdown of the disease, symptoms, and treatment options.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="mb-6">
              <p className="text-lg font-semibold text-green-400 mb-2">Definition:</p>
              <p className="text-gray-300">{definition}</p>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold text-green-400 mb-2">Symptoms:</p>
              <ul className="list-disc list-inside text-gray-300">
                {symptoms.split(", ").map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold text-green-400 mb-2">Treatment:</p>
              <p className="text-gray-300">{treatment}</p>
            </div>
          </CardContent>

          <CardFooter className="text-sm text-gray-400 text-center">
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
