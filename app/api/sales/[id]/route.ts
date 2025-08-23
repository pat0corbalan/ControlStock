import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id } = params

    const { data: sale, error } = await supabase.from("sales").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Error updating sale:", error)
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}
