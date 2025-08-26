"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SaleItem {
  quantity: number
  unit_price: number
  products: {
    name: string
    sku: string
  }
}

interface Sale {
  id: string
  customer?: {
    id: string
    name: string
  } | null
  total: number
  payment_method: string
  payment_status: string
  created_at: string
  sale_items: SaleItem[]
}


function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals = [
    { label: "año", seconds: 31536000 },
    { label: "mes", seconds: 2592000 },
    { label: "día", seconds: 86400 },
    { label: "hora", seconds: 3600 },
    { label: "minuto", seconds: 60 },
  ]

  for (const i of intervals) {
    const value = Math.floor(seconds / i.seconds)
    if (value >= 1) return `Hace ${value} ${i.label}${value > 1 ? "s" : ""}`
  }

  return "Hace unos segundos"
}

export function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true)
        const res = await fetch("/api/sales/")
        if (!res.ok) throw new Error("Error al cargar ventas")
        const data: Sale[] = await res.json()

        const filtered = data
          .filter((sale) => sale.sale_items && sale.sale_items.length > 0)
          .slice(0, 5)

        setSales(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Cargando ventas...</p>}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {sales.map((sale, index) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.customer?.name?.trim() || "Cliente Anónimo"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Venta #{String(index + 1).padStart(3, "0")} • {getTimeAgo(sale.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      sale.payment_status.toLowerCase() === "pagado"
                        ? "default"
                        : sale.payment_status.toLowerCase() === "pendiente"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {sale.payment_status}
                  </Badge>
                  <div className="text-sm font-medium">${sale.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
