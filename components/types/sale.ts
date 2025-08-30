export interface Customer {
  id: string
  name: string
}

export interface SaleItem {
  name: string
  quantity: number
  price: number
}

export interface Sale {
  id: string
  date: string
  customer: Customer // <-- No debe ser opcional ni undefined
  items: SaleItem[]
  subtotal: number
  total: number
  paymentMethod: string
  status: string
}
