import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM ?? 'Kume <noreply@kume.com>';

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY no está configurada. Agregála al .env para enviar emails.');
  }
  return new Resend(key);
}

interface DownloadEmailParams {
  to: string;
  buyerName: string;
  productTitle: string;
  downloadUrl: string;
  expiresAt: Date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function sendDownloadEmail(params: DownloadEmailParams) {
  const { to, buyerName, productTitle, downloadUrl, expiresAt } = params;

  const firstName = buyerName.split(' ')[0] ?? buyerName;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tu descarga esta lista</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #e5e7eb;">
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#000000;letter-spacing:-0.5px;">kume</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 0;">
              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500;">Compra exitosa</p>
              <h2 style="margin:0 0 24px;font-size:28px;font-weight:700;color:#000000;line-height:1.2;">Tu descarga esta lista, ${firstName}</h2>
              <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.6;">Gracias por tu compra. Aqui esta tu enlace para descargar:</p>
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:32px;">
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Producto</p>
                <p style="margin:0;font-size:18px;font-weight:600;color:#000000;">${productTitle}</p>
              </div>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-radius:8px;background:#000000;">
                    <a href="${downloadUrl}" style="display:inline-block;padding:16px 32px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Descargar ahora &rarr;</a>
                  </td>
                </tr>
              </table>
              <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin-bottom:32px;">
                <p style="margin:0;font-size:14px;color:#92400e;">
                  <strong>Este enlace expira el ${formatDate(expiresAt)}.</strong><br />
                  Si tiene problemas para descargarlo, responde este email y te ayudamos.
                </p>
              </div>
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Si el boton no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="margin:0;font-size:12px;color:#3b82f6;word-break:break-all;">${downloadUrl}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
                Kume &mdash; Activos digitales de calidad<br />
                Este email fue enviado porque realizaste una compra en nuestra plataforma.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const result = await getResend().emails.send({
    from: FROM,
    to,
    subject: `Tu descarga esta lista: ${productTitle}`,
    html,
  });

  return result;
}
