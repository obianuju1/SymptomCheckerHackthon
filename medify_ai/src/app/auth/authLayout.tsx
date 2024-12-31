'use client'
import { Card } from "@/components/ui/card";
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
     
       
          <main className="flex justify-center items-center h-screen w-full bg-main-image bg-cover bg-center bg-blend-darken bg-no-repeat min-h-screen">
            <Card className=" w-2/3 bg-black/80 text-white border-none p-1">
                {children}
            </Card>
          </main>
        
      
    );
  }