export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { sendEmail, baseEmailTemplate } from "@/lib/email"

const TEST_EMAIL = "joacorodes@gmail.com"

export async function GET() {
  const emailBody = `
    <p style="margin:0 0 16px;">Hi Joaquin,</p>
    <p style="margin:0 0 16px;">Welcome to <strong>Budgetly</strong> — we're glad you're here.</p>
    <p style="margin:0 0 24px;">Budgetly helps you take control of your finances by tracking your spending, setting budgets, and watching your savings grow — all in one place.</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="border-radius:6px;background-color:#16a34a;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard"
             style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#555550;">If you have any questions, just reply to this email — we're always happy to help.</p>
  `

  try {
    await sendEmail({
      to: TEST_EMAIL,
      subject: "Welcome to Budgetly!",
      html: baseEmailTemplate("Welcome to Budgetly!", emailBody),
    })
    return NextResponse.json({ success: true, sentTo: TEST_EMAIL })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
