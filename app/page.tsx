import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Link from "next/link";

export const metadata: Metadata = {
  title: "University of Montana Merch Store",
};

const stats = [
  { value: "500+", label: "Products" },
  { value: "10k+", label: "Happy Fans" },
  { value: "100%", label: "Licensed Gear" },
  { value: "Free", label: "Returns" },
];

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      {/* Stats bar */}
      <div className="bg-maroon-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="py-5 px-6 text-center">
                <div className="text-2xl font-extrabold text-copper-400">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FeaturedProducts />
      <Categories />

      {/* CTA Banner */}
      <section className="py-20 bg-maroon-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to rep the Griz?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Browse our full catalog of officially licensed University of Montana
            merchandise and find your perfect game-day look.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 bg-copper-600 hover:bg-copper-700 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg"
          >
            Browse All Products
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
