"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Store, Calendar, User, CreditCard, Printer } from "lucide-react"

interface Sale {
  id: string
  date: string
  customer?: {
    id: string
    name: string
  }
  items: Array<{ name: string; quantity: number; price: number }>
  subtotal: number
  total: number
  paymentMethod: string
  status: string
}


interface SaleReceiptProps {
  sale: Sale
  onClose: () => void
}

export function SaleReceipt({ sale, onClose }: SaleReceiptProps) {
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      {/* Encabezado del negocio */}
      <div className="text-center space-y-2 pb-4 border-b">
        <div className="flex items-center justify-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Mi Negocio</h2>
        </div>
        <p className="text-sm text-muted-foreground">Sistema de Gestión de Ventas</p>
        <p className="text-xs text-muted-foreground">Tel: (555) 123-4567</p>
      </div>

      {/* Información de la venta */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Fecha:</span>
          <span>{formatDate(sale.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Cliente:</span>
          <span>{sale.customer?.name ?? "Desconocido"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Método de pago:</span>
          <span>{sale.paymentMethod}</span>
        </div>
      </div>

      <Separator />

      {/* Detalles de productos */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm">PRODUCTOS</h3>
        {sale.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground">
                {item.quantity} x ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Totales */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${sale.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>TOTAL:</span>
          <span>${sale.total.toFixed(2)}</span>
        </div>
      </div>

      <Separator />

      {/* Información adicional */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">Comprobante #{sale.id}</p>
        <p className="text-xs text-muted-foreground">Estado: {sale.status}</p>
        <p className="text-xs text-muted-foreground">¡Gracias por su compra!</p>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={handlePrint} className="flex-1 bg-transparent">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button onClick={onClose} className="flex-1">
          Cerrar
        </Button>
      </div>
    </div>
  )
}
