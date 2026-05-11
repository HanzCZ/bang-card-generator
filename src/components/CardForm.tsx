import type { CardParams } from "../types";
import { CARD_TYPES, CARD_VALUES } from "../types";
import type { SuitData } from "../api";

import FileDropZone from "./FileDropZone";

interface Props {
  params: CardParams;
  suits: SuitData[];
  loading: boolean;
  onChange: (p: Partial<CardParams>) => void;
  onExport: () => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5">{children}</p>;
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/60 transition-colors"
    />
  );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
    />
  );
}

export default function CardForm({ params, suits, loading, onChange, onExport }: Props) {
  const hasValueSuit = params.card_type <= 2;

  return (
    <div className="flex flex-col gap-5 w-72 shrink-0">
      {/* Card Type */}
      <div>
        <Label>Card Type</Label>
        <div className="flex flex-col gap-1">
          {CARD_TYPES.map((t) => (
            <label
              key={t.id}
              className={`flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors ${
                params.card_type === t.id
                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                  : "text-white/60 hover:bg-white/5 border border-transparent"
              }`}
            >
              <input
                type="radio"
                className="accent-amber-400"
                checked={params.card_type === t.id}
                onChange={() => onChange({ card_type: t.id })}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Value + Suit */}
      <div className={hasValueSuit ? "" : "opacity-40 pointer-events-none"}>
        <Label>Card Value</Label>
        <select
          value={params.card_value}
          onChange={(e) => onChange({ card_value: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/60 transition-colors"
          disabled={!hasValueSuit}
        >
          {CARD_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>

        <Label>Suit</Label>
        <div className="flex gap-3 mt-1">
          {suits.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ card_suit: s.id as 0 | 1 | 2 | 3 })}
              className={`p-1.5 rounded-lg border-2 transition-all ${
                params.card_suit === s.id
                  ? "border-amber-400 bg-amber-400/15 scale-110"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={s.src} alt={`suit-${s.id}`} className="w-7 h-7 object-contain" />
            </button>
          ))}
        </div>
      </div>

      {/* Text Fields */}
      <div className="flex flex-col gap-3">
        <div>
          <Label>Title</Label>
          <Input value={params.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Bang" />
        </div>
        <div>
          <Label>Subtitle <span className="normal-case text-white/30">(optional)</span></Label>
          <Input value={params.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} placeholder="Subtitle" />
        </div>
        <div>
          <Label>Author <span className="normal-case text-white/30">(optional)</span></Label>
          <Input value={params.author} onChange={(e) => onChange({ author: e.target.value })} placeholder="Author" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            rows={5}
            value={params.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Card ability description…"
          />
        </div>
      </div>

      {/* Artwork */}
      <div className="flex flex-col gap-3">
        <FileDropZone label="Main Artwork" value={params.art} onChange={(f) => onChange({ art: f })} />
        <FileDropZone label="Expansion Art" optional value={params.expansion_art} onChange={(f) => onChange({ expansion_art: f })} />
      </div>

      {/* Back Card Toggle */}
      <div>
        <Label>Card Back</Label>
        <div className="flex gap-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => onChange({ back_card: v })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                params.back_card === v
                  ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                  : "border-white/10 text-white/40 hover:border-white/20"
              }`}
            >
              {v ? "Include" : "Exclude"}
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <button
        type="button"
        disabled={loading}
        onClick={onExport}
        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm transition-colors"
      >
        {loading ? "Generating…" : "Export Card (PNG)"}
      </button>
    </div>
  );
}
