"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface Product {
  name: string
  sku: string
  stock: number
  min_stock: number
}

export function LowStock() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/products/")
        if (!res.ok) throw new Error("Error al cargar productos")
        const products: Product[] = await res.json()
        const filtered = products.filter(p => p.stock < p.min_stock)
        setLowStockProducts(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-chart-2" />
          Productos con Stock Bajo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Cargando productos...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {lowStockProducts.length === 0 && <p>No hay productos con stock bajo.</p>}
            {lowStockProducts.map(product => (
              <div key={product.sku} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{product.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{product.stock} unidades</Badge>
                  <span className="text-xs text-muted-foreground">Min: {product.min_stock}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
