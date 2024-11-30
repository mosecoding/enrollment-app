import { auth } from "@/auth";
import LoginForm from "@/components/Auth/Forms/LoginForm";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/enrollment");

  return <LoginForm />;
}
