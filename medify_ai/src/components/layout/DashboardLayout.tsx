'use client'
import React from "react";
import { SidebarProvider } from "../ui/sidebar";
import DesktopNav from "../dashboard/desktop/DesktopNav";
import DashboardNavigation from "../dashboard/DashboardNavigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DesktopNav>
        <DashboardNavigation />
      </DesktopNav>
      {children}
    </SidebarProvider>
  );
};

export default DashboardLayout;
