import React from "react";
import { Activity } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
const DesktopNav = ({children}: {children: React.ReactNode}) => {
  return (
    <Sidebar className="border-none">
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-green-500" />
          <span className="text-xl font-bold text-heading-gradient">Medify AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {children}
      </SidebarContent>
    </Sidebar>
  )
};

export default DesktopNav;
