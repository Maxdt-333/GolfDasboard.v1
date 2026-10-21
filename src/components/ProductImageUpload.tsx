"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";

interface Props { image?: string; fallback?: string; onChange: (image?: string) => void; onBusy: (busy: boolean) => void; onErrorChange: (message: string) => void }
export default function ProductImageUpload({ image, fallback, onChange, onBusy, onErrorChange }: Props) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const request = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  function reportError(message: string) { setError(message); onErrorChange(message); }
  function setPending(value: boolean) { setBusy(value); onBusy(value); }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const current = ++request.current;
    reportError("");
    event.target.value = ""; // Allow picking the same file again after a failed attempt.
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setPending(false);
      reportError("Choose a JPG, PNG, or WebP image no larger than 5 MB.");
      return;
    }
    setPending(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject();
        reader.onerror = () => reject();
        reader.readAsDataURL(file);
      });
      // Reject corrupt files even if their extension and MIME type look like images.
      const decoded = new window.Image();
      decoded.src = data;
      await decoded.decode();
      if (request.current === current) onChange(data);
    } catch {
      if (request.current === current) reportError("This image could not be opened. Please choose another file.");
    } finally {
      if (request.current === current) setPending(false);
    }
  }
  return <section className="image-upload" aria-labelledby="image-heading">
    <div className="upload-preview">{image || fallback ? <Image src={image || fallback!} width={180} height={180} unoptimized alt="Product image preview" /> : <span>No image yet</span>}</div>
    <div className="upload-controls"><h3 id="image-heading">Product image <span className="muted">(optional)</span></h3><p id="image-help">JPG, PNG or WebP · Up to 5 MB</p>
      <input ref={input} id="product-image" tabIndex={-1} type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} aria-label="Upload product image" aria-describedby={`image-help${error ? " image-error" : ""}`} aria-invalid={!!error} className="sr-only" />
      <div className="upload-buttons"><button id="upload-image-button" type="button" className="button-secondary" aria-describedby={`image-help${error ? " image-error" : ""}`} onClick={() => input.current?.click()}>{image ? "Replace image" : "Upload image"}</button>{(image || error) && <button type="button" className="text-link" onClick={() => { ++request.current; setPending(false); reportError(""); if (!error) onChange(undefined); }}>{error && image ? "Keep current image" : "Use collection image"}</button>}</div>
      {busy && <p role="status">Preparing image…</p>}{error && <p id="image-error" role="alert" className="field-error">{error}</p>}
      <p className="upload-caption">{image ? "Your own product photo" : "Collection image preview"} · Saved for this session</p>
    </div>
  </section>;
}
