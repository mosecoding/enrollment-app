"use server";

import { auth } from "@/auth";
import { z } from "zod";
import prisma from "@/utils/prisma";
import { enrollmentSchema } from "@/components/Enrollment/Forms/EnrollmentForm/schema";
import { sendPaymentCodeToEmail } from "@/lib/resend";
import { generateUniquePaymentCode } from "@/lib/data";

export async function createEnrollment(
  values: z.infer<typeof enrollmentSchema>
) {
  const session = await auth();

  // Verifica si el usuario está autenticado
  if (!session || !session.user || !session.user.id) {
    return {
      error: "Debe iniciar sesión para realizar la matrícula.",
    };
  }

  try {
    const userId = session.user.id;

    // Valida los datos de entrada utilizando Zod
    const { data, success } = enrollmentSchema.safeParse(values);
    if (!success) {
      return {
        error: "Datos inválidos.",
      };
    }

    // Verifica si el usuario ya tiene una matrícula pendiente
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: userId,
        status: "PENDIENTE",
      },
    });

    if (existingEnrollment) {
      return {
        error: "Ya tienes una matrícula pendiente.",
      };
    }

    // Verifica si la sección tiene vacantes disponibles
    const section = await prisma.section.findUnique({
      where: { id: Number(data.section.id) },
      select: { vacancies: true },
    });

    if (!section) {
      return {
        error: "La sección seleccionada no existe.",
      };
    }

    if (section.vacancies === 0) {
      return {
        error: "No hay vacantes disponibles en la sección seleccionada.",
      };
    }

    // Genera un código de pago único
    const paymentCode = await generateUniquePaymentCode();

    // Obtener la fecha actual y sumar 7 días
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Sumar 7 días

    // Realiza la transacción para crear la matrícula y el pago
    await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: userId,
          sectionId: Number(data.section.id),
        },
      });

      await tx.payment.create({
        data: {
          amount: 340.0,
          paymentCode,
          expirationDate, // Usar la nueva fecha de expiración
          enrollmentId: enrollment.id,
        },
      });

      await tx.section.update({
        where: { id: Number(data.section.id) },
        data: {
          vacancies: { decrement: 1 },
        },
      });

      return enrollment;
    });

    // Enviar el username y password al correo registrado
    const { success: emailSent } = await sendPaymentCodeToEmail(paymentCode);

    if (!emailSent) {
      return { error: "Matrícula creada, pero no se pudo enviar el correo." };
    }

    return { success: true };
  } catch (error) {
    return {
      error: "Hubo un problema al crear la matrícula o el pago.",
    };
  }
}
