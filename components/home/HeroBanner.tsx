import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[580px] md:min-h-[680px] flex items-center overflow-hidden bg-maroon-900">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=75"
          alt="University of Montana campus"
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        {/* Gradient fade to left */}
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-900 via-maroon-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-xl">
          <span className="inline-block bg-copper-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            Official Griz Gear
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6">
            Wear Your
            <span className="block text-copper-400">Griz Pride</span>
          </h1>

          <p className="text-base sm:text-lg text-white/75 mb-10 leading-relaxed">
            Shop the official University of Montana merchandise. From game-day
            essentials to everyday wear, represent Grizzly Nation in style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-copper-600 hover:bg-copper-700 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-black/30"
            >
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Our Story
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6">
            {[
              { icon: "✓", label: "Officially Licensed" },
              { icon: "✓", label: "Free Shipping $75+" },
              { icon: "✓", label: "Easy Returns" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-white/60 text-sm">
                <span className="text-copper-400 font-bold">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
