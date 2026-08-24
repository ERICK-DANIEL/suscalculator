"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { IconDelete } from "./icons";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="w-full max-w-sm rounded-xl border border-outline-variant bg-surface-container-lowest shadow-luminous-hover"
      >
        <div className="flex flex-col items-start gap-4 px-8 pt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-on-error-container">
            <IconDelete className="h-6 w-6" />
          </div>
          <h2
            id="confirm-dialog-title"
            className="text-headline-md font-headline text-on-surface"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-message"
            className="text-body-sm text-on-surface-variant"
          >
            {message}
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3 px-8 pb-7">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-outline px-5 py-2.5 text-data-mono uppercase tracking-wide text-on-surface transition-all hover:border-on-surface hover:bg-surface-variant"
          >
            {t.confirm.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-error px-5 py-2.5 text-data-mono uppercase tracking-wide text-white shadow-md transition-all hover:bg-on-error-container hover:shadow-luminous"
          >
            {confirmLabel ?? t.confirm.deleteConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
