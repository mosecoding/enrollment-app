import { auth } from "@/auth";
import ContactForm from "@/components/Contact/Forms/ContactForm";
import { redirect } from "next/navigation";
import React from "react";

export default async function ContactPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");
  return <ContactForm />;
}
