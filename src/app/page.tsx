import type { Metadata } from "next";
import { ProjectsDashboard } from "@/components/projects-grid";

export const metadata: Metadata = {
  title: "Panel de proyectos",
  description:
    "Gestiona y evalúa tus métricas de System Usability Scale: proyectos, evaluaciones y puntuaciones guardadas en tu navegador.",
};

export default function Home() {
  return <ProjectsDashboard />;
}
