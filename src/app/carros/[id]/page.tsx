import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Share2, Phone, MapPin, Calendar, Gauge, Fuel, Car } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Detalhes do Carro - AutoNegocio",
};

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // TODO: Fetch car from Supabase when connected
  // const supabase = await createClient();
  // const { data: car } = await supabase.from("cars").select("*, car_photos(*)").eq("id", id).single();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Link href="/carros" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" /> Voltar à pesquisa
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Gallery Placeholder */}
            <div className="lg:col-span-2">
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Car className="h-20 w-20 mx-auto mb-2" />
                  <p>Carro ID: {id}</p>
                  <p className="text-sm">Conecte o Supabase para ver os detalhes</p>
                </div>
              </div>
            </div>

            {/* Car Info Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Marca Modelo</CardTitle>
                      <p className="text-sm text-gray-500">Versão</p>
                    </div>
                    <Badge>Usado</Badge>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">€XX.XXX</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" /> Ano
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gauge className="h-4 w-4" /> Km
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Fuel className="h-4 w-4" /> Combustível
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" /> Distrito
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button className="flex-1">
                      <Phone className="h-4 w-4 mr-2" /> Contactar
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
