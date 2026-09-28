"use client";

import { useRef, useState, useCallback } from "react";

interface GalleryUploaderProps {
  name?: string;
  defaultValue?: string[] | null;
  folder?: string;
  label?: string;
}

/**
 * Multi-image uploader for story galleries.
 * Uploads into the given storage folder (one folder per story),
 * keeps the list of public URLs in a hidden form field, and
 * deletes files from Supabase Storage when removed — no orphans.
 */
export function GalleryUploader({
  name = "gallery",
  defaultValue = null,
  folder = "stories/misc",
  label = "Gallery Images",
}: GalleryUploaderProps) {
  const [urls, setUrls] = useState<string[]>(defaultValue || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      setError(null);

      for (const file of Array.from(files)) {
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
            setError(data.error || `Upload failed for ${file.name}`);
            continue;
          }

          setUrls((prev) => [...prev, data.url]);
        } catch {
          setError("Network error — please try again");
        }
      }

      setUploading(false);
    },
    [folder]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleRemove = (url: string) => {
    // Delete from Supabase Storage so the file doesn't become an orphan.
    fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => {});
    setUrls((prev) => prev.filter((u) => u !== url));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">
        {label}
      </label>

      {/* Hidden input for form submission — JSON array of URLs */}
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {urls.map((url) => (
            <div
              key={url}
              className="relative group rounded-lg border border-[#2E3D2E]/10 overflow-hidden bg-[#F7F2E4] aspect-[4/3]"
            >
              <img
                src={url}
                alt="Gallery image"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                title="Delete image from storage"
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors h-28 ${
          dragOver
            ? "border-[#2E3D2E]/40 bg-[#2E3D2E]/5"
            : "border-[#2E3D2E]/15 bg-[#F7F2E4]/50 hover:border-[#2E3D2E]/30 hover:bg-[#F7F2E4]"
        }`}
      >
        {uploading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#2E3D2E]/30 border-t-[#2E3D2E] rounded-full animate-spin" />
            <span className="text-sm text-[#2E3D2E]/60">Uploading...</span>
          </div>
        ) : (
          <>
            <span className="text-sm text-[#2E3D2E]/60">
              + Add images (click or drop, multiple allowed)
            </span>
            <span className="text-xs text-[#2E3D2E]/35">
              JPEG, PNG, WebP, GIF — max 5MB each
            </span>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <p className="mt-1.5 text-xs text-[#2E3D2E]/40">
        Hover an image and click × to delete it from storage.
      </p>
    </div>
  );
}
