"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Car, MessageSquare, CreditCard, User } from "lucide-react";

export function DashboardNav() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("meuPainel") },
    { href: "/dashboard/carros", icon: Car, label: t("meusCarros") },
    { href: "/dashboard/mensagens", icon: MessageSquare, label: t("mensagens") },
    { href: "/dashboard/subscricao", icon: CreditCard, label: t("subscricao") },
    { href: "/dashboard/perfil", icon: User, label: t("perfil") },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white p-4">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
