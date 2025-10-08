import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number;
  lng: number;
}

interface UseGeolocationReturn {
  location: GeolocationState | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoading(false);
      },
      (error: GeolocationPositionError) => {
        setError(`Geolocation error: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    refetch: getLocation
  };
};
