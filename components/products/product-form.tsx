// components/products/product-form.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

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
  const [formData, setFormData] = useState<ProductFormData>(
    {
      name: initialData?.name ?? "",
      sku: initialData?.sku ?? "",
      category: initialData?.category ?? "",
      stock: initialData?.stock ?? 0,
      unit_cost: initialData?.unit_cost ?? 0,
      sale_price: initialData?.sale_price ?? 0,
    },
  )

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

  const margin = formData.unit_cost > 0 ? (((formData.sale_price - formData.unit_cost) / formData.unit_cost) * 100).toFixed(1) : "0"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Producto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Café Premium 500g"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU / Código *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange("sku", e.target.value.toUpperCase())}
            placeholder="Ej: CAF001"
            className={errors.sku ? "border-destructive" : ""}
          />
          {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className={errors.category ? "border-destructive" : ""}>
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
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Inicial *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleChange("stock", Number.parseInt(e.target.value) || 0)}
            placeholder="0"
            className={errors.stock ? "border-destructive" : ""}
          />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_cost">Costo Unitario * ($)</Label>
          <Input
            id="unit_cost"
            type="number"
            min="0"
            step="0.01"
            value={formData.unit_cost}
            onChange={(e) => handleChange("unit_cost", Number.parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.unit_cost ? "border-destructive" : ""}
          />
          {errors.unit_cost && <p className="text-sm text-destructive">{errors.unit_cost}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale_price">Precio de Venta * ($)</Label>
          <Input
            id="sale_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.sale_price}
            onChange={(e) => handleChange("sale_price", Number.parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.sale_price ? "border-destructive" : ""}
          />
          {errors.sale_price && <p className="text-sm text-destructive">{errors.sale_price}</p>}
        </div>
      </div>

      {/* Resumen de margen */}
      {formData.unit_cost > 0 && formData.sale_price > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Margen de ganancia:</span>
              <span className={`font-medium ${Number.parseFloat(margin) > 0 ? "text-primary" : "text-destructive"}`}>
                +{margin}% (${(formData.sale_price - formData.unit_cost).toFixed(2)})
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {initialData ? "Actualizar Producto" : "Agregar Producto"}
        </Button>
      </div>
    </form>
  )
}