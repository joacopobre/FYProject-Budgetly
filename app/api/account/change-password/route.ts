export const runtime = "nodejs"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth"
import { sendEmail, baseEmailTemplate } from "@/lib/email"

function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false
  return /[A-Za-z]/.test(password) && /\d/.test(password)
}

export async function POST(req: Request) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as {
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
  }

  const currentPassword = body.currentPassword ?? ""
  const newPassword = body.newPassword ?? ""
  const confirmPassword = body.confirmPassword ?? ""

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  if (!isStrongPassword(newPassword)) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters and include letters and numbers" },
      { status: 400 },
    )
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "Your account uses social login and does not have a password" },
      { status: 400 },
    )
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

  const secureUrl = `${process.env.NEXTAUTH_URL}/forgot-password`
  const emailBody = `
    <p style="margin:0 0 16px;">Hi${user.name ? ` ${user.name}` : ""},</p>
    <p style="margin:0 0 16px;">Your Budgetly account password was successfully changed.</p>
    <p style="margin:0 0 24px;">If you made this change, no further action is needed.</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="border-radius:6px;background-color:#dc2626;">
          <a href="${secureUrl}"
             style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            Not you? Secure your account
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#555550;">If you didn't change your password, reset it immediately using the button above.</p>
  `

  try {
    await sendEmail({
      to: user.email!,
      subject: "Your Budgetly password was changed",
      html: baseEmailTemplate("Your Budgetly password was changed", emailBody),
    })
  } catch {
    // Don't block the response if email fails
  }

  return NextResponse.json({ success: true })
}
