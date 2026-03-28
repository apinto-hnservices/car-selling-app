import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchFilters } from "@/components/search/SearchFilters";
import { Car } from "lucide-react";

export const metadata = {
  title: "Carros - AutoNegocio",
  description: "Pesquisar carros à venda em Portugal",
};

export default function CarsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Carros à Venda</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchFilters />
          </Suspense>
          <div className="mt-8">
            <div className="text-center py-16 text-gray-400">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum carro encontrado</p>
              <p className="text-sm">Tente alterar os filtros de pesquisa</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
