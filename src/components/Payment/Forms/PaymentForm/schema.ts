import { z } from "zod";

export const paymentSchema = z.object({
  paymentCode: z.string().trim().min(1, {
    message: "Por favor ingresa tu código de pago",
  }),
});
