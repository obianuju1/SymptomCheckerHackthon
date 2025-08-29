import React from "react";
import {APIProvider,Map} from '@vis.gl/react-google-maps';


interface MapProps {
  location: {
    lat: number,
    lng: number
  } | null;
}
const DashboardMap = ({location}: MapProps) => {
  const defaultCenter = { lat: -33.860664, lng: 151.208138 }
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <Map
      defaultZoom={13}
      defaultCenter={ location || defaultCenter }/>
    </APIProvider>
  );
};

export default DashboardMap;
