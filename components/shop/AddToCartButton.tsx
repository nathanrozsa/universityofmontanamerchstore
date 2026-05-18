"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  compact?: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

export default function AddToCartButton({ product, compact, selectedSize, selectedColor }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); // prevent card link navigation when compact
    addItem(product, 1, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        aria-label="Add to cart"
        className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-all shadow-sm ${
          added
            ? "bg-green-500 text-white scale-110"
            : "bg-maroon-900 text-white hover:bg-maroon-800"
        }`}
      >
        {added ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 ${
        added
          ? "bg-green-500 text-white"
          : "bg-maroon-900 text-white hover:bg-maroon-800 shadow-lg hover:shadow-xl hover:scale-[1.01]"
      }`}
    >
      {added ? (
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Added to Cart!
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.83-7.08a60.026 60.026 0 00-17.5 0c.36 1.2.696 2.41.996 3.63m3.456 2.45H7.5" />
          </svg>
          Add to Cart
        </span>
      )}
    </button>
  );
}
