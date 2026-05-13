"use client";

// app/TopHeader.tsx
// Design spec: sticky, backdrop-blur-md, bg-[#FBF8F6]/80, border-b border-[#F2E8E0]
// Glassmorphism is always-on (slight opacity), deepens on scroll.

import { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";

export default function TopHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    const onScroll = () => setScrolled(main.scrollTop > 8);
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className="flex items-center justify-between shrink-0 transition-all duration-300 ease-out"
      style={{
        height: "64px",
        paddingLeft: "clamp(1.5rem, 3vw, 3rem)",
        paddingRight: "clamp(1.5rem, 3vw, 3rem)",
        // Spec: bg-[#FBF8F6]/80 + backdrop-blur-md + border-b border-[#F2E8E0]
        backgroundColor: scrolled
          ? "rgba(251, 248, 246, 0.80)"
          : "rgba(251, 248, 246, 0.95)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        borderBottom: "1px solid #F2E8E0",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* ── Search ────────────────────────────────────────────── */}
      <div className="relative w-52 md:w-72">
        <label htmlFor="global-search" className="sr-only">
          Search bookings and students
        </label>
        <Search
          size={13}
          strokeWidth={2}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#94a3b8" }}
        />
        <input
          id="global-search"
          type="search"
          placeholder="Search…"
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm transition-shadow duration-200 focus:outline-none"
          style={{
            backgroundColor: "#FBF8F6",
            border: "1px solid #F2E8E0",
            fontFamily: "Manrope, Arial, sans-serif",
            color: "#000000",
          }}
          onFocus={e => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(227,165,100,0.35)")}
          onBlur={e => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>

      {/* ── Right cluster ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          aria-label="View notifications"
          className="relative p-2 rounded-lg transition-colors duration-300"
          style={{ color: "#64748b" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0EAE4")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Bell size={17} strokeWidth={1.75} aria-hidden="true" />
          <span
            aria-label="Unread notifications"
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#E3A564", boxShadow: "0 0 0 2px #FBF8F6" }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5" style={{ backgroundColor: "#F2E8E0" }} aria-hidden="true" />

        {/* Avatar + user */}
        <button
          aria-label="Open user menu"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors duration-300"
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F0EAE4")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {/* Avatar — uses accent gold ring matching the spec's gold accent */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "#000000",
              color: "#FBF8F6",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "CabinetGrotesk, Impact, sans-serif",
              boxShadow: "0 0 0 2px rgba(227,165,100,0.4)",
            }}
            aria-hidden="true"
          >
            KS
          </div>

          <div className="hidden md:block text-left">
            <p
              className="leading-none"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "CabinetGrotesk, Impact, sans-serif",
                color: "#000000",
              }}
            >
              Kai Nakamura
            </p>
            <p
              className="mt-0.5"
              style={{
                fontSize: "10px",
                fontFamily: "Manrope, Arial, sans-serif",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Admin
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
