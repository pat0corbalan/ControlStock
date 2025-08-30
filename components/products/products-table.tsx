import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Trash2 } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  unit_cost: number
  sale_price: number
  created_at?: string
}

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Calcular productos que se mostrarán en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const totalPages = Math.ceil(products.length / itemsPerPage)

  const goToPage = (page: number) => {
    if (page < 1) page = 1
    else if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  return (
    <>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-center">{product.stock}</TableCell>
              <TableCell className="text-right">
                {product.unit_cost !== undefined && product.unit_cost !== null
                  ? `$${product.unit_cost.toFixed(2)}`
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                {product.sale_price !== undefined && product.sale_price !== null
                  ? `$${product.sale_price.toFixed(2)}`
                  : "N/A"}
              </TableCell>

              <TableCell className="text-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                  aria-label={`Editar producto ${product.name}`}
                  title="Editar"
                  className="inline-flex items-center gap-1"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                  aria-label={`Eliminar producto ${product.name}`}
                  title="Eliminar"
                  className="inline-flex items-center gap-1"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Siguiente
        </Button>
      </div>
    </>
  )
}
