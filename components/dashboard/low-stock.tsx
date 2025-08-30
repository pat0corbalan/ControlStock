"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  name: string
  sku: string
  stock: number
  min_stock: number
}

const PAGE_SIZE = 5;

export function LowStock() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalProducts = lowStockProducts.length
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE)
  const currentProducts = lowStockProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertTriangle className="h-6 w-6" />
          Productos con Stock Bajo
          <span className="ml-auto text-sm font-semibold text-gray-700 dark:text-gray-300">
            Total: {totalProducts}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center py-6 text-gray-500">Cargando productos...</p>}
        {error && <p className="text-center py-6 text-red-600 font-semibold">Error: {error}</p>}
        {!loading && !error && (
          <>
            {totalProducts === 0 && <p className="text-center py-6 text-gray-600">No hay productos con stock bajo.</p>}
            {totalProducts > 0 && (
              <>
                <div className="space-y-3">
                  {currentProducts.map(product => (
                    <div
                      key={product.sku}
                      className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3 hover:bg-red-100 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-red-800">{product.name}</p>
                        <p className="text-sm text-red-600">SKU: {product.sku}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-400 text-white font-bold"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          {product.stock} unidades
                        </Badge>
                        <span className="text-xs text-red-500 font-medium">Min: {product.min_stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center gap-4 mt-6">
                  <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                    &larr; Anterior
                  </Button>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Siguiente &rarr;
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
