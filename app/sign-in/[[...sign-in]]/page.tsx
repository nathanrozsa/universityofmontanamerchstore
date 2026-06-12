"use client";

import { useState, useCallback } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else if (result.status === "needs_second_factor") {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
        setShowMFA(true);
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { code: string; message: string }[] };
      const code = clerkErr.errors?.[0]?.code;
      if (code === "form_identifier_not_found") {
        setError("No account found with that email address.");
      } else if (code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(clerkErr.errors?.[0]?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signIn, setActive, email, password, router]);

  const handleMFA = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: mfaCode,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr.errors?.[0]?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signIn, setActive, mfaCode, router]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-maroon-950 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-maroon-800/80 border border-white/10 rounded-2xl p-8 shadow-2xl">

          {!showMFA ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Welcome back</h1>
              <p className="text-white/60 text-sm text-center mb-8">Sign in to your account</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-copper-500 focus:ring-1 focus:ring-copper-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-copper-500 focus:ring-1 focus:ring-copper-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="w-full bg-copper-600 hover:bg-copper-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.01]"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="text-center text-white/50 text-sm mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-copper-400 hover:text-copper-300 font-medium">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Check your email</h1>
              <p className="text-white/60 text-sm text-center mb-8">
                We sent a verification code to{" "}
                <span className="text-white">{email}</span>
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleMFA} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Verification Code</label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    required
                    placeholder="Enter code"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-copper-500 focus:ring-1 focus:ring-copper-500 transition-colors text-center tracking-widest text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="w-full bg-copper-600 hover:bg-copper-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.01]"
                >
                  {loading ? "Verifying…" : "Verify Code"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setShowMFA(false); setError(""); setMfaCode(""); }}
                className="mt-4 w-full text-center text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                ← Back to sign in
                </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
