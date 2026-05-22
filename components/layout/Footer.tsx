import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const categoryLinks = [
  { href: "/shop?category=t-shirts", label: "T-Shirts" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=Water Bottle", label: "Water Bottles" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand block */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/universityofmontanamerchstorelogo.png"
                alt="University of Montana Merch Store"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div className="leading-tight">
                <div className="font-bold text-base">University of Montana</div>
                <div className="text-gray-400 text-xs tracking-widest uppercase">Merch Store</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Official merchandise for Grizzly Nation. Shop the latest gear and
              show your UM pride wherever you go. All products are officially
              licensed.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800 rounded-full px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-400">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                Officially Licensed
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800 rounded-full px-3 py-1.5">
                Free shipping $75+
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categoryLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} University of Montana. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm font-medium">Go Griz!</p>
        </div>
      </div>
    </footer>
  );
}
