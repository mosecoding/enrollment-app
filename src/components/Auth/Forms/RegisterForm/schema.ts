import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Por favor, ingresa tu(s) nombre(s).")
    .max(50, "El nombre no debe tener más de 50 caracteres.")
    .regex(/^[a-zA-Z\s]+$/, "Solo puedes usar letras y espacios."),
  lastName: z
    .string()
    .trim()
    .min(1, "¡No olvides ingresar tus apellidos!")
    .max(50, "Los apellidos no deben tener más de 50 caracteres.")
    .regex(/^[a-zA-Z\s]+$/, "Solo puedes usar letras y espacios."),
  dni: z
    .string()
    .trim()
    .min(1, "El DNI es obligatorio.")
    .regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos."),
  address: z
    .string()
    .min(1, "¡Por favor, ingresa tu dirección!")
    .max(100, "La dirección no puede tener más de 100 caracteres."),
  guardian: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, "¡Es necesario ingresar el nombre del apoderado!")
      .max(50, "El nombre del apoderado no puede superar los 50 caracteres.")
      .regex(
        /^[a-zA-Z\s]+$/,
        "Solo puedes usar letras y espacios en el nombre del apoderado."
      ),
    lastName: z
      .string()
      .trim()
      .min(1, "¡Es necesario ingresar los apellidos del apoderado!")
      .max(
        50,
        "Los apellidos del apoderado no pueden superar los 50 caracteres."
      )
      .regex(
        /^[a-zA-Z\s]+$/,
        "Solo puedes usar letras y espacios en los apellidos del apoderado."
      ),
    phone: z
      .string()
      .trim()
      .min(1, "Es necesario ingresar el celular del apoderado.")
      .regex(/^\d{9}$/, "El celular del apoderado debe tener 9 dígitos."),
  }),
  studentPhone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{9}$/.test(val), {
      message: "El celular del alumno debe tener 9 dígitos.",
    }),
  age: z
    .string()
    .trim()
    .min(1, { message: "¡La edad es obligatoria!" })
    .refine(
      (value) => {
        const isIntegerFormat = /^\d+$/.test(value);
        if (!isIntegerFormat) return false;

        const parsed = Number(value);
        return parsed >= 6 && parsed <= 16;
      },
      {
        message: "Debes tener entre 6 y 16 años.",
      }
    ),
  gender: z
    .union([z.enum(["MALE", "FEMALE"]), z.undefined()])
    .refine((value) => value !== undefined, {
      message: "Por favor, selecciona tu género.",
    }),
  birthDate: z
    .string()
    .trim()
    .min(1, "¡La fecha de nacimiento es obligatoria!")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato: YYYY-MM-DD.")
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "¡Parece que la fecha de nacimiento no es válida!",
      }
    ),
  email: z
    .string()
    .trim()
    .min(1, "¡Por favor, ingresa tu correo electrónico!")
    .email("El correo electrónico ingresado no es válido."),
});
