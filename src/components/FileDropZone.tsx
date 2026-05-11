import { useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";

interface Props {
  label: string;
  optional?: boolean;
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function FileDropZone({ label, optional, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) onChange(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
        dragging ? "border-amber-400 bg-amber-400/10" : "border-white/20 hover:border-white/40"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleChange}
      />
      <p className="text-sm font-medium text-white/70 mb-1">
        {label} {optional && <span className="text-white/40">(optional)</span>}
      </p>
      {value ? (
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-amber-400 text-sm truncate max-w-[160px]">{value.name}</span>
          <button
            type="button"
            className="text-white/40 hover:text-red-400 text-xs"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
          >
            ✕
          </button>
        </div>
      ) : (
        <p className="text-xs text-white/30 mt-1">Drop image here or click to browse</p>
      )}
    </div>
  );
}
