"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProject, useProjects } from "@/lib/storage";
import { averageScore, formatRelative } from "@/lib/sus";
import type { SusProject } from "@/lib/sus";
import { fmt, useI18n } from "@/lib/i18n";
import { CreateProjectDialog } from "./create-project-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { IconAdd, IconDelete, IconFolderOpen } from "./icons";

export function ProjectsDashboard() {
  const { projects, ready } = useProjects();
  const { locale, t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SusProject | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-16">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-headline-lg-mobile font-headline text-on-surface md:text-headline-lg">
            {t.dashboard.title}
          </h1>
          <p className="mt-2 text-body-lg text-on-surface-variant">
            {t.dashboard.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
        >
          <IconAdd className="h-5 w-5" />
          <span className="text-data-mono uppercase tracking-wider">
            {t.dashboard.newProject}
          </span>
        </button>
      </div>

      {!ready ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-surface-container-low"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest/60 p-16 text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconFolderOpen className="h-7 w-7" />
          </div>
          <h2 className="text-headline-md font-headline text-on-surface">
            {t.dashboard.emptyTitle}
          </h2>
          <p className="mt-2 max-w-sm text-body-lg text-on-surface-variant">
            {t.dashboard.emptyBody}
          </p>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-8 cursor-pointer rounded-lg bg-primary px-6 py-3 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
          >
            {t.dashboard.createProject}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const avg = averageScore(project.entries);
            const lastEntry = [...project.entries].sort((a, b) =>
              b.createdAt.localeCompare(a.createdAt),
            )[0];
            const scoreColor = !avg
              ? "text-outline"
              : avg >= 68
                ? "text-primary"
                : avg >= 50
                  ? "text-on-surface"
                  : "text-tertiary";
            return (
              <div
                key={project.id}
                className="group relative flex flex-col rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-luminous transition-all duration-300 hover:-translate-y-1 hover:shadow-luminous-hover"
              >
                <button
                  type="button"
                  aria-label={`${t.dashboard.deleteTitle}: ${project.name}`}
                  onClick={() => setPendingDelete(project)}
                  className="absolute top-4 right-4 cursor-pointer rounded-md p-1.5 text-outline opacity-0 transition-all hover:bg-error-container hover:text-error focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
                >
                  <IconDelete className="h-5 w-5" />
                </button>
                <div className="mb-6">
                  <Link
                    href={`/projects/${project.id}`}
                    className="block min-w-0 pr-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-active-indicator"
                  >
                    <h2 className="truncate text-headline-md font-headline text-on-surface transition-colors hover:text-primary">
                      {project.name}
                    </h2>
                  </Link>
                  <div
                    aria-hidden="true"
                    className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#2563EB] via-[#64748B] to-[#BC4800] transition-all duration-300 group-hover:w-20"
                  />
                </div>
                <div className="grow">
                  <div className="mb-6 rounded-lg bg-surface-container-low/50 p-4">
                    <div className="text-label-caps mb-1 uppercase tracking-widest text-on-surface-variant">
                      {t.dashboard.globalScore}
                    </div>
                    {avg !== null ? (
                      <div className="flex items-end gap-2">
                        <span className={`text-headline-xl ${scoreColor}`}>
                          {avg.toFixed(1)}
                        </span>
                        <span className="mb-2 text-body-lg text-on-surface-variant">
                          / 100
                        </span>
                      </div>
                    ) : (
                      <p className="text-body-sm text-outline">
                        {t.dashboard.noScoresYet}
                      </p>
                    )}
                  </div>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-label-caps mb-1 uppercase text-on-surface-variant">
                        {t.dashboard.sample}
                      </div>
                      <div className="font-semibold text-on-surface">
                        {fmt(
                          project.entries.length === 1
                            ? t.dashboard.users_one
                            : t.dashboard.users_other,
                          { count: project.entries.length },
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-label-caps mb-1 uppercase text-on-surface-variant">
                        {t.dashboard.lastUpdate}
                      </div>
                      <div className="text-body-lg text-on-surface-variant">
                        {lastEntry
                          ? formatRelative(lastEntry.createdAt, locale)
                          : formatRelative(project.createdAt, locale)}
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="mt-auto w-full rounded-lg border border-outline-variant px-4 py-3 text-center text-data-mono uppercase tracking-wide text-primary transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {t.dashboard.viewDetails}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <CreateProjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <ConfirmDialog
        open={pendingDelete !== null}
        title={t.dashboard.deleteTitle}
        message={fmt(t.dashboard.deleteBody, {
          name: pendingDelete?.name ?? "",
        })}
        onConfirm={() => {
          if (pendingDelete) deleteProject(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
