"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Auto<span className="text-blue-600">Negocio</span></span>
            </div>
            <p className="text-sm text-gray-500">
              A plataforma mais acessível para comprar e vender carros em Portugal.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/carros" className="text-sm text-gray-500 hover:text-gray-900">Carros</Link>
              <Link href="/stands" className="text-sm text-gray-500 hover:text-gray-900">Stands</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/termos" className="text-sm text-gray-500 hover:text-gray-900">{t("termos")}</Link>
              <Link href="/privacidade" className="text-sm text-gray-500 hover:text-gray-900">{t("privacidade")}</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t("contacto")}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/ajuda" className="text-sm text-gray-500 hover:text-gray-900">{t("ajuda")}</Link>
              <Link href="/sobre" className="text-sm text-gray-500 hover:text-gray-900">{t("sobre")}</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            {t("direitos", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
