export const runtime = "nodejs"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

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

  return NextResponse.json({ success: true })
}
