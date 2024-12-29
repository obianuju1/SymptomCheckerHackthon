import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <header className=" w-screen h-screen bg-center bg-cover bg-no-repeat bg-black/40 bg-blend-darken flex flex-col items-center justify-center text-white gap-2" style={{backgroundImage: "url('/Home_Background_Image.jpg')"}}>
      <div className="text-center ">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Medify AI</h1>
        <h3 className="scroll-m-20 text-l tracking-tight">Diagnosing patients with just a few clicks </h3>
      </div>
      <div>
      <Button asChild className="block w-[60%] mb-2 mx-auto text-center rounded-lg bg-green-500 hover:bg-green-500"><Link href={'auth/register'} className="text-center px-0">Sign Up</Link></Button>
      <Link href={'auth/login'} className="text-xs hover:underline">Existing user ? Log in </Link>
      </div>
    </header>
  );
}
