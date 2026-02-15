INSERT INTO raw_material (id, code, name, stock_quantity) VALUES (1, 'RM001', 'Wood', 100);
INSERT INTO raw_material (id, code, name, stock_quantity) VALUES (2, 'RM002', 'Nails', 500);
INSERT INTO raw_material (id, code, name, stock_quantity) VALUES (3, 'RM003', 'Paint', 50);

INSERT INTO product (id, code, name, price) VALUES (1, 'PRD001', 'Updated Product Name', 129.99);
INSERT INTO product (id, code, name, price) VALUES (3, 'PRD002', 'Another Product', 149.9);
INSERT INTO product (id, code, name, price) VALUES (4, 'PRD003', 'Cheap Product', 49.9);
INSERT INTO product (id, code, name, price) VALUES (5, 'PRD004', 'Luxury Chair', 299.9);
INSERT INTO product (id, code, name, price) VALUES (6, 'PRD005', 'Basic Stool', 39.9);

INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (1, 5, 1, 1);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (2, 20, 1, 2);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (3, 1, 1, 3);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (4, 2, 3, 1);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (5, 8, 4, 1);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (6, 30, 4, 2);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (7, 2, 4, 3);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (10, 8, 5, 1);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (11, 30, 5, 2);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (12, 2, 5, 3);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (13, 3, 6, 1);
INSERT INTO product_raw_material (id, quantity_needed, product_id, raw_material_id) VALUES (14, 10, 6, 2);