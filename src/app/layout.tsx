import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suscalculator.vercel.app"),
  title: {
    default: "SUS — Calculadora System Usability Scale",
    template: "%s · SUS",
  },
  description:
    "Crea proyectos, registra las respuestas de tus participantes al cuestionario SUS y obtén puntuaciones sobre 100 con grados y aceptabilidad. Los datos se guardan en tu navegador.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "SUS — Calculadora System Usability Scale",
    title: "SUS — Calculadora System Usability Scale",
    description:
      "Cuestionario SUS guiado, puntuación automática sobre 100 y grados de aceptabilidad para tus tests de usabilidad. Gratis y sin registro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SUS — Calculadora System Usability Scale",
    description:
      "Cuestionario SUS guiado, puntuación automática sobre 100 y grados de aceptabilidad para tus tests de usabilidad.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${hanken.variable} ${inter.variable} flex min-h-screen flex-col bg-gradient-to-br from-mesh-gradient-start to-mesh-gradient-end pt-16 text-body-lg text-on-background antialiased`}
      >
        <NavBar />
        <main className="flex w-full flex-1 flex-col">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
