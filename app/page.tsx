import Header from '../components/Header'
import InfiniteMarquee from '../components/InfiniteMarquee'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 text-center text-black">
      <Header />
      <section className="flex flex-col px-10 py-50 md:py-70">
        <section className="flex flex-col items-center justify-center gap-10 text-center">
          <h1 className="xl:text-6xlm text-3xl font-semibold md:max-w-2xl md:text-5xl lg:text-5xl xl:max-w-3xl xl:text-6xl">
            Take control of your finances with clarity and confidence
          </h1>
          <p className="text-md max-w-md text-gray-500 sm:text-xl md:max-w-md lg:max-w-xl xl:max-w-3xl xl:text-2xl">
            Budgetly helps you track spending, set realistic budgets, and understand where
            your money goes.
          </p>
          <button
            type="button"
            className="w-full rounded-lg bg-blue-500 px-10 py-2 font-light whitespace-nowrap text-white md:w-sm"
          >
            Get Started
          </button>
        </section>
        <div className="relative w-full overflow-hidden edge-fade">
          <InfiniteMarquee />
        </div>
      </section>
    </main>
  )
}
