// components/types/receipt.ts
export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;  // agregar esta propiedad
}


export interface Receipt {
  id: string
  date: string
  customer: string
  paymentMethod: string
  total: number
  type: string
  status: string
  items: ReceiptItem[]
  subtotal: number;
}
