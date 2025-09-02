'use client'

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/components/dashboard";

const Home = () => {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
};

export default Home;
