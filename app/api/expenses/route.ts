import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false })

    if (error) throw error

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Error al obtener gastos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: expense, error } = await supabase.from("expenses").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Error al crear gasto" }, { status: 500 })
  }
}
