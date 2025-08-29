'use client'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DropdownList from "./dropdown-list";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSymptoms } from "./hooks";


const SymptomDropdown = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [dropdownDisplay, setDropdownDisplay] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const {
        displayOptions,
        selectedOptions,
        isLoading,
        error,
        addSymptom,
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
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <h3 className="text-lg font-semibold">Select Your Symptoms</h3>
                <p className="text-sm text-muted-foreground">
                    Choose the symptoms that are bothering you
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setDropdownDisplay(true)}
                        placeholder="Search symptoms..."
                        className="w-full"
                    />
                    
                    {dropdownDisplay && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1">
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
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Selected Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedOptions.map((symptom) => (
                                <span
                                    key={symptom}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground"
                                >
                                    {symptom.replaceAll('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        {error}
                    </div>
                )}

                <Button 
                    onClick={submitSymptoms}
                    disabled={isLoading || selectedOptions.length === 0}
                    className="w-full"
                >
                    {isLoading ? 'Processing...' : 'Get Diagnosis'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default SymptomDropdown;
