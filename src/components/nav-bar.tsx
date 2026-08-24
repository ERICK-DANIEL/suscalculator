"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { IconClose, IconMenu } from "./icons";
import { LanguageSwitcher } from "./language-switcher";

export function NavBar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const LINKS = [
    { href: "/", label: t.nav.calculator },
    { href: "/guia", label: t.nav.guide },
    { href: "/historia", label: t.nav.history },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant/50 bg-surface/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-5 md:px-16">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-headline-md font-headline font-bold tracking-[0.22em]"
          >
            <span className="text-[#2563EB]">S</span>
            <span className="text-[#64748B]">U</span>
            <span className="text-[#BC4800]">S</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-label-caps uppercase transition-colors duration-200 ${
                    active
                      ? "text-active-indicator"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="cursor-pointer rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface md:hidden"
          >
            {menuOpen ? (
              <IconClose className="h-6 w-6" />
            ) : (
              <IconMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-out md:hidden ${
          menuOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-outline-variant/50 bg-surface-container-lowest/95 px-5 py-4 backdrop-blur-md">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-3 text-label-caps uppercase transition-colors ${
                  active
                    ? "bg-active-indicator/10 text-active-indicator"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
