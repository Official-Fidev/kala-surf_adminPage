"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Code2 } from "lucide-react";

const NAV = [
  { href: "/",      label: "Add-ons",   icon: LayoutDashboard },
  { href: "/api-docs", label: "API Docs", icon: Code2 },
];

const NF = { fontFamily: "'Noto Serif', Georgia, serif" };
const MF = { fontFamily: "Manrope, Arial, sans-serif" };

export default function NavLinks() {
  const path = usePathname();

  return (
    <ul className="space-y-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = path === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200"
              style={{
                borderLeft: active ? "2px solid #000" : "2px solid transparent",
                backgroundColor: active ? "rgba(0,0,0,0.04)" : "transparent",
                color: active ? "#000" : "#64748b",
                paddingLeft: active ? "10px" : "12px",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F2E8E0"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.75} />
              <span style={{ ...NF, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: active ? 700 : 400, fontStyle: active ? "italic" : "normal" }}>
                {label}
              </span>
            </Link>
          </li>
        );
      })}

      {/* Section label */}
      <li className="pt-5 pb-1 px-3">
        <span style={{ ...MF, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#94a3b8" }}>API</span>
      </li>
      <li>
        <div className="px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(242,232,224,0.6)", border: "1px solid #F2E8E0" }}>
          <p style={{ ...MF, fontSize: "10px", color: "#64748b", lineHeight: 1.6 }}>
            <span className="font-semibold block" style={{ color: "#000" }}>GET /api/addons</span>
            Public · No auth required
          </p>
          <p className="mt-2" style={{ ...MF, fontSize: "10px", color: "#64748b", lineHeight: 1.6 }}>
            <span className="font-semibold block" style={{ color: "#000" }}>?active=1</span>
            Filter active only
          </p>
        </div>
      </li>
    </ul>
  );
}
