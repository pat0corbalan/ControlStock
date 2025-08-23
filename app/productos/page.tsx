// app/productos/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { ProductsTable } from "@/components/products/products-table";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

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

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit_cost: number;
  sale_price: number;
}

const categories = ["Todas", "Bebidas", "Endulzantes", "Aceites", "Granos", "Lácteos"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products from the backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error((error as Error).message || "Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products locally
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Add a new product
  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al crear producto");
      }
      const newProduct: Product = await response.json();
      setProducts([...products, newProduct]);
      setIsAddDialogOpen(false);
      toast.success("Producto creado correctamente");
    } catch (error) {
      toast.error((error as Error).message || "Error al crear producto");
    }
  };

  // Edit an existing product
  const handleEditProduct = async (productData: ProductFormData) => {
    if (!editingProduct) return;
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al actualizar producto");
      }
      const updatedProduct: Product = await response.json();
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setEditingProduct(null);
      toast.success("Producto actualizado correctamente");
    } catch (error) {
      toast.error((error as Error).message || "Error al actualizar producto");
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Error al eliminar producto");
      }
      setProducts(products.filter((p) => p.id !== productId));
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      toast.error((error as Error).message || "Error al eliminar producto");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
            <p className="text-muted-foreground">Administra tu inventario y catálogo de productos</p>
          </div>
          {isLoading ? (
            <p className="text-center">Cargando productos...</p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                    aria-hidden="true"
                  />
                  <Input
                    placeholder="Buscar por nombre o SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Buscar productos por nombre o SKU"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" /> Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                    </DialogHeader>
                    <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <ProductsTable products={filteredProducts} onEdit={setEditingProduct} onDelete={handleDeleteProduct} />
              <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Producto</DialogTitle>
                  </DialogHeader>
                  {editingProduct && (
                    <ProductForm
                      initialData={editingProduct}
                      onSubmit={handleEditProduct}
                      onCancel={() => setEditingProduct(null)}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </main>
    </div>
  );
}