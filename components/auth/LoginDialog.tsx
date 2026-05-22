"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

type Tab = "signin" | "register";
type SignInMode = "password" | "email-code" | "verify-code";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const { login, register, sendEmailCode, verifyEmailCode } = useAuth();

  const [tab, setTab] = useState<Tab>("signin");
  const [signInMode, setSignInMode] = useState<SignInMode>("password");

  // password sign-in
  const [siLogin, setSiLogin] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // email code
  const [ecEmail, setEcEmail] = useState("");
  const [ecCode, setEcCode] = useState("");

  // register
  const [rFirst, setRFirst] = useState("");
  const [rLast, setRLast] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rPhone, setRPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTab("signin");
        setSignInMode("password");
        setSiLogin(""); setSiPassword("");
        setEcEmail(""); setEcCode("");
        setRFirst(""); setRLast(""); setREmail(""); setRPassword(""); setRPhone("");
        setError("");
        setLoading(false);
      }, 300);
    }
  }, [open]);

  const switchTab = (t: Tab) => {
    setTab(t);
    setSignInMode("password");
    setError("");
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(siLogin, siPassword);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await sendEmailCode(ecEmail);
    setLoading(false);
    if (result.success) {
      setSignInMode("verify-code");
    } else {
      setError(result.error ?? "Failed to send code.");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await verifyEmailCode(ecEmail, ecCode);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? "Invalid or expired code.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register({
      email: rEmail,
      password: rPassword,
      first_name: rFirst,
      last_name: rLast,
      phone: rPhone || undefined,
    });
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? "Registration failed.");
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-maroon-900 focus:bg-white transition-colors";
  const btnCls =
    "w-full py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {/* Header band */}
        <div className="bg-maroon-900 px-6 pt-8 pb-6">
          <div className="flex justify-center mb-3">
            <Image
              src="/universityofmontanamerchstorelogo.png"
              alt="UM Merch Store"
              width={44}
              height={44}
              className="h-11 w-auto"
            />
          </div>
          <DialogTitle className="text-center text-white text-xl font-bold">
            {tab === "signin" ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <p className="text-center text-white/65 text-sm mt-1">
            {tab === "signin"
              ? "Sign in to your UM Merch Store account"
              : "Join the Grizzly community"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => switchTab("signin")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "signin"
                ? "text-maroon-900 border-b-2 border-maroon-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "register"
                ? "text-maroon-900 border-b-2 border-maroon-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* ── Sign In: Password ── */}
          {tab === "signin" && signInMode === "password" && (
            <form onSubmit={handlePasswordSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={siLogin}
                  onChange={(e) => setSiLogin(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={siPassword}
                  onChange={(e) => setSiPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${btnCls} bg-maroon-900 hover:bg-maroon-800 text-white mt-1`}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                or{" "}
                <button
                  type="button"
                  onClick={() => { setSignInMode("email-code"); setError(""); }}
                  className="text-copper-600 hover:text-copper-700 font-medium"
                >
                  sign in with email code
                </button>
              </p>
            </form>
          )}

          {/* ── Sign In: Email Code — Step 1 ── */}
          {tab === "signin" && signInMode === "email-code" && (
            <form onSubmit={handleSendCode} className="space-y-3">
              <p className="text-sm text-gray-500 mb-1">
                Enter your email and we&apos;ll send you a 4-digit login code.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={ecEmail}
                  onChange={(e) => setEcEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${btnCls} bg-maroon-900 hover:bg-maroon-800 text-white mt-1`}
              >
                {loading ? "Sending…" : "Send Code"}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                <button
                  type="button"
                  onClick={() => { setSignInMode("password"); setError(""); }}
                  className="text-copper-600 hover:text-copper-700 font-medium"
                >
                  Back to password login
                </button>
              </p>
            </form>
          )}

          {/* ── Sign In: Email Code — Step 2 ── */}
          {tab === "signin" && signInMode === "verify-code" && (
            <form onSubmit={handleVerifyCode} className="space-y-3">
              <p className="text-sm text-gray-500 mb-1">
                We sent a 4-digit code to <strong>{ecEmail}</strong>. It expires in 15 minutes.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Login Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={ecCode}
                  onChange={(e) => setEcCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  className={`${inputCls} text-center tracking-[0.5em] text-lg font-bold`}
                />
              </div>
              <button
                type="submit"
                disabled={loading || ecCode.length !== 4}
                className={`${btnCls} bg-maroon-900 hover:bg-maroon-800 text-white mt-1`}
              >
                {loading ? "Verifying…" : "Verify Code"}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                Didn&apos;t get it?{" "}
                <button
                  type="button"
                  onClick={() => { setSignInMode("email-code"); setError(""); setEcCode(""); }}
                  className="text-copper-600 hover:text-copper-700 font-medium"
                >
                  Resend code
                </button>
              </p>
            </form>
          )}

          {/* ── Register ── */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    autoComplete="given-name"
                    required
                    value={rFirst}
                    onChange={(e) => setRFirst(e.target.value)}
                    placeholder="Jane"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    required
                    value={rLast}
                    onChange={(e) => setRLast(e.target.value)}
                    placeholder="Grizzly"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={rEmail}
                  onChange={(e) => setREmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={rPassword}
                  onChange={(e) => setRPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={rPhone}
                  onChange={(e) => setRPhone(e.target.value)}
                  placeholder="406-000-0000"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${btnCls} bg-maroon-900 hover:bg-maroon-800 text-white mt-1`}
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
