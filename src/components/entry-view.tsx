"use client";

import Link from "next/link";
import {
  SUS_QUESTION_COUNT,
  SUS_REVERSE,
  computeSusScore,
  formatDate,
  getBand,
  bandTexts,
} from "@/lib/sus";
import { useProjects } from "@/lib/storage";
import { fmt, useI18n } from "@/lib/i18n";
import { IconArrowBack, IconCheck } from "./icons";

interface EntryViewProps {
  projectId: string;
  entryId: string;
}

export function EntryView({ projectId, entryId }: EntryViewProps) {
  const { locale, t } = useI18n();
  const { projects, ready } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const entry = project?.entries.find((e) => e.id === entryId);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-16">
        <div className="h-64 animate-pulse rounded-xl bg-surface-container-low" />
      </div>
    );
  }

  if (!project || !entry) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 text-center md:px-16">
        <h1 className="text-headline-md font-headline text-on-surface">
          {t.entryView.notFoundTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-body-lg text-on-surface-variant">
          {t.entryView.notFoundBody}
        </p>
        <Link
          href={project ? `/projects/${project.id}` : "/"}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container"
        >
          <IconArrowBack className="h-[18px] w-[18px]" />
          {t.entryView.backToProject}
        </Link>
      </div>
    );
  }

  const score = computeSusScore(entry.answers);
  const band = getBand(score);
  const bandCopy = bandTexts(t, band);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-32 pt-12 md:px-16">
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="flex flex-col justify-center md:col-span-8">
          <div className="mb-4">
            <Link
              href={`/projects/${project.id}`}
              className="group inline-flex items-center gap-2 text-body-sm text-on-surface-variant transition-colors hover:text-active-indicator"
            >
              <IconArrowBack className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-1" />
              {fmt(t.entryView.backToName, { name: project.name })}
            </Link>
          </div>
          <h1 className="mb-2 text-headline-lg-mobile font-headline text-on-surface md:text-headline-lg">
            {fmt(t.entryView.responseOf, {
              name: entry.participant || t.projectView.defaultParticipant,
            })}
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            {fmt(t.entryView.completedOn, {
              date: formatDate(entry.createdAt, locale),
            })}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-ambient md:col-span-4">
          <div className="text-label-caps mb-2 uppercase text-on-surface-variant">
            {t.entryView.scoreCalculated}
          </div>
          <div className="mb-3 text-[72px] leading-none font-extrabold text-active-indicator">
            {score.toFixed(1)}
          </div>
          <div
            className={`rounded-full border px-4 py-1.5 text-label-caps uppercase ${band.chipClass}`}
          >
            {fmt(t.entryView.gradeWithAdjective, {
              grade: band.grade,
              adjective: bandCopy.adjective,
            })}
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
        <div className="border-b border-outline-variant bg-surface-container-low p-6">
          <h2 className="text-headline-md font-headline text-on-surface">
            {t.entryView.answersTitle}
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {t.questionnaire.scaleHint}
          </p>
        </div>
        <div className="divide-y divide-outline-variant/60">
          {Array.from({ length: SUS_QUESTION_COUNT }, (_, i) => {
            const value = entry.answers[i];
            return (
              <div
                key={i}
                className="flex flex-col items-start gap-6 p-6 transition-colors duration-150 hover:bg-surface-container-low md:flex-row md:items-center"
              >
                <div className="grow">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-md bg-surface-container-high px-2 py-1 text-data-mono shadow-sm text-on-surface">
                      Q{i + 1}
                    </span>
                    <span
                      className={`text-[12px] font-bold uppercase ${SUS_REVERSE[i] ? "text-error" : "text-secondary"}`}
                    >
                      {SUS_REVERSE[i]
                        ? t.questionnaire.negative
                        : t.questionnaire.positive}
                    </span>
                  </div>
                  <p className="font-medium text-on-surface">
                    {t.sus.questions[i]}
                  </p>
                </div>
                <div className="flex w-full justify-between gap-4 md:w-auto">
                  {[1, 2, 3, 4, 5].map((v) => {
                    const selected = value === v;
                    return (
                      <div key={v} className="flex flex-col items-center gap-2">
                        <span className="text-body-sm font-medium text-on-surface-variant">
                          {v}
                        </span>
                        <div
                          title={t.sus.likert[v - 1]}
                          className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${
                            selected
                              ? "border-transparent bg-active-indicator text-on-primary shadow-md shadow-active-indicator/30"
                              : "border-outline-variant bg-surface-container-lowest shadow-sm"
                          }`}
                        >
                          {selected && (
                            <IconCheck className="h-6 w-6" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
