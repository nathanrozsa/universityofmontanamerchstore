"use client";

import { useState } from "react";
import { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";

export default function ProductOptions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);

  return (
    <div className="space-y-6">
      {/* Size selector */}
      {product.sizes && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Size:{" "}
            <span className="font-semibold text-gray-900">{selectedSize}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                  selectedSize === size
                    ? "border-maroon-900 bg-maroon-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-maroon-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color selector */}
      {product.colors && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Color:{" "}
            <span className="font-semibold text-gray-900">{selectedColor}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                  selectedColor === color
                    ? "border-maroon-900 bg-maroon-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-maroon-900"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <AddToCartButton
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    </div>
  );
}
