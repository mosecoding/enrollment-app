import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCredentialsToEmail(
  email: string,
  username: string,
  password: string
) {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Tus credenciales de acceso",
      html: `
        <h1>¡Bienvenido a nuestra plataforma!</h1>
        <p>Aquí están tus credenciales de acceso:</p>
        <ul>
          <li><strong>Usuario:</strong> ${username}</li>
          <li><strong>Contraseña:</strong> ${password}</li>
        </ul>
        <p>Te recomendamos cambiar tu contraseña después de iniciar sesión.</p>
      `,
    });
    return { success: true };
  } catch (error) {
    return { error: "No se pudo enviar el correo electrónico." };
  }
}
