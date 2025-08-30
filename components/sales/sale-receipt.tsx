"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Store, Calendar, User, CreditCard, Printer } from "lucide-react"

interface Sale {
  id: string
  date: string
  customer: {
    id: string
    name: string
  }
  items: Array<{ name: string; quantity: number; price: number }>
  subtotal: number
  total: number
  paymentMethod: string
  status: string
}

interface BusinessSettings {
  business_name: string
  address: string
  phone: string
  email: string
  tax_id: string
  logo_url?: string
  website?: string
  description: string
}

interface SaleReceiptProps {
  sale: Sale
  onClose: () => void
}

export function SaleReceipt({ sale, onClose }: SaleReceiptProps) {
  const [business, setBusiness] = useState<BusinessSettings | null>(null)

  useEffect(() => {
    const fetchBusinessSettings = async () => {
      try {
        const res = await fetch("/api/business-settings")
        if (!res.ok) throw new Error("Error al obtener configuración del negocio")
        const data = await res.json()
        setBusiness(data)
      } catch (error) {
        console.error(error)
        alert("No se pudo cargar la información del negocio")
      }
    }

    fetchBusinessSettings()
  }, [])

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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sale-receipt-title"
    >
      <div className="bg-white rounded-md shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col">
        {/* Encabezado del negocio */}
        <div className="text-center pb-4 border-b mb-4">
          <div className="flex flex-col items-center justify-center gap-0 p-0 m-0">
            {business?.logo_url?.trim() ? (
              <img
                src={business.logo_url}
                alt="Logo del negocio"
                className="h-40 w-40 object-cover rounded-lg m-0 p-0 block"
              />
            ) : (
              <Store className="h-12 w-12 text-primary m-0 p-0" />
            )}
            <h2
              id="sale-receipt-title"
              className="text-2xl font-extrabold m-0 p-0 mt-2"
            >
              {business?.business_name || "Nombre del Negocio"}
            </h2>
          </div>

          <p className="text-sm text-muted-foreground m-0 p-0 mt-2">
            {business?.description || "Sistema de Gestión de Ventas"}
          </p>
          {business && (
            <p className="text-xs text-muted-foreground m-0 p-0 mt-1">
              {business.address && <>Dirección: {business.address}<br /></>}
              {business.phone && <>Tel: {business.phone} </>}
              {business.email && <>| Email: {business.email}</>}
            </p>
          )}
        </div>

        {/* Información de la venta */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Fecha:</span>
            <span>{formatDate(sale.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Cliente:</span>
            <span>{sale.customer?.name ?? "Cliente General"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Método de pago:</span>
            <span>{sale.paymentMethod}</span>
          </div>
        </div>

        <Separator />

        {/* Detalles de productos */}
        <div className="space-y-2 my-4">
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
        <div className="space-y-2 my-4">
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
        <div className="text-center space-y-1 mb-4">
          <p className="text-xs text-muted-foreground">Comprobante #{sale.id}</p>
          <p className="text-xs text-muted-foreground">Estado: {sale.status}</p>
          <p className="text-xs text-muted-foreground">¡Gracias por su compra!</p>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-4 sticky bottom-0 bg-white border-t py-4">
          <Button variant="outline" onClick={handlePrint} className="flex-1 bg-transparent" aria-label="Imprimir comprobante">
            <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
            Imprimir
          </Button>
          <Button onClick={onClose} className="flex-1" aria-label="Cerrar comprobante">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
