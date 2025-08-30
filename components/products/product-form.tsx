"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tag,
  Barcode,
  List,
  Database,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"

export interface ProductFormData {
  name: string
  sku: string
  category: string
  stock: number
  unit_cost: number
  sale_price: number
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
}

const categories = [
  "Bebidas",
  "Endulzantes",
  "Aceites",
  "Granos",
  "Lácteos",
  "Carnes",
  "Verduras",
  "Frutas",
  "Panadería",
  "Limpieza",
]

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name ?? "",
    sku: initialData?.sku ?? "",
    category: initialData?.category ?? "",
    stock: initialData?.stock ?? 0,
    unit_cost: initialData?.unit_cost ?? 0,
    sale_price: initialData?.sale_price ?? 0,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.sku.trim()) newErrors.sku = "El SKU es requerido"
    if (!formData.category) newErrors.category = "La categoría es requerida"
    if (formData.stock < 0) newErrors.stock = "El stock no puede ser negativo"
    if (formData.unit_cost <= 0) newErrors.unit_cost = "El costo debe ser mayor a 0"
    if (formData.sale_price <= 0) newErrors.sale_price = "El precio debe ser mayor a 0"
    if (formData.sale_price <= formData.unit_cost) newErrors.sale_price = "El precio debe ser mayor al costo"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const margin =
    formData.unit_cost > 0
      ? (((formData.sale_price - formData.unit_cost) / formData.unit_cost) * 100).toFixed(1)
      : "0"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="space-y-1 relative">
          <Label htmlFor="name" className="flex items-center gap-1">
            <Tag size={16} />
            Nombre del Producto *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Café Premium 500g"
            className={errors.name ? "border-destructive" : ""}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-sm text-destructive flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle size={16} />
              {errors.name}
            </p>
          )}
        </div>

        {/* SKU */}
        <div className="space-y-1 relative">
          <Label htmlFor="sku" className="flex items-center gap-1">
            <Barcode size={16} />
            SKU / Código *
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange("sku", e.target.value.toUpperCase())}
            placeholder="Ej: CAF001"
            className={errors.sku ? "border-destructive" : ""}
            aria-invalid={!!errors.sku}
            aria-describedby={errors.sku ? "sku-error" : undefined}
          />
          {errors.sku && (
            <p
              id="sku-error"
              className="text-sm text-destructive flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle size={16} />
              {errors.sku}
            </p>
          )}
        </div>

        {/* Categoría */}
        <div className="space-y-1 relative">
          <Label htmlFor="category" className="flex items-center gap-1">
            <List size={16} />
            Categoría *
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
          >
            <SelectTrigger className={errors.category ? "border-destructive" : ""} id="category">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p
              id="category-error"
              className="text-sm text-destructive flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle size={16} />
              {errors.category}
            </p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-1 relative">
          <Label htmlFor="stock" className="flex items-center gap-1">
            <Database size={16} />
            Stock Inicial *
          </Label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={formData.stock}
            onChange={(e) => handleChange("stock", Number.parseInt(e.target.value) || 0)}
            placeholder="0"
            className={errors.stock ? "border-destructive" : ""}
            aria-invalid={!!errors.stock}
            aria-describedby={errors.stock ? "stock-error" : undefined}
          />
          {errors.stock && (
            <p
              id="stock-error"
              className="text-sm text-destructive flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle size={16} />
              {errors.stock}
            </p>
          )}
        </div>

        {/* Costo Unitario */}
        <div className="space-y-1 relative">
          <Label htmlFor="unit_cost" className="flex items-center gap-1">
            <DollarSign size={16} />
            Costo Unitario * ($)
          </Label>
          <Input
            id="unit_cost"
            type="number"
            min={0}
            step={0.01}
            value={formData.unit_cost}
            onChange={(e) => handleChange("unit_cost", Number.parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.unit_cost ? "border-destructive" : ""}
            aria-invalid={!!errors.unit_cost}
            aria-describedby={errors.unit_cost ? "unit_cost-error" : undefined}
          />
          {errors.unit_cost && (
            <p
              id="unit_cost-error"
              className="text-sm text-destructive flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle size={16} />
              {errors.unit_cost}
            </p>
          )}
        </div>

        {/* Precio de Venta */}
        <div className="space-y-1 relative">
          <Label htmlFor="sale_price" className="flex items-center gap-1">
            <DollarSign size={16} />
            Precio de Venta * ($)
          </Label>
          <Input
            id="sale_price"
            type="number"
            min={0}
            step={0.01}
            value={formData.sale_price}
            onChange={(e) => handleChange("sale_price", Number.parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.sale_price ? "border-destructive" : ""}
            aria-invalid={!!errors.sale_price}
            aria-describedby={errors.sale_price ? "sale_price-error" : undefined}
          />
          {errors.sale_price && (
            <p
              id="sale_price-error"
              className="text-sm text-destructive flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle size={16} />
              {errors.sale_price}
            </p>
          )}
        </div>
      </div>

      {/* Resumen de margen */}
      {formData.unit_cost > 0 && formData.sale_price > 0 && (
        <Card>
          <CardContent className="pt-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              Margen de ganancia:
            </span>
            <span
              className={`font-medium flex items-center gap-1 ${
                Number.parseFloat(margin) > 0 ? "text-primary" : "text-destructive"
              }`}
              aria-live="polite"
            >
              {Number.parseFloat(margin) > 0 ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
              +{margin}% (${(formData.sale_price - formData.unit_cost).toFixed(2)})
            </span>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2"
          aria-label="Cancelar"
        >
          <XCircle size={18} />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2"
          aria-label={initialData ? "Actualizar Producto" : "Agregar Producto"}
        >
          <CheckCircle2 size={18} />
          {initialData ? "Actualizar Producto" : "Agregar Producto"}
        </Button>
      </div>
    </form>
  )
}
