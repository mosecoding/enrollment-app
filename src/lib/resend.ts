"use server"

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCredentialsToEmail(
  username: string,
  password: string
) {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "meph0525@gmail.com",
      subject: "Tus credenciales de acceso",
      html: `
        <h1>¡Bienvenido a nuestra plataforma!</h1>
        <p>Aquí están tus credenciales de acceso:</p>
        <ul>
          <li><strong>Usuario:</strong> ${username}</li>
          <li><strong>Contraseña:</strong> ${password}</li>
        </ul>
      `,
    });
    return { success: true };
  } catch (error) {
    return { error: "No se pudo enviar el correo electrónico." };
  }
}

export async function sendPaymentCodeToEmail(paymentCode: string) {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "meph0525@gmail.com",
      subject: "Código de pago",
      html: `
        <h1>¡Tu matrícula se ha registrado con éxito!</h1>
        <p>Aquí está tu código depago:</p>
        <span>${paymentCode}</span>
      `,
    });
    return { success: true };
  } catch (error) {
    return { error: "No se pudo enviar el correo electrónico." };
  }
}

export async function sendMessageToEmail(subject: string, message: string) {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "meph0525@gmail.com",
      subject,
      html: `
        <p>${message}</p>
      `,
    });
    return { success: true };
  } catch (error) {
    return { error: "No se pudo enviar el correo electrónico." };
  }
}
