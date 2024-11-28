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
import { loginSchema } from "@/components/Auth/Forms/LoginForm/schema";
import { login } from "@/actions/login";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await login(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/enrollment");
      }
    });
  }

  return (
    <section className="max-w-md min-h-[calc(100vh-4rem)] mx-auto content-center">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="px-5 py-16 space-y-9">
        <h1 className="text-3xl text-center font-bold">Acceder</h1>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        El nombre de usuario se ha enviado al correo registrado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        La contraseña se ha enviado al correo registrado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isPending ? (
                <Button className="w-full" disabled={isPending}>
                  Accediendo...
                </Button>
              ) : (
                <Button className="w-full" type="submit" disabled={isPending}>
                  Acceder
                </Button>
              )}
            </form>
          </Form>
          <div className="my-4 flex items-center">
            <div className="h-px flex-grow bg-input" />
            <span className="px-2 text-xs text-muted-foreground italic font-medium">
              O
            </span>
            <div className="h-px flex-grow bg-input" />
          </div>
          <Button variant="outline" asChild className="w-full">
            <Link
              href="register"
              className={cn({
                "pointer-events-none": isPending,
              })}
            >
              Crear cuenta
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
