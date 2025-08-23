import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Ventas del día
    const today = new Date().toISOString().split("T")[0]
    const { data: todaySales, error: salesError } = await supabase
      .from("sales")
      .select("total")
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`)

    if (salesError) throw salesError

    const dailySales = todaySales?.reduce((sum, sale) => sum + Number.parseFloat(sale.total.toString()), 0) || 0

    // Pagos pendientes
    const { data: pendingPayments, error: pendingError } = await supabase
      .from("sales")
      .select("total")
      .eq("payment_status", "pendiente")

    if (pendingError) throw pendingError

    const totalPending = pendingPayments?.reduce((sum, sale) => sum + Number.parseFloat(sale.total.toString()), 0) || 0

    // Gastos del mes
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const { data: monthlyExpenses, error: expensesError } = await supabase
      .from("expenses")
      .select("amount")
      .gte("expense_date", `${currentMonth}-01`)
      .lt("expense_date", `${currentMonth}-32`)

    if (expensesError) throw expensesError

    const monthlyExpensesTotal =
      monthlyExpenses?.reduce((sum, expense) => sum + Number.parseFloat(expense.amount.toString()), 0) || 0

    // Productos con stock bajo
    const { data: lowStockProducts, error: stockError } = await supabase
      .from("products")
      .select("*")
      .filter("stock", "lte", "min_stock")

    if (stockError) throw stockError

    const stats = {
      dailySales,
      pendingPayments: totalPending,
      monthlyExpenses: monthlyExpensesTotal,
      lowStockCount: lowStockProducts?.length || 0,
      lowStockProducts: lowStockProducts || [],
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
