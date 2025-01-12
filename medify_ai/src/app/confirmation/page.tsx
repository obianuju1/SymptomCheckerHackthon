"use client";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Option = {
  label: string;
  value: string;
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams(); // Use the new hook to get search params
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const router = useRouter(); // Initialize useRouter for navigation

  // When the component mounts and query is available, parse the symptoms
  useEffect(() => {
    const symptomsParam = searchParams.get("symptoms");  // Get the symptoms query parameter
    if (symptomsParam) {
      try {
        const symptoms = JSON.parse(symptomsParam); // Parse the symptoms param
        const selectedSymptoms = Object.keys(symptoms)
          .filter((key) => symptoms[key][0] === 1) // Filter for symptoms that were selected (1)
          .map((key) => ({ label: key, value: key })); // Map the keys to label-value pairs
        
        setSelectedOptions(selectedSymptoms); // Update state with selected symptoms
      } catch (error) {
        console.error("Failed to parse symptoms:", error);
      }
    }
  }, [searchParams]);

  // Handle removing selected symptom
  const removeSelectedOption = (option: Option) => {
    setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
  };

  // Handle final submission and navigate to predictions page
  // ConfirmationPage Component
const handleFinalSubmit = () => {
  console.log("Final selected symptoms:", selectedOptions);

  // Create the request payload
  const payload = selectedOptions.reduce<Record<string, number>>((acc, option) => {
    acc[option.value] = 1; // Set selected symptoms to 1
    return acc;
  }, {});

  // Make the fetch request
  fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Prediction:', data.prediction);
      // Pass the disease and selected symptoms to the predictions page via URL query parameters
      const symptomsParam = JSON.stringify(payload);  // Convert symptoms payload to a string
      router.push(`/prediction?disease=${data.prediction}&symptoms=${encodeURIComponent(symptomsParam)}`);  // Pass both disease and symptoms
    })
    .catch((error) => console.error('Error:', error));
};


  return (
    <div className="w-screen h-screen bg-[#1F2327] text-white flex justify-center items-center py-12 px-4">
      <div className="relative w-80 p-4 bg-[#2A2F36] rounded-lg shadow-xl">
        <h1 className="text-xl font-semibold mb-4 text-center text-green-400">
          Confirm Selected Symptoms
        </h1>

        {selectedOptions.length > 0 ? (
          <div className="mb-4 max-h-60 overflow-y-auto"> {/* Set max height and enable scroll */}
            {selectedOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center justify-between mb-2 rounded-lg border border-[#444C57] p-2 bg-[#333B44]"
              >
                <span className="text-sm text-gray-300">{option.label}</span>
                <button
                  className="ml-2 text-xs text-gray-300 hover:text-red-500"
                  onClick={() => removeSelectedOption(option)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No symptoms selected</p>
        )}

        <Button onClick={handleFinalSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white">
          Submit
        </Button>
      </div>
    </div>
  );
}
