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

    const dailySales =
      todaySales?.reduce(
        (sum, sale) => sum + Number.parseFloat(sale.total.toString()),
        0
      ) || 0

    // Pagos pendientes
    const { data: pendingPayments, error: pendingError } = await supabase
      .from("sales")
      .select("total")
      .eq("payment_status", "pendiente")

    if (pendingError) throw pendingError

    const totalPending =
      pendingPayments?.reduce(
        (sum, sale) => sum + Number.parseFloat(sale.total.toString()),
        0
      ) || 0

    // Gastos del mes (usando fecha válida)
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() // 0-indexed

    const startOfMonth = new Date(year, month, 1)
      .toISOString()
      .split("T")[0]
    const startOfNextMonth = new Date(year, month + 1, 1)
      .toISOString()
      .split("T")[0]

    const { data: monthlyExpenses, error: expensesError } = await supabase
      .from("expenses")
      .select("amount")
      .gte("expense_date", `${startOfMonth}T00:00:00`)
      .lt("expense_date", `${startOfNextMonth}T00:00:00`)

    if (expensesError) throw expensesError

    const monthlyExpensesTotal =
      monthlyExpenses?.reduce(
        (sum, expense) =>
          sum + Number.parseFloat(expense.amount.toString()),
        0
      ) || 0

    // Productos con stock bajo - trae todos y filtra en JS
    const { data: allProducts, error: productsError } = await supabase
      .from("products")
      .select("*")

    if (productsError) throw productsError

    const lowStockProducts =
      allProducts?.filter(
        (product) => product.stock <= product.min_stock
      ) || []

    const stats = {
      dailySales,
      pendingPayments: totalPending,
      monthlyExpenses: monthlyExpensesTotal,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
