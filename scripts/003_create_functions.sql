-- Función para actualizar stock de productos
CREATE OR REPLACE FUNCTION update_product_stock(product_id UUID, quantity_sold INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products 
  SET stock = stock - quantity_sold 
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
