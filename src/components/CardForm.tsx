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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="section-title"><span>{children}</span></div>;
}

export default function CardForm({ params, suits, loading, onChange, onExport }: Props) {
  const hasValueSuit = params.card_type <= 2;

  return (
    <div className="wood-panel rounded shrink-0 flex flex-col gap-0 p-4" style={{ width: "288px" }}>

      {/* Card type */}
      <SectionTitle>Card Type</SectionTitle>
      <div className="flex flex-col gap-0.5">
        {CARD_TYPES.map((t) => (
          <label key={t.id} className={`card-type-row ${params.card_type === t.id ? "active" : ""}`}>
            <input
              type="radio"
              name="card_type"
              checked={params.card_type === t.id}
              onChange={() => onChange({ card_type: t.id })}
            />
            {t.label}
          </label>
        ))}
      </div>

      {/* Value + Suit */}
      <div style={hasValueSuit ? {} : { opacity: 0.35, pointerEvents: "none" }}>
        <SectionTitle>Value &amp; Suit</SectionTitle>
        <div className="flex gap-3 items-center">
          <select
            value={params.card_value}
            onChange={(e) => onChange({ card_value: e.target.value })}
            disabled={!hasValueSuit}
            className="w-input w-input"
            style={{ width: "90px" }}
          >
            {CARD_VALUES.map((v) => <option key={v} value={v} style={{ background: "#1a0d06" }}>{v}</option>)}
          </select>
          <div className="flex gap-2">
            {suits.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ card_suit: s.id as 0 | 1 | 2 | 3 })}
                className={`suit-btn ${params.card_suit === s.id ? "active" : ""}`}
              >
                <img src={s.src} alt={`suit-${s.id}`} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text fields */}
      <SectionTitle>Card Text</SectionTitle>
      <div className="flex flex-col gap-2.5">
        <div>
          <p style={{ fontFamily: '"Rye", cursive', fontSize: "9px", color: "#7a5820", letterSpacing: "0.15em", marginBottom: "5px" }}>TITLE</p>
          <input className="w-input" value={params.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Bang" />
        </div>
        <div>
          <p style={{ fontFamily: '"Rye", cursive', fontSize: "9px", color: "#7a5820", letterSpacing: "0.15em", marginBottom: "5px" }}>
            SUBTITLE <span style={{ color: "#4a3010", textTransform: "none", fontFamily: '"Lora", serif', fontSize: "9px" }}>(optional)</span>
          </p>
          <input className="w-input" value={params.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} placeholder="e.g. Quick Draw" />
        </div>
        <div>
          <p style={{ fontFamily: '"Rye", cursive', fontSize: "9px", color: "#7a5820", letterSpacing: "0.15em", marginBottom: "5px" }}>
            AUTHOR <span style={{ color: "#4a3010", textTransform: "none", fontFamily: '"Lora", serif', fontSize: "9px" }}>(optional)</span>
          </p>
          <input className="w-input" value={params.author} onChange={(e) => onChange({ author: e.target.value })} placeholder="Your name" />
        </div>
        <div>
          <p style={{ fontFamily: '"Rye", cursive', fontSize: "9px", color: "#7a5820", letterSpacing: "0.15em", marginBottom: "5px" }}>DESCRIPTION</p>
          <textarea
            className="w-input"
            rows={4}
            style={{ resize: "none" }}
            value={params.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Card ability text…"
          />
        </div>
      </div>

      {/* Artwork */}
      <SectionTitle>Artwork</SectionTitle>
      <div className="flex flex-col gap-2">
        <FileDropZone label="Main Artwork" value={params.art} onChange={(f) => onChange({ art: f })} />
        <FileDropZone label="Expansion Art" optional value={params.expansion_art} onChange={(f) => onChange({ expansion_art: f })} />
      </div>

      {/* Card back */}
      <SectionTitle>Card Back</SectionTitle>
      <div className="flex gap-2">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange({ back_card: v })}
            className={`toggle-btn ${params.back_card === v ? "active" : ""}`}
          >
            {v ? "Include" : "Exclude"}
          </button>
        ))}
      </div>

      {/* Export */}
      <div style={{ marginTop: "20px" }}>
        <button type="button" disabled={loading} onClick={onExport} className="btn-draw">
          {loading ? "⟳  Rendering…" : "✦  Draw Your Cards  ✦"}
        </button>
      </div>

    </div>
  );
}
