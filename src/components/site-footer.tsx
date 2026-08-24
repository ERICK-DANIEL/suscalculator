"use client";

import { useI18n } from "@/lib/i18n";
import { IconGithub } from "./icons";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-between gap-6 border-t border-outline-variant/50 bg-surface-container-lowest/80 px-5 py-12 backdrop-blur-sm md:flex-row md:px-16">
      <span className="text-label-caps font-bold text-on-surface">
        {t.footer.tagline}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-6 text-body-sm">
        <span className="text-on-surface-variant">{t.footer.notice}</span>
        <a
          href="https://github.com/ERICK-DANIEL/suscalculator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <IconGithub className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
