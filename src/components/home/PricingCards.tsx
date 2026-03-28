"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function PricingCards() {
  const t = useTranslations("pricing");

  const plans = [
    {
      name: t("gratis"),
      price: "€0",
      period: "",
      description: t("particular"),
      features: [t("publicarGratis"), "Fotos ilimitadas", "Contacto direto"],
      cta: t("subscrever"),
      href: "/registar",
      popular: false,
    },
    {
      name: t("standBasico"),
      price: "€10,99",
      period: t("mesStr"),
      description: t("standBasicoDesc"),
      features: [t("ateCars", { count: 100 }), "Fotos ilimitadas", "Painel de gestão", "Contacto direto", "Perfil de stand"],
      cta: t("subscrever"),
      href: "/registar?type=stand",
      popular: true,
    },
    {
      name: t("standPro"),
      price: "€19,99",
      period: t("mesStr"),
      description: t("standProDesc"),
      features: [t("ateCars", { count: 500 }), "Fotos ilimitadas", "Painel de gestão", "Contacto direto", "Perfil de stand", "Destaques prioritários", "Ferramentas AI"],
      cta: t("subscrever"),
      href: "/registar?type=stand",
      popular: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <Card key={plan.name} className={`relative ${plan.popular ? "border-blue-600 border-2 shadow-lg" : ""}`}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Popular</Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-500">{plan.period}</span>}
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={plan.href}>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
