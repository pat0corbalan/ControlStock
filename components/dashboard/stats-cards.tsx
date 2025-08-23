import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard, Receipt, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Ventas del Día",
    value: "$2,450.00",
    description: "+12% desde ayer",
    icon: DollarSign,
    color: "text-chart-1",
  },
  {
    title: "Pagos Pendientes",
    value: "$1,230.00",
    description: "5 facturas pendientes",
    icon: CreditCard,
    color: "text-chart-2",
  },
  {
    title: "Gastos del Mes",
    value: "$890.00",
    description: "+8% desde el mes pasado",
    icon: Receipt,
    color: "text-chart-3",
  },
  {
    title: "Stock Bajo",
    value: "12",
    description: "Productos por reponer",
    icon: AlertTriangle,
    color: "text-chart-2",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
