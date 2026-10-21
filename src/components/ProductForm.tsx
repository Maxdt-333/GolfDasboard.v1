"use client";

// Client boundary: controlled inputs preserve typed values when validation fails.
import ProductImageUpload from "./ProductImageUpload";
import { useState, type FormEvent } from "react";
import { CATEGORIES, STATUSES, type ProductFormValues, type FormErrors, type Category, type ProductStatus } from "@/lib/types";
import { validateProduct } from "@/lib/validateProduct";

interface Props {
  initialValues: ProductFormValues;
  submitLabel: string;
  initialImage?: string;
  fallbackImage?: string;
  onSubmit: (values: ProductFormValues, image?: string) => void;
  onCancel: () => void;
}

function FieldError({ field, errors }: { field: keyof ProductFormValues; errors: FormErrors }) {
  return errors[field] ? <p id={`${field}-error`} className="field-error">{errors[field]}</p> : null;
}

export default function ProductForm({ initialValues, initialImage, fallbackImage, submitLabel, onSubmit, onCancel }: Props) {
  const [image, setImage] = useState(initialImage);
  const [imageError, setImageError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof ProductFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateFieldError(field: keyof ProductFormValues, message?: string) {
    setErrors((previous) => {
      const next = { ...previous };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }
  function changeField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (touched[field] || submitted) updateFieldError(field, validateProduct(nextValues)[field]);
  }
  function blurField(field: keyof ProductFormValues) {
    setTouched((previous) => ({ ...previous, [field]: true }));
    updateFieldError(field, validateProduct(values)[field]);
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return;
    setSubmitted(true);
    const nextErrors = validateProduct(values);
    setErrors(nextErrors);
    const fieldOrder: (keyof ProductFormValues)[] = ["name", "category", "price", "stock", "status"];
    const firstError = fieldOrder.find((field) => nextErrors[field]);
    if (firstError) {
      const field = event.currentTarget.elements.namedItem(firstError);
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) field.focus();
      return;
    }
    if (imageError) {
      document.getElementById("upload-image-button")?.focus();
      return;
    }
    onSubmit(values, image);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="form-panel">
      <ProductImageUpload image={image} fallback={values.category === initialValues.category && fallbackImage ? fallbackImage : values.category ? `/thumbnails/${values.category.toLowerCase()}.svg` : undefined} onChange={setImage} onBusy={setUploading} onErrorChange={setImageError} />
      <div className="space-y-6">
        <div>
          <label htmlFor="name">Product name</label>
          <input id="name" name="name" onBlur={() => blurField("name")} value={values.name} onChange={(e) => changeField("name", e.target.value)} placeholder="e.g. Tour Driver · 10.5°" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} required />
          <FieldError field="name" errors={errors} />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" onBlur={() => blurField("category")} value={values.category} onChange={(e) => changeField("category", e.target.value as Category | "")} aria-invalid={!!errors.category} aria-describedby={errors.category ? "category-error" : undefined} required>
            <option value="" disabled>Choose a category</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select><FieldError field="category" errors={errors} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price">Price (USD)</label>
            <input id="price" name="price" onBlur={() => blurField("price")} inputMode="decimal" value={values.price} onChange={(e) => changeField("price", e.target.value)} placeholder="0.00" aria-invalid={!!errors.price} aria-describedby={`price-help${errors.price ? " price-error" : ""}`} required />
            <p id="price-help" className="field-help">USD · More than 0 · Up to 2 decimal places (19.99)</p>
            <FieldError field="price" errors={errors} />
          </div>
          <div>
            <label htmlFor="stock">Stock</label>
            <input id="stock" name="stock" onBlur={() => blurField("stock")} inputMode="numeric" value={values.stock} onChange={(e) => changeField("stock", e.target.value)} placeholder="0" aria-invalid={!!errors.stock} aria-describedby={`stock-help${errors.stock ? " stock-error" : ""}`} required />
            <p id="stock-help" className="field-help">Whole units only · 0 or more</p>
            <FieldError field="stock" errors={errors} />
          </div>
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" onBlur={() => blurField("status")} value={values.status} onChange={(e) => changeField("status", e.target.value as ProductStatus | "")} aria-invalid={!!errors.status} aria-describedby={errors.status ? "status-error" : undefined} required>
            <option value="" disabled>Choose a status</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select><FieldError field="status" errors={errors} />
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-[#e5e9e1]">
        {(Object.keys(errors).length > 0 || imageError) && <p role="alert" className="field-error mb-4">Please correct the highlighted fields before saving.</p>}
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={uploading} className="button-primary">{uploading ? "Preparing image…" : submitLabel}</button><button type="button" className="button-secondary" onClick={onCancel}>Cancel</button></div>
      </div>
    </form>
  );
}
