import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-court-600 to-court-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl mb-4">
            Book Your Pickleball Court
          </h1>
          <p className="text-lg text-court-100 mb-8 max-w-2xl mx-auto">
            Reserve one of our 4 premium courts online. Only ₱300 per hour.
            Fast booking, instant email confirmation.
          </p>
          <Link
            to="/book"
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-court-700 hover:bg-court-50 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: '1', title: 'Choose a Court', desc: 'Select from 4 available courts and pick your preferred date and time.' },
            { step: '2', title: 'Fill Your Details', desc: 'Enter your name and email. We will send a confirmation to your inbox.' },
            { step: '3', title: 'Play!', desc: 'Show up at your scheduled time. Court rate is ₱300 per hour.' },
          ].map((item) => (
            <div key={item.step} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-court-100 text-court-700 font-bold text-lg">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-court-50 border-y border-court-100">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-3xl font-bold text-court-700">₱300 <span className="text-lg font-normal text-gray-600">/ hour</span></p>
          <p className="text-gray-600 mt-2">Affordable court rental for players of all levels</p>
        </div>
      </section>
    </div>
  );
}
