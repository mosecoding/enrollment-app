import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "¡Por favor, ingresa tu nombre de usuario!"),
  password: z.string().trim().min(1, "¡No olvides tu contraseña!"),
});
