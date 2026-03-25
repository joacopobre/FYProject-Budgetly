import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendEmail, baseEmailTemplate } from "@/lib/email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password ?? ""

        if (!email || !password) {
          throw new Error("Invalid email or password")
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          throw new Error("Invalid email or password")
        }

        if (!user.passwordHash) {
          throw new Error("Use Google sign-in for this account")
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPassword) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { name: true, createdAt: true },
        })

        if (dbUser) {
          const secondsSinceCreation = (Date.now() - dbUser.createdAt.getTime()) / 1000
          if (secondsSinceCreation < 30) {
            const firstName = dbUser.name ? dbUser.name.split(" ")[0] : "there"
            const emailBody = `
              <p style="margin:0 0 16px;">Hi ${firstName},</p>
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
                to: user.email,
                subject: "Welcome to Budgetly!",
                html: baseEmailTemplate("Welcome to Budgetly!", emailBody),
              })
            } catch {
              // Don't block sign-in if the welcome email fails
            }
          }
        }
      }
      return true
    },
    async jwt({ token, user }) {
      // Keep token.id in sync with the current authenticated subject.
      if (user?.id) token.id = user.id
      if (token.sub) token.id = token.sub
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = (token.id ?? token.sub) as string
      }
      return session
    },
  },
}