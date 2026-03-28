import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Eye, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("meuPainel")}</h1>
        <Link href="/dashboard/carros/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> {t("adicionarCarro")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("totalCarros")}</CardTitle>
            <Car className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("carrosAtivos")}</CardTitle>
            <Car className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("visualizacoes")}</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("mensagensNovas")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("meusCarros")}</h2>
        <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-gray-200">
          <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhum carro publicado</p>
          <Link href="/dashboard/carros/novo">
            <Button variant="outline" className="mt-3">
              <Plus className="h-4 w-4 mr-2" /> {t("adicionarCarro")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
