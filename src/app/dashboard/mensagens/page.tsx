import { getTranslations } from "next-intl/server";
import { MessageSquare } from "lucide-react";

export default async function MessagesPage() {
  const t = await getTranslations("dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("mensagens")}</h1>
      <div className="text-center py-16 text-gray-400 bg-white rounded-lg border border-gray-200">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">Sem mensagens</p>
        <p className="text-sm">As mensagens dos compradores aparecerão aqui</p>
      </div>
    </div>
  );
}
