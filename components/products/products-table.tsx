// components/products/products-table.tsx
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit_cost: number;
  sale_price: number;
  created_at?: string;
}

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              {product.unit_cost !== undefined && product.unit_cost !== null
                ? `$${product.unit_cost.toFixed(2)}`
                : 'N/A'}
            </TableCell>
            <TableCell>
              {product.sale_price !== undefined && product.sale_price !== null
                ? `$${product.sale_price.toFixed(2)}`
                : 'N/A'}
            </TableCell>

            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="mr-2">
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}