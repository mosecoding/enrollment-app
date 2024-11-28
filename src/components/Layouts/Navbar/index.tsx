import ThemeToggle from "@/components/Theme/ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl h-16 mx-auto px-5 flex items-center justify-between">
      <Link href="/" className="font-medium">
        ABC
      </Link>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
