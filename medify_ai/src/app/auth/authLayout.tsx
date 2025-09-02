'use client'
import { Card } from "@/components/ui/card";
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
     
       
          <main className="flex justify-center items-center min-h-screen w-full bg-">
            <Card className=" w-2/3 bg-transparent text-white border-none p-1 relative z-10">
                {children}
            </Card>
          </main>
        
      
    );
  }