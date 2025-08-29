import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Traer todas las ventas con clientes e items
    const { data: sales, error } = await supabase
      .from("sales")
      .select(
        `
        *,
        customer:customers(name, email, phone),
        sale_items (
          quantity,
          unit_price,
          subtotal,
          products (name, sku)
        )
      `
      )
      .order("created_at", { ascending: false }) // opcional: ordena por fecha

    if (error) throw error

    return NextResponse.json(sales)
  } catch (error) {
    console.error("Error fetching all receipts:", error)
    return NextResponse.json(
      { error: "Error al obtener los recibos de venta" },
      { status: 500 }
    )
  }
}
