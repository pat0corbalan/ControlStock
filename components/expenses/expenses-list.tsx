"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Calendar, Tag } from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

interface ExpensesListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (expenseId: string) => void
}

export function ExpensesList({ expenses, onEdit, onDelete }: ExpensesListProps) {
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null)

  const handleDelete = () => {
    if (deleteExpense) {
      onDelete(deleteExpense.id)
      setDeleteExpense(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Inventario: "bg-blue-100 text-blue-800",
      Servicios: "bg-green-100 text-green-800",
      Mantenimiento: "bg-yellow-100 text-yellow-800",
      Oficina: "bg-purple-100 text-purple-800",
      Transporte: "bg-orange-100 text-orange-800",
      Marketing: "bg-pink-100 text-pink-800",
      Alquiler: "bg-red-100 text-red-800",
      Seguros: "bg-indigo-100 text-indigo-800",
      Otros: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.Otros
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg mb-2">No se encontraron gastos</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Gastos ({expenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <h3 className="font-medium text-sm leading-tight">{expense.description}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(expense.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-chart-2">${expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Gasto #{expense.id}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteExpense(expense)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteExpense} onOpenChange={() => setDeleteExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El gasto "{deleteExpense?.description}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
