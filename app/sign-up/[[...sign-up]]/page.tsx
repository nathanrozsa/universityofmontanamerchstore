"use client";

import { useState, useCallback } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: createError } = await signUp.create({ emailAddress: email, password });
    if (createError) {
      setError(createError.longMessage ?? createError.message ?? "Something went wrong.");
      setLoading(false);
      return;
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.longMessage ?? sendError.message ?? "Failed to send verification code.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setPendingVerification(true);
  }, [signUp, email, password]);

  const handleVerification = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) {
      setError(verifyError.longMessage ?? verifyError.message ?? "Invalid code. Please try again.");
      setLoading(false);
      return;
    }
    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      setError(finalizeError.longMessage ?? finalizeError.message ?? "Something went wrong.");
      setLoading(false);
      return;
    }
    router.push("/");
  }, [signUp, code, router]);

  return (
    <div className="min-h-screen bg-maroon-950 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-maroon-800/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {!pendingVerification ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Create account</h1>
              <p className="text-white/60 text-sm text-center mb-8">Join the Griz community</p>

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

                <div id="clerk-captcha" />

                <button
                  type="submit"
                  disabled={loading || fetchStatus === "fetching"}
                  className="w-full bg-copper-600 hover:bg-copper-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.01]"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>

              <p className="text-center text-white/50 text-sm mt-6">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-copper-400 hover:text-copper-300 font-medium">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Check your email</h1>
              <p className="text-white/60 text-sm text-center mb-8">
                We sent a verification code to{" "}
                <span className="text-white/80">{email}</span>
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerification} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="Enter code"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-copper-500 focus:ring-1 focus:ring-copper-500 transition-colors text-center tracking-widest text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || fetchStatus === "fetching"}
                  className="w-full bg-copper-600 hover:bg-copper-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.01]"
                >
                  {loading ? "Verifying…" : "Verify Email"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
