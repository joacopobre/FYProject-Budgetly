export const runtime = "nodejs"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false
  return /[A-Za-z]/.test(password) && /\d/.test(password)
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    token?: string
    password?: string
    confirmPassword?: string
  }

  const token = body.token ?? ""
  const password = body.password ?? ""
  const confirmPassword = body.confirmPassword ?? ""

  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
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

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!resetToken || resetToken.expires < new Date()) {
    // Clean up expired token if it exists
    if (resetToken) {
      await prisma.passwordResetToken.delete({ where: { token } }).catch(() => {})
    }
    return NextResponse.json(
      { error: "This reset link is invalid or has expired" },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({ where: { email: resetToken.email } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.passwordResetToken.delete({ where: { token } }),
  ])

  return NextResponse.json({ success: true })
}
