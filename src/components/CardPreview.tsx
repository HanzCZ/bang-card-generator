interface Props {
  src: string | null;
  loading: boolean;
  error: string | null;
}

export default function CardPreview({ src, loading, error }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white/[0.02] rounded-2xl border border-white/5 p-6">
      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mb-4 max-w-sm text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 text-white/40">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-sm">Rendering card…</span>
        </div>
      )}

      {!loading && src && (
        <img
          src={src}
          alt="Card preview"
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl shadow-black/60 transition-opacity duration-200"
        />
      )}

      {!loading && !src && !error && (
        <p className="text-white/20 text-sm">Preview will appear here</p>
      )}
    </div>
  );
}
