"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export function PhotoUpload() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Alleen JPEG en PNG bestanden zijn toegestaan.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Bestand mag maximaal 5MB zijn.");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get presigned URL from our API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!res.ok) {
        throw new Error("Kon upload URL niet ophalen.");
      }

      const { uploadUrl, s3Key, s3Url } = await res.json();

      // Upload to S3 via presigned URL
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject());
        xhr.onerror = () => reject();
        xhr.send(file);
      });

      // Save photo record in database
      const saveRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          s3_url: s3Url,
          s3_key: s3Key,
          file_size: file.size,
          mime_type: file.type,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Foto opslaan mislukt.");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload mislukt.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="w-5 h-5 mr-2" />
        {uploading ? `Uploaden... ${progress}%` : "Foto kiezen"}
      </Button>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-electric-teal h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-coral">{error}</p>}
      <p className="text-xs text-gray-400">JPEG of PNG, max 5MB</p>
    </div>
  );
}
