"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X, Globe, Car, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useTranslations("common");
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLocale = () => {
    const current = document.cookie.match(/locale=(\w+)/)?.[1] || "pt";
    const next = current === "pt" ? "en" : "pt";
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Auto<span className="text-blue-600">Negocio</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t("inicio")}
            </Link>
            <Link href="/carros" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {t("carros")}
            </Link>
            <Link href="/vin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> VIN
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleLocale} title="Change language">
            <Globe className="h-5 w-5" />
          </Button>
          <Link href="/login">
            <Button variant="ghost">{t("entrar")}</Button>
          </Link>
          <Link href="/registar">
            <Button>{t("registar")}</Button>
          </Link>
        </div>
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
              {t("inicio")}
            </Link>
            <Link href="/carros" className="text-sm font-medium text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
              {t("carros")}
            </Link>
            <Link href="/vin" className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
              <Shield className="h-3.5 w-3.5" /> VIN
            </Link>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleLocale}>
                <Globe className="h-4 w-4 mr-1" /> PT/EN
              </Button>
            </div>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">{t("entrar")}</Button>
            </Link>
            <Link href="/registar" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">{t("registar")}</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
