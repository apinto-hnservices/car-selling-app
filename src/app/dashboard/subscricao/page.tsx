import { getTranslations } from "next-intl/server";
import { PricingCards } from "@/components/home/PricingCards";

export default async function SubscriptionPage() {
  const t = await getTranslations("dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("subscricao")}</h1>
      <PricingCards />
    </div>
  );
}
