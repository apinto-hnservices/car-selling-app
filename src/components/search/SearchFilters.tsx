"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";
import { CAR_MAKES, DISTRICTS, FUEL_TYPES, TRANSMISSION_TYPES } from "@/types/database";

export function SearchFilters() {
  const t = useTranslations("common");
  const tCar = useTranslations("car");
  const tFuel = useTranslations("fuel");
  const tTrans = useTranslations("transmission");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    make: searchParams.get("make") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    fuel_type: searchParams.get("fuel_type") || "",
    transmission: searchParams.get("transmission") || "",
    district: searchParams.get("district") || "",
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/carros?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      q: "", make: "", minPrice: "", maxPrice: "",
      minYear: "", maxYear: "", fuel_type: "", transmission: "", district: "",
    });
    router.push("/carros");
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("pesquisar") + "..."}
          value={filters.q}
          onChange={(e) => updateFilter("q", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="flex-1"
        />
        <Button onClick={applyFilters}>{t("pesquisar")}</Button>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${showFilters ? "block" : "hidden md:grid"}`}>
        <div>
          <Label className="text-xs">{tCar("marca")}</Label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={filters.make}
            onChange={(e) => updateFilter("make", e.target.value)}
          >
            <option value="">--</option>
            {CAR_MAKES.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs">{tCar("combustivel")}</Label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={filters.fuel_type}
            onChange={(e) => updateFilter("fuel_type", e.target.value)}
          >
            <option value="">--</option>
            {FUEL_TYPES.map((ft) => (
              <option key={ft} value={ft}>{tFuel(ft)}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs">{tCar("transmissao")}</Label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={filters.transmission}
            onChange={(e) => updateFilter("transmission", e.target.value)}
          >
            <option value="">--</option>
            {TRANSMISSION_TYPES.map((tt) => (
              <option key={tt} value={tt}>{tTrans(tt)}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs">{tCar("distrito")}</Label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={filters.district}
            onChange={(e) => updateFilter("district", e.target.value)}
          >
            <option value="">--</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs">{tCar("preco")} (min)</Label>
          <Input type="number" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} placeholder="€ min" />
        </div>
        <div>
          <Label className="text-xs">{tCar("preco")} (max)</Label>
          <Input type="number" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} placeholder="€ max" />
        </div>
        <div>
          <Label className="text-xs">{tCar("ano")} (min)</Label>
          <Input type="number" value={filters.minYear} onChange={(e) => updateFilter("minYear", e.target.value)} placeholder="2000" />
        </div>
        <div>
          <Label className="text-xs">{tCar("ano")} (max)</Label>
          <Input type="number" value={filters.maxYear} onChange={(e) => updateFilter("maxYear", e.target.value)} placeholder="2025" />
        </div>
      </div>

      <div className={`flex gap-2 ${showFilters ? "flex" : "hidden md:flex"}`}>
        <Button onClick={applyFilters} size="sm">{t("aplicar")}</Button>
        <Button onClick={clearFilters} variant="outline" size="sm">
          <X className="h-3 w-3 mr-1" /> {t("limpar")}
        </Button>
      </div>
    </div>
  );
}
