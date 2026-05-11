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
      <header className="border-b border-white/10 px-8 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold text-sm">B!</div>
        <h1 className="text-lg font-semibold text-white tracking-tight">Bang! Card Generator</h1>
        <span className="ml-auto text-xs text-white/25">v2</span>
      </header>

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
    </div>
  );
}
