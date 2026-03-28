"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, User, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [accountType, setAccountType] = useState<"particular" | "stand">("particular");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [nif, setNif] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            type: accountType,
            business_name: accountType === "stand" ? businessName : undefined,
            nif: accountType === "stand" ? nif : undefined,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">Auto<span className="text-blue-600">Negocio</span></span>
            </Link>
          </div>
          <CardTitle>{t("registar")}</CardTitle>
          <CardDescription>{t("jaTemConta")} <Link href="/login" className="text-blue-600 hover:underline">{t("entrar")}</Link></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{error}</div>
            )}
            <div>
              <Label>{t("tipoConta")}</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setAccountType("particular")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    accountType === "particular" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User className={`h-6 w-6 ${accountType === "particular" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className={`text-sm font-medium ${accountType === "particular" ? "text-blue-600" : "text-gray-600"}`}>{t("particular")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("stand")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    accountType === "stand" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Store className={`h-6 w-6 ${accountType === "stand" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className={`text-sm font-medium ${accountType === "stand" ? "text-blue-600" : "text-gray-600"}`}>{t("stand")}</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("nome")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("telefone")}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {accountType === "stand" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">{t("nomeStand")}</Label>
                  <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nif">{t("nif")}</Label>
                  <Input id="nif" value={nif} onChange={(e) => setNif(e.target.value)} required />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmarPassword")}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : t("criarConta")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
