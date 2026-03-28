"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const t = useTranslations("home");
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/carros${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("pesquisar")}
        className="flex-1 h-12 rounded-l-lg border-0 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <Button type="submit" className="h-12 rounded-l-none px-6">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
