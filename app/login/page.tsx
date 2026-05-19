"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Waves, Eye, EyeOff, Lock, User } from "lucide-react";

const CF = { fontFamily: "'CabinetGrotesk', Impact, sans-serif" };
const MF = { fontFamily: "Manrope, Arial, sans-serif" };

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBF8F6" }}>
      <div className="w-full max-w-sm px-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/logo.svg" alt="Kala Surf" className="w-16 h-16 rounded-xl object-contain mb-4" />
          <h1 className="text-2xl font-bold" style={{ ...CF, color: "#000" }}>Kala Admin</h1>
          <p className="mt-1 text-sm" style={{ ...MF, color: "#94a3b8" }}>Sign in to manage your add-ons</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-semibold mb-1.5" style={{ ...MF, color: "#64748b" }}>
              Username
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#94a3b8" }} />
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-shadow"
                style={{ backgroundColor: "#fff", border: "1px solid #F2E8E0", ...MF, color: "#000" }}
                onFocus={e => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(227,165,100,0.3)")}
                onBlur={e => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold mb-1.5" style={{ ...MF, color: "#64748b" }}>
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#94a3b8" }} />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition-shadow"
                style={{ backgroundColor: "#fff", border: "1px solid #F2E8E0", ...MF, color: "#000" }}
                onFocus={e => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(227,165,100,0.3)")}
                onBlur={e => (e.currentTarget.style.boxShadow = "none")}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#94a3b8" }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs py-2.5 px-3 rounded-lg" style={{ ...MF, color: "#dc2626", backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ ...MF, backgroundColor: loading ? "#F2E8E0" : "#000", color: loading ? "#94a3b8" : "#FBF8F6" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Dev hint */}
        <p className="mt-8 text-center text-[11px]" style={{ ...MF, color: "#94a3b8" }}>
          Default: <span style={{ color: "#64748b" }}>admin / kalasurf2024</span>
        </p>
      </div>
    </div>
  );
}
