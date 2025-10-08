/* this hook is used to fetch places from the places api. This also includes functions to filter places and update places*/ 
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios, { AxiosError } from "axios";
const RADIUS = 5000;

export interface PlacesReturn {
    places: Array<{
        id: string;
        name: string;
        types: string[];
        location: {
            latitude: number;
            longitude: number;
        };
        photos: string[];
        rating: number;
        formattedAddress: string;
        displayName: string;
    }>;
    isLoading: boolean;
    error: string | null;
    
}

interface Location {
    lat: number;
    lng: number;
}

const getHospitals = async (center: Location) => {
    const response = await axios.post('https://places.googleapis.com/v1/places:searchNearby', {
        'includedTypes': ['hospital'],
        'maxResultCount': 10,
        'locationRestriction': {
            'circle': {
                'center': {
                    'latitude': center.lat,
                    'longitude': center.lng,
                },
                'radius': RADIUS,
            }
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.id,places.name,places.types,places.location,places.formattedAddress,places.displayName,places.photos,places.rating',
        }
    });

    return response.data;
}

{/* function to calculate circle radius */}
{/* calculate and compare distances using haversine formula */}


export const usePlaces = (center: Location): PlacesReturn => {
    {/* this hook is used to fetch places from the places api. 
        it will return the data along with the loading state provided by react query */}
    const {data, isLoading, error} = useQuery({
        queryKey: ['places', center.lat, center.lng],
        queryFn: () => getHospitals(center),
    })
    return {
        places: data?.places || [],
        isLoading,
        error: error ? error.message : null,
    }
}