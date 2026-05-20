"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;

    const lineItems = items.map((item) => ({
      priceId: item.product.stripePriceId,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setLoading(false);
      setError(true);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.83-7.08a60.026 60.026 0 00-17.5 0c.36 1.2.696 2.41.996 3.63m3.456 2.45H7.5" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Browse our store and add some Griz gear!</p>
          <Link
            href="/shop"
            className="inline-block bg-maroon-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-maroon-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const price = item.product.salePrice ?? item.product.price;
            const key = `${item.product.id}-${item.selectedSize ?? ""}-${item.selectedColor ?? ""}`;
            return (
              <div key={key} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center">
                {item.product.images?.[0] && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                  </div>
                  <p className="text-maroon-900 font-semibold mt-1">${price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                    aria-label="Remove item"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>

                <p className="w-20 text-right font-semibold text-gray-900">
                  ${(price * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between text-lg font-semibold text-gray-900 mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4 text-center">Something went wrong. Please try again.</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
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
                Redirecting to checkout…
              </span>
            ) : (
              "Checkout"
            )}
          </button>

          <Link
            href="/shop"
            className="block text-center mt-4 text-sm text-gray-500 hover:text-maroon-900 transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
