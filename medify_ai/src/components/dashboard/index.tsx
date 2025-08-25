'use client'
import React, { useState, useEffect } from "react";
import DesktopNav from "./desktop/DesktopNav";
import List from "./list";
import MobileNav from "./mobile/MobileNav";
import { SidebarProvider } from "../ui/sidebar";
import DashboardMap from "./DashboardMap";
import { Card } from "../ui/card";

const Dashboard = () => {
  const [doctorData, setDoctorData] = useState([])
  const [geoLocation, setGeoLocation] = useState<{lat: number; lng: number} | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  // set up window check event listener 
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

// set geolocation data 
  useEffect (() => {
    const getLocation = async () => {
        if(!navigator.geolocation){
            console.error('Geolocation not supported');
            return
        }

        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            setGeoLocation({lat: position.coords.latitude, lng: position.coords.longitude})
        })
    }
    getLocation()
    console.log('location set')
  },[])

  const content = (
    <main className=" flex flex-col justify-center lg: w-full">
        <span className="flex justify-between w-5/6 ml-20 mb-20 ">
        <h1 className="text-2xl">Welcome back user</h1>
        <Card className="w-1/4  h-48 ">
        <List />
        </Card>
        </span>
      <Card className=" w-5/6 h-1/2 mx-auto mt-9">
        <DashboardMap location={geoLocation}/>
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