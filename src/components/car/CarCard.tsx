"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn, formatPrice, formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Fuel, Gauge, Calendar } from "lucide-react";
import type { CarWithPhotos } from "@/types/database";

interface CarCardProps {
  car: CarWithPhotos;
  className?: string;
}

export function CarCard({ car, className }: CarCardProps) {
  const tFuel = useTranslations("fuel");
  const tTrans = useTranslations("transmission");

  const primaryPhoto = car.car_photos?.find((p) => p.is_primary) || car.car_photos?.[0];

  return (
    <Link href={`/carros/${car.id}`} className={cn("group block", className)}>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.url}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Gauge className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant={car.condition === "novo" ? "default" : "secondary"}>
              {car.condition === "novo" ? "Novo" : "Usado"}
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2">
            <span className="rounded-md bg-white/90 px-2 py-1 text-lg font-bold text-gray-900 backdrop-blur-sm">
              {formatPrice(Number(car.price))}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 truncate">
            {car.make} {car.model} {car.version && <span className="font-normal text-gray-500">{car.version}</span>}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" /> {car.year}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Gauge className="h-3 w-3" /> {formatMileage(car.mileage)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Fuel className="h-3 w-3" /> {tFuel(car.fuel_type)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3" /> {car.district}
            </span>
            <span className="text-xs text-gray-400">
              {tTrans(car.transmission)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
