'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Header from '../../components/Header'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { BalanceSparkline } from '@/components/dashboard/BalanceSparkline'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { NetWorthChart } from '@/components/dashboard/NetWorthChart'
import { ThemeProvider } from '@/context/ThemeContext'
import type { BalancePoint } from '@/lib/transactions/buildBalanceSeries'
import type { TrendPoint } from '@/lib/transactions/buildTrendSeries'
import type { NetWorthPoint } from '@/lib/transactions/buildNetWorthSeries'

// ─── Dummy data ────────────────────────────────────────────────────────────────

const balanceData: BalancePoint[] = [
  { label: 'Jan', balance: 12000 },
  { label: 'Feb', balance: 13200 },
  { label: 'Mar', balance: 12800 },
  { label: 'Apr', balance: 14500 },
  { label: 'May', balance: 15200 },
  { label: 'Jun', balance: 14800 },
  { label: 'Jul', balance: 16100 },
  { label: 'Aug', balance: 17556 },
]

const trendData: TrendPoint[] = [
  { label: 'Aug', income: 3200, expenses: 1800 },
  { label: 'Sep', income: 2800, expenses: 2100 },
  { label: 'Oct', income: 3500, expenses: 1600 },
  { label: 'Nov', income: 4100, expenses: 2300 },
  { label: 'Dec', income: 3800, expenses: 2800 },
  { label: 'Jan', income: 4200, expenses: 1900 },
  { label: 'Feb', income: 3900, expenses: 2100 },
  { label: 'Mar', income: 4355, expenses: 1304 },
]

const netWorthData: NetWorthPoint[] = [
  { date: 'Aug', balance: 11200 },
  { date: 'Sep', balance: 11800 },
  { date: 'Oct', balance: 12400 },
  { date: 'Nov', balance: 13100 },
  { date: 'Dec', balance: 13800 },
  { date: 'Jan', balance: 15200 },
  { date: 'Feb', balance: 16400 },
  { date: 'Mar', balance: 17556 },
]

const budgets = [
  { name: 'Groceries', type: 'SPEND', balance: 115, target: 400, color: '#10b981' },
  { name: 'Transport', type: 'SPEND', balance: 20, target: 200, color: '#ef4444' },
  { name: 'Holiday Fund', type: 'SAVE', balance: 650, target: 2000, color: '#10b981' },
  { name: 'Entertainment', type: 'SPEND', balance: 109, target: 150, color: '#f59e0b' },
]

const mockTransactions = [
  { description: 'Freelance Payment', category: 'Income', amount: '+£600.00', date: 'Mar 10', type: 'income' },
  { description: 'Supermarket Shop', category: 'Food', amount: '-£85.00', date: 'Mar 9', type: 'expense' },
  { description: 'Monthly Bus Pass', category: 'Transport', amount: '-£180.00', date: 'Mar 8', type: 'expense' },
  { description: 'Netflix', category: 'Entertainment', amount: '-£15.00', date: 'Mar 7', type: 'expense' },
  { description: 'Dinner Out', category: 'Food', amount: '-£45.00', date: 'Mar 6', type: 'expense' },
]

const testimonials = [
  { quote: 'Budgetly helped me see exactly where my money was leaking. I finally have a budget I can actually follow.', name: 'Maya Thompson', role: 'Freelance Designer' },
  { quote: 'The dashboard is simple, fast and useful. I check it once a day and instantly know if I am on track.', name: 'Daniel Chen', role: 'Software Engineer' },
  { quote: 'I needed a finance tool that was clear and not overwhelming. Budgetly gives me confidence in every spending decision.', name: 'Sofia Martinez', role: 'Small Business Owner' },
  { quote: "Finally a budgeting app that doesn't feel like accounting software. It's calm and actually enjoyable to use.", name: 'James Okafor', role: 'Product Manager' },
  { quote: "The budget progress bars are so satisfying. I've saved more in 3 months than I did all of last year.", name: 'Priya Sharma', role: 'Graduate Student' },
  { quote: 'I love that it tracks net worth too. Seeing that number go up every month keeps me motivated.', name: 'Tom Ellis', role: 'Freelance Developer' },
]

// ─── Shared animation props ────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7 },
}

// ─── Waitlist form ─────────────────────────────────────────────────────────────

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center gap-2.5 text-emerald-400">
        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium tracking-wide">You&apos;re on the list!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 bg-transparent py-3.5 pl-5 pr-3 text-sm text-white placeholder-white/35 outline-none"
        />
        <button
          type="submit"
          className="m-1 shrink-0 cursor-pointer rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all duration-150 hover:bg-emerald-400 hover:shadow-[0_4px_20px_rgba(16,185,129,0.5)]"
        >
          Start for free
        </button>
      </div>
      <p className="mt-2.5 text-xs text-white/30">No credit card required.</p>
    </form>
  )
}

// ─── Global ambient glow ───────────────────────────────────────────────────────

function GlobalGlow() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        background: 'radial-gradient(ellipse 80% 55% at 50% 35%, rgba(16,185,129,0.15) 0%, transparent 70%)',
        filter: 'blur(160px)',
      }}
    />
  )
}

// ─── Global particles ──────────────────────────────────────────────────────────

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random(),
      opacity: 0.2 + Math.random() * 0.3,
      color: Math.random() > 0.5 ? '255,255,255' : '110,231,183',
      speed: 0.1 + Math.random() * 0.2,
      drift: (Math.random() - 0.5) * 0.15,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`
        ctx.fill()
        p.y -= p.speed
        p.x += p.drift
        if (p.y < -p.r) {
          p.y = canvas.height + p.r
          p.x = Math.random() * canvas.width
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 2 }}
      aria-hidden
    />
  )
}

// ─── Grain overlay ─────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise.png")' }}
      aria-hidden
    />
  )
}

// ─── Bento Section ─────────────────────────────────────────────────────────────

function BentoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const widthPct = useTransform(scrollYProgress, [0, 0.4], [62, 100])
  const cardWidth = useTransform(widthPct, (v) => `${v}vw`)
  const cardRadius = useTransform(scrollYProgress, [0, 0.4], [20, 0])

  return (
    <div ref={ref} className="relative overflow-x-hidden bg-[#0d2118] py-32">
      <div className="flex items-center justify-center">
        <motion.div
          style={{ width: cardWidth, borderRadius: cardRadius }}
          className="relative overflow-hidden bg-[#f0ede6]"
        >
          <Grain />
          <div className="relative z-10 mx-auto w-full max-w-5xl px-8 py-16">

            <div className="mb-16 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                Everything you need
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.05] text-[#0d2118] sm:text-5xl">
                All your finances, one place.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {/* Card 1 — TrendChart (col-span-2) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0 }}
                className="col-span-2 rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Dashboard</p>
                <p className="mt-1 text-base font-bold text-slate-900">Income vs Spending</p>
                <div className="mt-3 mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Income £4,355</span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Spent £1,304</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Net £3,051</span>
                </div>
                <ThemeProvider>
                  <TrendChart data={trendData} />
                </ThemeProvider>
              </motion.div>

              {/* Card 2 — Budget progress (col-span-1) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Budgets</p>
                <p className="mt-1 text-base font-bold text-slate-900">Give every pound a job</p>
                <div className="mt-5 flex flex-col gap-4">
                  {budgets.slice(0, 3).map(budget => {
                    const pct = Math.min(100, Math.round((budget.balance / budget.target) * 100))
                    return (
                      <div key={budget.name}>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                          <span className="font-medium text-slate-800">{budget.name}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: budget.color }} />
                        </div>
                        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                          <span>£{budget.balance}</span>
                          <span>of £{budget.target}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Card 3 — Transactions (col-span-1) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Transactions</p>
                <p className="mt-1 text-base font-bold text-slate-900">Recent activity</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  {mockTransactions.slice(0, 4).map((tx, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <span className="min-w-0 flex-1 truncate text-xs text-slate-700">{tx.description}</span>
                      <span className={`shrink-0 text-xs font-semibold tabular-nums ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 4 — Net Worth (col-span-2) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.16 }}
                className="col-span-2 rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Net Worth</p>
                    <p className="mt-1 text-base font-bold text-slate-900">£17,556</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">+£6,356 · 57%</span>
                </div>
                <ThemeProvider>
                  <NetWorthChart data={netWorthData} />
                </ThemeProvider>
              </motion.div>

              {/* Card 5 — Balance Trend (col-span-1) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Balance</p>
                <p className="mt-1 text-base font-bold text-slate-900">£17,556</p>
                <p className="text-xs text-emerald-600">+46.3% since January</p>
                <div className="mt-4">
                  <BalanceSparkline data={balanceData} />
                </div>
              </motion.div>

              {/* Card 6 — Spending limits (col-span-1) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.24 }}
                className="rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Spending Limits</p>
                <p className="mt-1 text-base font-bold text-slate-900">Monthly budget health</p>
                <div className="mt-5 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">Dining Out</span>
                      <span className="text-amber-600">£45 / £80</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-amber-400" style={{ width: '56%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">Shopping</span>
                      <span className="text-emerald-600">£30 / £150</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: '20%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-800">Subscriptions</span>
                      <span className="text-red-500">£58 / £50</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-red-400" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 7 — CSV Import (col-span-1) */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="rounded-2xl border border-[#0d2118]/8 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Import</p>
                <p className="mt-1 text-base font-bold text-slate-900">Import Transactions</p>
                <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700">Drop your bank export here</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">or click to browse</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                    .csv · .xlsx supported
                  </span>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Testimonial Marquee ───────────────────────────────────────────────────────

function TestimonialMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const doubled = [...testimonials, ...testimonials]

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const setDistance = () => {
      el.style.setProperty('--marquee-distance', `${el.scrollWidth / 2}px`)
    }
    setDistance()
    const ro = new ResizeObserver(setDistance)
    ro.observe(el)
    window.addEventListener('resize', setDistance)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', setDistance)
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden edge-fade">
      <div
        ref={trackRef}
        className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': '40s' } as React.CSSProperties}
      >
        {doubled.map((t, i) => {
          const initials = t.name.split(' ').map(n => n[0]).join('')
          return (
            <div
              key={`${t.name}-${i}`}
              className="shrink-0 w-80 rounded-2xl border border-emerald-400/10 bg-emerald-950/50 p-6 flex flex-col gap-4"
            >
              <p className="text-sm leading-7 text-emerald-50/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/8">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-900/70 text-xs font-semibold text-emerald-300">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-emerald-50/55">{t.role}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <GlobalGlow />
      <HeroParticles />
      <Header />

      {/* ══ Section 1 — Hero ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#06120f] via-[#0b1e17] to-[#0d2118] text-white">
        <div className="relative z-10 mx-auto w-full max-w-5xl px-8 pt-40 pb-0 text-center sm:pt-44 lg:pt-52">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="mx-auto max-w-4xl text-6xl font-normal leading-[1.0] tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Budgeting clarity for people who want real financial progress
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-emerald-50/75 sm:text-lg"
          >
            Budgetly gives you one calm workspace to track spending, manage monthly budgets,
            and make confident decisions with your money.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.18, ease: 'easeOut' }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <GoogleSignInButton className="inline-flex items-center justify-center rounded-lg bg-[#10b981] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition-all duration-150 hover:bg-[#059669] hover:shadow-[0_8px_30px_rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">
              Get Started
            </GoogleSignInButton>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/7 px-7 py-3 text-sm font-semibold text-white transition-all duration-150 hover:border-white/30 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              View Demo
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: 'easeOut' }}
            className="relative mx-auto mt-16 max-w-2xl"
          >
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-emerald-500/10 blur-3xl" />
            <div className="hero-card-float rounded-2xl border border-emerald-400/20 bg-[#0b1f14]/90 p-6 shadow-[0_0_60px_rgba(16,185,129,0.2),0_24px_52px_rgba(0,0,0,0.5)] backdrop-blur-sm">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Balance Trend</p>
                  <p className="mt-1 text-3xl font-bold text-white">£17,556</p>
                </div>
                <span className="rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-300">
                  +46.3% YTD
                </span>
              </div>
              <BalanceSparkline data={balanceData} />
              <div className="mt-3 flex justify-between text-xs text-emerald-50/40">
                <span>Jan</span>
                <span>Aug</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="h-32 bg-gradient-to-b from-transparent to-[#0d2118]" />
      </section>

      {/* ══ Section 2 — The App ═══════════════════════════════════════════════ */}
      <section id="demo">

        {/* 2a — Dashboard ─────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0d2118] py-32 text-white">
          <Grain />

          <div className="relative z-10 mx-auto w-full max-w-5xl px-8">
            <div className="grid gap-x-16 lg:grid-cols-2">
              {/* LEFT: chart */}
              <div className="py-12 lg:py-0">
                <ThemeProvider>
                  <motion.div
                    {...fadeUp}
                    className="flex w-full min-h-[500px] flex-col justify-center rounded-2xl border border-emerald-400/15 bg-[#112a1c] px-8 py-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
                  >
                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-900/50 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                        Income £4,355
                      </span>
                      <span className="rounded-full bg-red-900/50 px-4 py-1.5 text-sm font-semibold text-red-300">
                        Spent £1,304
                      </span>
                      <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                        Net £3,051
                      </span>
                    </div>
                    <TrendChart data={trendData} />
                  </motion.div>
                </ThemeProvider>
              </div>

              {/* RIGHT: text */}
              <div className="py-12 lg:sticky lg:top-24 lg:py-0 lg:self-start">
                <motion.div {...fadeUp}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Dashboard
                  </p>
                  <h2 className="mt-3 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                    Everything at a glance
                  </h2>
                  <p className="mt-5 max-w-sm text-lg leading-8 text-emerald-50/60">
                    Your balance, income, spending and net in one calm view. Updated in real time.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* 2b — Budgets ───────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0d2118] py-32 text-white">
          <Grain />

          <div className="relative z-10 mx-auto w-full max-w-5xl px-8">
            <div className="grid gap-x-16 lg:grid-cols-2">
              {/* LEFT: text */}
              <div className="py-12 lg:sticky lg:top-24 lg:py-0 lg:self-start">
                <motion.div {...fadeUp}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Budgets
                  </p>
                  <h2 className="mt-3 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                    Give every pound a job
                  </h2>
                  <p className="mt-5 max-w-sm text-lg leading-8 text-emerald-50/60">
                    Create spend and save budgets. Track progress automatically as you transact.
                  </p>
                </motion.div>
              </div>

              {/* RIGHT: budget cards */}
              <div className="py-12 lg:py-0">
                <div className="grid w-full gap-4 sm:grid-cols-2">
                  {budgets.map((budget, i) => {
                    const pct = Math.min(100, Math.round((budget.balance / budget.target) * 100))
                    const isWarning = budget.name === 'Transport'
                    return (
                      <motion.div
                        key={budget.name}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.7, delay: i * 0.09 }}
                        className="rounded-xl border border-emerald-400/10 bg-[#112a1c] p-5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white">{budget.name}</p>
                            <span
                              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                budget.type === 'SAVE'
                                  ? 'bg-emerald-900/60 text-emerald-300'
                                  : 'bg-slate-700/50 text-slate-300'
                              }`}
                            >
                              {budget.type === 'SAVE' ? 'Save' : 'Spend'}
                            </span>
                          </div>
                          {isWarning && (
                            <span className="rounded-full bg-red-900/40 px-2.5 py-0.5 text-xs font-medium text-red-400">
                              Low
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: budget.color }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-emerald-50/55">
                            <span>£{budget.balance}</span>
                            <span>of £{budget.target}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2c — Net Worth ─────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0d2118] py-32 text-white">
          <Grain />

          <div className="relative z-10 mx-auto w-full max-w-5xl px-8">
            <div className="grid gap-x-16 lg:grid-cols-2">
              {/* LEFT: chart */}
              <div className="py-12 lg:py-0">
                <ThemeProvider>
                  <motion.div
                    {...fadeUp}
                    className="flex w-full min-h-[500px] flex-col justify-center rounded-2xl border border-emerald-400/15 bg-[#112a1c] px-8 py-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Current Net Worth</p>
                        <p className="mt-1 text-2xl font-bold text-white">£17,556</p>
                      </div>
                      <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-semibold text-emerald-300">
                        +£6,356 · 57%
                      </span>
                    </div>
                    <NetWorthChart data={netWorthData} />
                  </motion.div>
                </ThemeProvider>
              </div>

              {/* RIGHT: text */}
              <div className="py-12 lg:sticky lg:top-24 lg:py-0 lg:self-start">
                <motion.div {...fadeUp}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Net Worth
                  </p>
                  <h2 className="mt-3 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                    Watch your wealth grow
                  </h2>
                  <p className="mt-5 max-w-sm text-lg leading-8 text-emerald-50/60">
                    Track your net worth over time. See the trend that matters most.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ══ Section 3 — Transactions ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0d2118] py-32 text-white">
        <Grain />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-8">
          <div className="grid gap-x-16 lg:grid-cols-2 lg:items-start">
            {/* Left: text */}
            <motion.div {...fadeUp} className="py-12 lg:sticky lg:top-24 lg:py-0 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Transactions
              </p>
              <h2 className="mt-3 text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                Every transaction, beautifully organised
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-8 text-emerald-50/60">
                Log income, expenses and transfers. Filter by date, type and category.
              </p>
            </motion.div>

            {/* Right: transaction list */}
            <div className="flex flex-col gap-3 py-12 lg:py-0">
              {mockTransactions.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-emerald-400/10 bg-[#112a1c] px-5 py-4"
                >
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${tx.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{tx.description}</p>
                    <span className="mt-0.5 inline-block rounded-full bg-white/7 px-2 py-0.5 text-xs text-emerald-50/55">
                      {tx.category}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-semibold tabular-nums ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.amount}
                    </p>
                    <p className="text-xs text-emerald-50/45">{tx.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ Section 4 — Feature Bento ════════════════════════════════════════ */}
      <BentoSection />

      {/* ══ Section 5 — Testimonials ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0d2118] py-32 text-white">
        <Grain />

        <div className="relative z-10 mx-auto mb-14 w-full max-w-5xl px-8">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Trusted by people building better money habits
            </h2>
          </motion.div>
        </div>
        <div className="relative z-10">
          <TestimonialMarquee />
        </div>
      </section>

      {/* ══ Section 6 — CTA ═══════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0a1c12] px-6 py-32 text-white">
        <Grain />

        <motion.div
          {...fadeUp}
          className="relative z-10 mx-auto w-full max-w-5xl px-8 text-center"
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl sm:leading-[1.1] lg:text-6xl">
            Ready to bring structure to your finances?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-emerald-50/70">
            Join thousands of people building better money habits with Budgetly.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <WaitlistForm />
            <a
              href="#demo"
              className="text-sm text-white/40 transition-colors duration-150 hover:text-white/70"
            >
              View demo ↓
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-emerald-100/10 bg-[#0a1813] px-6 py-16 text-white">
        <div className="mx-auto grid w-full max-w-5xl gap-10 text-emerald-50/90 md:grid-cols-2">
          <div id="about">
            <h3 className="text-base font-semibold text-white">About Budgetly</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-emerald-50/65">
              Budgetly is built to make personal finance easier to understand, so you can
              spend with intention and grow financial confidence over time.
            </p>
          </div>
          <div id="contact">
            <h3 className="text-base font-semibold text-white">Contact</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-50/65">
              Questions about Budgetly? Reach out at{' '}
              <a className="text-emerald-200 underline-offset-2 hover:underline" href="#">
                support@budgetly.app
              </a>
              .
            </p>
          </div>
          <div className="text-sm text-emerald-50/45 md:col-span-2">© 2025 Budgetly</div>
        </div>
      </footer>
    </main>
  )
}
