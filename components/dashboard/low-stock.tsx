import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

const lowStockProducts = [
  {
    name: "Café Premium 500g",
    sku: "CAF001",
    stock: 3,
    minStock: 10,
  },
  {
    name: "Azúcar Blanca 1kg",
    sku: "AZU001",
    stock: 5,
    minStock: 15,
  },
  {
    name: "Aceite de Oliva 500ml",
    sku: "ACE001",
    stock: 2,
    minStock: 8,
  },
  {
    name: "Arroz Integral 1kg",
    sku: "ARR001",
    stock: 7,
    minStock: 20,
  },
]

export function LowStock() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-chart-2" />
          Productos con Stock Bajo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.map((product) => (
            <div key={product.sku} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{product.stock} unidades</Badge>
                <span className="text-xs text-muted-foreground">Min: {product.minStock}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
