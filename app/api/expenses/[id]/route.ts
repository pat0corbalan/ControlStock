import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id } = params

    const { data: expense, error } = await supabase.from("expenses").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json({ error: "Error al actualizar gasto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { error } = await supabase.from("expenses").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "Gasto eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Error al eliminar gasto" }, { status: 500 })
  }
}
