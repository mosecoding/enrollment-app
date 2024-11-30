import { auth } from "@/auth";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import LogoutBtn from "@/components/Auth/Buttons/LogoutBtn";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="w-full max-w-7xl h-16 mx-auto px-5 flex items-center justify-between">
      <Link href="/" className="font-medium">
        ABC
      </Link>
      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        {session && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"outline"}>
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={"/enrollment"}>Matrícula</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/contact"}>Contáctanos</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LogoutBtn />
          </>
        )}
      </div>
    </nav>
  );
}
