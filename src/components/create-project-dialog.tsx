"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createProject } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { IconClose } from "./icons";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const project = createProject(name, description);
    onClose();
    router.push(`/projects/${project.id}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest shadow-luminous-hover"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-8 py-5">
          <h2 id="create-project-title" className="text-headline-md font-headline text-on-surface">
            {t.createDialog.title}
          </h2>
          <button
            type="button"
            aria-label={t.questionnaire.closeAria}
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-6">
          <p className="text-body-sm text-on-surface-variant">
            {t.createDialog.subtitle}
          </p>
          <div>
            <label
              htmlFor="project-name"
              className="text-label-caps uppercase mb-1.5 block text-on-surface-variant"
            >
              {t.createDialog.nameLabel}
            </label>
            <input
              id="project-name"
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.createDialog.namePlaceholder}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-lg outline-none transition placeholder:text-outline/70 focus:border-active-indicator focus:ring-4 focus:ring-active-indicator/10"
            />
          </div>
          <div>
            <label
              htmlFor="project-description"
              className="text-label-caps uppercase mb-1.5 block text-on-surface-variant"
            >
              {t.createDialog.descLabel}
            </label>
            <input
              id="project-description"
              type="text"
              maxLength={140}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.createDialog.descPlaceholder}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-lg outline-none transition placeholder:text-outline/70 focus:border-active-indicator focus:ring-4 focus:ring-active-indicator/10"
            />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-outline px-5 py-2.5 text-data-mono uppercase tracking-wide text-on-surface transition-all hover:bg-surface-variant hover:border-on-surface"
            >
              {t.confirm.cancel}
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
            >
              {t.createDialog.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
