import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Extraer el ID desde la URL
    const url = new URL(request.url)
    const segments = url.pathname.split("/")
    const saleId = segments[segments.length - 1]

    // Traer la venta con el cliente
    const { data: sale, error: saleError } = await supabase
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
      .eq("id", saleId)
      .single()

    if (saleError) throw saleError

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Error fetching receipt:", error)
    return NextResponse.json(
      { error: "Error al obtener recibo de venta" },
      { status: 500 }
    )
  }
}
