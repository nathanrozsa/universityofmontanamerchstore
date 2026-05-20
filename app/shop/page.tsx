"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/data";
import ProductCard from "@/components/shop/ProductCard";

function SuccessBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(searchParams.get("checkout") === "success");

  if (!visible) return null;

  return (
    <div className="mb-6 flex items-center justify-between bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
      <span>Order placed! Check your email for confirmation.</span>
      <button onClick={() => setVisible(false)} className="ml-4 text-green-600 hover:text-green-900 font-bold leading-none">&times;</button>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">Shop</h1>
        <p className="text-gray-500">Official University of Montana merchandise</p>
      </div>

      <Suspense>
        <SuccessBanner />
      </Suspense>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="py-2.5 px-4 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-maroon-900/20 focus:border-maroon-900 transition cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400 mb-5">
          {filtered.length} {filtered.length === 1 ? "product" : "products"} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-14 h-14 text-gray-200 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
            <p className="text-sm text-gray-400 mb-5">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}