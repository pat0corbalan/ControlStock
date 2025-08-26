// types/receipt.ts
export interface Receipt {
  id: string
  date: string
  customer: string
  items: { name: string; quantity: number; price: number }[]
  subtotal: number
  total: number
  paymentMethod: string
  status: string
  type: string
}
