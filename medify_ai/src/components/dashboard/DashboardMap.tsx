'use client'

import React from "react";
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';


interface MapProps {
  location?: {
    lat: number,
    lng: number
  } | null;
  places?: Array<{
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
  }> | null;
}

const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const defaultCenter = { lat: -33.860664, lng: 151.208138 };
const DashboardMap = ({ location, places }: MapProps) => {
  return (
    <div className="w-full h-96">
      <APIProvider apiKey={mapsApiKey}>
        <Map defaultZoom={10} defaultCenter={location || defaultCenter} className="w-full h-full" >
          {location && (
            <Marker position={location} title="Your Location" />
          )}
          {/*fetch from the places api and find nearby hospitals*/}
          {places && places.map((place) => (
            <Marker key={place.id} position={{ lat: place.location.latitude, lng: place.location.longitude }} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default DashboardMap;