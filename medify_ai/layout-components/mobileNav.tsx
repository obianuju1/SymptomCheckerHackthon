import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const MobileNav = () => {
  const router = useRouter()
  return(
  
    <nav className="sidebar flex flex-col items-center desktop-nav">
    <div className=" flex flex-col items-center gap-4" style={{marginTop: 200}}>
    <Link href={'/dashboard'} className="mb-4 font-semibold text-xl ">Dashboard</Link>
    <Link href={'/evaluations'} className="mb-4 text-xl font-semibold">Diagnoses</Link>
    </div>
    <Button className="bg-green-500 hover:bg-green-500 font-semibold" onClick={() => router.push('/symptoms')}>Start New Diagnosis</Button>
  </nav>
  )
 
};

export default MobileNav;
