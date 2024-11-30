import prisma from "@/utils/prisma";
import { nanoid } from "nanoid";
import { sendPaymentCodeToEmail } from "./resend";
import { Enrollment } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getEducationLevels() {
  try {
    const educationLevels = await prisma.level.findMany({
      include: {
        grades: {
          include: {
            sections: true,
          },
        },
      },
    });

    return educationLevels;
  } catch (error) {
    return null;
  }
}

export async function getStudent(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        enrollment: {
          include: {
            section: {
              include: {
                grade: {
                  include: {
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return student;
  } catch (error) {
    return null;
  }
}

export async function generateUniquePaymentCode() {
  let paymentCode: string;
  let existingPayment;

  do {
    paymentCode = nanoid(10);
    existingPayment = await prisma.payment.findUnique({
      where: { paymentCode },
    });
  } while (existingPayment);

  return paymentCode;
}

export async function updatePaymentCodeAfter7Days(enrollmentId: string) {
  try {
    // Obtener el pago asociado al enrollmentId
    const payment = await prisma.payment.findFirst({
      where: { enrollmentId },
    });

    if (!payment) {
      return { error: "No se encontró el pago para este estudiante." };
    }

    const creationDate = new Date(payment.paymentDate);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - creationDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convertir a días

    // Si han pasado más de 7 días, genera y actualiza el código de pago
    if (differenceInDays > 7) {
      const newPaymentCode = await generateUniquePaymentCode();

      // Actualiza el código de pago en la base de datos
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentCode: newPaymentCode,
        },
      });

      // Enviar el nuevo código al correo del estudiante
      const { success: emailSent } = await sendPaymentCodeToEmail(newPaymentCode);

      if (!emailSent) {
        return { error: "No se pudo enviar el nuevo código de pago al correo." };
      }

      revalidatePath("/enrollment");
    }

    return { error: "No han pasado 7 días desde la creación del pago." };
  } catch (error) {
    return { error: "Hubo un problema al intentar actualizar el código de pago." };
  }
}