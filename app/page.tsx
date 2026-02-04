import Header from '../components/Header'
import InfiniteMarquee from '../components/InfiniteMarquee'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 text-center text-black">
      <Header />
      {/* Hero */}
      <section className="flex flex-col gap-30 px-10 pt-50 pb-40 md:gap-40 md:pt-70">
        <section className="flex flex-col items-center justify-center gap-10 text-center">
          <h1 className="text-3xl font-semibold md:max-w-2xl md:text-5xl lg:text-5xl xl:max-w-3xl xl:text-6xl">
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
        <div className="edge-fade relative w-full overflow-hidden">
          <InfiniteMarquee />
        </div>
      </section>
      {/* Features */}
      <section className="flex flex-col justify-center px-8 text-center align-middle">
        <h1 className="font-semmibold text-4xl"> Features </h1>
        <p className="pt-3 text-xl text-gray-500">
          Have all your transactions in one place
        </p>
        <div className="flex flex-col justify-center gap-8 pt-10">
          <div className="flex h-80 justify-center rounded-4xl bg-green-600 align-middle">
            {/* img */}h
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-medium">Track spending easily</h1>
            <p className="text-lg text-gray-500">Automatic sumaries by category</p>
          </div>
          <button
            type="button"
            className="bg-primary mx-auto rounded-lg px-12 py-1.5 text-white"
          >
            Get Started
          </button>
        </div>
      </section>
    </main>
  )
}
