import { z } from "zod";

export const contactSchema = z.object({
  subject: z.string().trim().min(1, "¡Por favor, ingrese un asunto"),
  message: z.string().trim().min(1, "¡No olvides escribir un mensaje!"),
});
