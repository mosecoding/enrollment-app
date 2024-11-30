"use server";

import { auth } from "@/auth";
import { paymentSchema } from "@/components/Payment/Forms/PaymentForm/schema";
import prisma from "@/utils/prisma";
import { EnrollmentStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Procesar pago y actualizar matrícula
export async function processPayment(values: z.infer<typeof paymentSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Debe iniciar sesión para realizar el pago." };
  }

  try {
    const { data, success } = paymentSchema.safeParse(values);

    if (!success) {
      return { error: "Código de pago inválido." };
    }

    // Buscar el pago por código y validar que pertenezca al usuario autenticado
    const payment = await prisma.payment.findFirst({
      where: { paymentCode: data.paymentCode, status: PaymentStatus.PENDIENTE },
      include: {
        enrollment: {
          include: {
            student: true,
          },
        },
      },
    });

    // Validar que el pago y la matrícula pertenecen al estudiante
    if (!payment || payment.enrollment?.studentId !== session.user.id) {
      return { error: "Código de pago inválido o no autorizado." };
    }

    // Verificar que payment.enrollmentId no sea null antes de realizar la transacción
    const enrollmentId = payment.enrollmentId; // Convertir null a undefined

    // Si el enrollmentId es válido, realizar la transacción de actualización
    if (enrollmentId) {
      await prisma.$transaction([
        prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { status: EnrollmentStatus.COMPLETADO },
        }),
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.COMPLETADO },
        }),
      ]);

      revalidatePath("/enrollment");
    } else {
      return { error: "No se encontró una matrícula válida." };
    }
  } catch (error) {
    return { error: "Hubo un problema al procesar el pago." };
  }
}
