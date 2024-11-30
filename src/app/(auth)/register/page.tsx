import { auth } from "@/auth";
import RegisterForm from "@/components/Auth/Forms/RegisterForm";
import { redirect } from "next/navigation";
import React from "react";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/enrollment");

  return <RegisterForm />;
}
