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
      data-state={checked ? 'checked' : 'unchecked'}
      className="group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-surface-container-high"
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
      <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 group-data-[state=checked]:translate-x-[1.375rem] group-data-[state=unchecked]:translate-x-[0.25rem]" />
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
            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-surface-container-high"
            style={{ opacity: disabled ? 0.5 : 1 }} />
          <div className="flex gap-1">
            <button onClick={() => inputRef.current?.click()} title="Replace" disabled={disabled}
              className="p-1.5 rounded-lg text-on-secondary-container transition-colors duration-200 disabled:opacity-50 hover:bg-surface-container-high">
              <Upload size={12} />
            </button>
            <button onClick={onRemove} title="Remove" disabled={disabled}
              className="p-1.5 rounded-lg text-outline transition-colors duration-200 disabled:opacity-50 hover:bg-error/10 hover:text-error">
              <Trash2 size={12} />
            </button>
          </div>
        </>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={disabled}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 disabled:opacity-50 border-dashed border-surface-container-high text-on-secondary-container hover:border-outline"
          style={MF}>
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
    <tr className="transition-colors duration-150 border-t border-surface-container-high even:bg-surface-container/50">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 text-outline">
          <div className="flex flex-col">
            <button className="hover:text-foreground transition-colors"><ChevronUp size={12} /></button>
            <button className="hover:text-foreground transition-colors"><ChevronDown size={12} /></button>
          </div>
          <span className="text-xs font-mono text-outline">{String(addon.order).padStart(2, "0")}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <Toggle checked={addon.active} disabled={saving || toggling} onChange={handleToggleClick} />
      </td>
      <td className="px-5 py-3.5">
        <span className="font-medium whitespace-nowrap text-foreground">{addon.item_name}</span>
      </td>
      <td className="px-5 py-3.5">
        {addon.addon_name
          ? <span className="text-on-secondary-container">{addon.addon_name}</span>
          : <span className="text-outline italic">—</span>}
      </td>
      <td className="px-5 py-3.5">
        <ImageCell 
          preview={preview} 
          disabled={saving}
          onFileSelect={(f) => { setImageFile(f); setImageRemoved(false); }} 
          onRemove={() => { setImageFile(null); setImageRemoved(true); }} 
        />
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap text-on-secondary-container">{addon.charge_type}</td>
      <td className="px-5 py-3.5 text-outline">{addon.max_qty ?? "N/A"}</td>
      <td className="px-5 py-3.5 whitespace-nowrap">
        {hasChanges ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
            <button onClick={handleSave} disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-primary transition-colors duration-200 disabled:opacity-70 bg-primary hover:bg-primary/90">
              {saving ? "Sending..." : "Send"}
            </button>
            <button onClick={handleRevert} disabled={saving}
              className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors disabled:opacity-50"
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
      data-state={copied ? 'copied' : 'default'}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors duration-200 data-[state=copied]:bg-primary/10 data-[state=copied]:text-primary data-[state=default]:bg-foreground/5 data-[state=default]:text-on-secondary-container">
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
          <div key={t.id} className="animate-fade-in-up flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg pointer-events-auto bg-surface border border-surface-container-high">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary-container" style={MF}>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="animate-fade-in-up">
        <p className="label-caps mb-1">Cloudbeds Integration</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={CF}>Add-ons Manager</h1>
            <p className="mt-1 text-sm text-on-secondary-container">
              Control which add-ons appear on your booking website and upload their images.
            </p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0 transition-colors duration-200 border border-surface-container-high text-on-secondary-container bg-surface hover:bg-surface-container-high">
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="flex flex-col items-center py-4 rounded-xl bg-surface border border-surface-container-high">
          <span className="text-2xl font-bold text-foreground" style={CF}>{addons.length}</span>
          <span className="label-caps mt-0.5">Total Add-ons</span>
        </div>
        <div className="flex flex-col items-center py-4 rounded-xl bg-primary/5 border border-primary/20">
          <span className="text-2xl font-bold text-primary" style={CF}>{activeCount}</span>
          <span className="label-caps mt-0.5">Active</span>
        </div>
        <div className="flex flex-col items-center py-4 rounded-xl bg-surface-container border border-surface-container-high">
          <span className="text-2xl font-bold text-on-secondary-container" style={CF}>{addons.length - activeCount}</span>
          <span className="label-caps mt-0.5">Inactive</span>
        </div>
      </div>

      {/* API quick-reference */}
      <div className="p-4 rounded-xl animate-fade-in-up bg-primary-container/5 border border-primary-container/10" style={{ animationDelay: "90ms" }}>
        <p className="text-xs font-semibold mb-2 text-primary-container" style={MF}>📡 Public API — callable from your booking website</p>
        <div className="flex flex-wrap gap-2">
          <CopyBadge text={`${origin}/api/addons`} />
          <CopyBadge text={`${origin}/api/addons?active=1`} />
        </div>
        <p className="text-xs mt-2 text-on-secondary-container" style={MF}>
          Returns JSON · <span className="font-semibold">CORS: *</span> · No authentication required
        </p>
      </div>

      {/* Table */}
      <section className="rounded-xl overflow-hidden animate-fade-in-up border border-surface-container-high bg-surface" style={{ animationDelay: "120ms" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-container-high">
          <div>
            <h2 className="font-bold text-lg text-foreground" style={CF}>Items</h2>
            <p className="label-caps mt-0.5">Toggle active status · upload images</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary" style={MF}>
              <CheckCircle2 size={11} />{activeCount} active
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-surface-container text-on-secondary-container border border-surface-container-high" style={MF}>
              <XCircle size={11} />{addons.length - activeCount} inactive
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={MF}>
            <thead>
              <tr className="bg-surface-container/50">
                {["Order", "Status", "Cloudbeds Item", "Category", "Image", "Type", "Price", ""].map((c, idx) => (
                  <th key={idx} scope="col" className="px-5 py-3 text-left whitespace-nowrap label-caps">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i} className="border-t border-surface-container-high">
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

        <div className="px-6 py-4 flex items-center justify-between border-t border-surface-container-high">
          <p className="label-caps">
            <span className="text-on-secondary-container font-semibold">{addons.length}</span> items from Cloudbeds
          </p>
          <p className="text-xs text-outline" style={MF}>
            Make changes and click Send to apply them
          </p>
        </div>
      </section>
    </div>
  );
}

