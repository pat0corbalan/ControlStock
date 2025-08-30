"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, CheckCircle } from "lucide-react"
import { Sale } from "../types/sale"

interface SalesListProps {
  sales: Sale[]
  onViewReceipt: (sale: Sale) => void
  onUpdateStatus: (saleId: string, newStatus: string) => void
}

const PAGE_SIZE = 5 // Cantidad de ventas por página

export function SalesList({ sales, onViewReceipt, onUpdateStatus }: SalesListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(sales.length / PAGE_SIZE)

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
    switch (status.toLowerCase()) {
      case "pagado":
        return <Badge variant="default">Pagado</Badge>
      case "pendiente":
        return <Badge variant="destructive">Pendiente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const paginatedSales = sales.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

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
            {paginatedSales.map((sale) => (
              <div key={sale.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Venta #{sale.id}</h3>
                      {getStatusBadge(sale.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {sale.customer?.name ?? "Desconocido"} • {formatDate(sale.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.items.length} producto(s) • {sale.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold">${sale.total.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onViewReceipt(sale)} title="Ver comprobante">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sale.status.toLowerCase() === "pendiente" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onUpdateStatus(sale.id, "Pagado")}
                          title="Marcar como pagado"
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Pagar
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

            {/* Paginación */}
            <div className="flex justify-end items-center gap-4 pt-2">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                &larr; Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Siguiente &rarr;
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
