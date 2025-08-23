import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: settings, error } = await supabase.from("business_settings").select("*").limit(1).single()

    if (error) throw error

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching business settings:", error)
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Obtener el primer registro de configuración
    const { data: existingSettings } = await supabase.from("business_settings").select("id").limit(1).single()

    if (existingSettings) {
      // Actualizar configuración existente
      const { data: settings, error } = await supabase
        .from("business_settings")
        .update(body)
        .eq("id", existingSettings.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(settings)
    } else {
      // Crear nueva configuración
      const { data: settings, error } = await supabase.from("business_settings").insert([body]).select().single()

      if (error) throw error
      return NextResponse.json(settings)
    }
  } catch (error) {
    console.error("Error updating business settings:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}
