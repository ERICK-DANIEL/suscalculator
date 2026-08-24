"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { IconArrowForward, IconCheckCircle } from "@/components/icons";

const STEP_CLASSES = [
  {
    classes: "border-l-primary bg-primary-fixed/20 border-outline-variant",
    titleClass: "text-on-primary-fixed-variant",
  },
  {
    classes: "border-l-tertiary bg-tertiary-fixed/30 border-outline-variant",
    titleClass: "text-on-tertiary-fixed-variant",
  },
  {
    classes: "border-l-secondary bg-secondary-fixed/20 border-outline-variant",
    titleClass: "text-on-secondary-fixed-variant",
  },
] as const;

const EXAMPLE_ROWS = [
  { raw: "4", converted: "3" },
  { raw: "2", converted: "3" },
] as const;

const GRADE_CHIP_CLASSES = [
  "bg-secondary-container text-on-secondary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-surface-container-high text-on-surface",
  "bg-surface-container-high text-on-surface",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-error-container text-on-error-container",
] as const;

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-data-mono mt-3 inline-block rounded bg-surface-container px-2 py-1 text-on-surface">
      {children}
    </code>
  );
}

export function GuideContent() {
  const { t } = useI18n();
  const g = t.guide;
  const scaleRows = [
    { range: "85–100", grade: "A+", id: "a_plus" as const },
    { range: "73–84.9", grade: "A", id: "a" as const },
    { range: "52–72.9", grade: "B", id: "b" as const },
    { range: "39–51.9", grade: "C", id: "c" as const },
    { range: "25–38.9", grade: "D", id: "d" as const },
    { range: "0–24.9", grade: "F", id: "f" as const },
  ];
  const acceptabilityCells = [
    { label: t.sus.acceptability.acceptable, cls: "font-medium text-secondary" },
    { label: t.sus.acceptability.acceptable, cls: "font-medium text-secondary" },
    { label: t.sus.marginalAcceptable, cls: "text-on-surface-variant" },
    { label: t.sus.acceptability.marginal, cls: "text-on-surface-variant" },
    { label: t.sus.acceptability.unacceptable, cls: "font-medium text-tertiary" },
    { label: t.sus.acceptability.unacceptable, cls: "font-medium text-tertiary" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-16">
      <header className="mx-auto mb-24 max-w-3xl text-center">
        <h1 className="mb-6 text-headline-lg-mobile font-headline text-on-surface md:text-headline-xl">
          {g.heroTitle}
        </h1>
        <p className="text-body-lg text-on-surface-variant">{g.heroSubtitle}</p>
      </header>

      <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-12">
        <section className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-ambient md:col-span-8">
          <h2 className="mb-6 text-headline-md font-headline text-on-surface">
            {g.whatTitle}
          </h2>
          <div className="space-y-4 text-body-lg text-on-surface-variant">
            {g.whatParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-center rounded-xl border border-outline-variant/60 bg-surface-container-low p-8 shadow-ambient md:col-span-4">
          <h3 className="mb-6 text-headline-md font-headline text-on-surface">
            {g.featuresTitle}
          </h3>
          <ul className="space-y-4 text-body-sm text-on-surface-variant">
            {g.features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <IconCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <strong>{f.title}</strong> {f.body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-ambient md:col-span-12">
          <h2 className="mb-6 text-headline-md font-headline text-on-surface">
            {g.calcTitle}
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="mb-6 text-body-lg text-on-surface-variant">
                {g.calcIntro}{" "}
                <strong className="text-on-surface">{g.calcIntroStrong}</strong>.
              </p>
              <div className="space-y-6">
                {g.steps.map((step, i) => (
                  <div
                    key={step.title}
                    className={`rounded-lg border border-l-4 border-outline-variant p-5 ${STEP_CLASSES[i].classes}`}
                  >
                    <h4
                      className={`text-label-caps mb-2 uppercase ${STEP_CLASSES[i].titleClass}`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {step.text}
                    </p>
                    <Formula>{step.formula}</Formula>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-low p-8 shadow-ambient">
              <div
                aria-hidden="true"
                className="absolute top-0 -mr-16 -mt-16 right-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl"
              />
              <div className="relative z-10 mb-6 text-center">
                <span className="text-label-caps rounded-full border border-primary-fixed-dim/50 bg-primary-fixed/30 px-3 py-1 uppercase text-primary">
                  {g.exampleBadge}
                </span>
              </div>
              <table className="text-data-mono relative z-10 w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="py-3 font-medium text-on-surface-variant">#</th>
                    <th className="py-3 font-medium text-on-surface-variant">
                      {g.colRaw}
                    </th>
                    <th className="py-3 text-right font-medium text-on-surface-variant">
                      {g.colConverted}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2].map((n, idx) => (
                    <tr
                      key={n}
                      className="border-b border-surface-container-high transition-colors hover:bg-surface-container"
                    >
                      <td className="py-3 text-on-surface">
                        {idx === 0 ? fmtQ(g.qOdd, n) : fmtQ(g.qEven, n)}
                      </td>
                      <td className="py-3 text-on-surface-variant">
                        {EXAMPLE_ROWS[idx].raw}
                      </td>
                      <td className="py-3 text-right font-semibold text-on-surface">
                        {EXAMPLE_ROWS[idx].converted}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="text-body-sm py-3 text-center italic text-outline">
                      …
                    </td>
                  </tr>
                  <tr className="border-t-2 border-outline-variant text-on-surface">
                    <td className="py-4">{g.sumRow}</td>
                    <td />
                    <td className="py-4 text-right font-bold">27</td>
                  </tr>
                  <tr className="rounded-lg bg-primary-fixed/20 text-primary">
                    <td className="rounded-l-lg py-4 pl-2 font-bold">{g.finalRow}</td>
                    <td />
                    <td className="rounded-r-lg py-4 pr-2 text-right text-lg font-bold">
                      67.5
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-2 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-ambient md:col-span-12">
          <h2 className="mb-2 text-headline-md font-headline text-on-surface">
            {g.interpretTitle}
          </h2>
          <p className="mb-6 max-w-2xl text-body-lg text-on-surface-variant">
            {g.interpretBody}
          </p>
          <div className="overflow-x-auto rounded-xl border border-outline-variant/50">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low text-label-caps uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-4 font-bold">{g.thRange}</th>
                  <th className="px-6 py-4 font-bold">{g.thGrade}</th>
                  <th className="px-6 py-4 font-bold">{g.thAdjective}</th>
                  <th className="px-6 py-4 font-bold">{g.thAcceptability}</th>
                </tr>
              </thead>
              <tbody className="text-body-sm">
                {scaleRows.map((row, i) => (
                  <tr
                    key={row.grade}
                    className="border-b border-outline-variant/30 transition-colors last:border-b-0 hover:bg-surface-container-low/50"
                  >
                    <td className="px-6 py-4 text-data-mono tabular-nums text-on-surface">
                      {row.range}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded px-2.5 py-0.5 text-data-mono font-bold ${GRADE_CHIP_CLASSES[i]}`}
                      >
                        {row.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {t.sus.bands[row.id].adjective}
                    </td>
                    <td className={`px-6 py-4 ${acceptabilityCells[i].cls}`}>
                      {acceptabilityCells[i].label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-2 flex flex-col items-center rounded-xl border border-outline-variant/60 bg-gradient-to-br from-surface-container-lowest to-surface-container-low p-12 text-center shadow-ambient md:col-span-12">
          <h2 className="text-headline-md font-headline text-on-surface">
            {g.readyTitle}
          </h2>
          <p className="mt-2 max-w-md text-body-lg text-on-surface-variant">
            {g.readyBody}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-data-mono uppercase tracking-wide text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-luminous"
          >
            {g.readyCta}
            <IconArrowForward className="h-[18px] w-[18px]" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function fmtQ(template: string, n: number): string {
  return template.replace("{n}", String(n));
}
