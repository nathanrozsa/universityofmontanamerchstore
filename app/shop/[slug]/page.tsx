import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/data";
import ImageGallery from "@/components/shop/ImageGallery";
import ProductOptions from "@/components/shop/ProductOptions";
import ProductCard from "@/components/shop/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

// Pre-generate all product routes at build time
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined;
  const savings = hasDiscount ? product.price - product.salePrice! : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gray-700 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-gray-700 capitalize">{product.category.replace("-", " ")}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
        {/* Left — image gallery */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Right — product details */}
        <div>
          {/* Category + badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider capitalize">
              {product.category.replace("-", " ")}
            </span>
            {product.badge && (
              <span className="bg-maroon-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-extrabold text-gray-900">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save ${savings.toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          <p className="text-gray-600 leading-relaxed mb-8">{product.longDescription}</p>

          {/* Size & color selectors + add to cart */}
          <ProductOptions product={product} />

          {/* Stock indicator */}
          <div className={`mt-5 flex items-center gap-2 text-sm ${product.inStock ? "text-green-600" : "text-red-500"}`}>
            <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
            {product.inStock ? "In stock — ready to ship" : "Currently out of stock"}
          </div>

          {/* Perks */}
          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Free shipping", sub: "Orders over $75" },
              { label: "Easy returns", sub: "30-day policy" },
              { label: "Official gear", sub: "Licensed by UM" },
            ].map((perk) => (
              <div key={perk.label} className="flex flex-col text-center bg-gray-50 rounded-xl p-3">
                <span className="text-sm font-semibold text-gray-800">{perk.label}</span>
                <span className="text-xs text-gray-400 mt-0.5">{perk.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
