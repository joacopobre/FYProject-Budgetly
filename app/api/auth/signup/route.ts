export const runtime = "nodejs"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendEmail, baseEmailTemplate } from "@/lib/email"

type SignupBody = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasLetter && hasNumber
}

export async function POST(req: Request) {
  const body = (await req.json()) as SignupBody

  const email = body.email?.trim().toLowerCase() ?? ""
  const password = body.password ?? ""
  const confirmPassword = body.confirmPassword ?? ""
  const name = body.name?.trim() || null

  if (!email || !password || !confirmPassword) {
    return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }

  if (!isStrongPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters and include letters and numbers" },
      { status: 400 },
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "Account already exists" }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  })

  const firstName = name ? name.split(" ")[0] : "there"
  const greeting = `Hi ${firstName},`

  const emailBody = `
    <p style="margin:0 0 16px;">${greeting}</p>
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
      to: email,
      subject: "Welcome to Budgetly!",
      html: baseEmailTemplate("Welcome to Budgetly!", emailBody),
    })
  } catch {
    // Don't fail registration if the welcome email can't be sent
  }

  return NextResponse.json({ success: true })
}
