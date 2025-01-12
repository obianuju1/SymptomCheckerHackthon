"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams from next/navigation
import { symptoms } from "@/app/data/symptomsData"; // Import the symptom data

type Option = {
  label: string;
  value: string;
};

export default function DropdownSearchSelect() {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true); // Dropdown is open by default
  const router = useRouter(); // Initialize router for navigating
  const searchParams = useSearchParams(); // New search params hook from next/navigation

  // Handle option selection/deselection
  const toggleOption = (option: Option) => {
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter options based on search query
  const filteredOptions = symptoms.filter((option: Option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clear selected option
  const removeSelectedOption = (option: Option) => {
    setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
  };

  // Handle form submission and pass selected options to confirmation page
  const handleSubmit = () => {
    // Create the request payload, mapping the selected options to the model's expected format
    const payload = symptoms.reduce((acc: { [key: string]: number[] }, option: Option) => {
      acc[option.value] = selectedOptions.some((selected) => selected.value === option.value) ? [1] : [0];
      return acc;
    }, {});

    // Create the query string
    const queryParams = new URLSearchParams();
    queryParams.set("symptoms", JSON.stringify(payload));
  
    // Use router.push to navigate with the query string
    router.push(`/confirmation?${queryParams.toString()}`);
  };

  return (
    <div className="w-screen h-screen bg-[#1F2327] text-white flex justify-center items-center py-12 px-4">
      <div className="relative w-80 p-4 bg-[#2A2F36] rounded-lg shadow-xl">
        {/* Page Title */}
        <h1 className="text-xl font-semibold mb-4 text-center text-green-400">
          Select any symptoms that you are experiencing
        </h1>

        {/* Search input */}
        <Input
          placeholder="Search symptoms..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 mb-4 bg-[#333B44] text-gray-300 border border-[#444C57] rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Display selected options */}
        {selectedOptions.length > 0 && (
          <div className="mb-2">
            <span className="text-sm text-gray-500">Selected: </span>
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-block bg-[#333B44] text-gray-300 text-xs py-1 px-3 rounded-lg mr-2 mb-2"
              >
                {option.label}{" "}
                <button
                  className="ml-2 text-xs text-gray-300 hover:text-red-500"
                  onClick={() => removeSelectedOption(option)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="w-full bg-[#2A2F36] border border-[#444C57] rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto mb-4">
            <ul>
              {filteredOptions.map((option: Option) => (
                <li
                  key={option.value}
                  className="flex items-center justify-between p-2 hover:bg-[#333B44] cursor-pointer"
                  onClick={() => toggleOption(option)}
                >
                  <Checkbox
                    checked={selectedOptions.some((selected) => selected.value === option.value)}
                    onChange={() => toggleOption(option)}
                    className="mr-2"
                  />
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white">
          Submit
        </Button>
      </div>
    </div>
  );
}
