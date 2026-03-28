"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { formatMileage } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { VinRecord, VinMileageHistory, VinOwnershipHistory } from "@/types/database";

interface VinHistoryReportProps {
  vin?: string | null;
  initialRecord?: VinRecord | null;
  initialMileage?: VinMileageHistory[];
  initialOwnership?: VinOwnershipHistory[];
}

export function VinHistoryReport({
  vin: initialVin,
  initialRecord,
  initialMileage,
  initialOwnership,
}: VinHistoryReportProps) {
  const t = useTranslations("vinHistory");
  const [vin, setVin] = useState(initialVin || "");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<VinRecord | null>(initialRecord || null);
  const [mileageHistory, setMileageHistory] = useState<VinMileageHistory[]>(initialMileage || []);
  const [ownershipHistory, setOwnershipHistory] = useState<VinOwnershipHistory[]>(initialOwnership || []);
  const [searched, setSearched] = useState(!!initialRecord);

  const searchVin = async (searchVin?: string) => {
    const vinToSearch = (searchVin || vin).trim().toUpperCase();
    if (!vinToSearch) return;

    setLoading(true);
    try {
      const supabase = createClient();

      const { data: vinRecord } = await supabase
        .from("vin_records")
        .select("*")
        .eq("vin", vinToSearch)
        .single();

      if (vinRecord) {
        setRecord(vinRecord);

        const [{ data: mileage }, { data: ownership }] = await Promise.all([
          supabase
            .from("vin_mileage_history")
            .select("*")
            .eq("vin", vinToSearch)
            .order("recorded_at", { ascending: true }),
          supabase
            .from("vin_ownership_history")
            .select("*")
            .eq("vin", vinToSearch)
            .order("listed_at", { ascending: true }),
        ]);

        setMileageHistory(mileage || []);
        setOwnershipHistory(ownership || []);
      } else {
        setRecord(null);
        setMileageHistory([]);
        setOwnershipHistory([]);
      }
      setSearched(true);
    } catch {
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getMileageTrend = (index: number): "up" | "down" | "same" => {
    if (index === 0) return "same";
    const current = mileageHistory[index].mileage;
    const previous = mileageHistory[index - 1].mileage;
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "same";
  };

  return (
    <div className="space-y-4">
      {/* VIN Search */}
      {!initialVin && (
        <div className="flex gap-2">
          <Input
            placeholder={t("pesquisarVin")}
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && searchVin()}
            className="font-mono"
            maxLength={17}
          />
          <Button onClick={() => searchVin()} disabled={loading || !vin.trim()}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "..." : t("verificarVin")}
          </Button>
        </div>
      )}

      {/* No VIN */}
      {!searched && !initialVin && (
        <Card>
          <CardContent className="py-8 text-center text-gray-400">
            <Gauge className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{t("semVin")}</p>
          </CardContent>
        </Card>
      )}

      {/* No results */}
      {searched && !record && (
        <Card>
          <CardContent className="py-8 text-center text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{t("semHistorico")}</p>
          </CardContent>
        </Card>
      )}

      {/* VIN Report */}
      {record && (
        <>
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-600" />
                  {t("reporteVin")}
                </CardTitle>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                  {record.vin}
                </code>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold">{record.total_owners}</div>
                  <div className="text-xs text-gray-500">{t("totalProprietarios")}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold">{formatDate(record.first_seen_at)}</div>
                  <div className="text-xs text-gray-500">{t("primeiroRegisto")}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold">{formatDate(record.last_seen_at)}</div>
                  <div className="text-xs text-gray-500">{t("ultimoRegisto")}</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${record.has_mileage_anomaly ? "bg-red-50" : "bg-green-50"}`}>
                  {record.has_mileage_anomaly ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  )}
                  <div className="text-sm font-semibold">
                    {record.has_mileage_anomaly ? (
                      <span className="text-red-600">{t("alertaQuilometragem")}</span>
                    ) : (
                      <span className="text-green-600">{t("semAlerta")}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mileage anomaly alert */}
              {record.has_mileage_anomaly && (
                <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">{t("alertaQuilometragem")}</p>
                    <p className="text-sm text-red-600 mt-1">{t("alertaDescida")}</p>
                  </div>
                </div>
              )}

              {record.make && (
                <div className="mt-4 text-sm text-gray-500">
                  {record.make} {record.model} {record.year && `(${record.year})`}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mileage History */}
          {mileageHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("historicoQuilometros")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mileageHistory.map((entry, index) => {
                    const trend = getMileageTrend(index);
                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          trend === "down" ? "border-red-200 bg-red-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                            {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                            {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                            {trend === "same" && <Gauge className="h-4 w-4 text-gray-400" />}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {formatMileage(entry.mileage)}
                              {trend === "down" && (
                                <AlertTriangle className="inline h-4 w-4 text-red-500 ml-2" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(entry.recorded_at)}
                            </div>
                          </div>
                        </div>
                        <Badge variant={entry.source === "inspection" ? "default" : "secondary"}>
                          {t(`fontes.${entry.source}`)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ownership History */}
          {ownershipHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("historicoProprietarios")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ownershipHistory.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {t("proprietario")} #{index + 1}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(entry.listed_at)}
                            {entry.sold_at && ` - ${formatDate(entry.sold_at)}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={entry.seller_type === "stand" ? "default" : "secondary"}>
                          {entry.seller_type === "stand" ? t("stand") : t("particular")}
                        </Badge>
                        {entry.listed_price && (
                          <div className="text-sm font-semibold mt-1">
                            {new Intl.NumberFormat("pt-PT", {
                              style: "currency",
                              currency: "EUR",
                              minimumFractionDigits: 0,
                            }).format(Number(entry.listed_price))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
