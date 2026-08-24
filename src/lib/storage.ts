"use client";

import { useSyncExternalStore } from "react";
import {
  type SusEntry,
  type SusProject,
  SUS_QUESTION_COUNT,
  isValidAnswers,
} from "./sus";

const STORAGE_KEY = "suscalculator.projects.v1";
const CHANGE_EVENT = "suscalculator:changed";
const EMPTY: SusProject[] = [];

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeProject(raw: unknown): SusProject | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.id !== "string" || typeof p.name !== "string") return null;
  const entries = Array.isArray(p.entries) ? p.entries : [];
  return {
    id: p.id,
    name: p.name,
    description: typeof p.description === "string" ? p.description : "",
    createdAt:
      typeof p.createdAt === "string" ? p.createdAt : new Date().toISOString(),
    entries: entries
      .filter((e): e is SusEntry => {
        if (typeof e !== "object" || e === null) return false;
        const entry = e as Record<string, unknown>;
        return typeof entry.id === "string" && isValidAnswers(entry.answers);
      })
      .map((e) => ({
        id: e.id,
        participant: typeof e.participant === "string" ? e.participant : "",
        answers: e.answers.slice(0, SUS_QUESTION_COUNT),
        createdAt:
          typeof e.createdAt === "string"
            ? e.createdAt
            : new Date().toISOString(),
      })),
  };
}

/** Caché estable: getSnapshot debe devolver la misma referencia si los datos no cambian. */
let cacheRaw: string | null = null;
let cacheValue: SusProject[] = EMPTY;

export function readProjects(): SusProject[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const key = raw ?? "";
  if (key === cacheRaw) return cacheValue;
  let value: SusProject[] = EMPTY;
  try {
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        value = parsed
          .map(sanitizeProject)
          .filter((p): p is SusProject => p !== null);
      }
    }
  } catch {
    value = EMPTY;
  }
  cacheRaw = key;
  cacheValue = value;
  return cacheValue;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const noopSubscribe = () => () => {};

/**
 * Lee los proyectos de localStorage de forma segura con SSR/hidratación:
 * `ready` indica cuándo ya se han cargado los datos reales en el cliente.
 */
export function useProjects(): { projects: SusProject[]; ready: boolean } {
  const projects = useSyncExternalStore(subscribe, readProjects, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return { projects, ready };
}

function writeProjects(projects: SusProject[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function mutate(fn: (projects: SusProject[]) => SusProject[]): void {
  writeProjects(fn(readProjects()));
}

export function createProject(name: string, description = ""): SusProject {
  const project: SusProject = {
    id: makeId(),
    name: name.trim() || "Proyecto sin nombre",
    description: description.trim(),
    createdAt: new Date().toISOString(),
    entries: [],
  };
  mutate((projects) => [project, ...projects]);
  return project;
}

export function deleteProject(id: string): void {
  mutate((projects) => projects.filter((p) => p.id !== id));
}

export function renameProject(
  id: string,
  name: string,
  description?: string,
): void {
  mutate((projects) =>
    projects.map((p) =>
      p.id === id
        ? {
            ...p,
            name: name.trim() || p.name,
            ...(description !== undefined
              ? { description: description.trim() }
              : {}),
          }
        : p,
    ),
  );
}

export function saveEntry(projectId: string, entry: SusEntry): void {
  mutate((projects) =>
    projects.map((p) => {
      if (p.id !== projectId) return p;
      const exists = p.entries.some((e) => e.id === entry.id);
      return {
        ...p,
        entries: exists
          ? p.entries.map((e) => (e.id === entry.id ? entry : e))
          : [...p.entries, entry],
      };
    }),
  );
}

export function deleteEntry(projectId: string, entryId: string): void {
  mutate((projects) =>
    projects.map((p) =>
      p.id === projectId
        ? { ...p, entries: p.entries.filter((e) => e.id !== entryId) }
        : p,
    ),
  );
}

export function newEntryId(): string {
  return makeId();
}
