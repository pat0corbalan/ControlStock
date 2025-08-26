import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const saleId = params.id

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
