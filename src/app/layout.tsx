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
    default: "SUS — System Usability Scale Calculator",
    template: "%s · SUS",
  },
  description:
    "Create projects, record your participants' responses to the SUS questionnaire and get scores out of 100 with grades and acceptability. Data is stored in your browser.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SUS — System Usability Scale Calculator",
    title: "SUS — System Usability Scale Calculator",
    description:
      "Guided SUS questionnaire, automatic scoring out of 100 and acceptability grades for your usability tests. Free, no sign-up.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SUS — System Usability Scale Calculator",
    description:
      "Guided SUS questionnaire, automatic scoring out of 100 and acceptability grades for your usability tests.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
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
