import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsDashboard } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: { absolute: "SUS Calculator: projects & usability evaluations" },
  description:
    "Manage and track your System Usability Scale metrics: create projects, record evaluations and get scores out of 100, stored in your browser.",
  alternates: { canonical: "/" },
};

const LANGUAGES = ["Español", "English", "Português", "Français", "Deutsch"];

function AboutSus() {
  return (
    <section
      aria-labelledby="about-sus-title"
      className="mx-auto w-full max-w-[1200px] px-5 pb-16 md:px-16"
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-outline-variant/50 bg-surface-container-lowest/95 p-6 shadow-luminous md:p-8">
        <h2
          id="about-sus-title"
          className="font-headline text-headline-md text-on-surface"
        >
          What is the System Usability Scale?
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          The SUS is a 10-question questionnaire created by John Brooke in 1996
          that measures the perceived usability of any digital product in under
          five minutes.
        </p>
        <p className="mt-3 text-body-lg text-on-surface-variant">
          This calculator records your participants&apos; responses and turns
          them into a score out of 100 with a grade, an adjective and an
          acceptability level based on Bangor, Kortum and Miller. Data is kept
          in your browser and can be exported to CSV.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-label-caps uppercase text-on-surface-variant">
            Available in
          </span>
          {LANGUAGES.map((lang) => (
            <span
              key={lang}
              className="rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1 text-label-caps text-on-surface-variant"
            >
              {lang}
            </span>
          ))}
        </div>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          First time with the method? Read the{" "}
          <Link
            href="/guia"
            className="font-semibold text-active-indicator underline decoration-active-indicator/30 underline-offset-4 hover:decoration-active-indicator"
          >
            complete SUS guide
          </Link>{" "}
          or its{" "}
          <Link
            href="/historia"
            className="font-semibold text-active-indicator underline decoration-active-indicator/30 underline-offset-4 hover:decoration-active-indicator"
          >
            history
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <ProjectsDashboard />
      <AboutSus />
    </>
  );
}

