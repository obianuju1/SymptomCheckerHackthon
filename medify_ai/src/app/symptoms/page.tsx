"use client"
import { useState } from "react";
import SymptomDropdown from "@/components/symptom-checker/symptom-dropdown";


type Option = {
  label: string;
  value: string;
};

export default function SymptomsPage() {

  return (
    <div>
      <h1>Title</h1>
      <SymptomDropdown />
    </div>
  )
  
}
