import type { Metadata } from "next";
import { HistoryContent } from "@/components/history-content";

export const metadata: Metadata = {
  title: { absolute: "History of the System Usability Scale" },
  description:
    "The origins of the System Usability Scale: from John Brooke's internal tool at DEC (1986) to the global usability standard.",
  alternates: { canonical: "/historia" },
};

export default function HistoriaPage() {
  return <HistoryContent />;
}
