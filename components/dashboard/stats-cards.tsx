"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Receipt, AlertTriangle } from "lucide-react";

interface StatsData {
  dailySales: number;
  pendingPayments: number;
  monthlyExpenses: number;
  lowStockCount: number;
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
}

function StatCard({ title, value, description, Icon, colorClass }: StatCardProps) {
  return (
    <Card role="region" aria-label={title} tabIndex={0}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Fetch sales
        const salesRes = await fetch("/api/sales/");
        if (!salesRes.ok) throw new Error("No se pudieron cargar las ventas");
        const salesData = await salesRes.json();

        // Fetch expenses
        const expensesRes = await fetch("/api/expenses/");
        if (!expensesRes.ok) throw new Error("No se pudieron cargar los gastos");
        const expensesData = await expensesRes.json();

        // Fetch low stock products
        const productsRes = await fetch("/api/products/");
        if (!productsRes.ok) throw new Error("No se pudieron cargar los productos");
        const productsData = await productsRes.json();

        const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        // Ventas del día: sumamos ventas con created_at igual a hoy y pagado
        const dailySales = salesData
          .filter((sale: any) => sale.created_at?.slice(0, 10) === today && sale.payment_status === "pagado")
          .reduce((acc: number, sale: any) => acc + Number(sale.total || 0), 0);

        // Pagos pendientes: sumamos ventas con payment_status diferente a pagado (ej: "pendiente", "a_pagar", etc)
        const pendingPayments = salesData
          .filter((sale: any) => sale.payment_status !== "pagado")
          .reduce((acc: number, sale: any) => acc + Number(sale.total || 0), 0);

        // Gastos del mes: sumamos gastos con created_at dentro del mes actual
        const monthlyExpenses = expensesData
          .filter((expense: any) => expense.created_at?.slice(0, 7) === currentMonth)
          .reduce((acc: number, expense: any) => acc + Number(expense.amount || 0), 0);

        // Stock bajo: contamos productos con stock menor a cierto umbral, ej: 5
        const lowStockCount = productsData.filter((product: any) => product.stock !== undefined && product.stock < 5).length;

        setStats({
          dailySales,
          pendingPayments,
          monthlyExpenses,
          lowStockCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!stats) return null;

  const formatCurrency = (value: number) =>
    value.toLocaleString("es-ES", { style: "currency", currency: "ARS" });

  const cards: StatCardProps[] = [
    {
      title: "Ventas del Día",
      value: formatCurrency(stats.dailySales),
      description: "+12% desde ayer",
      Icon: DollarSign,
      colorClass: "text-chart-1",
    },
    {
      title: "Pagos Pendientes",
      value: formatCurrency(stats.pendingPayments),
      description: "Facturas pendientes",
      Icon: CreditCard,
      colorClass: "text-chart-2",
    },
    {
      title: "Gastos del Mes",
      value: formatCurrency(stats.monthlyExpenses),
      description: "+8% desde el mes pasado",
      Icon: Receipt,
      colorClass: "text-chart-3",
    },
    {
      title: "Stock Bajo",
      value: stats.lowStockCount.toString(),
      description: "Productos por reponer",
      Icon: AlertTriangle,
      colorClass: "text-chart-2",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, description, Icon, colorClass }) => (
        <StatCard
          key={title}
          title={title}
          value={value}
          description={description}
          Icon={Icon}
          colorClass={colorClass}
        />
      ))}
    </div>
  );
}
