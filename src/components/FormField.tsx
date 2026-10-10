import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  const fieldId = id ?? inputProps.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={`input w-full bg-base-100 ${error ? "input-error" : ""}`}
        {...inputProps}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
