// app/api/business-settings/upload-logo/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("business-assets")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("business-assets").getPublicUrl(filePath)

    if (!data?.publicUrl) {
      throw new Error("Failed to get public URL")
    }

    return NextResponse.json({ url: data.publicUrl })
  } catch (error) {
    console.error("Error uploading logo:", error)
    return NextResponse.json({ error: "Error al subir el logo" }, { status: 500 })
  }
}