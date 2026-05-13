// app/(admin)/layout.tsx — Admin shell: sidebar + sticky header
// This layout wraps all pages under /  (the route group keeps URL clean)
import type { Metadata } from "next";
import NavLinks from "../NavLinks";
import TopHeader from "../TopHeader";

export const metadata: Metadata = {
  title: "Kala Surf — Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#FBF8F6" }}>
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className="w-64 shrink-0 flex flex-col h-screen overflow-y-auto"
        style={{ backgroundColor: "#FBF8F6", borderRight: "1px solid #F2E8E0" }}
      >
        {/* Brand wordmark */}
        <div className="px-6 py-6 shrink-0" style={{ borderBottom: "1px solid #F2E8E0" }}>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "'CabinetGrotesk', Impact, sans-serif", color: "#000" }}
          >
            Kala Admin
          </span>
          <p
            className="mt-0.5"
            style={{ fontFamily: "Manrope, Arial, sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#94a3b8" }}
          >
            Surf School · Bali
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <NavLinks />
        </nav>

        {/* Sign-out at the bottom */}
        <div className="px-4 py-4 shrink-0" style={{ borderTop: "1px solid #F2E8E0" }}>
          {/* Inline async sign-out — rendered server-side, click handled client-side via SignOutButton */}
          <SignOutSection />
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />
        <main
          className="flex-1 overflow-y-auto px-8 py-8"
          id="main-content"
          style={{ backgroundColor: "#FBF8F6" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// Tiny server component that embeds the client SignOutButton
import SignOutButton from "../SignOutButton";

function SignOutSection() {
  return <SignOutButton />;
}
