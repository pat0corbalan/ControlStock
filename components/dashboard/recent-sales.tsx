import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const recentSales = [
  {
    id: "001",
    customer: "María González",
    amount: "$125.00",
    status: "Pagado",
    time: "Hace 2 horas",
  },
  {
    id: "002",
    customer: "Carlos Rodríguez",
    amount: "$89.50",
    status: "Pendiente",
    time: "Hace 4 horas",
  },
  {
    id: "003",
    customer: "Ana López",
    amount: "$234.00",
    status: "Pagado",
    time: "Hace 6 horas",
  },
  {
    id: "004",
    customer: "Luis Martín",
    amount: "$67.25",
    status: "Contra entrega",
    time: "Hace 1 día",
  },
]

export function RecentSales() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">
                  Venta #{sale.id} • {sale.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    sale.status === "Pagado" ? "default" : sale.status === "Pendiente" ? "destructive" : "secondary"
                  }
                >
                  {sale.status}
                </Badge>
                <div className="text-sm font-medium">{sale.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
