import Link from "next/link";

export default function Home() {
  return (
    <header>
      <h1>Medify AI</h1>
      <p>Diagnosing patients with just a few clicks !</p>
      <Link href={'/signup'}>Sign Up</Link>
    </header>
  );
}
