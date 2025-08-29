'use client'
import React from "react";
import DesktopNav from "./desktop/DesktopNav";
import List from "./list";
import MobileNav from "./mobile/MobileNav";
import { SidebarProvider } from "../ui/sidebar";
import DashboardMap from "./DashboardMap";
import { Card } from "../ui/card";
import { useMobile } from "@/hooks/use-mobile";
import { useGeolocation } from "@/hooks/use-geolocation";

const Dashboard = () => {
  const isMobile = useMobile();
  const { location, isLoading, error } = useGeolocation();

  const content = (
    <main className="flex flex-col justify-center w-full p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8 mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
          Welcome back user
        </h1>
        <Card className="w-full lg:w-1/4 h-48 lg:h-64">
          <List />
        </Card>
      </div>
      <Card className="w-full h-96 lg:h-[600px]">
        {isLoading && <div className="p-4">Loading location...</div>}
        {error && <div className="p-4 text-destructive">Error: {error}</div>}
        {location && <DashboardMap location={location}/>}
      </Card>      
    </main>
  )

  if (isMobile) {
    return (
    <>
     <MobileNav />
     {content}
    </>
    )    
  }

  return (
    <SidebarProvider>
      <DesktopNav />
      {content}
    </SidebarProvider>

    
    
    
  )
};

export default Dashboard;