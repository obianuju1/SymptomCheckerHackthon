"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation"; // Import the useSearchParams hook

const Prediction = () => {
  const searchParams = useSearchParams(); // Get the URL query parameters
  const [predictedDisease, setPredictedDisease] = useState("");
  const [diseaseInfo, setDiseaseInfo] = useState({
    description: "",
    disease: "",
    precautions: "",
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<any>([]); // State for storing selected symptoms
  
  useEffect(() => {
    const disease = searchParams.get("disease"); // Get the disease from URL query parameter
    const symptoms = searchParams.get("symptoms"); // Get the disease from URL query parameter
    if (disease) {
      setPredictedDisease(disease); // Set the predicted disease name
    if (symptoms) {
        try {
          const parsedSymptoms = JSON.parse(decodeURIComponent(symptoms)); // Parse symptoms
          setSelectedSymptoms(parsedSymptoms); // Set selected symptoms
        } catch (error) {
          console.error("Failed to parse symptoms:", error);
        }
      }
  
      const fetchDiseaseInfo = async () => {
        try {
          // Fetch disease details from 'Diagnoses' collection based on the predicted disease
          const diseaseDetailsQuery = query(
            collection(db, "Diagnoses"),
            where("Disease", "==", disease)
          );
          const diseaseDetailsSnapshot = await getDocs(diseaseDetailsQuery);
          const diseaseDetailsData = diseaseDetailsSnapshot.docs[0]?.data();

          if (diseaseDetailsData) {
            setDiseaseInfo({
              description: diseaseDetailsData.Description,  // Ensure these fields match your DB structure
              disease: diseaseDetailsData.Disease,
              precautions: diseaseDetailsData.Precautions,
            });
          }
        } catch (error) {
          console.error("Error fetching disease data:", error);
        }
      };

      fetchDiseaseInfo();
    }
  }, [searchParams]);

  return (
    <div className="w-screen h-screen bg-[#1F2327] text-white flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-[#2A2F36] rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-400 my-6">
          Your Predicted Disease is:
          <h6 className="text-green-600">{predictedDisease}</h6>
        </h1>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-green-400">Your Symptoms:</h3>
          <ul className="list-disc list-inside text-gray-300">
            {selectedSymptoms && Object.keys(selectedSymptoms).length > 0 ? (
              Object.keys(selectedSymptoms).map((symptom, index) => (
                <li key={index}>{symptom}</li> // Display the symptom names
              ))
            ) : (
              <p>No symptoms selected</p>
            )}
          </ul>
        </div>

        <Card className="rounded-lg bg-[#1A1D22] shadow-lg border border-[#333B44]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-green-400">
              Disease Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              A concise breakdown of the disease, symptoms, treatment options, and precautions.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="mb-6">
              <p className="text-lg font-semibold text-green-400 mb-2">Description:</p>
              <p className="text-gray-300">{diseaseInfo.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold text-green-400 mb-2">Precautions:</p>
              <ul className="list-disc list-inside text-gray-300">
              {Array.isArray(diseaseInfo.precautions) ? (
        diseaseInfo.precautions.map((precaution, index) => (
          <li key={index}>{precaution}</li>
        ))
      ) : (
        <li>No precautions available</li>
      )}
              </ul>
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
