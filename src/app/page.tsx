import type { Metadata } from "next";
import { ProjectsDashboard } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: { absolute: "Calculadora SUS: proyectos y evaluaciones de usabilidad" },
  description:
    "Gestiona y evalúa tus métricas de System Usability Scale: crea proyectos, registra evaluaciones y obtén puntuaciones sobre 100 guardadas en tu navegador.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <ProjectsDashboard />;
}

