import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <header className=" w-screen h-screen bg-center bg-cover bg-no-repeat " style={{backgroundImage: "url('/Home_Background_Image.jpg')"}}>
      <h1>Medify AI</h1>
      <p>Diagnosing patients with just a few clicks !</p>
      <div>
      <Button asChild><Link href={'/register'}>Sign Up</Link></Button>
      <Link href={'/sign-in'}>Existing user ? Log in </Link>
      </div>
    </header>
  );
}
