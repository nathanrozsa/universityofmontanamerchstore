"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-maroon-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <Image
              src="/universityofmontanamerchstorelogo.png"
              alt="University of Montana Merch Store"
              width={40}
              height={40}
              className="h-14
               w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-copper-400 bg-white/10"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth + Cart + hamburger */}
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            ) : (
              <Link
                href="/sign-in"
                className="hidden md:inline-flex items-center px-4 py-1.5 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/shop"
              aria-label="Shopping cart"
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.83-7.08a60.026 60.026 0 00-17.5 0c.36 1.2.696 2.41.996 3.63m3.456 2.45H7.5"
                />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-maroon-950">
          <nav className="flex flex-col px-4 py-2">
            {navLinks.map((link) => {
              const active = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-sm font-medium border-b border-white/10 transition-colors ${
                    active ? "text-copper-400" : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isSignedIn && (
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-copper-400 hover:text-copper-300 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
