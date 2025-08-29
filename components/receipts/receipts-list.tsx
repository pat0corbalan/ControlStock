"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Printer } from "lucide-react"
import { Receipt } from "@/components/types/receipt"

interface ReceiptsListProps {
  receipts: Receipt[]
  onViewReceipt: (receipt: Receipt) => void
}

export function ReceiptsList({ receipts, onViewReceipt }: ReceiptsListProps) {
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
    const normalized = status.toLowerCase()
    switch (normalized) {
      case "pagado":
        return <Badge variant="default">Pagado</Badge>
      case "pendiente":
        return <Badge variant="destructive">Pendiente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleQuickPrint = (receipt: Receipt) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Comprobante ${receipt.id}</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
              .info { margin-bottom: 15px; }
              .items { margin-bottom: 15px; }
              .items table { width: 100%; border-collapse: collapse; }
              .items th, .items td { padding: 5px; text-align: left; border-bottom: 1px solid #eee; }
              .total { text-align: right; font-weight: bold; font-size: 14px; margin-top: 10px; }
              .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Mi Negocio</h2>
              <p>Sistema de Gestión de Ventas</p>
            </div>
            <div class="info">
              <p><strong>Comprobante:</strong> ${receipt.id}</p>
              <p><strong>Fecha:</strong> ${formatDate(receipt.date)}</p>
              <p><strong>Cliente:</strong> ${receipt.customer}</p>
              <p><strong>Método de pago:</strong> ${receipt.paymentMethod}</p>
            </div>
            <div class="items">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${receipt.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div class="total">
              <p>TOTAL: $${receipt.total.toFixed(2)}</p>
            </div>
            <div class="footer">
              <p>Estado: ${receipt.status}</p>
              <p>¡Gracias por su compra!</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }

  if (receipts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg mb-2">No se encontraron comprobantes</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprobantes Generados ({receipts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Comprobante #{receipt.id}</h3>
                    {getStatusBadge(receipt.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {receipt.customer} • {formatDate(receipt.date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {receipt.items.length} producto(s) • {receipt.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold">${receipt.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{receipt.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewReceipt(receipt)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleQuickPrint(receipt)}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-sm text-muted-foreground">
                  <strong>Productos:</strong>{" "}
                  {receipt.items.map((item, index) => (
                    <span key={index}>
                      {item.name} (x{item.quantity})
                      {index < receipt.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
