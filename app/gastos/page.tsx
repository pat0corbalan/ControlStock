"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { ExpensesList } from "@/components/expenses/expenses-list"
import { ExpensesChart } from "@/components/expenses/expenses-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Receipt, TrendingUp, Calendar } from "lucide-react"

// Datos de ejemplo para gastos
const initialExpenses = [
  {
    id: "G001",
    description: "Compra de mercancía",
    amount: 450.0,
    date: "2024-01-15",
    category: "Inventario",
  },
  {
    id: "G002",
    description: "Pago de electricidad",
    amount: 85.5,
    date: "2024-01-14",
    category: "Servicios",
  },
  {
    id: "G003",
    description: "Mantenimiento de equipos",
    amount: 120.0,
    date: "2024-01-13",
    category: "Mantenimiento",
  },
  {
    id: "G004",
    description: "Material de oficina",
    amount: 35.75,
    date: "2024-01-12",
    category: "Oficina",
  },
  {
    id: "G005",
    description: "Transporte de mercancía",
    amount: 65.0,
    date: "2024-01-11",
    category: "Transporte",
  },
]

const categories = [
  "Todas",
  "Inventario",
  "Servicios",
  "Mantenimiento",
  "Oficina",
  "Transporte",
  "Marketing",
  "Alquiler",
  "Seguros",
  "Otros",
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [dateFilter, setDateFilter] = useState("")

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = selectedCategory === "Todas" || expense.category === selectedCategory
    const matchesDate = !dateFilter || expense.date.includes(dateFilter)
    return matchesCategory && matchesDate
  })

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: `G${String(expenses.length + 1).padStart(3, "0")}`,
    }
    setExpenses([newExpense, ...expenses])
    setShowAddForm(false)
  }

  const handleEditExpense = (expenseData) => {
    setExpenses(expenses.map((e) => (e.id === editingExpense.id ? { ...expenseData, id: editingExpense.id } : e)))
    setEditingExpense(null)
  }

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter((e) => e.id !== expenseId))
  }

  // Cálculos para el resumen
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
  })
  const monthlyTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const expensesByCategory = categories
    .filter((cat) => cat !== "Todas")
    .map((category) => ({
      category,
      amount: expenses.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Registro de Gastos</h1>
            <p className="text-muted-foreground">Controla y analiza los gastos de tu negocio</p>
          </div>

          {/* Resumen de gastos */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Filtrado</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-2">${totalExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{filteredExpenses.length} gastos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{thisMonthExpenses.length} gastos este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio por Gasto</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">Promedio calculado</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <Button onClick={() => setShowAddForm(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Gasto
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fecha (Año-Mes)</Label>
                  <Input
                    type="month"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    placeholder="2024-01"
                  />
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("Todas")
                      setDateFilter("")
                    }}
                    className="w-full bg-transparent"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Lista de gastos */}
            <div className="space-y-6">
              <ExpensesList expenses={filteredExpenses} onEdit={setEditingExpense} onDelete={handleDeleteExpense} />
            </div>

            {/* Gráfico de gastos por categoría */}
            <div className="space-y-6">
              <ExpensesChart data={expensesByCategory} />
            </div>
          </div>

          {/* Modal para agregar gasto */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
              </DialogHeader>
              <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setShowAddForm(false)} />
            </DialogContent>
          </Dialog>

          {/* Modal para editar gasto */}
          <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Gasto</DialogTitle>
              </DialogHeader>
              {editingExpense && (
                <ExpenseForm
                  initialData={editingExpense}
                  onSubmit={handleEditExpense}
                  onCancel={() => setEditingExpense(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
