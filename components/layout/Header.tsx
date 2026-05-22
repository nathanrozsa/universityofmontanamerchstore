"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginDialog from "@/components/auth/LoginDialog";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = user?.first_name || user?.display_name || user?.user_login || "Account";

  return (
    <>
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
                className="h-10 w-auto"
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

            {/* Right side: Account + Cart + Hamburger */}
            <div className="flex items-center gap-2">

              {/* Account area */}
              {!isLoading && (
                <>
                  {user ? (
                    /* Logged-in: avatar + name + dropdown */
                    <div className="relative hidden md:block" ref={accountMenuRef}>
                      <button
                        onClick={() => setAccountMenuOpen((o) => !o)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                      >
                        {user.image ? (
                          <Image
                            src={user.image as string}
                            alt={displayName}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-white/30"
                          />
                        ) : (
                          <span className="h-7 w-7 rounded-full bg-copper-600 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/30">
                            {displayName[0]?.toUpperCase()}
                          </span>
                        )}
                        <span className="text-white/90">{displayName}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/50">
                          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {accountMenuOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 text-gray-700">
                          <div className="px-4 py-2.5 border-b border-gray-100">
                            <p className="text-xs text-gray-400">Signed in as</p>
                            <p className="text-sm font-medium truncate">{user.user_email}</p>
                          </div>
                          <button
                            onClick={() => { setAccountMenuOpen(false); logout(); }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-600 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Logged-out: Sign In button */
                    <button
                      onClick={() => setLoginOpen(true)}
                      className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-copper-600 hover:bg-copper-700 text-white text-sm font-semibold transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
                      </svg>
                      Sign In
                    </button>
                  )}
                </>
              )}

              {/* Cart icon */}
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
                    className={`py-3 text-sm font-medium border-b border-white/10 last:border-0 transition-colors ${
                      active ? "text-copper-400" : "text-white/85 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile account row */}
              {!isLoading && (
                <div className="py-3">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {user.image ? (
                          <Image
                            src={user.image as string}
                            alt={displayName}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <span className="h-7 w-7 rounded-full bg-copper-600 flex items-center justify-center text-xs font-bold text-white">
                            {displayName[0]?.toUpperCase()}
                          </span>
                        )}
                        <span className="text-sm text-white/85">{displayName}</span>
                      </div>
                      <button
                        onClick={() => { setMobileOpen(false); logout(); }}
                        className="text-sm text-red-400 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                      className="w-full py-2.5 rounded-lg bg-copper-600 hover:bg-copper-700 text-white text-sm font-semibold transition-colors"
                    >
                      Sign In / Create Account
                    </button>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
