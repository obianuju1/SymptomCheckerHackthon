'use client'

import React from "react";
import MobileNav from "../../../layout-components/mobileNav";
import Header from "../../../layout-components/header";
import Content from "../../../layout-components/content";
import Map from "../../../layout-components/map";
const dashboard = () => {
  return (
  <div className="w-screen h-screen bg-[#1F2327] text-white grid grid-rows-5 grid-cols-5">
    <MobileNav/>
    <Header/>
    <Map/>
    <div className="map flex justify-center text-4xl" ><h1>Welcome Back</h1></div>
    <Content/>
  </div>
  );
};

export default dashboard;
