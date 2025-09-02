'use client'

import { cn } from '@/lib/utils';

interface ChipProps {
    label: string;
    onRemove?: () => void;
    className?: string;
}

const Chip = ({ label, onRemove, className }: ChipProps) => {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-colors",
                onRemove && "cursor-pointer hover:bg-primary/80",
                className
            )}
            onClick={onRemove}
        >
            {label.replaceAll('_', ' ')}
            {onRemove && (
                <span className="text-xs hover:text-destructive">×</span>
            )}
        </span>
    );
};

export default Chip;
