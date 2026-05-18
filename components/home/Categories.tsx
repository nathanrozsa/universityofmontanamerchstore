import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data";

export default function Categories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Browse our curated collections of officially licensed Grizzly gear.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
                  {cat.name}
                </h3>
                <p className="text-white/65 text-sm mt-0.5">{cat.count} items</p>
              </div>
              {/* Hover ring */}
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-copper-500 rounded-2xl transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
