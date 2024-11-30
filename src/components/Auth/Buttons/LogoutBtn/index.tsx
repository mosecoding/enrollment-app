"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <Button onClick={() => signOut()} variant={"outline"} size={"icon"}>
      <LogOut />
    </Button>
  );
}
