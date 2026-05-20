import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the University of Montana Merch Store and Grizzly Nation.",
};

const values = [
  {
    title: "Officially Licensed",
    description:
      "Every product in our store is officially licensed by the University of Montana, ensuring authentic quality and design.",
  },
  {
    title: "Community First",
    description:
      "A portion of every sale supports UM student scholarships and campus programs. When you shop Griz, everyone wins.",
  },
  {
    title: "Quality Guaranteed",
    description:
      "We partner with trusted manufacturers to deliver gear that holds up through every season — from tailgates to classrooms.",
  },
];

const team = [
  {
    name: "Montana Spirit",
    role: "Est. 1893 · Missoula, MT",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&auto=format&fit=crop&q=80",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 bg-maroon-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/universityofmontanacampus.jpg"
            alt="University campus"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">About Us</h1>
          <p className="text-lg text-white/70 leading-relaxed">
            We are the official merchandise store of the University of Montana Grizzlies —
            dedicated to outfitting Griz Nation with pride since day one.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-copper-600 mb-3 block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Born in Missoula,<br />Built for Griz Fans
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The University of Montana Merch Store was founded with a simple mission:
                  make it easy for students, alumni, and fans everywhere to wear their Griz
                  pride with style. From our home in Missoula, Montana, we ship officially
                  licensed gear across the country and beyond.
                </p>
                <p>
                  The University of Montana has a rich athletic tradition stretching back
                  to 1893. The Grizzlies have built one of the most storied programs in
                  college football, and Grizzly Nation spans generations of passionate fans.
                  Our store is a celebration of that legacy.
                </p>
                <p>
                  Every item you purchase is officially licensed, meaning a portion of
                  proceeds directly benefits the university and its students. Shopping here
                  isn't just about looking great — it's about giving back to the school we love.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-maroon-900 text-white font-semibold rounded-xl hover:bg-maroon-800 transition-all shadow-md"
                >
                  Browse the Store
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
              src="/universityofmontanacampus.jpg"
              alt="University of Montana campus"
              className="object-cover w-full h-[512px]"
              width={1024}
              height={768}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What We Stand For</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Our values guide every product we sell and every experience we create for Griz fans.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-maroon-900 rounded-xl flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions? We'd love to help.</h2>
          <p className="text-gray-500 mb-8">
            Our team is here for you. Reach out any time with questions about products,
            orders, or custom orders for your group.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-maroon-900 text-maroon-900 font-semibold rounded-xl hover:bg-maroon-900 hover:text-white transition-all"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
