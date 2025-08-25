'use client'



type DropdownListProps = {
    filteredOptions: {label: string, value: string}[]; // filtered options to display
    updateSelection: (symptom: string[]) => void;
    selectedOptions: string[];

};
  
const DropdownList = ({ filteredOptions, updateSelection, selectedOptions}: DropdownListProps) => {
    return (
        <div>
            { filteredOptions && filteredOptions.length > 0 &&filteredOptions.map((option: {label:string, value:string}) => (
                <div key={option.value} onClick={() => updateSelection([...selectedOptions, option.value])}>
                   {option.label}
                </div>
            ))}
        </div>
    )
};

export default DropdownList;
