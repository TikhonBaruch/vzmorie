"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  className?: string;
}

export function FileUpload({
  onUpload,
  folder = "uploads",
  accept = "image/*",
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      onUpload(url);
      setPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Ошибка загрузки файла");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-full rounded-lg object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-6 text-sm text-slate-400 transition hover:border-slate-600 hover:text-slate-300 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {uploading ? "Загрузка..." : "Нажмите для загрузки файла"}
        </button>
      )}
    </div>
  );
}
