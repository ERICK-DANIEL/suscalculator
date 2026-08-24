"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type SusEntry,
  acceptabilityClass,
  averageScore,
  bandTexts,
  buildCsv,
  computeSusScore,
  formatDate,
  formatRelative,
  getAcceptability,
  getBand,
} from "@/lib/sus";
import { deleteEntry, deleteProject, useProjects } from "@/lib/storage";
import { fmt, useI18n } from "@/lib/i18n";
import {
  IconArrowBack,
  IconAssignment,
  IconDelete,
  IconDownload,
  IconEdit,
} from "./icons";
import { Questionnaire } from "./questionnaire";
import { ConfirmDialog } from "./confirm-dialog";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "proyecto"
  );
}

export function ProjectView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { projects, ready } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [pendingProjectDelete, setPendingProjectDelete] = useState(false);
  const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<SusEntry | null>(null);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-16">
        <div className="h-64 animate-pulse rounded-xl bg-surface-container-low" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 text-center md:px-16">
        <h1 className="text-headline-md font-headline text-on-surface">
          {t.projectView.notFoundTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-body-lg text-on-surface-variant">
          {t.projectView.notFoundBody}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container"
        >
          <IconArrowBack className="h-[18px] w-[18px]" />
          {t.projectView.backToPanelCta}
        </Link>
      </div>
    );
  }

  const avg = averageScore(project.entries);
  const band = avg !== null ? getBand(avg) : null;
  const bandCopy = band ? bandTexts(t, band) : null;
  const acceptabilityId = avg !== null ? getAcceptability(avg) : null;
  const lastEntry = [...project.entries].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];

  const exportCsv = () => {
    if (!project) return;
    const blob = new Blob([buildCsv(project, t, locale)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `sus-${slugify(project.name)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteProject = () => {
    if (!project) return;
    deleteProject(project.id);
    router.push("/");
  };

  const openNewEvaluation = () => {
    setEditingEntry(null);
    setQuestionnaireOpen(true);
  };

  const openEditEvaluation = (entry: SusEntry) => {
    setEditingEntry(entry);
    setQuestionnaireOpen(true);
  };

  const participantName = (entry: SusEntry | undefined) =>
    entry?.participant || t.projectView.defaultParticipant;

  const pendingEntry = project.entries.find((e) => e.id === pendingEntryId);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-12 md:px-16">
      <Link
        href="/"
        className="group mb-4 inline-flex w-max items-center gap-2 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
      >
        <IconArrowBack className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-1" />
        {t.projectView.backPanel}
      </Link>

      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h1 className="mb-2 text-headline-lg-mobile font-headline text-on-surface md:text-headline-lg">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-body-lg text-on-surface-variant">
              {project.description}
            </p>
          )}
          <p className="mt-2 text-body-sm text-outline">
            {fmt(t.projectView.createdOn, {
              date: formatDate(project.createdAt, locale),
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openNewEvaluation}
            className="cursor-pointer whitespace-nowrap rounded-xl bg-primary px-6 py-3 text-label-caps font-bold uppercase text-on-primary shadow-md transition-all hover:bg-primary-container hover:text-on-primary-fixed-variant hover:shadow-luminous"
          >
            {t.projectView.newEvaluation}
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={project.entries.length === 0}
            title={
              project.entries.length === 0
                ? t.projectView.exportDisabledTitle
                : t.projectView.exportTitle
            }
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-outline bg-transparent px-5 py-3 text-label-caps font-bold uppercase text-on-surface shadow-sm transition-all enabled:hover:border-on-surface enabled:hover:bg-surface-variant disabled:opacity-40"
          >
            <IconDownload className="h-[18px] w-[18px]" />
            {t.projectView.exportCsv}
          </button>
          <button
            type="button"
            aria-label={t.projectView.deleteAria}
            onClick={() => setPendingProjectDelete(true)}
            className="cursor-pointer rounded-xl border border-outline px-4 py-3 text-on-surface-variant shadow-sm transition-all hover:border-error hover:bg-error-container hover:text-error"
          >
            <IconDelete className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label={t.projectView.avgScoreLabel} blobClass="bg-primary/5">
          <div className="relative z-10 flex items-baseline gap-2">
            <span className="text-[48px] leading-none font-extrabold tracking-tighter text-on-surface">
              {avg !== null ? avg.toFixed(1) : "—"}
            </span>
            <span className="text-body-sm text-on-surface-variant">/ 100</span>
          </div>
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            {band && bandCopy && acceptabilityId ? (
              <>
                <span className={`rounded-full px-3 py-0.5 text-label-caps uppercase ${band.chipClass}`}>
                  {fmt(t.projectView.gradePrefix, { grade: band.grade })}
                </span>
                <span className={`text-body-sm font-medium ${acceptabilityClass(acceptabilityId)}`}>
                  {t.sus.acceptability[acceptabilityId]}
                </span>
              </>
            ) : (
              <span className="text-body-sm text-outline">
                {t.projectView.registerFirst}
              </span>
            )}
          </div>
        </StatCard>

        <StatCard label={t.projectView.gradeGlobal} blobClass="bg-secondary/5">
          <div className="relative z-10 mt-auto">
            <div
              className={`mb-2 w-max rounded-full border border-secondary/20 px-4 py-1.5 text-headline-md font-headline font-bold shadow-sm ${
                band && band.tone === "positive"
                  ? "bg-secondary-container text-on-secondary-container"
                  : band && band.tone === "negative"
                    ? "bg-error-container text-on-error-container"
                    : "bg-surface-container-high text-on-surface"
              }`}
            >
              {band
                ? fmt(t.projectView.gradePrefix, { grade: band.grade })
                : t.projectView.noData}
            </div>
          </div>
          <span className="relative z-10 mt-2 block text-body-sm text-on-surface-variant">
            {band && bandCopy
              ? `${bandCopy.adjective} – ${bandCopy.descriptor}`
              : t.projectView.noEvaluationsYet}
          </span>
        </StatCard>

        <StatCard label={t.projectView.registeredCount} blobClass="bg-active-indicator/5">
          <div className="relative z-10 mt-auto flex items-baseline gap-2">
            <span className="text-[48px] leading-none font-extrabold tracking-tighter text-on-surface">
              {project.entries.length}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {fmt(
                project.entries.length === 1
                  ? t.projectView.participants_one
                  : t.projectView.participants_other,
                { count: project.entries.length },
              ).replace(/^\d+\s/, "")}
            </span>
          </div>
          <div className="relative z-10 mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-active-indicator shadow-[0_0_8px_rgba(0,102,255,0.4)] transition-all duration-700"
              style={{ width: `${avg !== null ? Math.min(100, Math.max(4, avg)) : 0}%` }}
            />
          </div>
          <p className="relative z-10 mt-2 text-body-sm text-on-surface-variant">
            {lastEntry
              ? fmt(t.projectView.lastEvalTemplate, {
                  when: formatRelative(lastEntry.createdAt, locale).toLowerCase(),
                })
              : t.projectView.noEvaluationsYet}
          </p>
        </StatCard>
      </div>

      <section className="mt-16 flex flex-col gap-6">
        <h2 className="text-headline-md font-semibold text-on-surface">
          {t.projectView.historyTitle}
        </h2>
        {project.entries.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/60 p-14 text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconAssignment className="h-7 w-7" />
            </div>
            <h3 className="text-headline-md font-headline text-on-surface">
              {t.projectView.emptyTitle}
            </h3>
            <p className="mt-2 max-w-md text-body-lg text-on-surface-variant">
              {t.projectView.emptyBody}
            </p>
            <button
              type="button"
              onClick={openNewEvaluation}
              className="mt-8 cursor-pointer rounded-lg bg-primary px-6 py-3 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
            >
              {t.projectView.emptyCta}
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest shadow-luminous">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low text-label-caps uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-4 font-bold">{t.projectView.thParticipant}</th>
                  <th className="hidden px-6 py-4 font-bold sm:table-cell">{t.projectView.thDate}</th>
                  <th className="px-6 py-4 font-bold">{t.projectView.thScore}</th>
                  <th className="px-6 py-4 text-right font-bold">{t.projectView.thActions}</th>
                </tr>
              </thead>
              <tbody className="text-body-sm text-on-surface">
                {[...project.entries]
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((entry) => {
                    const score = computeSusScore(entry.answers);
                    const entryBand = getBand(score);
                    return (
                      <tr
                        key={entry.id}
                        className="group border-b border-outline-variant/30 transition-colors last:border-b-0 hover:bg-surface-container-low/50"
                      >
                        <td className="max-w-[220px] truncate px-6 py-4 font-medium">
                          {entry.participant || t.projectView.defaultParticipant}
                        </td>
                        <td className="hidden px-6 py-4 text-data-mono text-on-surface-variant sm:table-cell">
                          {formatDate(entry.createdAt, locale)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`my-3 ml-1 inline-block rounded px-2.5 py-1 text-data-mono font-bold tabular-nums ${entryBand.scoreClass}`}
                          >
                            {score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/projects/${project.id}/evaluations/${entry.id}`}
                              className="rounded-lg border border-outline px-4 py-2 text-label-caps uppercase text-on-surface shadow-sm transition-all hover:border-on-surface hover:bg-surface-variant"
                            >
                              {t.projectView.viewAnswers}
                            </Link>
                            <button
                              type="button"
                              aria-label={fmt(t.projectView.editAria, {
                                name: participantName(entry),
                              })}
                              onClick={() => openEditEvaluation(entry)}
                              className="cursor-pointer rounded-md p-2 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
                            >
                              <IconEdit className="h-[18px] w-[18px]" />
                            </button>
                            <button
                              type="button"
                              aria-label={fmt(t.projectView.deleteEntryAria, {
                                name: participantName(entry),
                              })}
                              onClick={() => setPendingEntryId(entry.id)}
                              className="cursor-pointer rounded-md p-2 text-outline transition-colors hover:bg-error-container hover:text-error"
                            >
                              <IconDelete className="h-[18px] w-[18px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {questionnaireOpen && (
        <Questionnaire
          projectId={project.id}
          existingEntryCount={project.entries.length}
          editing={editingEntry}
          onClose={() => {
            setQuestionnaireOpen(false);
            setEditingEntry(null);
          }}
        />
      )}

      <ConfirmDialog
        open={pendingProjectDelete}
        title={t.projectView.deleteProjectTitle}
        message={fmt(t.projectView.deleteProjectBody, { name: project.name })}
        onConfirm={handleDeleteProject}
        onCancel={() => setPendingProjectDelete(false)}
      />
      <ConfirmDialog
        open={pendingEntryId !== null}
        title={t.projectView.deleteEntryTitle}
        message={fmt(t.projectView.deleteEntryBody, {
          name: participantName(pendingEntry),
        })}
        onConfirm={() => {
          if (pendingEntryId) deleteEntry(project.id, pendingEntryId);
          setPendingEntryId(null);
        }}
        onCancel={() => setPendingEntryId(null)}
      />
    </div>
  );
}

function StatCard({
  label,
  blobClass,
  children,
}: {
  label: string;
  blobClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-6 shadow-luminous transition-shadow hover:shadow-luminous-hover">
      <div
        aria-hidden="true"
        className={`absolute top-0 -mr-8 -mt-8 right-0 h-32 w-32 rounded-bl-full transition-transform group-hover:scale-110 ${blobClass}`}
      />
      <span className="text-label-caps relative z-10 uppercase text-on-surface-variant">
        {label}
      </span>
      {children}
    </div>
  );
}
