import { z } from "zod";

export const enrollmentSchema = z.object({
    level: z
      .object({
        id: z.string().min(1, "El nivel educativo debe tener un id válido."),
        name: z.string().min(1, "El nivel educativo debe tener un nombre válido."),
      })
      .refine(
        (data) => data.id !== "" && data.name !== "",
        "¡Por favor, selecciona un nivel educativo!"
      ),
    grade: z
      .object({
        id: z.string().min(1, "El grado debe tener un id válido."),
        name: z.string().min(1, "El grado debe tener un nombre válido."),
      })
      .refine(
        (data) => data.id !== "" && data.name !== "",
        "¡Por favor, selecciona un grado!"
      ),
    section: z
      .object({
        id: z.string().min(1, "La sección debe tener un id válido."),
        name: z.string().min(1, "La sección debe tener un nombre válido."),
      })
      .refine(
        (data) => data.id !== "" && data.name !== "",
        "¡Por favor, selecciona una sección!"
      ),
  });
  