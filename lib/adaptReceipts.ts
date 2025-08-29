// lib/adaptReceipt.ts
import { Receipt, ReceiptItem } from "@/components/types/receipt";

export function adaptReceipt(raw: any): Receipt {
  const items: ReceiptItem[] = (raw.sale_items ?? []).map((item: any) => ({
    name: item.products?.name ?? "Producto sin nombre",
    quantity: item.quantity ?? 0,
    price: item.unit_price ?? 0,
    subtotal: item.subtotal ?? 0,
  }));

  const subtotal = items.reduce((acc: number, item: ReceiptItem) => acc + item.subtotal, 0);

  return {
    id: raw.id,
    date: raw.created_at,
    customer: raw.customer?.name ?? "Cliente desconocido",
    paymentMethod: raw.payment_method ?? "Desconocido",
    total: raw.total ?? 0,
    subtotal,
    type: "Venta",
    status: raw.payment_status ?? "Desconocido",
    items,
  };
}

