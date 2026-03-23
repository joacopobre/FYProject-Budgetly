import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export function baseEmailTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="background-color:#0d2118;border-radius:8px 8px 0 0;padding:28px 40px;">
                <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                  Budgetly
                </span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="background-color:#ffffff;padding:40px;color:#1a1a1a;font-size:15px;line-height:1.6;">
                ${body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f5f5f0;border-radius:0 0 8px 8px;padding:24px 40px;text-align:center;color:#888880;font-size:12px;line-height:1.5;">
                &copy; ${new Date().getFullYear()} Budgetly. All rights reserved.<br />
                You are receiving this email because you have an account with Budgetly.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Budgetly <hello@budgetly.uk>",
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
