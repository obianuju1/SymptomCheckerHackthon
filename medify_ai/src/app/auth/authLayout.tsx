'use client'
import { Card } from "@/components/ui/card";
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
     
       
          <main className="flex justify-center items-center min-h-screen w-full bg-background">
            <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-transparent text-white border-none p-6 relative z-10">
                {children}
            </Card>
          </main>
        
      
    );
  }