'use client'
import List from "./List";
import MobileNav from "./mobile/MobileNav";
import DesktopNav from "./desktop/DesktopNav";
import DashboardMap from "./DashboardMap";
import { Card } from "../ui/card";
import { SidebarProvider } from "../ui/sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { useGeolocation } from "@/hooks/use-geolocation";
import DashboardNavigation from "./DashboardNavigation";
import { useAuth } from "../../../context/AuthContext";
import { usePlaces } from "@/hooks/use-places";

const Dashboard = () => {
  const isMobile = useMobile();
  const { location, isLoading, error } = useGeolocation();
  const { user } = useAuth();
  const { places, isLoading: placesLoading, error: placesError } = usePlaces(location || { lat: 0, lng: 0 });
  
  // Debug logging
  console.log('Dashboard - user:', user);
  console.log('Dashboard - places:', places);
  console.log('type of places:', typeof places[0]);

  const content = (
    <main className="flex flex-col justify-center w-full p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8 mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
          Welcome back {user?.first_name || 'User'}
        </h1>
        <Card className="w-full lg:w-1/4 h-48 lg:h-64">
          <List />
        </Card>
      </div>
      <Card className="w-full h-96 lg:h-[600px]">
        {isLoading && <div className="p-4">Loading location...</div>}
        {error && <div className="p-4 text-destructive">Error: {error}</div>}
        {placesLoading && <div className="p-4">Loading places...</div>}
        {placesError && <div className="p-4 text-destructive">Error: {placesError}</div>}
        {location && <DashboardMap location={location} places={places}/>}
      </Card>      
    </main>
  )

  if (isMobile) {
    return (
      <>
        <MobileNav>
          <DashboardNavigation />
        </MobileNav>
        {content}
      </>
    )    
  }

  return (
    <SidebarProvider>
      <DesktopNav>
        <DashboardNavigation />
      </DesktopNav>
      {content}
    </SidebarProvider>
  )
};

export default Dashboard;