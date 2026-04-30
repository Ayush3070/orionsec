import React, { useMemo, useRef, useState } from "react";
import { Upload, File, X } from "lucide-react";

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

export default function UploadBox({ files, setFiles, theme = "dark" }) {
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
      className={`rounded-2xl border p-5 shadow-lg transition-all ${dragging ? theme === "dark" ? "border-cyan-400/60 bg-cyan-400/5" : "border-cyan-500 bg-cyan-50" : theme === "dark" ? "border-white/10 bg-panel-dark" : "border-gray-200 bg-white"}`}
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); addFiles(e.dataTransfer.files); }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme === "dark" ? "bg-gradient-to-br from-cyan-400/20 to-emerald-400/20" : "bg-gradient-to-br from-cyan-100 to-emerald-100"}`}>
            <Upload className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
          </div>
          <div>
            <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Upload files</div>
            <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Drag & drop or select files to scan</div>
          </div>
        </div>
        <button
          type="button"
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all hover:scale-105 ${theme === "dark" ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
          onClick={() => inputRef.current?.click()}
        >
          <File className="h-3.5 w-3.5" />
          Choose files
        </button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      <div className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs ${theme === "dark" ? "border-white/10 bg-black/20 text-white/70" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
        <span className="flex items-center gap-2"><File className="h-3.5 w-3.5" />{files.length} file(s) selected</span>
        <span className="font-mono">{humanBytes(totalSize)}</span>
      </div>

      {files.length > 0 && (
        <div className="orion-scrollbar mt-3 max-h-28 space-y-2 overflow-auto pr-1">
          {files.map((f) => (
            <div key={`${f.name}:${f.size}`} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all ${theme === "dark" ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
              <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-200"}`}>
                  <File className={`h-4 w-4 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`} />
                </div>
                <div className="min-w-0">
                  <div className={`truncate text-xs font-semibold ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>{f.name}</div>
                  <div className={`text-[11px] ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>{humanBytes(f.size)}</div>
                </div>
              </div>
              <button type="button" className={`rounded-lg p-1.5 transition-all ${theme === "dark" ? "text-white/50 hover:bg-red-500/20 hover:text-red-400" : "text-gray-400 hover:bg-red-50 hover:text-red-500"}`} onClick={() => setFiles((prev) => prev.filter((x) => !(x.name === f.name && x.size === f.size)))}>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
