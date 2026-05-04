import React from "react";
import { UploadCloud, File, X } from "lucide-react";

export default function UploadBox({ files, setFiles, theme }) {
  const inputRef = React.useRef(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const remove = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const drop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...dropped]);
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-[#131520]" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        <UploadCloud className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
        <div>
          <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Upload Files</div>
          <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Drop files or click to browse</div>
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={drop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all hover:border-cyan-400/50 ${theme === "dark" ? "border-white/10 bg-black/20" : "border-gray-300 bg-gray-50"}`}
      >
        <UploadCloud className={`mx-auto mb-2 h-8 w-8 ${theme === "dark" ? "text-white/30" : "text-gray-400"}`} />
        <p className={`text-sm ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Drag & drop files here, or click to select</p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFiles} />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f) => (
            <div key={f.name} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`}>
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-cyan-400" />
                <span className={theme === "dark" ? "text-white/80" : "text-gray-700"}>{f.name}</span>
              </div>
              <button onClick={() => remove(f.name)} className="text-red-400 hover:text-red-300">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
