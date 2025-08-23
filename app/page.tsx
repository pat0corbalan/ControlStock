import { Navigation } from "@/components/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { LowStock } from "@/components/dashboard/low-stock"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Resumen general de tu negocio</p>
          </div>

          <div className="space-y-6">
            <StatsCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <SalesChart />
              <RecentSales />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <LowStock />
              <div className="col-span-4">{/* Espacio para futuras métricas */}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
