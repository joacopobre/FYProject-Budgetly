 'use client'

import Header from '../../components/Header'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { ChartNoAxesCombined, CircleDollarSign, PiggyBank, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export default function Home() {
  const reduceMotion = useReducedMotion()

  const riseIn = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0 },
  }

  const features = [
    {
      icon: CircleDollarSign,
      title: 'Automatic expense tracking',
      description:
        'Link your accounts and organize spending into categories without manual work.',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      accentBar: 'bg-emerald-500',
    },
    {
      icon: ChartNoAxesCombined,
      title: 'Monthly insights that matter',
      description:
        'See where your money goes each month with clear trends and practical summaries.',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      accentBar: 'bg-teal-500',
    },
    {
      icon: PiggyBank,
      title: 'Budgets that stay realistic',
      description:
        'Set spending limits by category and track progress in real time as you move through the month.',
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      accentBar: 'bg-cyan-500',
    },
    {
      icon: ShieldCheck,
      title: 'Private and secure by default',
      description:
        'Your financial data is protected with modern security practices and encrypted storage.',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      accentBar: 'bg-green-500',
    },
  ]

  const testimonials = [
    {
      name: 'Maya Thompson',
      initials: 'MT',
      role: 'Freelance Designer',
      quote:
        'Budgetly helped me see exactly where my money was leaking each month. I finally have a budget I can actually follow.',
      accentBar: 'bg-emerald-500',
      avatarBg: 'bg-emerald-100',
      avatarText: 'text-emerald-700',
    },
    {
      name: 'Daniel Chen',
      initials: 'DC',
      role: 'Software Engineer',
      quote:
        'The dashboard is simple, fast, and useful. I check it once a day and instantly know if I am on track.',
      accentBar: 'bg-teal-500',
      avatarBg: 'bg-teal-100',
      avatarText: 'text-teal-700',
    },
    {
      name: 'Sofia Martinez',
      initials: 'SM',
      role: 'Small Business Owner',
      quote:
        'I needed a finance tool that was clear and not overwhelming. Budgetly gives me confidence in every spending decision.',
      accentBar: 'bg-cyan-500',
      avatarBg: 'bg-cyan-100',
      avatarText: 'text-cyan-700',
    },
  ]

  const cardHover = reduceMotion ? undefined : { y: -2 }

  return (
    <main className="min-h-screen bg-[#f3f5f4] text-slate-900">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#06120f] via-[#0a1d17] to-[#0d241c]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hero-dot-grid" />
          <div className="hero-aurora hero-aurora-one" />
          <div className="hero-aurora hero-aurora-two" />
          <div className="hero-aurora hero-aurora-three" />
          <div className="hero-light-sweep" />
          <div className="hero-horizon" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-38 pb-30 text-center sm:pt-42 lg:pt-46">
          <motion.h1
            variants={riseIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.62, ease: 'easeOut' }}
            className="mx-auto max-w-4xl text-4xl leading-tight font-semibold text-white sm:text-5xl lg:text-6xl"
          >
            Budgeting clarity for people who want real financial progress
          </motion.h1>
          <motion.p
            variants={riseIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-emerald-50/85 sm:text-lg"
          >
            Budgetly gives you one calm workspace to track spending, manage monthly budgets,
            and make confident decisions with your money.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={riseIn}
            transition={{ duration: 0.58, delay: 0.16, ease: 'easeOut' }}
            className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <GoogleSignInButton className="inline-flex items-center justify-center rounded-md bg-[#10b981] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(16,185,129,0.28)] transition-colors duration-150 hover:bg-[#059669] focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none">
              Get Started
            </GoogleSignInButton>
            <motion.a
              href="#demo"
              className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/8 px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none"
              variants={riseIn}
              transition={{ duration: 0.55, delay: 0.22, ease: 'easeOut' }}
            >
              View Demo
            </motion.a>
          </motion.div>

          <motion.p
            className="mt-6 text-sm text-emerald-50/70"
            variants={riseIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.52, delay: 0.24, ease: 'easeOut' }}
          >
            Trusted by thousands of users managing their daily finances with confidence.
          </motion.p>

          <div className="relative mx-auto mt-16 max-w-6xl px-2">
            <div className="grid gap-4 lg:grid-cols-[.9fr_1.2fr_.9fr] lg:items-end">
              <motion.article
                initial="hidden"
                animate="visible"
                variants={riseIn}
                transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
                className="hero-card-float relative hidden overflow-hidden rounded-2xl border border-emerald-100/15 bg-white/92 p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.22)] lg:block"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-400" />
                <p className="text-xs text-slate-500">Monthly Savings</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">$860</p>
                <p className="mt-2 text-sm text-emerald-700">+18% vs last month</p>
              </motion.article>

              <motion.article
                initial="hidden"
                animate="visible"
                variants={riseIn}
                transition={{ duration: 0.62, delay: 0.34, ease: 'easeOut' }}
                className="rounded-xl border border-emerald-100/20 bg-white/95 p-5 text-left shadow-[0_14px_34px_rgba(0,0,0,0.25)]"
              >
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Budgetly Dashboard</p>
                      <p className="text-xs text-slate-500">Current month</p>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      On Track
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Spent</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">$2,140</p>
                    </div>
                    <div className="rounded-md border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Budget Remaining</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-700">$860</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 w-[71%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial="hidden"
                animate="visible"
                variants={riseIn}
                transition={{ duration: 0.62, delay: 0.4, ease: 'easeOut' }}
                className="hero-card-float relative hidden overflow-hidden rounded-2xl border border-emerald-100/15 bg-white/92 p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.22)] [animation-delay:1.2s] lg:block"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 to-teal-400" />
                <p className="text-xs text-slate-500">Largest Category</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">Groceries</p>
                <p className="mt-2 text-sm text-slate-600">$420 this month</p>
              </motion.article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-3xl font-bold text-transparent">50k+</p>
            <p className="mt-1 text-sm text-slate-600">Monthly active users</p>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-emerald-400" />
          </div>
          <div>
            <p className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent">$120M+</p>
            <p className="mt-1 text-sm text-slate-600">Tracked each month</p>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-teal-400" />
          </div>
          <div>
            <p className="bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent">4.9/5</p>
            <p className="mt-1 text-sm text-slate-600">Average product rating</p>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-cyan-400" />
          </div>
          <div>
            <p className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent">99.9%</p>
            <p className="mt-1 text-sm text-slate-600">Platform availability</p>
            <div className="mt-3 h-0.5 w-8 rounded-full bg-green-400" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-30">
        <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div className="text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to stay in control
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              Budgetly keeps your finances organized without overwhelming you, so your budget
              becomes practical and sustainable.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map(feature => (
              <motion.article
                key={feature.title}
                variants={riseIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.52, delay: 0.06 * features.indexOf(feature), ease: 'easeOut' }}
                whileHover={cardHover}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-shadow duration-200 hover:shadow-[0_12px_24px_rgba(15,23,42,0.1)]"
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${feature.accentBar}`} />
                <div className={`mb-4 inline-flex rounded-xl ${feature.iconBg} p-2.5 ${feature.iconColor}`}>
                  <feature.icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="bg-white py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <motion.div
            variants={riseIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.58, ease: 'easeOut' }}
            style={reduceMotion ? undefined : { willChange: 'transform, opacity' }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              One workspace for your monthly financial decisions
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              Review category performance, track budget progress, and understand spending
              trends in one focused product experience.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Track daily expenses with clear category visibility</li>
              <li>Understand your monthly progress at a glance</li>
              <li>Adjust your budget before overspending happens</li>
            </ul>
            <GoogleSignInButton className="mt-8 inline-flex items-center justify-center rounded-md bg-[#10b981] px-6 py-3 text-sm font-medium text-white shadow-[0_6px_16px_rgba(16,185,129,0.25)] transition-colors duration-150 hover:bg-[#059669] focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none">
              Get Started
            </GoogleSignInButton>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: reduceMotion ? 0 : 14 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.62, delay: 0.06, ease: 'easeOut' }}
            className="rounded-xl border border-slate-200 bg-[#f7faf8] p-5 shadow-[0_10px_26px_rgba(15,23,42,0.09)]"
          >
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">Budgetly Analytics</p>
                <div className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-slate-200 bg-white p-3 md:col-span-2">
                  <p className="text-xs text-slate-500">Cash Flow</p>
                  <div className="mt-3 flex h-28 items-end gap-2" aria-hidden>
                    <span className="h-10 w-full rounded-sm bg-emerald-200" />
                    <span className="h-16 w-full rounded-sm bg-emerald-300" />
                    <span className="h-22 w-full rounded-sm bg-emerald-400" />
                    <span className="h-14 w-full rounded-sm bg-emerald-300" />
                    <span className="h-24 w-full rounded-sm bg-emerald-500" />
                    <span className="h-18 w-full rounded-sm bg-emerald-400" />
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Top Category</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">Groceries</p>
                  <p className="mt-1 text-xs text-slate-500">$420 this month</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="py-32">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Trusted by people building healthier financial habits
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Budgetly gives users clear visibility, practical workflows, and confidence in
              daily spending decisions.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map(item => (
              <motion.article
                key={item.name}
                variants={riseIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: 0.08 * testimonials.indexOf(item),
                  ease: 'easeOut',
                }}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_6px_18px_rgba(15,23,42,0.07)]"
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${item.accentBar}`} />
                <span className="mb-3 block text-4xl leading-none font-bold text-slate-200 select-none" aria-hidden>
                  &ldquo;
                </span>
                <p className="text-sm leading-7 text-slate-700">{item.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${item.avatarBg} ${item.avatarText}`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f231b] px-6 py-30">
        <motion.div
          variants={riseIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-5xl rounded-xl border border-emerald-200/15 bg-gradient-to-r from-[#143427] to-[#1a4431] p-10 sm:p-12"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to bring structure to your finances?
            </h2>
            <p className="mt-4 text-base leading-7 text-emerald-50/80">
              Start using Budgetly today and turn monthly budgeting into a routine you can
              rely on.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <GoogleSignInButton className="inline-flex items-center justify-center rounded-md bg-[#10b981] px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#059669] focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none">
                Get Started
              </GoogleSignInButton>
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none"
              >
                Create Account
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-emerald-100/10 bg-[#0a1813] px-6 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 text-emerald-50/90 md:grid-cols-2">
          <div id="about">
            <h3 className="text-base font-semibold text-white">About Budgetly</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-emerald-50/70">
              Budgetly is built to make personal finance easier to understand, so you can
              spend with intention and grow financial confidence over time.
            </p>
          </div>
          <div id="contact">
            <h3 className="text-base font-semibold text-white">Contact</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-50/70">
              Questions about Budgetly? Reach out at{' '}
              <a className="text-emerald-200 underline-offset-2 hover:underline" href="#">
                support@budgetly.app
              </a>
              .
            </p>
          </div>
          <div className="text-sm text-emerald-50/60 md:col-span-2">Budgetly</div>
        </div>
      </footer>
    </main>
  )
}
