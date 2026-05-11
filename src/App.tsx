import { useCallback, useEffect, useRef, useState } from "react";
import CardForm from "./components/CardForm";
import CardPreview from "./components/CardPreview";
import type { CardParams, CardType } from "./types";
import { exportCard, fetchPreview, SUIT_LIST } from "./api";

const DEFAULT_PARAMS: CardParams = {
  card_type: 0 as CardType,
  card_value: "Random",
  card_suit: 0,
  title: "Bang",
  subtitle: "",
  author: "",
  description: "Choose a player within range. That player loses 1 life point.",
  back_card: true,
  art: null,
  expansion_art: null,
};

export default function App() {
  const [params, setParams] = useState<CardParams>(DEFAULT_PARAMS);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback((p: CardParams) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        setPreviewSrc(await fetchPreview(p));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Chyba při generování");
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  function handleChange(patch: Partial<CardParams>) {
    const next = { ...params, ...patch };
    setParams(next);
    refresh(next);
  }

  useEffect(() => { refresh(DEFAULT_PARAMS); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleExport() {
    setLoading(true);
    try {
      await exportCard(params);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export selhal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header ── */}
      <header className="relative" style={{ background: "#120a03" }}>
        <div className="gold-line" />
        <div className="px-8 py-5 flex items-center gap-4">
          <span className="sheriff-star">✦</span>
          <div>
            <h1 style={{ fontFamily: '"Rye", cursive', color: "#f0b030", fontSize: "22px", lineHeight: 1, margin: 0, letterSpacing: "0.06em" }}>
              Bang! Card Generator
            </h1>
            <p style={{ fontFamily: '"Lora", serif', color: "#6a5030", fontSize: "11px", marginTop: "4px", fontStyle: "italic" }}>
              Custom card creator for the Wild West
            </p>
          </div>
          <div className="ml-auto" style={{ fontFamily: '"Rye", cursive', color: "#4a3018", fontSize: "11px", letterSpacing: "0.1em" }}>
            Est. 1865
          </div>
        </div>
        <div className="gold-line" />
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex gap-6 p-6 overflow-auto">
        <CardForm
          params={params}
          suits={SUIT_LIST}
          loading={loading}
          onChange={handleChange}
          onExport={handleExport}
        />
        <CardPreview src={previewSrc} loading={loading} error={error} />
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #2a1608", padding: "10px 32px", textAlign: "center" }}>
        <span style={{ fontFamily: '"Rye", cursive', color: "#3a2510", fontSize: "10px", letterSpacing: "0.15em" }}>
          ✦ Fan-made tool — Bang! is a trademark of its respective owners ✦
        </span>
      </footer>
    </div>
  );
}
