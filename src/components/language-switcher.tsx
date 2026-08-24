"use client";

import { LOCALES, dictionaries, setLocale, useI18n } from "@/lib/i18n";
import { IconExpandMore } from "./icons";

export function LanguageSwitcher() {
  const { locale } = useI18n();

  return (
    <label className="group relative inline-flex items-center">
      <span className="sr-only">{dictionaries[locale].nav.language}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof LOCALES)[number])}
        className="cursor-pointer appearance-none rounded-md bg-transparent py-1.5 pr-6 pl-2 text-label-caps uppercase font-medium text-on-surface-variant outline-none transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-active-indicator"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {dictionaries[code].nativeName}
          </option>
        ))}
      </select>
      <IconExpandMore className="pointer-events-none absolute right-0.5 h-4 w-4 text-on-surface-variant transition-colors group-hover:text-on-surface" />
    </label>
  );
}
