"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Camera, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PhotoFile {
  file?: File;
  url: string;
  isPrimary: boolean;
}

interface PhotoUploadProps {
  photos: PhotoFile[];
  onChange: (photos: PhotoFile[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, maxPhotos = 10 }: PhotoUploadProps) {
  const t = useTranslations("car");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: PhotoFile[] = Array.from(files)
      .slice(0, maxPhotos - photos.length)
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isPrimary: photos.length === 0,
      }));
    onChange([...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((p) => p.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  const setPrimary = (index: number) => {
    const updated = photos.map((p, i) => ({ ...p, isPrimary: i === index }));
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          photos.length >= maxPhotos && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => photos.length < maxPhotos && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
      >
        <Camera className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{t("adicionarFotos")}</p>
        <p className="text-xs text-gray-400">{photos.length}/{maxPhotos}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square rounded-md overflow-hidden border border-gray-200">
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-yellow-400"
                  onClick={() => setPrimary(index)}
                >
                  <Star className={cn("h-4 w-4", photo.isPrimary && "fill-yellow-400 text-yellow-400")} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:text-red-400"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {photo.isPrimary && (
                <div className="absolute top-1 left-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
