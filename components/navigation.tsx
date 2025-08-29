"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingCart, Receipt, FileText, Menu, Store } from "lucide-react"

interface BusinessSettings {
  id: string
  business_name: string
  address: string
  phone: string
  email: string
  tax_id: string
  logo_url: string
  created_at: string
  updated_at: string
  description: string
  website: string
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Clientes", href: "/clientes", icon: Package },
  { name: "Ventas", href: "/ventas", icon: ShoppingCart },
  { name: "Gastos", href: "/gastos", icon: Receipt },
  { name: "Comprobantes", href: "/comprobantes", icon: FileText },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const res = await fetch("/api/business-settings")
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data: BusinessSettings = await res.json()
        setBusinessSettings(data)
      } catch (e) {
        setError("No se pudo cargar la configuración del negocio.")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const businessName = businessSettings?.business_name || "Mi Negocio"
  const logoUrl = businessSettings?.logo_url || ""

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <Store className="h-8 w-8 text-sidebar-primary" />
          )}
          {loading ? (
            <h1 className="text-xl font-bold text-sidebar-foreground">Cargando...</h1>
          ) : error ? (
            <h1 className="text-xl font-bold text-red-600">{error}</h1>
          ) : (
            <h1 className="text-xl font-bold text-sidebar-foreground">{businessName}</h1>
          )}
        </div>
        <div className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-6 w-6 rounded object-cover"
              />
            ) : (
              <Store className="h-6 w-6 text-primary" />
            )}
            {loading ? (
              <h1 className="text-lg font-bold">Cargando...</h1>
            ) : error ? (
              <h1 className="text-lg font-bold text-red-600">{error}</h1>
            ) : (
              <h1 className="text-lg font-bold">{businessName}</h1>
            )}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center gap-2 mb-6">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-6 w-6 rounded object-cover"
                  />
                ) : (
                  <Store className="h-6 w-6 text-primary" />
                )}
                <h1 className="text-lg font-bold">{businessName}</h1>
              </div>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
