"use client";

import { useRef, useState, useCallback } from "react";

interface ImageUploaderProps {
  name?: string;
  defaultValue?: string | null;
  folder?: string;
  label?: string;
}

export function ImageUploader({
  name = "image_url",
  defaultValue = null,
  folder = "general",
  label = "Image",
}: ImageUploaderProps) {
  const [url, setUrl] = useState<string | null>(defaultValue || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed");
          return;
        }

        setUrl(data.url);
      } catch {
        setError("Network error — please try again");
      } finally {
        setUploading(false);
      }
    },
    [folder]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setUrl(null);
    setError(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">
        {label}
      </label>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={url || ""} />

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {url ? (
        /* ── Preview state ── */
        <div className="relative rounded-lg border border-[#2E3D2E]/10 overflow-hidden bg-[#F7F2E4]">
          <img
            src={url}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
          <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-[#2E3D2E]/10">
            <span className="text-xs text-[#2E3D2E]/50 truncate max-w-[60%]">
              {url.split("/").pop()}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="text-xs font-medium text-[#2E3D2E]/70 hover:text-[#2E3D2E] transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Drop zone state ── */
        <div
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors h-48 ${
            dragOver
              ? "border-[#2E3D2E]/40 bg-[#2E3D2E]/5"
              : "border-[#2E3D2E]/15 bg-[#F7F2E4]/50 hover:border-[#2E3D2E]/30 hover:bg-[#F7F2E4]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#2E3D2E]/30 border-t-[#2E3D2E] rounded-full animate-spin" />
              <span className="text-sm text-[#2E3D2E]/60">Uploading...</span>
            </div>
          ) : (
            <>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#2E3D2E]/30"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm text-[#2E3D2E]/50">
                Drop image or click to upload
              </span>
              <span className="text-xs text-[#2E3D2E]/30">
                JPEG, PNG, WebP, GIF — max 5MB
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
