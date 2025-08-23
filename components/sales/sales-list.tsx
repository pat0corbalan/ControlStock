// components/sales/sales-list.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, CheckCircle } from "lucide-react"

interface Sale {
  id: string
  date: string
  customer: string
  items: Array<{ name: string; quantity: number; price: number }>
  subtotal: number
  total: number
  paymentMethod: string
  status: string
}

interface SalesListProps {
  sales: Sale[]
  onViewReceipt: (sale: Sale) => void
  onUpdateStatus: (saleId: string, newStatus: string) => void
}

export function SalesList({ sales, onViewReceipt, onUpdateStatus }: SalesListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pagado":
        return <Badge variant="default">Pagado</Badge>
      case "Pendiente":
        return <Badge variant="destructive">Pendiente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Ventas ({sales.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No hay ventas registradas</p>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Venta #{sale.id}</h3>
                      {getStatusBadge(sale.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {sale.customer} • {formatDate(sale.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.items.length} producto(s) • {sale.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold">${sale.total.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onViewReceipt(sale)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sale.status === "Pendiente" && (
                        <Button variant="outline" size="sm" onClick={() => onUpdateStatus(sale.id, "Pagado")}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    <strong>Productos:</strong>{" "}
                    {sale.items.map((item, index) => (
                      <span key={index}>
                        {item.name} (x{item.quantity}){index < sale.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}