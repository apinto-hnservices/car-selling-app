import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import Link from "next/link";

export default async function MyCarsPage() {
  const t = await getTranslations("dashboard");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("meusCarros")}</h1>
        <Link href="/dashboard/carros/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> {t("adicionarCarro")}
          </Button>
        </Link>
      </div>

      <div className="text-center py-16 text-gray-400 bg-white rounded-lg border border-gray-200">
        <Car className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">Nenhum carro publicado</p>
        <p className="text-sm mb-4">Comece por adicionar o seu primeiro carro</p>
        <Link href="/dashboard/carros/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> {t("adicionarCarro")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
