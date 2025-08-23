"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react"

// Productos disponibles (en una app real vendría de la base de datos)
const availableProducts = [
  { id: "1", name: "Café Premium 500g", sku: "CAF001", price: 12.99, stock: 25 },
  { id: "2", name: "Azúcar Blanca 1kg", sku: "AZU001", price: 2.5, stock: 15 },
  { id: "3", name: "Aceite de Oliva 500ml", sku: "ACE001", price: 9.99, stock: 8 },
  { id: "4", name: "Arroz Integral 1kg", sku: "ARR001", price: 3.75, stock: 30 },
  { id: "5", name: "Leche Entera 1L", sku: "LEC001", price: 2.99, stock: 12 },
]

const paymentMethods = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta de crédito", label: "Tarjeta de crédito" },
  { value: "Contra entrega", label: "Contra entrega" },
  { value: "A pagar", label: "A pagar (Fiado)" },
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
}

interface NewSaleFormProps {
  onSubmit: (saleData: any) => void
  onCancel: () => void
}

export function NewSaleForm({ onSubmit, onCancel }: NewSaleFormProps) {
  const [customer, setCustomer] = useState("")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("")

  const addToCart = () => {
    if (!selectedProductId) return

    const product = availableProducts.find((p) => p.id === selectedProductId)
    if (!product) return

    const existingItem = cart.find((item) => item.id === selectedProductId)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === selectedProductId ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ])
    }
    setSelectedProductId("")
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((item) => item.id === productId)
    if (!item) return

    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else if (newQuantity <= item.stock) {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal // En una app real podría incluir impuestos, descuentos, etc.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert("Agrega al menos un producto a la venta")
      return
    }

    if (!paymentMethod) {
      alert("Selecciona un método de pago")
      return
    }

    const saleData = {
      customer: customer || "Cliente General",
      items: cart.map((item) => ({
        product_id: item.id,      // 👈 Esto es lo que espera el backend
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal,
      total,
      paymentMethod,
    }

    onSubmit(saleData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Nombre del Cliente (Opcional)</Label>
              <Input
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Cliente General"
              />
            </div>
          </CardContent>
        </Card>

        {/* Método de pago */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Selección de productos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agregar Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id} disabled={product.stock === 0}>
                    <div className="flex justify-between items-center w-full">
                      <span>{product.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm text-muted-foreground">${product.price}</span>
                        <Badge variant={product.stock > 5 ? "default" : "destructive"} className="text-xs">
                          {product.stock} en stock
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
        </CardContent>
      </Card>

      {/* Carrito de compras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras ({cart.length} productos)
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
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
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

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={cart.length === 0 || !paymentMethod}>
          Finalizar Venta
        </Button>
      </div>
    </form>
  )
}
