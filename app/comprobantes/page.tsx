"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ReceiptsList } from "@/components/receipts/receipts-list"
import { BusinessSettings } from "@/components/receipts/business-settings"
import { EnhancedReceipt } from "@/components/receipts/enhanced-receipt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt as ReceiptIcon, Settings, Search, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Receipt } from "@/components/types/receipt"


interface ReceiptsListProps {
  receipts: Receipt[]
  onViewReceipt: (receipt: Receipt) => void
}


export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch receipts on mount
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/receipts")
        if (!response.ok) throw new Error("Failed to fetch receipts")
        const data = await response.json()
        setReceipts(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar los comprobantes.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchReceipts()
  }, [toast])

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "Todos" || receipt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalReceipts = receipts.length
  const paidReceipts = receipts.filter((r) => r.status === "pagado").length
  const pendingReceipts = receipts.filter((r) => r.status === "pendiente").length
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
                <ReceiptIcon className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-1">{paidReceipts}</div>
                <p className="text-xs text-muted-foreground">Comprobantes pagados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <ReceiptIcon className="h-4 w-4 text-chart-2" />
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
                    disabled={loading}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="pagado">Pagado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de comprobantes */}
          {loading ? (
            <p>Cargando comprobantes...</p>
          ) : (
            <ReceiptsList
              receipts={filteredReceipts}
              onViewReceipt={(receipt) => {
                setSelectedReceipt(receipt)
                setShowReceipt(true)
              }}
            />
          )}

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