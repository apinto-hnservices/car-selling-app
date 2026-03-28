import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const t = await getTranslations("dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("perfil")}</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> {t("perfil")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Conecte o Supabase para gerir o seu perfil
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
