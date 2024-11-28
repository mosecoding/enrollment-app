"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { registerSchema } from "@/components/Auth/Forms/RegisterForm/schema";
import prisma from "@/utils/prisma";
import { sendCredentialsToEmail } from "@/lib/resend";

export async function register(values: z.infer<typeof registerSchema>) {
  try {
    const { data, success } = registerSchema.safeParse(values);
    if (!success) {
      return {
        error: "Datos inválidos.",
      };
    }

    // Verificar si ya existe un usuario con el mismo DNI
    const existingUser = await prisma.student.findUnique({
      where: { dni: data.dni },
    });

    if (existingUser) {
      return {
        error: "El DNI ya se encuentra registrado.",
      };
    }

    // Verificar si el correo está asignado a otro usuario
    const existingEmail = await prisma.student.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      return {
        error: "El correo ya se encuentra registrado.",
      };
    }

    // Generar un username único basado en números
    let username: string;
    do {
      username = nanoid(7).replace(/\D/g, ""); // Generar una cadena de solo números
    } while (
      username.length < 7 ||
      (await prisma.student.findUnique({ where: { username } }))
    );

    // Generar una contraseña alfanumérica aleatoria
    const password = nanoid(10); // Ejemplo: "a8Z2C9XkLm"
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username,
        dni: data.dni,
        address: data.address,
        phoneNumber: data.studentPhone,
        birthDate: new Date(data.birthDate),
        age: parseInt(data.age),
        gender: data.gender,
        guardian: {
          create: {
            firstName: data.guardian.firstName,
            lastName: data.guardian.lastName,
            phoneNumber: data.guardian.phone,
          },
        },
        email: data.email,
        password: hashedPassword,
      },
    });

    // Enviar el username y password al correo registrado
    const { success: emailSent } = await sendCredentialsToEmail(
      data.email,
      username,
      password
    );

    if (!emailSent) {
      return { error: "Usuario creado, pero no se pudo enviar el correo." };
    }
    
    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error inesperado." };
  }
}
