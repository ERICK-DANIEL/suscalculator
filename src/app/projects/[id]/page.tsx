import type { Metadata } from "next";
import { ProjectView } from "@/components/project-view";

export const metadata: Metadata = {
  title: "Detalle del proyecto",
  description:
    "Puntuaciones SUS del proyecto: media, adjetivo, grado, aceptabilidad, evaluaciones por participante y exportación a CSV.",
};

export default async function ProjectPage(
  props: PageProps<'/projects/[id]'>,
) {
  const { id } = await props.params;
  return <ProjectView projectId={id} />;
}
