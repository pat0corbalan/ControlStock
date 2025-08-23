"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ReceiptsList } from "@/components/receipts/receipts-list"
import { BusinessSettings } from "@/components/receipts/business-settings"
import { EnhancedReceipt } from "@/components/receipts/enhanced-receipt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt, Settings, Search, FileText } from "lucide-react"

// Datos de ejemplo para comprobantes (en una app real vendría de la base de datos)
const initialReceipts = [
  {
    id: "V001",
    date: "2024-01-15T10:30:00",
    customer: "María González",
    items: [
      { name: "Café Premium 500g", quantity: 2, price: 12.99 },
      { name: "Azúcar Blanca 1kg", quantity: 1, price: 2.5 },
    ],
    subtotal: 28.48,
    total: 28.48,
    paymentMethod: "Efectivo",
    status: "Pagado",
    type: "Venta",
  },
  {
    id: "V002",
    date: "2024-01-15T14:15:00",
    customer: "Carlos Rodríguez",
    items: [
      { name: "Aceite de Oliva 500ml", quantity: 1, price: 9.99 },
      { name: "Arroz Integral 1kg", quantity: 3, price: 3.75 },
    ],
    subtotal: 21.24,
    total: 21.24,
    paymentMethod: "A pagar",
    status: "Pendiente",
    type: "Venta",
  },
  {
    id: "V003",
    date: "2024-01-15T16:45:00",
    customer: "Ana López",
    items: [{ name: "Leche Entera 1L", quantity: 4, price: 2.99 }],
    subtotal: 11.96,
    total: 11.96,
    paymentMethod: "Tarjeta de crédito",
    status: "Pagado",
    type: "Venta",
  },
]

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState(initialReceipts)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "Todos" || receipt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalReceipts = receipts.length
  const paidReceipts = receipts.filter((r) => r.status === "Pagado").length
  const pendingReceipts = receipts.filter((r) => r.status === "Pendiente").length
  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.total, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Sistema de Comprobantes</h1>
            <p className="text-muted-foreground">Gestiona y reimprime todos los comprobantes generados</p>
          </div>

          {/* Resumen de comprobantes */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comprobantes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReceipts}</div>
                <p className="text-xs text-muted-foreground">Comprobantes generados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagados</CardTitle>
                <Receipt className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-1">{paidReceipts}</div>
                <p className="text-xs text-muted-foreground">Comprobantes pagados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Receipt className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-2">{pendingReceipts}</div>
                <p className="text-xs text-muted-foreground">Pagos pendientes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <Button onClick={() => setShowSettings(true)} variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Negocio
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por ID o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Pagado">Pagado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de comprobantes */}
          <ReceiptsList
            receipts={filteredReceipts}
            onViewReceipt={(receipt) => {
              setSelectedReceipt(receipt)
              setShowReceipt(true)
            }}
          />

          {/* Modal de comprobante mejorado */}
          <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Comprobante de Venta</DialogTitle>
              </DialogHeader>
              {selectedReceipt && <EnhancedReceipt receipt={selectedReceipt} onClose={() => setShowReceipt(false)} />}
            </DialogContent>
          </Dialog>

          {/* Modal de configuración del negocio */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuración del Negocio</DialogTitle>
              </DialogHeader>
              <BusinessSettings onClose={() => setShowSettings(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
