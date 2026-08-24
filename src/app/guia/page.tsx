import type { Metadata } from "next";
import { GuideContent } from "@/components/guide-content";

export const metadata: Metadata = {
  title: { absolute: "System Usability Scale Guide (SUS)" },
  description:
    "What the System Usability Scale is, how it is calculated step by step and how to interpret its scores with adjectives, grades and acceptability.",
  alternates: { canonical: "/guia" },
};

export default function GuiaPage() {
  return <GuideContent />;
}
