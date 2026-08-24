"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { IconArrowForward, IconHistoryEdu, IconSpeed } from "@/components/icons";

const STAT_BORDERS = [
  "border-t-primary",
  "border-t-secondary",
  "border-t-tertiary",
] as const;

export function HistoryContent() {
  const { t } = useI18n();
  const h = t.history;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-16">
      <header className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
        <h1 className="mb-6 text-headline-lg-mobile font-headline text-on-surface md:text-headline-xl">
          {h.heroTitle}
        </h1>
        <p className="text-body-lg text-on-surface-variant">{h.heroSubtitle}</p>
      </header>

      <div className="mb-16 grid grid-cols-1 gap-6 md:mb-32 md:grid-cols-12">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-8 shadow-ambient md:col-span-8">
          <div className="relative z-10">
            <span className="text-label-caps mb-4 inline-block rounded-full bg-primary-fixed px-3 py-1 uppercase text-on-primary-fixed">
              {h.originsBadge}
            </span>
            <h2 className="mb-4 text-headline-lg font-headline text-on-surface">
              {h.originsTitle}
            </h2>
            <p className="max-w-xl text-body-lg text-on-surface-variant">
              {h.originsBody}
            </p>
          </div>
          <IconHistoryEdu className="pointer-events-none absolute right-0 bottom-0 h-60 w-60 translate-x-1/4 translate-y-1/4 opacity-5" />
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-outline-variant bg-gradient-to-bl from-surface-container-lowest to-surface-container p-8 shadow-ambient md:col-span-4">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container">
            <IconSpeed className="h-6 w-6" />
          </div>
          <h3 className="mb-3 text-headline-md font-headline text-on-surface">
            {h.quickTitle}
          </h3>
          <p className="text-body-sm text-on-surface-variant">{h.quickBody}</p>
        </div>

        {h.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-outline-variant border-t-4 bg-surface-container-lowest p-8 shadow-ambient md:col-span-4 ${STAT_BORDERS[i]}`}
          >
            <div className="text-label-caps mb-4 uppercase tracking-wider text-on-surface-variant">
              {stat.label}
            </div>
            <div className="mb-2 text-headline-xl text-on-surface">{stat.value}</div>
            <p className="mt-2 border-t border-outline-variant pt-4 text-body-sm text-on-surface-variant">
              {stat.text}
            </p>
          </div>
        ))}
      </div>

      <section className="mx-auto max-w-4xl py-12">
        <h2 className="mb-16 text-center text-headline-lg font-headline text-on-surface">
          {h.timelineTitle}
        </h2>
        <div className="relative ml-4 border-l-2 border-outline-variant md:ml-0 md:border-l-0">
          <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -ml-[1px] bg-outline-variant md:block" />
          {h.timeline.map((event, i) => (
            <div
              key={event.year}
              className={`group relative mb-20 pl-10 last:mb-0 md:flex md:items-center md:pl-0 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`md:w-1/2 transition-transform duration-300 group-hover:-translate-x-2 ${
                  i % 2 === 1 ? "md:pl-16" : "md:pr-16 md:text-right"
                }`}
              >
                <h3 className="mb-3 text-headline-lg font-headline text-primary">
                  {event.year}
                </h3>
                <div className="inline-block w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
                  <h4 className="mb-2 text-headline-md font-headline text-on-surface">
                    {event.title}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant">{event.text}</p>
                </div>
              </div>
              <div
                aria-hidden="true"
                className={`absolute top-6 left-[-9px] z-10 h-5 w-5 rounded-full border-4 border-primary bg-surface-container-lowest transition-all duration-300 group-hover:scale-125 group-hover:bg-primary-fixed md:left-1/2 md:top-auto md:-ml-[10px] ${
                  i === 0 ? "bg-primary" : ""
                } ${i % 2 === 1 ? "md:right-auto" : ""}`}
              />
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-center py-8 text-center">
        <h2 className="text-headline-md font-headline text-on-surface">
          {h.finalTitle}
        </h2>
        <p className="mt-3 max-w-xl text-body-lg text-on-surface-variant">
          {h.finalBody}
        </p>
        <Link
          href="/guia"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
        >
          {h.finalCta}
          <IconArrowForward className="h-[18px] w-[18px]" />
        </Link>
      </section>
    </div>
  );
}
