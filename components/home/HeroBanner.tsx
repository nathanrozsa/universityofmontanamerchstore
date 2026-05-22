import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";

export default function HeroBanner() {
  const hoodie = products.find((p) => p.slug === "montana-script-hoodie")!;
  const salePrice = hoodie.salePrice!;
  const discount = Math.round(((hoodie.price - salePrice) / hoodie.price) * 100);

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
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left — hero text */}
          <div className="flex-1 max-w-xl">
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

          {/* Right — featured product card */}
          <div className="hidden lg:block flex-shrink-0 w-[300px]">
            <div className="relative bg-maroon-800/80 backdrop-blur-sm border border-white/10 rounded-3xl p-5 shadow-2xl">
              {/* Best Seller badge */}
              <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-copper-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                ★ Best Seller
              </div>

              {/* Featured label */}
              <p className="text-copper-400 text-[10px] font-bold uppercase tracking-widest text-center mb-3 flex items-center justify-center gap-1.5">
                <span>★</span> Featured Item
              </p>

              {/* Product image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
                <Image
                  src={hoodie.images[0]}
                  alt={hoodie.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>

              {/* Name + description */}
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{hoodie.name}</h3>
              <p className="text-white/50 text-xs mb-4">{hoodie.description}</p>

              {/* Pricing */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-copper-400 text-2xl font-extrabold">${salePrice.toFixed(2)}</span>
                <span className="text-white/40 text-sm line-through">${hoodie.price.toFixed(2)}</span>
                <span className="ml-auto bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {discount}% Off
                </span>
              </div>

              {/* Shop Now button */}
              <Link
                href={`/shop/${hoodie.slug}`}
                className="block w-full text-center bg-copper-500 hover:bg-copper-600 text-white font-bold text-sm py-3 rounded-xl transition-all hover:scale-[1.02] mb-4"
              >
                Shop Now →
              </Link>

              {/* Sizes */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {hoodie.sizes?.map((size) => (
                  <span key={size} className="border border-white/20 text-white/60 text-[10px] font-medium px-2 py-0.5 rounded-md">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
