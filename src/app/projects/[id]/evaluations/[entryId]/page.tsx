import type { Metadata } from "next";
import { EntryView } from "@/components/entry-view";

export const metadata: Metadata = {
  title: "Respuestas del participante",
  description:
    "Detalle de las respuestas al cuestionario SUS de un participante y su puntuación calculada.",
};

export default async function EvaluationPage(
  props: PageProps<'/projects/[id]/evaluations/[entryId]'>,
) {
  const { id, entryId } = await props.params;
  return <EntryView projectId={id} entryId={entryId} />;
}
