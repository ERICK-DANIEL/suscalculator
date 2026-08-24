import type { Metadata } from "next";
import Link from "next/link";
import { ProjectsDashboard } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: {
    absolute:
      "Calculadora SUS — Panel de proyectos y evaluaciones de usabilidad",
  },
  description:
    "Gestiona y evalúa tus métricas de System Usability Scale: proyectos, evaluaciones y puntuaciones guardadas en tu navegador.",
  alternates: { canonical: "/" },
};

function AboutSus() {
  return (
    <section
      aria-labelledby="about-sus-title"
      className="mx-auto mt-4 w-full max-w-[1200px] px-5 pb-16 md:px-16"
    >
      <div className="max-w-3xl rounded-3xl border border-outline-variant/50 bg-surface-container-lowest/95 p-8 shadow-luminous md:p-10">
        <h2
          id="about-sus-title"
          className="font-headline text-headline-md text-on-surface"
        >
          Qué es el System Usability Scale (SUS)
        </h2>
        <p className="mt-5 text-body-lg text-on-surface-variant">
          El System Usability Scale (SUS) es un cuestionario estandarizado de
          10 preguntas con escala Likert de 5 puntos que John Brooke publicó en
          1996 para medir la usabilidad percibida de un producto digital. Es el
          método más utilizado en la industria por su rapidez: aplicar una
          evaluación toma menos de cinco minutos.
        </p>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Esta calculadora organiza tu trabajo en un panel de proyectos donde
          registras las respuestas de cada participante y obtienes
          automáticamente la puntuación media sobre 100. Cada resultado se
          interpreta según los estudios de Bangor, Kortum y Miller con un grado
          académico (de A+ a F), un adjetivo (de «la mejor imaginable» a «la
          peor imaginable») y su nivel de aceptabilidad, tomando 68 puntos como
          frontera entre una experiencia usable y una mejorable.
        </p>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Puedes exportar los resultados a CSV para analizarlos donde
          prefieras, y todos los datos se guardan únicamente en tu navegador:
          no enviamos información a ningún servidor. La interfaz está
          disponible en español, inglés, portugués, francés y alemán, así que
          puedes recoger respuestas tanto en sesiones presenciales como
          remotas.
        </p>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          ¿Nuevo en el método? Consulta la{" "}
          <Link
            href="/guia"
            className="font-semibold text-active-indicator underline decoration-active-indicator/30 underline-offset-4 hover:decoration-active-indicator"
          >
            guía completa del System Usability Scale
          </Link>{" "}
          o descubre la{" "}
          <Link
            href="/historia"
            className="font-semibold text-active-indicator underline decoration-active-indicator/30 underline-offset-4 hover:decoration-active-indicator"
          >
            historia del cuestionario SUS
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
