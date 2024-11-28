import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "./components/Auth/Forms/LoginForm/schema";
import prisma from "./utils/prisma";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);
        if (!success) {
          throw new Error("Credenciales inválidas.");
        }

        // Verificar si el usuario existe en la base de datos por username
        const user = await prisma.student.findUnique({
          where: {
            username: data.username,
          },
        });

        if (!user) {
          throw new Error("Usuario no encontrado.");
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(
          data.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta.");
        }

        // Retornar el objeto del usuario si todo es correcto
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
