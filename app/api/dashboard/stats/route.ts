import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Backend: Añadir estadísticas diarias
export async function GET() {
  try {
    const supabase = await createClient()

    // Ventas de los últimos 7 días
    const today = new Date().toISOString().split("T")[0]
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const { data: weeklySales, error: salesError } = await supabase
      .from("sales")
      .select("total, created_at")
      .gte("created_at", sevenDaysAgo.toISOString())

    if (salesError) throw salesError

    // Declaramos explicitamente el tipo de `acc` como un objeto con claves de tipo string y valores numéricos
    const dailySales: { [key: string]: number } = weeklySales?.reduce(
      (acc: { [key: string]: number }, sale) => {
        const day = new Date(sale.created_at).toISOString().split("T")[0]
        if (!acc[day]) acc[day] = 0
        acc[day] += Number.parseFloat(sale.total.toString())
        return acc
      },
      {} // Valor inicial es un objeto vacío
    ) || {}

    // Gastos de los últimos 7 días
    const { data: weeklyExpenses, error: expensesError } = await supabase
      .from("expenses")
      .select("amount, expense_date")
      .gte("expense_date", sevenDaysAgo.toISOString())

    if (expensesError) throw expensesError

    // Declaramos explícitamente el tipo de `acc` para los gastos
    const dailyExpenses: { [key: string]: number } = weeklyExpenses?.reduce(
      (acc: { [key: string]: number }, expense) => {
        const day = new Date(expense.expense_date).toISOString().split("T")[0]
        if (!acc[day]) acc[day] = 0
        acc[day] += Number.parseFloat(expense.amount.toString())
        return acc
      },
      {} // Valor inicial es un objeto vacío
    ) || {}

    // Preparar los datos para el gráfico
    const chartData = Object.keys(dailySales).map((day) => ({
      day,
      ventas: dailySales[day] || 0,
      gastos: dailyExpenses[day] || 0,
    }))

    return NextResponse.json(chartData)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
