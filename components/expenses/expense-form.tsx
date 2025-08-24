"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ExpenseFormData {
  description: string;
  amount: number;
  expense_date: string;
  category: string;
}

interface ExpenseFormProps {
  initialData?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  error?: string | null;
  isSubmitting?: boolean;
}

const categories = [
  "Inventario",
  "Servicios",
  "Mantenimiento",
  "Oficina",
  "Transporte",
  "Marketing",
  "Alquiler",
  "Seguros",
  "Otros",
];

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  error,
  isSubmitting,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>(
    initialData || {
      description: "",
      amount: 0,
      expense_date: new Date().toISOString().split("T")[0],
      category: "",
    }
  );

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    let updatedValue: string | number = value;

    if (field === "amount") {
      updatedValue = value === "" ? 0 : Number.parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [field]: updatedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };


  const validateForm = () => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.description.trim())
      newErrors.description = "La descripción es requerida";
    if (formData.amount <= 0)
      newErrors.amount = "El monto debe ser mayor a 0";
    if (!formData.expense_date)
      newErrors.expense_date = "La fecha es requerida";
    if (!formData.category)
      newErrors.category = "La categoría es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Ej: Pago de electricidad, Compra de mercancía..."
          className={errors.description ? "border-destructive" : ""}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Monto * ($)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={
            Number.isNaN(formData.amount) || formData.amount === 0
              ? ""
              : formData.amount
          }
          onChange={(e) => handleChange("amount", e.target.value)}
          placeholder="0.00"
          className={errors.amount ? "border-destructive" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Fecha *</Label>
        <Input
          id="date"
          type="date"
          value={formData.expense_date}
          onChange={(e) => handleChange("expense_date", e.target.value)}
          className={errors.expense_date ? "border-destructive" : ""}
        />
        {errors.expense_date && (
          <p className="text-sm text-destructive">{errors.expense_date}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange("category", value)}
        >
          <SelectTrigger
            className={errors.category ? "border-destructive" : ""}
          >
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
          <p className="text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-transparent"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting
            ? "Procesando..."
            : initialData
            ? "Actualizar Gasto"
            : "Agregar Gasto"}
        </Button>
      </div>
    </form>
  );
}
