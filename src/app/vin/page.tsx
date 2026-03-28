import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VinHistoryReport } from "@/components/car/VinHistoryReport";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Verificar VIN - AutoNegocio",
  description: "Verifique o histórico de quilometragem e proprietários de qualquer carro pelo número VIN",
};

export default async function VinCheckPage() {
  const t = await getTranslations("vinHistory");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-blue-200" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("reporteVin")}</h1>
            <p className="text-blue-100 max-w-xl mx-auto">
              Verifique o histórico de quilometragem e proprietários anteriores de qualquer veículo.
              Proteja-se contra fraudes de quilometragem.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <VinHistoryReport />
        </div>
      </main>
      <Footer />
    </div>
  );
}
