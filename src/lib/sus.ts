import type { Dictionary, Locale } from "@/lib/i18n";
import { localeTag } from "@/lib/i18n";

export const SUS_QUESTION_COUNT = 10;

/** Ítems pares (índice 1, 3, …) con puntuación invertida. */
export const SUS_REVERSE: readonly boolean[] = [
  false,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
];

/** Respuesta individual de un participante al cuestionario SUS. */
export interface SusEntry {
  id: string;
  participant: string;
  /** 10 valores entre 1 y 5, en el orden estándar de las preguntas SUS. */
  answers: number[];
  createdAt: string;
}

/** Un proyecto agrupa las evaluaciones SUS de un producto o versión. */
export interface SusProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  entries: SusEntry[];
}

export function isValidAnswers(answers: unknown): answers is number[] {
  return (
    Array.isArray(answers) &&
    answers.length === SUS_QUESTION_COUNT &&
    answers.every((a) => Number.isInteger(a) && a >= 1 && a <= 5)
  );
}

/**
 * Puntuación SUS clásica (Brooke, 1996):
 * ítems impares (1.º, 3.º, …): valor − 1; ítems pares: 5 − valor.
 * La suma se multiplica por 2,5 para obtener un rango de 0 a 100.
 */
export function computeSusScore(answers: number[]): number {
  if (!isValidAnswers(answers)) return 0;
  let total = 0;
  for (let i = 0; i < answers.length; i++) {
    total += i % 2 === 0 ? answers[i] - 1 : 5 - answers[i];
  }
  return total * 2.5;
}

export function averageScore(entries: SusEntry[]): number | null {
  if (entries.length === 0) return null;
  const sum = entries.reduce((acc, e) => acc + computeSusScore(e.answers), 0);
  return sum / entries.length;
}

export type BandId = "a_plus" | "a" | "b" | "c" | "d" | "f";
export type AcceptabilityId = "acceptable" | "marginal" | "unacceptable";

export interface SusBand {
  id: BandId;
  grade: string;
  chipClass: string;
  scoreClass: string;
  tone: "positive" | "neutral" | "negative";
}

/**
 * Escala de adjetivos y grados (Bangor, Kortum & Miller):
 * 0–24.9 F · 25–38.9 D · 39–51.9 C · 52–72.9 B · 73–84.9 A · 85–100 A+
 * Los textos traducidos viven en los diccionarios (t.sus.bands[id]).
 */
export function getBand(score: number): SusBand {
  if (score >= 85) {
    return {
      id: "a_plus",
      grade: "A+",
      chipClass:
        "bg-secondary-container text-on-secondary-container border border-secondary/20",
      scoreClass: "text-secondary bg-secondary/5",
      tone: "positive",
    };
  }
  if (score >= 73) {
    return {
      id: "a",
      grade: "A",
      chipClass:
        "bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim",
      scoreClass: "text-secondary bg-secondary/5",
      tone: "positive",
    };
  }
  if (score >= 52) {
    return {
      id: "b",
      grade: "B",
      chipClass: "bg-surface-container-high text-on-surface",
      scoreClass: "text-on-surface bg-surface-variant",
      tone: "neutral",
    };
  }
  if (score >= 39) {
    return {
      id: "c",
      grade: "C",
      chipClass: "bg-surface-container-highest text-on-surface-variant",
      scoreClass: "text-on-surface bg-surface-variant",
      tone: "neutral",
    };
  }
  if (score >= 25) {
    return {
      id: "d",
      grade: "D",
      chipClass:
        "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim",
      scoreClass: "text-tertiary bg-tertiary/10",
      tone: "negative",
    };
  }
  return {
    id: "f",
    grade: "F",
    chipClass: "bg-error-container text-on-error-container",
    scoreClass: "text-tertiary bg-tertiary/10",
    tone: "negative",
  };
}

export function bandTexts(
  t: Dictionary,
  band: SusBand,
): { adjective: string; descriptor: string } {
  return t.sus.bands[band.id];
}

/** Umbral habitual: ≥ 68 aceptable; 50–67.9 marginal; < 50 no aceptable. */
export function getAcceptability(score: number): AcceptabilityId {
  if (score >= 68) return "acceptable";
  if (score >= 50) return "marginal";
  return "unacceptable";
}

export function acceptabilityClass(a: AcceptabilityId): string {
  switch (a) {
    case "acceptable":
      return "text-secondary";
    case "marginal":
      return "text-on-surface-variant";
    case "unacceptable":
      return "text-tertiary";
  }
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatRelative(iso: string, locale: Locale): string {
  const rtf = new Intl.RelativeTimeFormat(localeTag(locale), {
    numeric: "auto",
  });
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days < 7) return rtf.format(-days, "day");
  if (days < 30) return rtf.format(-Math.floor(days / 7), "week");
  if (days < 365) return rtf.format(-Math.floor(days / 30), "month");
  return rtf.format(-Math.floor(days / 365), "year");
}

const DECIMAL_COMMA_LOCALES: readonly Locale[] = ["es", "pt", "fr", "de"];

/** CSV con BOM para que Excel respete los acentos. */
export function buildCsv(project: SusProject, t: Dictionary, locale: Locale): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",;\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const header = [
    t.sus.csvHeaders.participant,
    ...Array.from({ length: SUS_QUESTION_COUNT }, (_, i) => `Q${i + 1}`),
    t.sus.csvHeaders.susScore,
    t.sus.csvHeaders.date,
  ];
  const decimal = DECIMAL_COMMA_LOCALES.includes(locale) ? "," : ".";
  const rows = project.entries.map((e) => [
    e.participant,
    ...e.answers,
    computeSusScore(e.answers).toFixed(1).replace(".", decimal),
    e.createdAt,
  ]);
  return (
    "\uFEFF" +
    [header, ...rows].map((row) => row.map(escape).join(";")).join("\n")
  );
}
