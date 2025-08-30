"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react"

interface NewSaleFormProps {
  onSubmit: (saleData: any) => Promise<void>
  onCancel: () => void
}

interface Product {
  id: string
  name: string
  sku: string
  sale_price: number
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

interface Customer {
  id: string
  name: string
}

const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta de crédito" },
  { value: "contra_entrega", label: "Contra entrega" },
  { value: "a_pagar", label: "A pagar (Fiado)" },
]

// Utilidad para formatear moneda local
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value)

export function NewSaleForm({ onSubmit, onCancel }: NewSaleFormProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingProducts(true)
        const [productsRes, customersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/customers"),
        ])

        if (!productsRes.ok) throw new Error("Error al obtener productos")
        if (!customersRes.ok) throw new Error("Error al obtener clientes")

        const productsData = await productsRes.json()
        const customersData = await customersRes.json()

        setProducts(
          productsData.map((p: any) => ({
            ...p,
            sale_price: Number(p.sale_price),
            stock: Number(p.stock),
          }))
        )
        setCustomers(customersData)
      } catch (error) {
        console.error(error)
        alert("No se pudieron cargar los datos")
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchData()
  }, [])

  const addToCart = useCallback(() => {
    if (!selectedProductId) return

    const product = products.find((p) => p.id === selectedProductId)
    if (!product || product.stock === 0) return

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === selectedProductId)
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return currentCart.map((item) =>
            item.id === selectedProductId ? { ...item, quantity: item.quantity + 1 } : item
          )
        }
        alert("No hay más stock disponible para este producto")
        return currentCart
      } else {
        return [...currentCart, { ...product, quantity: 1 }]
      }
    })

    setSelectedProductId("")
  }, [selectedProductId, products])

  const updateQuantity = useCallback(
    (id: string, newQty: number) => {
      setCart((currentCart) => {
        const item = currentCart.find((i) => i.id === id)
        if (!item) return currentCart

        if (newQty <= 0) {
          return currentCart.filter((i) => i.id !== id)
        } else if (newQty <= item.stock) {
          return currentCart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
        } else {
          alert("No hay suficiente stock para aumentar la cantidad")
          return currentCart
        }
      })
    },
    []
  )

  const removeFromCart = useCallback((id: string) => {
    if (confirm("¿Estás seguro que quieres eliminar este producto del carrito?")) {
      setCart((currentCart) => currentCart.filter((item) => item.id !== id))
    }
  }, [])

  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.sale_price * i.quantity, 0), [cart])
  const total = subtotal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert("Agrega al menos un producto")
      return
    }
    if (!paymentMethod) {
      alert("Selecciona un método de pago")
      return
    }

    const saleData = {
      customer: customer ? { id: customer.id, name: customer.name } : null,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.sale_price,
        subtotal: item.sale_price * item.quantity,
      })),
      total,
      paymentMethod,
    }

    setLoading(true)
    try {
      await onSubmit(saleData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cliente y pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="customer">Seleccionar cliente</Label>
            <Select
              value={customer?.id || "general"}
              onValueChange={(value) => {
                if (value === "general") {
                  setCustomer(null)
                } else {
                  const selected = customers.find((c) => c.id === value) || null
                  setCustomer(selected)
                }
              }}
              aria-label="Seleccionar cliente"
            >
              <SelectTrigger>
                <SelectValue placeholder="Cliente General" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Cliente General</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              aria-label="Seleccionar método de pago"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agregar Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProducts ? (
            <p className="text-muted-foreground">Cargando productos...</p>
          ) : (
            <div className="flex gap-2 items-center">
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
                aria-label="Seleccionar producto"
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id} disabled={p.stock === 0}>
                      <div className="flex justify-between items-center w-full">
                        <span>{p.name}</span>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(p.sale_price)}
                          </span>
                          <Badge
                            variant={p.stock > 5 ? "default" : "destructive"}
                            className="text-xs"
                            title={`${p.stock} en stock`}
                          >
                            {p.stock} en stock
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addToCart}
                disabled={!selectedProductId || products.find((p) => p.id === selectedProductId)?.stock === 0}
                aria-label="Agregar producto al carrito"
                title="Agregar"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carrito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito ({cart.length} {cart.length === 1 ? "producto" : "productos"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay productos en el carrito</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  aria-label={`Producto en carrito: ${item.name}, cantidad ${item.quantity}`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.sale_price)} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Disminuir cantidad de ${item.name}`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center" aria-live="polite">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right ml-4 font-semibold" aria-label={`Subtotal de ${item.name}`}>
                    {formatCurrency(item.sale_price * item.quantity)}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-transparent"
          aria-label="Cancelar venta"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading || cart.length === 0 || !paymentMethod}
          aria-label="Finalizar venta"
        >
          {loading ? "Guardando..." : "Finalizar Venta"}
        </Button>
      </div>
    </form>
  )
}
