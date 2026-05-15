"use client";

// app/(admin)/page.tsx — Add-ons Manager Dashboard
import { useState, useEffect, useRef } from "react";
import {
  RefreshCw, Upload, Trash2, CheckCircle2, XCircle,
  ImageIcon, ChevronUp, ChevronDown, Copy, Check,
} from "lucide-react";

const CF = { fontFamily: "'CabinetGrotesk', Impact, sans-serif" };
const MF = { fontFamily: "Manrope, Arial, sans-serif" };

interface Addon {
  id: string; order: number; active: boolean; item_name: string;
  addon_name: string; charge_type: string; max_qty: number | null; image_url: string | null;
}

interface ToastMessage {
  id: number;
  message: string;
}

/* ── Toggle switch ───────────────────────────────────────────── */
function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={onChange} disabled={disabled}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 disabled:opacity-50"
      style={{ backgroundColor: checked ? "#568275" : "#F2E8E0", cursor: disabled ? "not-allowed" : "pointer" }}>
      <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: checked ? "translateX(1.375rem)" : "translateX(0.25rem)" }} />
    </button>
  );
}

/* ── Image cell ──────────────────────────────────────────────── */
function ImageCell({ 
  preview, 
  disabled,
  onFileSelect, 
  onRemove
}: { 
  preview: string | null; 
  disabled: boolean;
  onFileSelect: (f: File) => void; 
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview"
            className="w-9 h-9 rounded-lg object-cover shrink-0"
            style={{ border: "1px solid #F2E8E0", opacity: disabled ? 0.5 : 1 }} />
          <div className="flex gap-1">
            <button onClick={() => inputRef.current?.click()} title="Replace" disabled={disabled}
              className="p-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50" style={{ color: "#64748b" }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = "#F2E8E0" }}
              onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = "transparent" }}>
              <Upload size={12} />
            </button>
            <button onClick={onRemove} title="Remove" disabled={disabled}
              className="p-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50" style={{ color: "#94a3b8" }}
              onMouseEnter={e => { if (!disabled) { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#dc2626"; } }}
              onMouseLeave={e => { if (!disabled) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; } }}>
              <Trash2 size={12} />
            </button>
          </div>
        </>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={disabled}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 disabled:opacity-50"
          style={{ ...MF, border: "1px dashed #F2E8E0", color: "#64748b" }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = "#94a3b8"; }}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#F2E8E0")}>
          <ImageIcon size={11} />
          Add image
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" disabled={disabled}
        onChange={e => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = ""; }} />
    </div>
  );
}

/* ── Addon Row ───────────────────────────────────────────────── */
function AddonRow({ addon, index, onSaved, onToggle }: { addon: Addon; index: number; onSaved: () => void; onToggle: () => Promise<void> }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    setImageFile(null);
    setImageRemoved(false);
  }, [addon]);

  const preview = imageFile ? URL.createObjectURL(imageFile) : (imageRemoved ? null : addon.image_url);
  const hasChanges = imageFile !== null || imageRemoved;

  const handleSave = async () => {
    setSaving(true);
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await fetch(`/api/addons/${addon.id}/image`, { method: "POST", body: fd });
      } else if (imageRemoved && addon.image_url) {
        await fetch(`/api/addons/${addon.id}/image`, { method: "DELETE" });
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    setImageFile(null);
    setImageRemoved(false);
  };

  const handleToggleClick = async () => {
    setToggling(true);
    await onToggle();
    setToggling(false);
  };

  return (
    <tr className="transition-colors duration-150" style={{ borderTop: "1px solid #F2E8E0", backgroundColor: index % 2 === 1 ? "rgba(242,232,224,0.2)" : "transparent" }}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1" style={{ color: "#94a3b8" }}>
          <div className="flex flex-col">
            <button className="hover:text-black transition-colors"><ChevronUp size={12} /></button>
            <button className="hover:text-black transition-colors"><ChevronDown size={12} /></button>
          </div>
          <span className="text-xs font-mono" style={{ color: "#94a3b8" }}>{String(addon.order).padStart(2, "0")}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <Toggle checked={addon.active} disabled={saving || toggling} onChange={handleToggleClick} />
      </td>
      <td className="px-5 py-3.5">
        <span className="font-medium whitespace-nowrap" style={{ color: "#000" }}>{addon.item_name}</span>
      </td>
      <td className="px-5 py-3.5">
        {addon.addon_name
          ? <span style={{ color: "#64748b" }}>{addon.addon_name}</span>
          : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>—</span>}
      </td>
      <td className="px-5 py-3.5">
        <ImageCell 
          preview={preview} 
          disabled={saving}
          onFileSelect={(f) => { setImageFile(f); setImageRemoved(false); }} 
          onRemove={() => { setImageFile(null); setImageRemoved(true); }} 
        />
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: "#64748b" }}>{addon.charge_type}</td>
      <td className="px-5 py-3.5" style={{ color: "#94a3b8" }}>{addon.max_qty ?? "N/A"}</td>
      <td className="px-5 py-3.5 whitespace-nowrap">
        {hasChanges ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
            <button onClick={handleSave} disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors duration-200 disabled:opacity-70"
              style={{ backgroundColor: "#568275" }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = "#436b5f"; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = "#568275"; }}>
              {saving ? "Sending..." : "Send"}
            </button>
            <button onClick={handleRevert} disabled={saving}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Revert changes">
              <XCircle size={14} />
            </button>
          </div>
        ) : (
          <div className="w-16"></div>
        )}
      </td>
    </tr>
  );
}

/* ── Copy badge ──────────────────────────────────────────────── */
function CopyBadge({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors duration-200"
      style={{ backgroundColor: copied ? "rgba(86,130,117,0.1)" : "rgba(0,0,0,0.05)", color: copied ? "#568275" : "#64748b" }}>
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {text}
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // Avoid SSR/client hydration mismatch for window.location
  const [origin, setOrigin] = useState("");

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  useEffect(() => { setOrigin(window.location.origin); }, []);

  const fetchAddons = async () => {
    try {
      const res = await fetch("/api/addons");
      const data = await res.json();
      if (data.success) setAddons(data.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggle = async (addon: Addon) => {
    try {
      const res = await fetch(`/api/addons/${addon.id}/toggle`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, active: data.data.active } : a));
        addToast(`Status marked as ${data.data.active ? 'Active' : 'Inactive'}.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchAddons(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchAddons(); };

  const activeCount = addons.filter(a => a.active).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6" style={MF}>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="animate-fade-in-up flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg pointer-events-auto"
            style={{ backgroundColor: "#FBF8F6", border: "1px solid #F2E8E0" }}>
            <CheckCircle2 size={16} color="#568275" />
            <span className="text-sm font-medium" style={{ color: "#2f5069", ...MF }}>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="animate-fade-in-up">
        <p className="label-caps mb-1">Cloudbeds Integration</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={CF}>Add-ons Manager</h1>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              Control which add-ons appear on your booking website and upload their images.
            </p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-colors duration-200"
            style={{ border: "1px solid #F2E8E0", color: "#64748b", backgroundColor: "#FBF8F6" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F2E8E0")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FBF8F6")}>
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        {[
          { label: "Total Add-ons",  val: addons.length, bg: "#FBF8F6", border: "1px solid #F2E8E0", color: "#000" },
          { label: "Active",         val: activeCount,   bg: "rgba(86,130,117,0.07)", border: "1px solid rgba(86,130,117,0.2)", color: "#568275" },
          { label: "Inactive",       val: addons.length - activeCount, bg: "rgba(242,232,224,0.8)", border: "1px solid #F2E8E0", color: "#64748b" },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center py-4 rounded-xl"
            style={{ backgroundColor: s.bg, border: s.border }}>
            <span className="text-2xl font-bold" style={{ ...CF, color: s.color }}>{s.val}</span>
            <span className="label-caps mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* API quick-reference */}
      <div className="p-4 rounded-xl animate-fade-in-up" style={{ backgroundColor: "rgba(47,80,105,0.04)", border: "1px solid rgba(47,80,105,0.12)", animationDelay: "90ms" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#2f5069", ...MF }}>📡 Public API — callable from your booking website</p>
        <div className="flex flex-wrap gap-2">
          <CopyBadge text={`${origin}/api/addons`} />
          <CopyBadge text={`${origin}/api/addons?active=1`} />
        </div>
        <p className="text-xs mt-2" style={{ color: "#64748b", ...MF }}>
          Returns JSON · <span className="font-semibold">CORS: *</span> · No authentication required
        </p>
      </div>

      {/* Table */}
      <section className="rounded-xl overflow-hidden animate-fade-in-up" style={{ border: "1px solid #F2E8E0", backgroundColor: "#FBF8F6", animationDelay: "120ms" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #F2E8E0" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ ...CF, color: "#000" }}>Items</h2>
            <p className="label-caps mt-0.5">Toggle active status · upload images</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(86,130,117,0.10)", color: "#568275", ...MF }}>
              <CheckCircle2 size={11} />{activeCount} active
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(242,232,224,0.8)", color: "#64748b", border: "1px solid #F2E8E0", ...MF }}>
              <XCircle size={11} />{addons.length - activeCount} inactive
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={MF}>
            <thead>
              <tr style={{ backgroundColor: "rgba(242,232,224,0.5)" }}>
                {["Order", "Status", "Cloudbeds Item", "Category", "Image", "Type", "Price", ""].map((c, idx) => (
                  <th key={idx} scope="col" className="px-5 py-3 text-left whitespace-nowrap label-caps">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #F2E8E0" }}>
                      {[60, 40, 160, 140, 80, 120, 40, 80].map((w, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-3 rounded skeleton" style={{ width: w }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : addons.map((addon, i) => (
                    <AddonRow key={addon.id} addon={addon} index={i} onSaved={fetchAddons} onToggle={() => handleToggle(addon)} />
                  ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #F2E8E0" }}>
          <p className="label-caps">
            <span style={{ color: "#64748b", fontWeight: 600 }}>{addons.length}</span> items from Cloudbeds
          </p>
          <p className="text-xs" style={{ color: "#94a3b8", ...MF }}>
            Make changes and click Send to apply them
          </p>
        </div>
      </section>
    </div>
  );
}

