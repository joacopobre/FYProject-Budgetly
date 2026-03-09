import Header from '../../components/Header'
import InfiniteMarquee from '../../components/InfiniteMarquee'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 text-center text-black">
      <Header />
      {/* Hero */}
      <section className="flex flex-col gap-30 px-10 pt-50 pb-40 md:gap-40 md:pt-70">
        <section className="flex flex-col items-center justify-center gap-10 text-center">
          <h1 className="text-3xl font-bold md:max-w-2xl md:text-5xl lg:text-5xl xl:max-w-3xl xl:text-6xl">
            Take control of your finances with clarity and confidence
          </h1>
          <p className="max-w-md text-base text-gray-500 sm:text-xl md:max-w-md lg:max-w-xl xl:max-w-3xl xl:text-2xl">
            Budgetly helps you track spending, set realistic budgets, and understand where
            your money goes.
          </p>
          <GoogleSignInButton className="w-full rounded-lg bg-blue-500 px-10 py-2 font-medium whitespace-nowrap text-white md:w-[320px]">
            Get Started
          </GoogleSignInButton>
        </section>
        <div className="edge-fade relative w-full overflow-hidden">
          <InfiniteMarquee />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center px-6 text-center md:px-12">
        <h2 className="text-4xl font-semibold md:text-7xl"> Features </h2>
        <p className="pt-3 text-xl text-gray-500 md:text-2xl">
          Have all your transactions in one place
        </p>

        {/* feature 1 */}
        <div className="my-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto flex aspect-[4/3] min-h-[18rem] w-full max-w-[340px] items-center justify-center rounded-[32px] bg-green-500 shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)] sm:max-w-[420px] lg:min-h-[20rem] lg:max-w-none">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full flex-col gap-4 lg:text-start">
            <h3 className="text-3xl font-medium">Track spending easily</h3>
            <p className="text-lg text-gray-500">Automatic sumaries by category</p>
          </div>
        </div>

        {/* feature 2 */}
        <div className="my-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto flex aspect-[4/3] min-h-[18rem] w-full max-w-[340px] items-center justify-center rounded-[32px] bg-green-500 shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)] sm:max-w-[420px] lg:order-2 lg:min-h-[20rem] lg:max-w-none">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full flex-col gap-4 lg:order-1 lg:text-start">
            <h3 className="text-3xl font-medium">Visualize your progress</h3>
            <p className="text-lg text-gray-500">Monthly insights and charts </p>
          </div>
        </div>
        <GoogleSignInButton className="bg-primary mx-auto my-5 rounded-lg px-12 py-1.5 font-medium text-white lg:px-[72px] lg:py-3 lg:text-xl lg:tracking-wider">
          Get Started
        </GoogleSignInButton>

        {/* feature 3 */}
        <div className="my-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto flex aspect-[4/3] min-h-[18rem] w-full max-w-85 items-center justify-center rounded-[32px] bg-green-500 shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)] sm:max-w-[420px] lg:min-h-[20rem] lg:max-w-none">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full flex-col gap-4 lg:text-start">
            <h3 className="text-3xl font-medium">Secure and private</h3>
            <p className="text-lg text-gray-500">
              Data protected using modern encryption.
            </p>
          </div>
        </div>

        {/* feature 4 */}
        <div className="my-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto flex aspect-[4/3] min-h-[18rem] w-full max-w-85 items-center justify-center rounded-[32px] bg-green-500 shadow-[0px_30px_31px_2px_rgba(0,0,0,0.1)] sm:max-w-[420px] lg:order-2 lg:min-h-[20rem] lg:max-w-none">
            {/* img */}
          </div>
          <div className="mx-auto flex w-full flex-col gap-4 lg:order-1 lg:text-start">
            <h3 className="text-3xl font-medium">Simple by design</h3>
            <p className="text-lg text-gray-500">
              Made for everyone, not just accountants.
            </p>
          </div>
        </div>
      </section>
      {/* Demo secton */}

      <section
        id="demo"
        className="flex flex-col justify-center bg-green-700 px-6 pt-10 pb-30 text-center align-middle"
      >
        {/* title */}
        <h2 className="mt-15 mb-7 text-4xl font-semibold text-white md:text-7xl">
          How It Works
        </h2>
        <p className="text-md mb-7 px-10 font-medium text-gray-100 md:text-2xl">
          Track, organise, and understand your finances in just a few steps.
        </p>
        <GoogleSignInButton className="mx-auto mb-7 rounded-xl bg-white px-12 py-2 font-medium text-green-700">
          Get Started
        </GoogleSignInButton>

        {/* mobile carousel */}
        <div className="relative md:hidden">
          <div className="relative z-0 mx-auto w-full max-w-md snap-x snap-mandatory [scroll-padding-inline:1.25rem] overflow-x-auto overflow-y-hidden scroll-smooth px-0 sm:[scroll-padding-inline:1.5rem]">
            <div className="flex flex-nowrap justify-start gap-5 px-5 sm:px-6">
              <div className="w-[clamp(16px,8vw,32px)] shrink-0"></div>
              <div className="h-[420px] w-[clamp(260px,85vw,340px)] shrink-0 snap-center rounded-[24px] border-4 border-green-500 bg-green-50 p-5">
                <div className="mb-4 h-5 w-1/2 rounded bg-green-500/60"></div>
                <div className="mb-2 h-3 w-3/4 rounded bg-gray-300/80"></div>
                <div className="mb-2 h-3 w-2/3 rounded bg-gray-300/70"></div>
                <div className="mb-4 h-3 w-1/2 rounded bg-gray-300/60"></div>
                <div className="grid grid-cols-5 gap-1.5">
                  <div className="h-16 rounded bg-green-400/70"></div>
                  <div className="h-10 rounded bg-green-400/60"></div>
                  <div className="h-20 rounded bg-green-400/80"></div>
                  <div className="h-12 rounded bg-green-400/65"></div>
                  <div className="h-18 rounded bg-green-400/75"></div>
                </div>
              </div>
              <div className="h-[420px] w-[clamp(260px,85vw,340px)] shrink-0 snap-center rounded-[24px] border-4 border-green-500 bg-green-50 p-5">
                <div className="mb-4 h-5 w-1/2 rounded bg-green-500/60"></div>
                <div className="mb-2 h-3 w-3/4 rounded bg-gray-300/80"></div>
                <div className="mb-2 h-3 w-2/3 rounded bg-gray-300/70"></div>
                <div className="mb-4 h-3 w-1/2 rounded bg-gray-300/60"></div>
                <div className="grid grid-cols-5 gap-1.5">
                  <div className="h-16 rounded bg-green-400/70"></div>
                  <div className="h-10 rounded bg-green-400/60"></div>
                  <div className="h-20 rounded bg-green-400/80"></div>
                  <div className="h-12 rounded bg-green-400/65"></div>
                  <div className="h-18 rounded bg-green-400/75"></div>
                </div>
              </div>
              <div className="h-[420px] w-[clamp(260px,85vw,340px)] shrink-0 snap-center rounded-[24px] border-4 border-green-500 bg-green-50 p-5">
                <div className="mb-4 h-5 w-1/2 rounded bg-green-500/60"></div>
                <div className="mb-2 h-3 w-3/4 rounded bg-gray-300/80"></div>
                <div className="mb-2 h-3 w-2/3 rounded bg-gray-300/70"></div>
                <div className="mb-4 h-3 w-1/2 rounded bg-gray-300/60"></div>
                <div className="grid grid-cols-5 gap-1.5">
                  <div className="h-16 rounded bg-green-400/70"></div>
                  <div className="h-10 rounded bg-green-400/60"></div>
                  <div className="h-20 rounded bg-green-400/80"></div>
                  <div className="h-12 rounded bg-green-400/65"></div>
                  <div className="h-18 rounded bg-green-400/75"></div>
                </div>
              </div>
              <div className="w-[clamp(16px,8vw,32px)] shrink-0"></div>
            </div>
          </div>
        </div>

        {/* video big viewport */}
        <div className="mx-auto hidden aspect-video w-full max-w-[85%] rounded-3xl border-4 border-green-500 bg-white md:flex"></div>
      </section>

      {/* testimonials */}
      <section id="testimonials" className="bg-green-700 py-16">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-6 text-center text-white md:px-10">
          <h2 className="text-4xl font-semibold md:text-7xl">Testimonials</h2>
          <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
            Hear from people using Budgetly to stay on track.
          </p>
          <div className="mt-12 grid w-full items-start justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex w-full flex-col items-center rounded-4xl border-4 border-green-500 bg-gray-100 px-6 py-6">
              <div className="h-30 w-30 rounded-full bg-amber-300"></div>
              <h3 className="mt-6 text-xl font-medium text-black">Person 1</h3>
              <p className="mt-4 text-gray-700">
                Lorem ipsum dolor sit amet consectetur. Euismod arcu commodo risus duis
                nisl risus et congue. Cum aliquam ornare ipsum placerat non posuere sed.
              </p>
            </div>

            <div className="flex w-full flex-col items-center rounded-4xl border-4 border-green-500 bg-gray-100 px-6 py-6">
              <div className="h-30 w-30 rounded-full bg-amber-300"></div>
              <h3 className="mt-6 text-xl font-medium text-black">Person 2</h3>
              <p className="mt-4 text-gray-700">
                Lorem ipsum dolor sit amet consectetur. Euismod arcu commodo risus duis
                nisl risus et congue. Cum aliquam ornare ipsum placerat non posuere
                sed.Lorem ipsum dolor sit amet consectetur. Euismod arcu commodo risus
                duis nisl risus et congue. Cum aliquam ornare ipsum placerat non posuere
                sed.
              </p>
            </div>

            <div className="flex w-full flex-col items-center rounded-4xl border-4 border-green-500 bg-gray-100 px-6 py-6">
              <div className="h-30 w-30 rounded-full bg-amber-300"></div>
              <h3 className="mt-6 text-xl font-medium text-black">Person 3</h3>
              <p className="mt-4 text-gray-700">
                Lorem ipsum dolor sit amet consectetur. Euismod arcu commodo risus duis
                nisl risus et congue. Cum aliquam ornare ipsum placerat non posuere sed.
              </p>
            </div>

            <div className="flex w-full flex-col items-center rounded-4xl border-4 border-green-500 bg-gray-100 px-6 py-6">
              <div className="h-30 w-30 rounded-full bg-amber-300"></div>
              <h3 className="mt-6 text-xl font-medium text-black">Person 4</h3>
              <p className="mt-4 text-gray-700">
                Lorem ipsum dolor sit amet consectetur. Euismod arcu commodo risus duis
                nisl risus et congue. Cum aliquam ornare ipsum placerat non posuere
                sed.Lorem ipsum dolor sit amet consectetur. Euismod arcu commodo risus
                duis nisl risus et congue. Cum aliquam ornare ipsum placerat non posuere
                sed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex w-full justify-center bg-black py-50 text-center">
        <p className="m-auto text-white"> ALL RELEVANT INFO FOR FOOTER</p>
      </footer>
    </main>
  )
}
