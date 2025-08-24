"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, Store } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BusinessSettingsProps {
  onClose: () => void
}

interface BusinessSettingsData {
  id?: string
  business_name: string
  address: string
  phone: string
  email: string
  tax_id: string
  website: string
  description: string
  logo_url: string | null
}

export function BusinessSettings({ onClose }: BusinessSettingsProps) {
  const [businessData, setBusinessData] = useState<BusinessSettingsData>({
    business_name: "",
    address: "",
    phone: "",
    email: "",
    tax_id: "",
    website: "",
    description: "",
    logo_url: null,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fetch business settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/business-settings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Failed to fetch settings")
        const data = await response.json()
        setBusinessData({
          business_name: data.business_name || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          tax_id: data.tax_id || "",
          website: data.website || "",
          description: data.description || "",
          logo_url: data.logo_url || null,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar la configuración del negocio.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleChange = (field: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El archivo debe ser menor a 2MB.",
          variant: "destructive",
        })
        return
      }
      setLogoFile(file)
      setBusinessData((prev) => ({ ...prev, logo_url: URL.createObjectURL(file) }))
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      let logoUrl = businessData.logo_url
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)

        const uploadResponse = await fetch("/api/business-settings/upload-logo", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error("Failed to upload logo")
        const uploadResult = await uploadResponse.json()
        logoUrl = uploadResult.url
      }

      const response = await fetch("/api/business-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...businessData,
          logo_url: logoUrl,
        }),
      })

      if (!response.ok) throw new Error("Failed to update settings")
      toast({
        title: "Éxito",
        description: "Configuración del negocio guardada correctamente.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración del negocio.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
              <Label htmlFor="business_name">Nombre del Negocio *</Label>
              <Input
                id="business_name"
                value={businessData.business_name}
                onChange={(e) => handleChange("business_name", e.target.value)}
                placeholder="Mi Negocio"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_id">RUC / NIT</Label>
              <Input
                id="tax_id"
                value={businessData.tax_id}
                onChange={(e) => handleChange("tax_id", e.target.value)}
                placeholder="12345678901"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={businessData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Calle Principal 123, Ciudad"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={businessData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                value={businessData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://www.minegocio.com"
                disabled={loading}
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
                disabled={loading}
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
                {businessData.logo_url ? (
                  <img
                    src={businessData.logo_url}
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
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={loading} />
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
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="flex-1" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
}