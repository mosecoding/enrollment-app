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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genders } from "./constants";
import { register } from "@/actions/register";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      address: "",
      studentPhone: "",
      birthDate: "",
      age: "",
      gender: undefined,
      guardian: { firstName: "", lastName: "", phone: "" },
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await register(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/login");
      }
    });
    console.log(values);
  }

  return (
    <section className="max-w-3xl min-h-[calc(100vh-4rem)] mx-auto content-center">
      <div className="px-5 py-16 space-y-8">
        <h1 className="text-3xl text-center font-bold">Crear cuenta</h1>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 pb-6 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre&#40;s&#41;</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        El DNI debe ser único y no estar registrado previamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY-MM-DD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-transparent">
                          {genders.map((gender) => (
                            <SelectItem
                              key={gender.value}
                              value={gender.value}
                              className="focus:bg-primary/10"
                            >
                              {gender.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular del alumno</FormLabel>
                      <FormControl>
                        <Input placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-input" />
                <span className="px-2 text-xs text-muted-foreground italic font-medium">
                  DATOS DEL APODERADO
                </span>
                <div className="flex-grow h-px bg-input" />
              </div>
              <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="guardian.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre&#40;s&#41; del apoderado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardian.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos del apoderado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardian.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular del apoderado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isPending ? (
                <Button className="w-full" disabled={isPending}>
                  Creando cuenta...
                </Button>
              ) : (
                <Button className="w-full" type="submit" disabled={isPending}>
                  Crear cuenta
                </Button>
              )}
            </form>
          </Form>
          <div className="flex items-center my-4">
            <div className="h-px flex-grow bg-input" />
            <span className="px-2 text-xs text-muted-foreground italic font-medium">
              O
            </span>
            <div className="h-px flex-grow bg-input" />
          </div>
          <Button variant="outline" asChild className="w-full">
            <Link
              href="login"
              className={cn({
                "pointer-events-none": isPending,
              })}
            >
              Acceder
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
