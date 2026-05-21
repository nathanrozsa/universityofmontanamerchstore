"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== undefined;
  const [loading, setLoading] = useState(false);

  async function handleBuyNow() {
    if (!product.stripePriceId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: product.stripePriceId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Product image */}
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-maroon-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Sale
            </span>
          )}
        </div>
      </Link>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1 capitalize">
          {product.category.replace("-", " ")}
        </p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-maroon-900 transition-colors text-sm leading-snug line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.stripePriceId && (
            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="bg-maroon-900 hover:bg-maroon-800 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              {loading ? "Loading…" : "Buy Now"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
