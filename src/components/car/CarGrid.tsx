import { CarCard } from "./CarCard";
import type { CarWithPhotos } from "@/types/database";

interface CarGridProps {
  cars: CarWithPhotos[];
}

export function CarGrid({ cars }: CarGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
