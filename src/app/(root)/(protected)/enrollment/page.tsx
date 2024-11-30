import { auth } from "@/auth";
import EnrollmentForm from "@/components/Enrollment/Forms/EnrollmentForm";
import {
  getEducationLevels,
  getStudent,
  updatePaymentCodeAfter7Days,
} from "@/lib/data";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentForm from "@/components/Payment/Forms/PaymentForm";

export default async function EnrollmentPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");

  const educationLevels = await getEducationLevels();

  const student = await getStudent(session.user.id);

  if (!student) return null;

  // Verifica si el estudiante tiene una matrícula pendiente
  const enrollment = student.enrollment;

  if (enrollment?.status === "PENDIENTE") {
    const updatedPaymentCode = await updatePaymentCodeAfter7Days(enrollment.id);
    if (!updatedPaymentCode) return null;
  }

  return (
    <div>
      {enrollment ? (
        <div className="max-w-md min-h-[calc(100vh-4rem)] mx-auto content-center">
          <div className="px-5 py-16">
            {enrollment.status === "PENDIENTE" ? (
              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>Hola {student.firstName}</CardTitle>
                  <CardDescription>
                    Tu código de pago ha sido enviado al correo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>Estado: {enrollment.status}</li>
                    <li>Nivel: {enrollment.section.grade.level.name}</li>
                    <li>Grado: {enrollment.section.grade.name}</li>
                    <li>Sección: {enrollment.section.name}</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <PaymentForm />
                </CardFooter>
              </Card>
            ) : (
              <Card className="bg-transparent">
                <CardContent className="text-center space-y-2 p-6">
                  <h3 className="text-3xl font-bold">
                    ¡Felicidades {student.firstName}!
                  </h3>
                  <p className="text-xl text-center">¡Has sido matriculado!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <EnrollmentForm levels={educationLevels} />
      )}
    </div>
  );
}
