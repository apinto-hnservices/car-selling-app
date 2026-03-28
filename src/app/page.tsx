import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSearch } from "@/components/home/HeroSearch";
import { PricingCards } from "@/components/home/PricingCards";
import { Car, Users, Building2, Shield } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("titulo")}</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t("subtitulo")}</p>
            <HeroSearch />
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">Carros</div>
              </div>
              <div>
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">Utilizadores</div>
              </div>
              <div>
                <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-500">Stands</div>
              </div>
              <div>
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">20</div>
                <div className="text-sm text-gray-500">Distritos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Planos & Preços</h2>
            <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">Comece gratuitamente ou escolha um plano para o seu stand</p>
            <PricingCards />
          </div>
        </section>

        {/* Recent Cars Placeholder */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("carrosRecentes")}</h2>
            <div className="text-center py-12 text-gray-400">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum carro publicado ainda</p>
              <p className="text-sm">Seja o primeiro a publicar o seu carro!</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
