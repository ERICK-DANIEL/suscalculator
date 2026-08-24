import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsDashboard } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: { absolute: "Calculadora SUS: proyectos y evaluaciones de usabilidad" },
  description:
    "Gestiona y evalúa tus métricas de System Usability Scale: crea proyectos, registra evaluaciones y obtén puntuaciones sobre 100 guardadas en tu navegador.",
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
          Qué es el System Usability Scale
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          El SUS es un cuestionario de 10 preguntas creado por John Brooke en
          1996 que mide la usabilidad percibida de cualquier producto digital
          en menos de cinco minutos.
        </p>
        <p className="mt-3 text-body-lg text-on-surface-variant">
          Esta calculadora registra las respuestas de tus participantes y las
          convierte en una puntuación de 0 a 100 con grado, adjetivo y nivel de
          aceptabilidad según Bangor, Kortum y Miller. Los datos se guardan en
          tu navegador y puedes exportarlos a CSV.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-label-caps uppercase text-on-surface-variant">
            Disponible en
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
          ¿Primera vez con el método? Consulta la{" "}
          <Link
            href="/guia"
            className="font-semibold text-active-indicator underline decoration-active-indicator/30 underline-offset-4 hover:decoration-active-indicator"
          >
            guía completa del SUS
          </Link>{" "}
          o su{" "}
          <Link
            href="/historia"
            className="font-semibold text-active-indicator underline decoration-active-indicator/30 underline-offset-4 hover:decoration-active-indicator"
          >
            historia
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

