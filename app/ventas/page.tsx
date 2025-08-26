// app/ventas/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { NewSaleForm } from "@/components/sales/new-sale-form"
import { SalesList } from "@/components/sales/sales-list"
import { SaleReceipt } from "@/components/sales/sale-receipt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Receipt } from "lucide-react"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

interface SaleItem {
  name: string
  quantity: number
  price: number
}

interface Sale {
  id: string
  date: string
  customer: string
  items: SaleItem[]
  subtotal: number
  total: number
  paymentMethod: string
  status: string
}

const mapStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1)

const mapPaymentMethod = (method: string) => {
  switch (method) {
    case "efectivo":
      return "Efectivo"
    case "a_pagar":
      return "A pagar"
    case "tarjeta_credito":
      return "Tarjeta de crédito"
    default:
      return method.charAt(0).toUpperCase() + method.slice(1)
  }
}

const mapSale = (sale: any): Sale => ({
  id: sale.id,
  date: sale.created_at,
  customer: sale.customer || "Anónimo",
  items: (sale.sale_items || []).map((item: any) => ({
    name: item.products?.name || "Sin nombre",
    quantity: item.quantity,
    price: item.unit_price,
  })),
  subtotal: (sale.sale_items || []).reduce((sum: number, item: any) => sum + item.subtotal, 0),
  total: sale.total,
  paymentMethod: mapPaymentMethod(sale.payment_method),
  status: mapStatus(sale.payment_status),
})


export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [showNewSaleForm, setShowNewSaleForm] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSales = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sales")
      if (!response.ok) {
        throw new Error("Error al obtener ventas")
      }
      const data = await response.json()
      setSales(data.map(mapSale))
    } catch (error) {
      toast.error((error as Error).message || "Error al cargar las ventas")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleNewSale = async (saleData: any) => {
  try {
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: saleData.items,
        payment_method: saleData.paymentMethod.toLowerCase().replace(" ", "_"),
        total: saleData.total,
        customer_id: saleData.customer?.id ?? null, // ✅ integración del cliente
      }),
    })

    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error || "Error al crear venta")
    }

    const completeSale = await response.json()
    const newSale = mapSale(completeSale)
    setSales([newSale, ...sales])
    setSelectedSale(newSale)
    setShowNewSaleForm(false)
    setShowReceipt(true)
    toast.success("Venta creada correctamente")
  } catch (error) {
    toast.error((error as Error).message || "Error al crear venta")
  }
}


  const handleUpdateSaleStatus = async (saleId: string, newStatus: string) => {
  try {
    const response = await fetch(`/api/sales/${saleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_status: newStatus.toLowerCase() }),
    })
    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error || "Error al actualizar venta")
    }
    const updatedSale = await response.json()
    setSales((prevSales) =>
      prevSales.map((sale) => (sale.id === saleId ? mapSale(updatedSale) : sale))
    )
    toast.success("Estado de venta actualizado")
  } catch (error) {
    toast.error((error as Error).message || "Error al actualizar venta")
  }
}


  const todaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.date)
    const today = new Date()
    return saleDate.toDateString() === today.toDateString()
  })

  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)
  const pendingPayments = sales.filter((sale) => sale.status === "Pendiente").reduce((sum, sale) => sum + sale.total, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Toaster />
      <Navigation />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Sistema de Ventas</h1>
            <p className="text-muted-foreground">Registra nuevas ventas y gestiona el historial</p>
          </div>

          {isLoading ? (
            <p className="text-center">Cargando ventas...</p>
          ) : (
            <>
              {/* Resumen del día */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${todayTotal.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{todaySales.length} ventas realizadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                    <Receipt className="h-4 w-4 text-chart-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-chart-2">${pendingPayments.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {sales.filter((s) => s.status === "Pendiente").length} facturas pendientes
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <Button onClick={() => setShowNewSaleForm(true)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Venta
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de ventas */}
              <SalesList
                sales={sales}
                onViewReceipt={(sale) => {
                  setSelectedSale(sale)
                  setShowReceipt(true)
                }}
                onUpdateStatus={handleUpdateSaleStatus}
              />
            </>
          )}

          {/* Modal de nueva venta */}
          <Dialog open={showNewSaleForm} onOpenChange={setShowNewSaleForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Venta</DialogTitle>
              </DialogHeader>
              <NewSaleForm onSubmit={handleNewSale} onCancel={() => setShowNewSaleForm(false)} />
            </DialogContent>
          </Dialog>

          {/* Modal de comprobante */}
          <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Comprobante de Venta</DialogTitle>
              </DialogHeader>
              {selectedSale && <SaleReceipt sale={selectedSale} onClose={() => setShowReceipt(false)} />}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}