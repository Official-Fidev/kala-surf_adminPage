"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors duration-200"
      style={{ fontFamily: "Manrope, Arial, sans-serif", color: "#94a3b8" }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#F2E8E0"; e.currentTarget.style.color = "#000"; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
    >
      <LogOut size={14} strokeWidth={1.75} />
      <span style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em" }}>
        Sign Out
      </span>
    </button>
  );
}
