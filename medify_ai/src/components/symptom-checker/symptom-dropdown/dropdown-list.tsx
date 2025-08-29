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
    if (isLoading) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                Loading symptoms...
            </div>
        );
    }

    if (filteredOptions.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No symptoms found
            </div>
        );
    }

    return (
        <div className="max-h-60 overflow-y-auto border rounded-md bg-background">
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
