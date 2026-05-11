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
      className={`drop-zone ${dragging ? "dragging" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={handleChange} />

      <p style={{ fontFamily: '"Rye", cursive', fontSize: "9px", color: "#7a5820", letterSpacing: "0.15em", marginBottom: "4px" }}>
        {label.toUpperCase()}
        {optional && <span style={{ fontFamily: '"Lora", serif', color: "#4a3010", letterSpacing: 0, textTransform: "none" }}> (optional)</span>}
      </p>

      {value ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "2px" }}>
          <span style={{ color: "#c8860c", fontSize: "12px", fontFamily: '"Lora", serif', maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value.name}
          </span>
          <button
            type="button"
            style={{ color: "#5a3010", fontSize: "11px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
          >
            ✕
          </button>
        </div>
      ) : (
        <p style={{ color: "#3a2410", fontSize: "11px", fontFamily: '"Lora", serif', fontStyle: "italic", marginTop: "2px" }}>
          Drop here or click to browse
        </p>
      )}
    </div>
  );
}
