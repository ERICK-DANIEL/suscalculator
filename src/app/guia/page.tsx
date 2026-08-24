import type { Metadata } from "next";
import { GuideContent } from "@/components/guide-content";

export const metadata: Metadata = {
  title: "Guía del SUS",
  description:
    "Qué es la System Usability Scale, cómo se calcula paso a paso y cómo interpretar sus puntuaciones con adjetivos, grados y aceptabilidad.",
};

export default function GuiaPage() {
  return <GuideContent />;
}
