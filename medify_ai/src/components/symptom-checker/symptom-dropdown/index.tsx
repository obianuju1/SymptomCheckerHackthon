'use client'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DropdownList from "./dropdown-list";
import Chip from "./chip";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSymptoms, DiagnosisResults } from "@/hooks/use-symptoms";

interface SymptomDropdownProps {
  onSubmission?: (results: DiagnosisResults) => void;
}


const SymptomDropdown = ({ onSubmission }: SymptomDropdownProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [dropdownDisplay, setDropdownDisplay] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const {
        displayOptions,
        selectedOptions,
        isLoading,
        addSymptom,
        removeSymptom,
        submitSymptoms
    } = useSymptoms();

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownDisplay(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSymptomSelect = (symptom: string) => {
        addSymptom(symptom);
        setInputValue(''); // Clear input after selection
        setDropdownDisplay(false);
    };

    // Memoized filtered options with improved sorting
    const filteredOptions = useMemo(() => {
        if (!inputValue.trim()) return displayOptions;
        
        const inputLower = inputValue.toLowerCase().trim();
        
        return displayOptions
            .filter((option) => 
                option.label.toLowerCase().includes(inputLower)
            )
            .sort((a, b) => {
                const aLabel = a.label.toLowerCase();
                const bLabel = b.label.toLowerCase();
                
                const aStarts = aLabel.startsWith(inputLower);
                const bStarts = bLabel.startsWith(inputLower);
                
                if (aStarts && !bStarts) return -1;
                if (bStarts && !aStarts) return 1;
                
                return aLabel.localeCompare(bLabel);
            });
    }, [displayOptions, inputValue]);

    return (
        <Card className="w-full max-w-md mx-auto pt-8">
            <CardHeader className="text-center pb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">Select Your Symptoms</h3>
                <p className="text-base sm:text-lg text-muted-foreground text-center">
                    Choose the symptoms that are bothering you
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative" ref={dropdownRef}>
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setDropdownDisplay(true)}
                        placeholder="Type to search symptoms..."
                        className="form-input w-full"
                    />
                    
                    {dropdownDisplay && filteredOptions.length > 0 && (
                        <div className=" mt-1">
                            <DropdownList
                                filteredOptions={filteredOptions}
                                onSelect={handleSymptomSelect}
                                selectedOptions={selectedOptions}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>

                {/* Selected Symptoms Display */}
                {selectedOptions.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {selectedOptions.map((symptom) => (
                                <Chip
                                    key={symptom}
                                    label={symptom}
                                    onRemove={() => removeSymptom(symptom)}
                                />
                            ))}
                        </div>
                    </div>
                )}



                <Button 
                    onClick={async () => {
                        try {
                            const results = await submitSymptoms();
                            onSubmission?.(results);
                        } catch (error) {
                            console.error('Error submitting symptoms:', error);
                        }
                    }}
                    disabled={isLoading || selectedOptions.length === 0}
                    className="form-button w-full bg-green-500 hover:bg-green-600 text-base font-medium"
                >
                    {isLoading ? 'Processing...' : 'Get Diagnosis'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default SymptomDropdown;
