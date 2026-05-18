"use client";

import { categories } from "@/lib/data";

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $75", min: 50, max: 75 },
  { label: "$75+", min: 75, max: Infinity },
];

interface Props {
  selectedCategory: string;
  priceRange: [number, number];
  onCategoryChange: (cat: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}

export default function ProductFilters({
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceChange,
  onReset,
}: Props) {
  const activePriceLabel =
    PRICE_RANGES.find(
      (r) => r.min === priceRange[0] && r.max === priceRange[1]
    )?.label ?? "All Prices";

  return (
    <aside className="space-y-8">
      {/* Category filter */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onCategoryChange("all")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === "all"
                  ? "bg-maroon-900 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-maroon-900 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.name}
                <span className={`ml-1 text-xs ${selectedCategory === cat.slug ? "text-white/60" : "text-gray-400"}`}>
                  ({cat.count})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price filter */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Price Range
        </h3>
        <ul className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <li key={range.label}>
              <button
                onClick={() => onPriceChange(range.min, range.max)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activePriceLabel === range.label
                    ? "bg-maroon-900 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="text-xs text-gray-400 hover:text-maroon-900 underline underline-offset-2 transition-colors"
      >
        Reset all filters
      </button>
    </aside>
  );
}
