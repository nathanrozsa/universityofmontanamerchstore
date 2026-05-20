"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

interface Props {
  product: Product;
  compact?: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

export default function AddToCartButton({ product, compact, selectedSize, selectedColor }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();

    if (compact) {
      router.push(`/shop/${product.slug}`);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: product.stripePriceId,
          quantity: 1,
          selectedSize,
          selectedColor,
          productSlug: product.slug,
        }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setLoading(false);
      setError(true);
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        aria-label="View product"
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-all shadow-sm bg-maroon-900 text-white hover:bg-maroon-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 ${
          loading
            ? "bg-maroon-800 text-white cursor-wait opacity-80"
            : "bg-maroon-900 text-white hover:bg-maroon-800 shadow-lg hover:shadow-xl hover:scale-[1.01]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.83-7.08a60.026 60.026 0 00-17.5 0c.36 1.2.696 2.41.996 3.63m3.456 2.45H7.5" />
            </svg>
            Buy
          </span>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600 text-center">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
