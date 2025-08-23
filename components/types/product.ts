interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  [key: string]: any; // opcional, si hay más campos
}
