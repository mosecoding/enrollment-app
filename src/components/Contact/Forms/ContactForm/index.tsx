"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/login";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/cn";
import { contactSchema } from "./schema";
import { sendMessageToEmail } from "@/lib/resend";

export default function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await sendMessageToEmail(values.subject, values.message);
      if (response.error) {
        setError(response.error);
      } else {
        setSubmitted(true);
      }
    });
  }

  return (
    <section className="max-w-md min-h-[calc(100vh-4rem)] mx-auto content-center">
      {!submitted ? (
        <>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="px-5 py-16 space-y-6">
            <h1 className="text-3xl text-center font-bold">
              Contacta con nosotros
            </h1>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje</FormLabel>
                          <FormControl>
                            <Textarea className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isPending ? (
                    <Button className="w-full" disabled={isPending}>
                      Enviando...
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isPending}
                    >
                      Enviar
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <p className="px-5 py-16 text-center font-semibold text-3xl">MENSAJE ENVIADO CON ÉXITO</p>
      )}
    </section>
  );
}
