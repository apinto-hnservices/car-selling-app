"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoUpload } from "@/components/car/PhotoUpload";
import { CAR_MAKES, DISTRICTS, FUEL_TYPES, TRANSMISSION_TYPES } from "@/types/database";
import type { FuelType, TransmissionType, CarCondition } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

interface PhotoFile {
  file?: File;
  url: string;
  isPrimary: boolean;
}

export default function NewCarPage() {
  const t = useTranslations("car");
  const tFuel = useTranslations("fuel");
  const tTrans = useTranslations("transmission");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  const [form, setForm] = useState({
    make: "",
    model: "",
    version: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: "gasolina" as FuelType,
    transmission: "manual" as TransmissionType,
    power_hp: "",
    engine_cc: "",
    color: "",
    doors: "5",
    seats: "5",
    vin: "",
    description: "",
    condition: "usado" as CarCondition,
    district: "",
    city: "",
  });

  const updateForm = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Tem de iniciar sessão para publicar um carro");
        setLoading(false);
        return;
      }

      // Insert car
      const { data: car, error: carError } = await supabase
        .from("cars")
        .insert({
          seller_id: user.id,
          make: form.make,
          model: form.model,
          version: form.version || null,
          year: form.year,
          price: form.price,
          mileage: form.mileage,
          fuel_type: form.fuel_type,
          transmission: form.transmission,
          power_hp: form.power_hp ? parseInt(form.power_hp) : null,
          engine_cc: form.engine_cc ? parseInt(form.engine_cc) : null,
          color: form.color || null,
          doors: parseInt(form.doors),
          seats: parseInt(form.seats),
          vin: form.vin || null,
          description: form.description || null,
          condition: form.condition,
          district: form.district,
          city: form.city || null,
        })
        .select()
        .single();

      if (carError) throw carError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (photo.file) {
          const ext = photo.file.name.split(".").pop();
          const path = `cars/${car.id}/${i}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("car-photos")
            .upload(path, photo.file);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from("car-photos")
              .getPublicUrl(path);

            await supabase.from("car_photos").insert({
              car_id: car.id,
              url: publicUrl,
              position: i,
              is_primary: photo.isPrimary,
            });
          }
        }
      }

      router.push("/dashboard/carros");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar o carro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("criarAnuncio")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>
        )}

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("fotos")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoUpload photos={photos} onChange={setPhotos} />
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("detalhes")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("marca")} *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1"
                  value={form.make}
                  onChange={(e) => updateForm("make", e.target.value)}
                  required
                >
                  <option value="">--</option>
                  {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <Label>{t("modelo")} *</Label>
                <Input value={form.model} onChange={(e) => updateForm("model", e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label>{t("versao")}</Label>
                <Input value={form.version} onChange={(e) => updateForm("version", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t("ano")} *</Label>
                <Input type="number" value={form.year} onChange={(e) => updateForm("year", parseInt(e.target.value))} min={1900} max={2030} required className="mt-1" />
              </div>
            </div>

            <div>
              <Label>{t("condicao")} *</Label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input type="radio" name="condition" value="usado" checked={form.condition === "usado"} onChange={(e) => updateForm("condition", e.target.value)} />
                  <span className="text-sm">{t("usado")}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="condition" value="novo" checked={form.condition === "novo"} onChange={(e) => updateForm("condition", e.target.value)} />
                  <span className="text-sm">{t("novo")}</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("preco")} (€) *</Label>
                <Input type="number" value={form.price} onChange={(e) => updateForm("price", parseInt(e.target.value) || 0)} min={0} required className="mt-1" />
              </div>
              <div>
                <Label>{t("quilometros")} *</Label>
                <Input type="number" value={form.mileage} onChange={(e) => updateForm("mileage", parseInt(e.target.value) || 0)} min={0} required className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("especificacoes")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("combustivel")} *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1"
                  value={form.fuel_type}
                  onChange={(e) => updateForm("fuel_type", e.target.value)}
                  required
                >
                  {FUEL_TYPES.map((ft) => <option key={ft} value={ft}>{tFuel(ft)}</option>)}
                </select>
              </div>
              <div>
                <Label>{t("transmissao")} *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1"
                  value={form.transmission}
                  onChange={(e) => updateForm("transmission", e.target.value)}
                  required
                >
                  {TRANSMISSION_TYPES.map((tt) => <option key={tt} value={tt}>{tTrans(tt)}</option>)}
                </select>
              </div>
              <div>
                <Label>{t("potencia")} (CV)</Label>
                <Input type="number" value={form.power_hp} onChange={(e) => updateForm("power_hp", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t("cilindrada")} (cc)</Label>
                <Input type="number" value={form.engine_cc} onChange={(e) => updateForm("engine_cc", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t("cor")}</Label>
                <Input value={form.color} onChange={(e) => updateForm("color", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t("portas")}</Label>
                <Input type="number" value={form.doors} onChange={(e) => updateForm("doors", e.target.value)} min={2} max={6} className="mt-1" />
              </div>
              <div>
                <Label>{t("lugares")}</Label>
                <Input type="number" value={form.seats} onChange={(e) => updateForm("seats", e.target.value)} min={1} max={9} className="mt-1" />
              </div>
              <div>
                <Label>{t("vin")}</Label>
                <Input value={form.vin} onChange={(e) => updateForm("vin", e.target.value)} placeholder="WVWZZZ3CZWE123456" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("distrito")} *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-1"
                  value={form.district}
                  onChange={(e) => updateForm("district", e.target.value)}
                  required
                >
                  <option value="">--</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <Label>{t("cidade")}</Label>
                <Input value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("descricao")}</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Descreva o seu carro..."
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "A publicar..." : t("publicar")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
