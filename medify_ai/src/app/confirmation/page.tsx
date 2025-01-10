"use client";

import { useSearchParams } from "next/navigation"; // Import from next/navigation instead of next/router
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Option = {
  label: string;
  value: string;
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams(); // Use the new hook to get search params
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  // When component mounts and query is available, parse the symptoms
  useEffect(() => {
    const symptomsParam = searchParams.get("symptoms");  // Get the symptoms query parameter
    if (symptomsParam) {
      try {
        const symptoms = JSON.parse(symptomsParam) || [];
        setSelectedOptions(symptoms);
      } catch (error) {
        console.error("Failed to parse symptoms:", error);
      }
    }
  }, [searchParams]);

  // Handle removing selected symptom
  const removeSelectedOption = (option: Option) => {
    setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
  };

  // Handle final submission
  const handleFinalSubmit = () => {
    console.log("Final selected symptoms:", selectedOptions);
    // You can now do something with the selected symptoms, like saving them to the server
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