// app/api/business-settings/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: settings, error } = await supabase
      .from("business_settings")
      .select("*")
      .limit(1)
      .single()

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

    const { data: existingSettings } = await supabase
      .from("business_settings")
      .select("id")
      .limit(1)
      .single()

    if (existingSettings) {
      const { data: settings, error } = await supabase
        .from("business_settings")
        .update({
          business_name: body.business_name,
          address: body.address,
          phone: body.phone,
          email: body.email,
          tax_id: body.tax_id,
          website: body.website,
          description: body.description,
          logo_url: body.logo_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(settings)
    } else {
      const { data: settings, error } = await supabase
        .from("business_settings")
        .insert([
          {
            business_name: body.business_name,
            address: body.address,
            phone: body.phone,
            email: body.email,
            tax_id: body.tax_id,
            website: body.website,
            description: body.description,
            logo_url: body.logo_url,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(settings)
    }
  } catch (error) {
    console.error("Error updating business settings:", error)
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 })
  }
}