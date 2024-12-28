"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/hooks/use-toast";

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Symptom 1", value: "symptom1" },
  { label: "Symptom 2", value: "symptom2" },
  { label: "Symptom 3", value: "symptom3" },
  { label: "Symptom 4", value: "symptom4" },
  { label: "Symptom 5", value: "symptom5" },
  { label: "Symptom 6", value: "symptom6" },
  { label: "Symptom 7", value: "symptom7" },
  { label: "Symptom 8", value: "symptom8" },
  { label: "Symptom 9", value: "symptom9" },
  { label: "Symptom 10", value: "symptom10" },
];

export default function DropdownSearchSelect() {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true); // Dropdown is open by default

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
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clear selected option
  const removeSelectedOption = (option: Option) => {
    setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
  };

  // Handle form submission (can be extended to send data)
  const handleSubmit = () => {
    toast({
      title: "You selected the following symptoms:",
      description: selectedOptions.map((option) => option.label).join(", "),
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="relative w-80 p-4 bg-white rounded-lg shadow-lg">
        {/* Page Title */}
        <h1 className="text-xl font-semibold mb-4 text-center">Select any symptoms that you are experiencing</h1>

        {/* Search input */}
        <Input
          placeholder="Search symptoms..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 mb-4"
        />

         {/* Display selected options */}
         {selectedOptions.length > 0 && (
          <div className="mb-2">
            <span className="text-sm text-gray-500">Selected: </span>
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-block bg-gray-200 text-gray-800 text-xs py-1 px-3 rounded-lg mr-2 mb-2"
              >
                {option.label}{" "}
                <button
                  className="ml-2 text-xs text-gray-800 hover:text-red-500"
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
          <div className="w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto mb-4">
            <ul>
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
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
        <Button onClick={handleSubmit} className="w-full ">
          Submit
        </Button>
      </div>
    </div>
  );
}
