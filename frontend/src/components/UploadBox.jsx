import React, { useMemo, useRef, useState } from "react";

function humanBytes(bytes) {
  if (!bytes && bytes !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let idx = 0;
  while (size >= 1024 && idx < units.length - 1) {
    size /= 1024;
    idx += 1;
  }
  return `${size.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export default function UploadBox({ files, setFiles }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const totalSize = useMemo(() => files.reduce((acc, f) => acc + (f.size || 0), 0), [files]);

  const addFiles = (fileList) => {
    const next = Array.from(fileList || []).filter((f) => f && f.size >= 0);
    if (next.length === 0) return;
    setFiles((prev) => {
      const merged = [...prev];
      for (const f of next) {
        if (!merged.some((x) => x.name === f.name && x.size === f.size)) merged.push(f);
      }
      return merged;
    });
  };

  return (
    <div
      className={[
        "rounded-2xl border bg-panel p-4 shadow-glow transition",
        dragging ? "border-cyan-300/60" : "border-stroke",
      ].join(" ")}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Upload files</div>
          <div className="text-xs text-white/60">Drag & drop or select files to scan.</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
          onClick={() => inputRef.current?.click()}
        >
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
        <span>{files.length} file(s) selected</span>
        <span>{humanBytes(totalSize)}</span>
      </div>

      {files.length > 0 && (
        <div className="orion-scrollbar mt-3 max-h-28 space-y-2 overflow-auto pr-1">
          {files.map((f) => (
            <div key={`${f.name}:${f.size}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white/90">{f.name}</div>
                <div className="text-[11px] text-white/60">{humanBytes(f.size)}</div>
              </div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10"
                onClick={() => setFiles((prev) => prev.filter((x) => !(x.name === f.name && x.size === f.size)))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

