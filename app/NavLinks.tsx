"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

const NAV = [
  { href: "/",      label: "Add-ons",   icon: LayoutDashboard },
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

    </ul>
  );
}
