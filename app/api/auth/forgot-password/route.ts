export const runtime = "nodejs"

import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { sendEmail, baseEmailTemplate } from "@/lib/email"

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string }
  const email = body.email?.trim().toLowerCase() ?? ""

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: { select: { provider: true } } },
  })

  console.log("[forgot-password] email lookup:", email)
  console.log("[forgot-password] user found:", user ? { id: user.id, email: user.email, hasPasswordHash: !!user.passwordHash, providers: user.accounts.map(a => a.provider) } : null)

  // No account — return generic success to avoid email enumeration.
  if (!user) {
    return NextResponse.json({ success: true })
  }

  // Google OAuth account — no password hash set, or only Google linked.
  const hasGoogleAccount = user.accounts.some(a => a.provider === "google")
  const isGoogleOnly = hasGoogleAccount && !user.passwordHash
  console.log("[forgot-password] isGoogleOnly:", isGoogleOnly)
  if (isGoogleOnly) {
    return NextResponse.json({ googleAccount: true })
  }

  // Delete any existing reset tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email } })

  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.passwordResetToken.create({ data: { email, token, expires } })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  const emailBody = `
    <p style="margin:0 0 16px;">Hi,</p>
    <p style="margin:0 0 16px;">We received a request to reset the password for your Budgetly account.</p>
    <p style="margin:0 0 24px;">Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="border-radius:6px;background-color:#16a34a;">
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            Reset password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#555550;">If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
  `

  try {
    await sendEmail({
      to: email,
      subject: "Reset your Budgetly password",
      html: baseEmailTemplate("Reset your Budgetly password", emailBody),
    })
  } catch {
    // Don't expose email sending errors to the client
  }

  return NextResponse.json({ success: true })
}
