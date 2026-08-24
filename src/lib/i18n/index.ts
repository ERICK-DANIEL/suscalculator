"use client";

import { useSyncExternalStore } from "react";
import { en, type Dictionary } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import { fr } from "./fr";
import { de } from "./de";

export type { Dictionary };

export const LOCALES = ["en", "es", "pt", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const STORAGE_KEY = "suscalculator.locale";

export const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
  pt,
  fr,
  de,
};

const LOCALE_TAGS: Record<Locale, string> = {
  es: "es-ES",
  en: "en-US",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
};

export function localeTag(locale: Locale): string {
  return LOCALE_TAGS[locale];
}

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    // localStorage puede no estar disponible en modo privado estricto
  }
  for (const tag of navigator.languages ?? []) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

let cache: Locale | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Locale {
  cache ??= detectLocale();
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(locale: Locale): void {
  cache = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // sin persistencia disponible; el cambio vive solo en memoria
  }
  for (const listener of listeners) listener();
}

/** Idioma del usuario: detectado al entrar y persistido entre visitas. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LOCALE);
}

export function useI18n(): { locale: Locale; t: Dictionary } {
  const locale = useLocale();
  return { locale, t: dictionaries[locale] };
}

/** Sustituye marcadores {nombre} en plantillas de traducción. */
export function fmt(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}
