'use client'

import { cn } from '@/lib/utils';
import { SymptomOption } from './hooks';

interface DropdownListProps {
    filteredOptions: SymptomOption[];
    onSelect: (symptom: string) => void;
    selectedOptions: string[];
    isLoading?: boolean;
}

const DropdownList = ({ 
    filteredOptions, 
    onSelect, 
    selectedOptions, 
    isLoading = false 
}: DropdownListProps) => {
    // Log errors to console for debugging
    if (isLoading) {
        console.log('Dropdown: Loading symptoms...');
    }
    
    if (filteredOptions.length === 0 && !isLoading) {
        console.warn('Dropdown: No symptoms available or found');
    }

    return (
        <div className="max-h-40 overflow-y-auto border rounded-md bg-background">
            {filteredOptions.map((option) => {
                const isSelected = selectedOptions.includes(option.value);
                
                return (
                    <div
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        className={cn(
                            "px-4 py-2 cursor-pointer hover:bg-accent transition-colors",
                            isSelected && "bg-accent text-accent-foreground"
                        )}
                    >
                        <span className="flex items-center gap-2">
                            {option.label}
                            {isSelected && (
                                <span className="text-xs text-muted-foreground">✓</span>
                            )}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default DropdownList;
