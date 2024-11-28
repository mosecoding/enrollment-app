import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default function EnrollmentPage() {
  const session = auth();
  if (!session) redirect("/login");
  return <div>EnrollmentPage</div>;
}
