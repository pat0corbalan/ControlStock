"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const res = await fetch("/api/products")
        if (!res.ok) throw new Error("Error al obtener productos")
        const data = await res.json()
        const parsed = data.map((p: any) => ({
          ...p,
          sale_price: Number(p.sale_price),
          stock: Number(p.stock),
        }))
        setProducts(parsed)
      } catch (error) {
        console.error(error)
        alert("No se pudieron cargar los productos")
      } finally {
        setLoadingProducts(false)
      }
    }

    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers")
        if (!res.ok) throw new Error("Error al obtener clientes")
        const data = await res.json()
        setCustomers(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProducts()
    fetchCustomers()
  }, [])

  const addToCart = () => {
    if (!selectedProductId) return
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    const existingItem = cart.find((item) => item.id === selectedProductId)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setSelectedProductId("")
  }

  const updateQuantity = (id: string, newQty: number) => {
    const item = cart.find((i) => i.id === id)
    if (!item) return

    if (newQty <= 0) {
      removeFromCart(id)
    } else if (newQty <= item.stock) {
      setCart(cart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((i) => i.id !== id))
  }

  const subtotal = cart.reduce((sum, i) => sum + i.sale_price * i.quantity, 0)
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
      customer: customer || { id: "", name: "Cliente General" },
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
    await onSubmit(saleData)
    setLoading(false)
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
  value={customer?.id || "general"}  // default "general" si no hay cliente seleccionado
  onValueChange={(value) => {
    if (value === "general") {
      setCustomer(null);
    } else {
      const selected = customers.find((c) => c.id === value) || null;
      setCustomer(selected);
    }
  }}
>
  <SelectTrigger>
    <SelectValue placeholder="Cliente General" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="general">Cliente General</SelectItem> {/* valor no vacío */}
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
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
            <div className="flex gap-2">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id} disabled={p.stock === 0}>
                      <div className="flex justify-between items-center w-full">
                        <span>{p.name}</span>
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-sm text-muted-foreground">${p.sale_price}</span>
                          <Badge variant={p.stock > 5 ? "default" : "destructive"} className="text-xs">
                            {p.stock} en stock
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addToCart} disabled={!selectedProductId}>
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
            Carrito ({cart.length} productos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay productos en el carrito</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.sale_price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">${(item.sale_price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={loading || cart.length === 0 || !paymentMethod}>
          {loading ? "Guardando..." : "Finalizar Venta"}
        </Button>
      </div>
    </form>
  )
}
