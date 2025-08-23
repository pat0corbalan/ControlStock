-- Insertar productos de ejemplo
INSERT INTO public.products (name, sku, category, stock, unit_cost, sale_price, min_stock) VALUES
('Coca Cola 600ml', 'CC600', 'Bebidas', 50, 1.20, 2.00, 10),
('Pan Integral', 'PI001', 'Panadería', 25, 0.80, 1.50, 5),
('Leche Entera 1L', 'LE1L', 'Lácteos', 30, 1.50, 2.50, 8),
('Arroz 1kg', 'AR1K', 'Granos', 40, 2.00, 3.50, 10),
('Aceite Vegetal 1L', 'AV1L', 'Aceites', 20, 3.00, 5.00, 5),
('Detergente 500ml', 'DT500', 'Limpieza', 15, 2.50, 4.00, 3),
('Papel Higiénico x4', 'PH4', 'Higiene', 35, 3.50, 6.00, 8),
('Shampoo 400ml', 'SH400', 'Higiene', 12, 4.00, 7.50, 3),
('Galletas Saladas', 'GS001', 'Snacks', 60, 1.00, 1.80, 15),
('Yogurt Natural', 'YN001', 'Lácteos', 18, 1.80, 3.00, 5)
ON CONFLICT (sku) DO NOTHING;

-- Insertar gastos de ejemplo
INSERT INTO public.expenses (description, amount, category, expense_date) VALUES
('Compra de mercadería', 500.00, 'Inventario', CURRENT_DATE - INTERVAL '5 days'),
('Pago de luz', 85.50, 'Servicios', CURRENT_DATE - INTERVAL '3 days'),
('Mantenimiento de equipos', 120.00, 'Mantenimiento', CURRENT_DATE - INTERVAL '7 days'),
('Publicidad en redes sociales', 50.00, 'Marketing', CURRENT_DATE - INTERVAL '2 days'),
('Alquiler del local', 800.00, 'Alquiler', CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insertar ventas de ejemplo
INSERT INTO public.sales (total, payment_method, payment_status) VALUES
(15.50, 'efectivo', 'pagado'),
(8.00, 'tarjeta', 'pagado'),
(25.00, 'a_pagar', 'pendiente'),
(12.30, 'efectivo', 'pagado')
ON CONFLICT DO NOTHING;
