"use client";

import { LOCALES, dictionaries, setLocale, useI18n } from "@/lib/i18n";
import { IconLanguage } from "./icons";

export function LanguageSwitcher() {
  const { locale } = useI18n();

  return (
    <label className="relative inline-flex items-center text-on-surface-variant">
      <span className="sr-only">{dictionaries[locale].nav.language}</span>
      <IconLanguage className="pointer-events-none absolute left-2.5 h-4 w-4" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof LOCALES)[number])}
        className="cursor-pointer appearance-none rounded-lg border border-outline-variant/70 bg-surface-container-lowest py-1.5 pr-7 pl-8 text-body-sm font-medium text-on-surface outline-none transition hover:border-outline focus:border-active-indicator focus:ring-4 focus:ring-active-indicator/10"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {dictionaries[code].nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
