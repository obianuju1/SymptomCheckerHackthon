'use client'
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DropdownList from "./dropdown-list";
import React, { useState,useEffect,useRef } from "react";
import axios from "axios";



const SymptomDropdown = () => {
    const [inputValue,setInputValue] = useState<string>('') 
    const [dropdownDisplay,setDropdownDisplay] = useState<boolean>(false) // determines wether dropdown is displayed
    const [selectedOptions,setSelectedOptions] = useState<string[]>([]) // shoes which options have been selected
    const [symptoms,setSymptoms] = useState<string[]>([]) // symptoms rendered on mount
    const [displayOptions,setDisplayOptions] = useState<{label: string, value: string}[]>([]) // key is the formatted val is the data value
    const dropdownRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        const getSymptoms = async () => {

            const res = await axios.get('http://127.0.0.1:8000/symptoms') // replace with url
            const raw = res.data.symptoms
            setSymptoms(raw)
            setDisplayOptions(
                raw.map((symptom: string) => (
                    {label: symptom.replaceAll('_',' '), value: symptom }
                ))
                
            )
        }

        getSymptoms()

    },[])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef && !dropdownRef.current?.contains(event.target as Node)){
                setDropdownDisplay(false)
            }
        }

        document.addEventListener('mousedown',handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown',handleClickOutside) 
        }
    })

    const handleInputChange = (e) => {
        // input change sets the state to the current input 
        setInputValue(e.target.value)
    }

    const handleSubmit = async () => {
        // fucntion to handle the submission logic send submission 
        try {
            await axios.post('http://127.0.0.1:8000/predict',{
                symptoms: selectedOptions
            })
            console.log('succesfull post')
            // add possible novigation to the results after 
        } catch (error) {
            console.error(error)
        }
        
    }

    const filteredOptions = displayOptions.filter((option) => option.label.toLowerCase().trim()
    .includes(inputValue)).sort((a,b) => {
        const inputLower = inputValue.toLowerCase().trim()
        
        const aLabel = a.label.toLowerCase()
        const bLabel = b.label.toLowerCase()

        const aStarts = aLabel.startsWith(inputLower) // return true/false if a starts with the curent input value
        const bStarts = bLabel.startsWith(inputLower) // return true/false if b starts with the current input value

        if(aStarts && !bStarts) return -1 // return -1 if a starts with the current input value and a dosent 
        if(bStarts && !aStarts) return 1  // return 1 if b starts with the input value and a dosent

        return aLabel.localeCompare(bLabel)

    })
  

    
  return (
    <Card>
        <CardHeader>Please Select Any Symproms Bothering You</CardHeader>
        <CardContent>
        <Input onChange={handleInputChange} 
            onFocus={() => {setDropdownDisplay(true)}}/>
            <div ref={dropdownRef}>
            {dropdownDisplay && 
            <DropdownList updateSelection={setSelectedOptions} 
            selectedOptions={selectedOptions} filteredOptions={filteredOptions} />}
            </div>
            <Button onClick={handleSubmit}>Get Diagnoses</Button>
        </CardContent>
    </Card>
  );
};

export default SymptomDropdown;
