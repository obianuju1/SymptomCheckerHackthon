import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <header className="w-screen h-screen bg-center bg-cover bg-no-repeat bg-black/40 bg-blend-darken flex flex-col items-center justify-center text-white gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 bg-main-image">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-2 sm:mb-4">
          Medify AI
        </h1>
        <h3 className="scroll-m-20 text-base sm:text-lg lg:text-xl tracking-tight text-gray-200">
          Diagnosing patients with just a few clicks
        </h3>
      </div>
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm">
        <Button 
          asChild 
          className="w-full sm:w-80 text-center rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Link href={'auth/register'} className="text-center px-0 py-3">
            Sign Up
          </Link>
        </Button>
        <Link 
          href={'auth/login'} 
          className="text-sm sm:text-base hover:underline transition-colors duration-200 hover:text-green-300"
        >
          Existing user? Log in
        </Link>
      </div>
    </header>
  );
}
