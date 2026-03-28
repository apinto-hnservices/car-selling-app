import { Header } from "@/components/layout/Header";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export const metadata = {
  title: "Painel - AutoNegocio",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
