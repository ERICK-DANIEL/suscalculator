import type { Metadata } from "next";
import { HistoryContent } from "@/components/history-content";

export const metadata: Metadata = {
  title: { absolute: "Historia del System Usability Scale" },
  description:
    "Los orígenes de la System Usability Scale: de la herramienta interna de John Brooke en DEC (1986) al estándar global de usabilidad.",
  alternates: { canonical: "/historia" },
};

export default function HistoriaPage() {
  return <HistoryContent />;
}
