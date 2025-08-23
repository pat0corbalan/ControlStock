"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, Store } from "lucide-react"

interface BusinessSettingsProps {
  onClose: () => void
}

export function BusinessSettings({ onClose }: BusinessSettingsProps) {
  const [businessData, setBusinessData] = useState({
    name: "Mi Negocio",
    address: "Calle Principal 123, Ciudad",
    phone: "(555) 123-4567",
    email: "info@minegocio.com",
    ruc: "",
    website: "",
    description: "Sistema de Gestión de Ventas",
    logo: null,
  })

  const handleChange = (field: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // En una app real, aquí subirías el archivo al servidor
      setBusinessData((prev) => ({ ...prev, logo: file }))
    }
  }

  const handleSave = () => {
    // En una app real, aquí guardarías los datos en la base de datos
    alert("Configuración guardada exitosamente")
    onClose()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Información del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Negocio *</Label>
              <Input
                id="name"
                value={businessData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Mi Negocio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruc">RUC / NIT</Label>
              <Input
                id="ruc"
                value={businessData.ruc}
                onChange={(e) => handleChange("ruc", e.target.value)}
                placeholder="12345678901"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={businessData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Calle Principal 123, Ciudad"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={businessData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={businessData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="info@minegocio.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                value={businessData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://www.minegocio.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={businessData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descripción de tu negocio"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo del Negocio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                {businessData.logo ? (
                  <img
                    src={URL.createObjectURL(businessData.logo) || "/placeholder.svg"}
                    alt="Logo"
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <Store className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="logo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <Upload className="h-4 w-4" />
                    Subir logo (PNG, JPG - Max 2MB)
                  </div>
                </Label>
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              El logo aparecerá en todos los comprobantes generados. Recomendamos usar una imagen cuadrada de alta
              calidad.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}
