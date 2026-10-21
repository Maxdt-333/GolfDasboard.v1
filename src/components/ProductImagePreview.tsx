"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { X, ZoomIn } from "lucide-react";

export default function ProductImagePreview({ src, name }: { src: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const title = useId();
  function open() {
    dialog.current?.showModal();
    closeButton.current?.focus();
  }
  return <>
    <button type="button" className="text-link image-preview-trigger" onClick={open}><ZoomIn size={18} aria-hidden="true" />View product image</button>
    <dialog ref={dialog} className="image-preview-dialog" aria-labelledby={title}>
      <div className="image-preview-header">
        <h2 id={title}>{name}</h2>
        <button ref={closeButton} type="button" className="image-preview-close" aria-label="Close image preview" onClick={() => dialog.current?.close()}><X size={23} aria-hidden="true" /></button>
      </div>
      <Image src={src} width={1280} height={1280} unoptimized alt={`Enlarged product image for ${name}`} />
    </dialog>
  </>;
}
