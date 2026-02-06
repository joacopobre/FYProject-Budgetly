import Header from '../components/Header'
import InfiniteMarquee from '../components/InfiniteMarquee'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 pb-10 text-center text-black">
      <Header />
      {/* Hero */}
      <section className="flex flex-col gap-30 px-10 pt-50 pb-40 md:gap-40 md:pt-70">
        <section className="flex flex-col items-center justify-center gap-10 text-center">
          <h1 className="text-3xl font-bold md:max-w-2xl md:text-5xl lg:text-5xl xl:max-w-3xl xl:text-6xl">
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
        <h2 className="font-semmibold text-4xl"> Features </h2>
        <p className="pt-3 text-xl text-gray-500">
          Have all your transactions in one place
        </p>

        {/* feature 1 */}
        <div className="my-20 flex flex-col justify-center gap-8 align-middle lg:flex-row lg:justify-around">
          <div className="mx-auto flex h-80 w-full max-w-107 justify-center rounded-4xl bg-green-500 align-middle shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)]">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full max-w-107 flex-col gap-3 lg:pt-20 lg:text-start">
            <h3 className="text-3xl font-medium">Track spending easily</h3>
            <p className="text-lg text-gray-500">Automatic sumaries by category</p>
          </div>
        </div>

        {/* feature 2 */}
        <div className="my-20 flex flex-col justify-center gap-8 align-middle lg:flex-row-reverse lg:justify-around">
          <div className="mx-auto flex h-80 w-full max-w-107 justify-center rounded-4xl bg-green-500 align-middle shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)]">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full max-w-107 flex-col gap-3 lg:pt-20 lg:text-start">
            <h3 className="text-3xl font-medium">Visualize your progress</h3>
            <p className="text-lg text-gray-500">Monthly insights and charts </p>
          </div>
        </div>
        <button
          type="button"
          className="bg-primary font-semmibold mx-auto my-5 rounded-lg px-12 py-1.5 text-white lg:px-18 lg:py-3 lg:text-xl lg:tracking-wider"
        >
          Get Started
        </button>

        {/* feature 3 */}
        <div className="my-20 flex flex-col justify-center gap-8 align-middle lg:flex-row lg:justify-around">
          <div className="mx-auto flex h-80 w-full max-w-107 justify-center rounded-4xl bg-green-500 align-middle shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)]">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full max-w-107 flex-col gap-3 lg:pt-20 lg:text-start">
            <h3 className="text-3xl font-medium">Secure and private</h3>
            <p className="text-lg text-gray-500">
              Data protected using modern encryption.
            </p>
          </div>
        </div>

        {/* feature 4 */}
        <div className="my-20 flex flex-col justify-center gap-8 align-middle lg:flex-row-reverse lg:justify-around">
          <div className="mx-auto flex h-80 w-full max-w-107 justify-center rounded-4xl bg-green-500 align-middle shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)]">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full max-w-107 flex-col gap-3 lg:pt-20 lg:text-start">
            <h3 className="text-3xl font-medium">Simple by design</h3>
            <p className="text-lg text-gray-500">
              Made for everyone, not just accountants.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
