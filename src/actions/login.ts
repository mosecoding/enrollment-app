"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/components/Auth/Forms/LoginForm/schema";
import { AuthError } from "next-auth";
import { z } from "zod";

export async function login(values: z.infer<typeof loginSchema>) {
  try {
    await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Ocurrió un error inesperado." };
  }
}
