import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: sales, error } = await supabase
      .from("sales")
      .select(`
        *,
        customer:customers (id, name),
        sale_items (
          *,
          products (name, sku)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(sales)
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json({ error: "Error al obtener ventas" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { items, payment_method, total, customer_id } = await request.json()

    // Validación básica
    if (!customer_id) {
      return NextResponse.json({ error: "Falta el ID del cliente" }, { status: 400 })
    }

    // Crear la venta con el cliente
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert([
        {
          total,
          payment_method,
          payment_status: payment_method === "a_pagar" ? "pendiente" : "pagado",
          customer_id, // ✅ Asociar cliente aquí
        },
      ])
      .select()
      .single()

    if (saleError) throw saleError

    // Crear los items de la venta y actualizar stock
    for (const item of items) {
      // Insertar item de venta
      const { error: itemError } = await supabase.from("sale_items").insert([
        {
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        },
      ])

      if (itemError) throw itemError

      // Actualizar stock del producto
      const { error: stockError } = await supabase.rpc("update_product_stock", {
        product_id: item.product_id,
        quantity_sold: item.quantity,
      })

      if (stockError) {
        // Si no existe la función, actualizar manualmente
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single()

        if (product) {
          await supabase
            .from("products")
            .update({ stock: product.stock - item.quantity })
            .eq("id", item.product_id)
        }
      }
    }

    // Obtener la venta completa con items
    const { data: completeSale, error: fetchError } = await supabase
      .from("sales")
      .select(`
        *,
        sale_items (
          *,
          products (name, sku)
        )
      `)
      .eq("id", sale.id)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json(completeSale)
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 })
  }
}
