
-- Insert enquiries with correct status values
INSERT INTO enquiries (enquiry_id, subject, description, customer_name, customer_email, customer_phone, priority, status, estimated_value) VALUES
('ENQ-2026-002', 'High-Temperature Alloy Forgings', 'Need Inconel 718 forgings for gas turbine blades, qty 500 pcs', 'Bharat Heavy Electricals', 'procurement@bhel.in', '+91-9812345678', 'high', 'in_review', 2500000),
('ENQ-2026-003', 'Stainless Steel Reactor Vessels', 'SS 316L reactor vessels for chemical plant, 3 units', 'Thermax Limited', 'procurement@thermax.com', '+91-3322110099', 'high', 'new', 4800000),
('ENQ-2026-004', 'Precision Machined Gears', 'Helical gears in 4140 steel, heat treated, qty 200', 'Mahindra Forgings', 'supply@mahindraforge.com', '+91-8877665544', 'medium', 'quoted', 1200000),
('ENQ-2026-005', 'Titanium Aerospace Components', 'Ti-6Al-4V brackets and fittings for aircraft assembly', 'Tata Advanced Materials', 'orders@tataam.com', '+91-9988776655', 'high', 'in_review', 6500000),
('ENQ-2026-006', 'Cast Iron Pump Housings', 'Grey iron pump housings, GG25 grade, 150 units', 'Kirloskar Brothers', 'orders@kirloskar.com', '+91-4433221100', 'medium', 'new', 950000),
('ENQ-2026-007', 'Duplex Steel Valve Bodies', '2205 duplex steel valve bodies for offshore platform', 'Larsen & Toubro Heavy', 'purchase@ltheavy.com', '+91-7766554433', 'high', 'in_review', 3200000),
('ENQ-2026-008', 'Tool Steel Die Blocks', 'H13 hot work tool steel die blocks, 25 sets', 'Precision Steel Works', 'info@precisionsteel.com', '+91-9876543210', 'medium', 'quoted', 1800000),
('ENQ-2026-009', 'Maraging Steel Components', 'C300 maraging steel missile components', 'Godrej Precision Engineering', 'engg@godrej.com', '+91-6655443322', 'high', 'in_review', 8900000),
('ENQ-2026-010', 'Stainless Steel Kitchen Equipment', 'SS 304 commercial kitchen equipment project', 'Jindal Stainless', 'sales@jindalstainless.com', '+91-5544332211', 'low', 'new', 450000),
('ENQ-2026-011', 'Heavy Duty Crane Components', 'EN24 steel crane hooks and sheaves, 50 sets', 'Walchandnagar Industries', 'purchase@walchand.com', '+91-2211009988', 'medium', 'quoted', 2100000),
('ENQ-2026-012', 'Electrical Bus Bars', 'Copper-chromium bus bars for switchgear', 'Crompton Greaves', 'supply@crompton.com', '+91-1100998877', 'medium', 'new', 780000),
('ENQ-2026-013', 'Nimonic Alloy Turbine Discs', 'Nimonic 80A discs for steam turbines, 30 pcs', 'Bharat Heavy Electricals', 'procurement@bhel.in', '+91-9812345678', 'high', 'converted', 5600000),
('ENQ-2026-014', 'Reactor Pressure Vessel Heads', 'SA 508 Grade 3 pressure vessel heads for nuclear reactor', 'Nuclear Power Corp', 'engineering@npcil.co.in', '+91-7788665544', 'urgent', 'new', 12000000),
('ENQ-2026-015', 'Special Alloy Rods', 'Superalloy rods in various grades for defense applications', 'Mishra Dhatu Nigam', 'procurement@midhani.com', '+91-8899776655', 'high', 'in_review', 7200000);

-- Insert quotations linked to customers
INSERT INTO quotations (quotation_id, project_title, description, customer_id, subtotal, tax_amount, total_amount, status, valid_until) VALUES
('QT-2026-002', 'Inconel 718 Turbine Blade Forgings', 'Supply of 500 Inconel 718 forgings for gas turbine blades', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), 2100000, 378000, 2478000, 'sent', '2026-04-15'),
('QT-2026-003', 'AISI 4140 Helical Gears Package', 'Manufacturing 200 helical gears in 4140 steel with heat treatment', (SELECT id FROM customers WHERE name='Mahindra Forgings' LIMIT 1), 1050000, 189000, 1239000, 'accepted', '2026-04-01'),
('QT-2026-004', 'Ti-6Al-4V Aerospace Brackets', 'Titanium brackets and fittings for aircraft assembly - Phase 1', (SELECT id FROM customers WHERE name='Tata Advanced Materials' LIMIT 1), 5500000, 990000, 6490000, 'sent', '2026-05-01'),
('QT-2026-005', 'H13 Tool Steel Die Blocks', 'Supply of 25 sets H13 hot work die blocks, heat treated to 44-48 HRC', (SELECT id FROM customers WHERE name='Precision Steel Works' LIMIT 1), 1550000, 279000, 1829000, 'accepted', '2026-03-30'),
('QT-2026-006', 'Duplex 2205 Valve Bodies', 'Manufacturing duplex steel valve bodies for offshore platform', (SELECT id FROM customers WHERE name='Larsen & Toubro Heavy' LIMIT 1), 2800000, 504000, 3304000, 'draft', '2026-04-20'),
('QT-2026-007', 'Maraging C300 Defense Components', 'Precision machined maraging steel components for missile program', (SELECT id FROM customers WHERE name='Godrej Precision Engineering' LIMIT 1), 7800000, 1404000, 9204000, 'sent', '2026-05-15'),
('QT-2026-008', 'EN24 Crane Hook Sets', '50 sets of EN24 steel crane hooks with heat treatment certificates', (SELECT id FROM customers WHERE name='Walchandnagar Industries' LIMIT 1), 1850000, 333000, 2183000, 'accepted', '2026-04-10'),
('QT-2026-009', 'Nimonic 80A Turbine Discs', '30 pieces Nimonic 80A discs for steam turbine application', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), 4800000, 864000, 5664000, 'accepted', '2026-04-25'),
('QT-2026-010', 'SA 508 Reactor Vessel Heads', 'Nuclear grade SA 508 Grade 3 pressure vessel heads', (SELECT id FROM customers WHERE name='Nuclear Power Corp' LIMIT 1), 10500000, 1890000, 12390000, 'draft', '2026-06-01');

-- Insert job cards
INSERT INTO job_cards (job_number, title, description, customer_id, priority, status, due_date, estimated_hours, actual_hours, assigned_to) VALUES
('JC-2026-005', 'Inconel 718 Forging - Batch A', 'First batch of 250 Inconel 718 forgings for turbine blades', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), 'high', 'in_progress', '2026-04-10', 480, 120, 'Rajiv Menon'),
('JC-2026-006', '4140 Helical Gears Production', 'Manufacturing 200 helical gears with CNC machining and heat treatment', (SELECT id FROM customers WHERE name='Mahindra Forgings' LIMIT 1), 'medium', 'in_progress', '2026-03-28', 320, 210, 'Suresh Patil'),
('JC-2026-007', 'H13 Die Block Set 1-10', 'First 10 sets of H13 die blocks, rough machining and heat treat', (SELECT id FROM customers WHERE name='Precision Steel Works' LIMIT 1), 'medium', 'in_progress', '2026-03-25', 200, 160, 'Anil Kumar'),
('JC-2026-008', 'Ti-6Al-4V Brackets Phase 1', 'Titanium aerospace brackets - initial production run', (SELECT id FROM customers WHERE name='Tata Advanced Materials' LIMIT 1), 'high', 'pending', '2026-05-15', 600, 0, 'Deepak Sharma'),
('JC-2026-009', 'Nimonic 80A Disc Forging', 'Hot forging of 30 Nimonic 80A turbine discs', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), 'high', 'in_progress', '2026-04-20', 400, 85, 'Vikram Reddy'),
('JC-2026-010', 'EN24 Crane Hooks Batch 1', 'First batch of 25 crane hook sets, forging and machining', (SELECT id FROM customers WHERE name='Walchandnagar Industries' LIMIT 1), 'medium', 'in_progress', '2026-04-05', 280, 190, 'Manoj Singh'),
('JC-2026-011', 'Maraging C300 Component A', 'Precision machining of maraging steel missile housing', (SELECT id FROM customers WHERE name='Godrej Precision Engineering' LIMIT 1), 'urgent', 'in_progress', '2026-03-20', 350, 280, 'Dr. Rajan Iyer'),
('JC-2026-012', 'SS 316L Reactor Shell', 'Welding and fabrication of stainless steel reactor shell', (SELECT id FROM customers WHERE name='Thermax Limited' LIMIT 1), 'high', 'pending', '2026-05-01', 500, 0, 'Ashok Jadhav'),
('JC-2026-013', 'GG25 Pump Housing Cast', 'Sand casting of 150 grey iron pump housings', (SELECT id FROM customers WHERE name='Kirloskar Brothers' LIMIT 1), 'medium', 'review', '2026-03-18', 240, 235, 'Pramod Sawant'),
('JC-2026-014', 'Duplex 2205 Valve Body Proto', 'Prototype machining of duplex steel valve bodies', (SELECT id FROM customers WHERE name='Larsen & Toubro Heavy' LIMIT 1), 'high', 'pending', '2026-04-30', 180, 0, 'Kiran Desai'),
('JC-2026-015', 'H13 Die Block Set 11-25', 'Remaining 15 sets of H13 die blocks', (SELECT id FROM customers WHERE name='Precision Steel Works' LIMIT 1), 'medium', 'pending', '2026-04-15', 300, 0, 'Anil Kumar'),
('JC-2026-016', 'Inconel 718 Forging - Batch B', 'Second batch of 250 Inconel 718 forgings', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), 'high', 'pending', '2026-05-10', 480, 0, 'Rajiv Menon');

-- Insert purchase orders
INSERT INTO purchase_orders (po_number, supplier_name, supplier_contact, order_date, expected_delivery, subtotal, tax_amount, total_amount, status, notes) VALUES
('PO-2026-001', 'Mishra Dhatu Nigam Limited', 'sales@midhani.com', '2026-02-15', '2026-03-20', 1800000, 324000, 2124000, 'confirmed', 'Inconel 718 billets for BHEL turbine blade forgings'),
('PO-2026-002', 'VSMPO-AVISMA (India)', 'india@vsmpo.com', '2026-02-20', '2026-04-01', 3200000, 576000, 3776000, 'sent', 'Ti-6Al-4V bars and plates for aerospace components'),
('PO-2026-003', 'Uddeholm India Pvt Ltd', 'orders@uddeholm.in', '2026-03-01', '2026-03-15', 950000, 171000, 1121000, 'delivered', 'H13 tool steel blocks - premium grade'),
('PO-2026-004', 'Jindal Steel & Power', 'supply@jindalsteel.com', '2026-02-28', '2026-03-18', 650000, 117000, 767000, 'confirmed', 'EN24 steel bars for crane components'),
('PO-2026-005', 'Salem Steel Plant (SAIL)', 'sales@salemsteel.in', '2026-03-05', '2026-03-25', 420000, 75600, 495600, 'confirmed', 'SS 316L plates for reactor vessel fabrication'),
('PO-2026-006', 'Special Metals India', 'procurement@specialmetals.in', '2026-03-08', '2026-04-10', 2400000, 432000, 2832000, 'sent', 'Nimonic 80A discs - raw forgings'),
('PO-2026-007', 'Outokumpu India', 'sales@outokumpu.in', '2026-03-10', '2026-04-05', 1100000, 198000, 1298000, 'draft', 'Duplex 2205 steel billets for valve bodies'),
('PO-2026-008', 'Kennametal India', 'tools@kennametal.in', '2026-02-10', '2026-02-25', 380000, 68400, 448400, 'delivered', 'Carbide cutting tools and inserts for CNC machining'),
('PO-2026-009', 'Castrol Industrial India', 'industrial@castrol.in', '2026-03-01', '2026-03-10', 125000, 22500, 147500, 'delivered', 'Cutting fluids and quenching oils'),
('PO-2026-010', 'Bharat Forge Consumables', 'supply@bharatforge.com', '2026-03-05', '2026-03-20', 280000, 50400, 330400, 'confirmed', 'Welding consumables - Inconel and SS electrodes');

-- Insert purchase order items
INSERT INTO purchase_order_items (po_id, item_name, description, quantity, unit_price, total_price) VALUES
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-001'), 'Inconel 718 Billet 200mm dia', 'Vacuum melted Inconel 718, AMS 5662', 20, 90000, 1800000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-002'), 'Ti-6Al-4V Bar 100mm dia', 'Grade 5 titanium bar per AMS 4928', 15, 140000, 2100000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-002'), 'Ti-6Al-4V Plate 25mm', 'Grade 5 titanium plate per AMS 4911', 10, 110000, 1100000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-003'), 'H13 Block 300x200x150', 'Premium grade H13, ESR quality', 25, 38000, 950000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-004'), 'EN24 Bar 150mm dia', 'EN24T steel bar, normalized', 30, 15000, 450000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-004'), 'EN24 Bar 100mm dia', 'EN24T steel bar, normalized', 20, 10000, 200000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-005'), 'SS 316L Plate 20mm', 'ASTM A240 316L plate', 12, 35000, 420000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-006'), 'Nimonic 80A Disc Blank 400mm', 'AMS 5766 Nimonic 80A forged disc', 30, 80000, 2400000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-008'), 'Carbide Insert CNMG120408', 'Kennametal KC5010 grade', 200, 850, 170000),
((SELECT id FROM purchase_orders WHERE po_number='PO-2026-008'), 'Carbide End Mill 20mm', '4-flute solid carbide', 20, 10500, 210000);

-- Insert invoices
INSERT INTO invoices (invoice_number, customer_id, job_card_id, issue_date, due_date, subtotal, tax_amount, total_amount, paid_amount, status, payment_terms, notes) VALUES
('INV-2026-001', (SELECT id FROM customers WHERE name='Precision Steel Works' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-007' LIMIT 1), '2026-03-01', '2026-03-31', 775000, 139500, 914500, 914500, 'paid', 'Net 30', 'Partial delivery - 10 sets H13 die blocks'),
('INV-2026-002', (SELECT id FROM customers WHERE name='Mahindra Forgings' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-006' LIMIT 1), '2026-03-05', '2026-04-04', 520000, 93600, 613600, 300000, 'sent', 'Net 30', 'Progress billing - 100 gears completed'),
('INV-2026-003', (SELECT id FROM customers WHERE name='Walchandnagar Industries' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-010' LIMIT 1), '2026-03-08', '2026-04-07', 925000, 166500, 1091500, 0, 'sent', 'Net 30', 'First batch 25 crane hook sets'),
('INV-2026-004', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-005' LIMIT 1), '2026-03-10', '2026-04-09', 1050000, 189000, 1239000, 1239000, 'paid', 'Net 30', 'Advance payment for Inconel 718 forgings Batch A'),
('INV-2026-005', (SELECT id FROM customers WHERE name='Godrej Precision Engineering' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-011' LIMIT 1), '2026-03-12', '2026-04-11', 3900000, 702000, 4602000, 0, 'draft', 'Net 30', 'Maraging steel components - 50% milestone'),
('INV-2026-006', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-009' LIMIT 1), '2026-02-28', '2026-03-15', 2400000, 432000, 2832000, 2832000, 'paid', 'Net 15', 'Nimonic 80A disc forging advance'),
('INV-2026-007', (SELECT id FROM customers WHERE name='Kirloskar Brothers' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-013' LIMIT 1), '2026-03-11', '2026-04-10', 475000, 85500, 560500, 0, 'sent', 'Net 30', 'GG25 pump housings - 75 units delivered'),
('INV-2026-008', (SELECT id FROM customers WHERE name='Acme Manufacturing' LIMIT 1), NULL, '2026-02-15', '2026-03-02', 350000, 63000, 413000, 413000, 'paid', 'Net 15', 'General machining services - February');

-- Insert invoice items
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price) VALUES
((SELECT id FROM invoices WHERE invoice_number='INV-2026-001'), 'H13 Die Block Set - machined & heat treated', 10, 77500, 775000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-002'), '4140 Helical Gear - CNC machined', 100, 4200, 420000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-002'), 'Heat treatment - batch processing', 1, 100000, 100000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-003'), 'EN24 Crane Hook Set - forged & machined', 25, 37000, 925000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-004'), 'Inconel 718 Forging - turbine blade blank', 125, 8400, 1050000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-005'), 'Maraging C300 Missile Housing - machined', 5, 780000, 3900000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-006'), 'Nimonic 80A Turbine Disc - forged blank', 30, 80000, 2400000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-007'), 'GG25 Pump Housing - sand cast & machined', 75, 6333, 475000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-008'), 'CNC Machining Services', 1, 250000, 250000),
((SELECT id FROM invoices WHERE invoice_number='INV-2026-008'), 'Surface Treatment & Finishing', 1, 100000, 100000);

-- Insert tools/equipment
INSERT INTO tools (tool_id, name, type, manufacturer, model, serial_number, status, condition, location, purchase_date, purchase_cost, last_maintenance, next_maintenance, maintenance_interval_days, notes) VALUES
('TL-001', 'CNC Vertical Machining Center', 'CNC Machine', 'DMG Mori', 'DMU 50', 'DMG-2023-4521', 'in_use', 'excellent', 'Shop Floor - Bay 1', '2023-06-15', 8500000, '2026-02-15', '2026-05-15', 90, 'Primary 5-axis machining center for precision components'),
('TL-002', 'CNC Turning Center', 'CNC Machine', 'Mazak', 'QTN 350M', 'MZK-2022-8734', 'in_use', 'good', 'Shop Floor - Bay 1', '2022-03-10', 6200000, '2026-01-20', '2026-04-20', 90, 'Multi-tasking turning center with live tooling'),
('TL-003', 'Hydraulic Forging Press 2000T', 'Forging Equipment', 'SMS Group', 'HPF-2000', 'SMS-2021-1156', 'in_use', 'good', 'Forging Shop', '2021-01-20', 25000000, '2026-03-01', '2026-06-01', 90, '2000-ton hydraulic press for open die forging'),
('TL-004', 'Vacuum Heat Treatment Furnace', 'Heat Treatment', 'Ipsen', 'VTTC-324', 'IPS-2023-2890', 'in_use', 'excellent', 'Heat Treatment Bay', '2023-09-01', 12000000, '2026-02-28', '2026-05-28', 90, 'Vacuum furnace for aerospace grade heat treatment'),
('TL-005', 'Coordinate Measuring Machine', 'Inspection', 'Zeiss', 'Contura G2', 'ZS-2024-0445', 'available', 'excellent', 'Quality Lab', '2024-01-15', 4500000, '2026-03-05', '2026-09-05', 180, 'High precision CMM for dimensional inspection'),
('TL-006', 'Wire EDM Machine', 'EDM', 'Sodick', 'ALC600G', 'SDK-2022-6712', 'in_use', 'good', 'Shop Floor - Bay 2', '2022-07-20', 3800000, '2026-02-10', '2026-05-10', 90, 'Wire EDM for complex profiles and tool steel cutting'),
('TL-007', 'Induction Melting Furnace 500kg', 'Melting', 'Inductotherm', 'VIP-500', 'IND-2020-3344', 'in_use', 'fair', 'Foundry', '2020-05-10', 5500000, '2026-01-15', '2026-04-15', 90, '500kg capacity induction furnace for alloy melting'),
('TL-008', 'CNC Surface Grinder', 'Grinding', 'Okamoto', 'ACC-84ST', 'OKM-2023-1123', 'available', 'excellent', 'Shop Floor - Bay 3', '2023-11-01', 2800000, '2026-03-10', '2026-06-10', 90, 'Precision surface grinding for tool steel components'),
('TL-009', 'Spectro Analyzer', 'Testing', 'SPECTRO', 'SPECTROMAXx', 'SPT-2024-0089', 'available', 'excellent', 'Quality Lab', '2024-03-01', 3200000, '2026-02-20', '2026-08-20', 180, 'OES analyzer for chemical composition analysis'),
('TL-010', 'Hardness Tester', 'Testing', 'Instron', 'Wilson VH3100', 'INS-2023-5567', 'available', 'good', 'Quality Lab', '2023-04-15', 850000, '2026-03-01', '2026-09-01', 180, 'Vickers/Rockwell hardness testing machine'),
('TL-011', 'MIG/TIG Welding Station', 'Welding', 'Lincoln Electric', 'Power Wave S500', 'LE-2022-7890', 'in_use', 'good', 'Welding Bay', '2022-08-01', 450000, '2026-02-25', '2026-05-25', 90, 'Multi-process welding for SS and alloy welding'),
('TL-012', 'Bandsaw Machine', 'Cutting', 'Amada', 'HFA-400CNC', 'AMD-2021-4456', 'maintenance', 'fair', 'Material Store', '2021-06-15', 1200000, '2026-03-08', '2026-04-08', 30, 'CNC bandsaw for raw material cutting - blade replacement needed');

-- Insert quality inspections
INSERT INTO quality_inspections (job_card_id, inspection_type, inspector_name, status, defects_found, notes, inspection_date) VALUES
((SELECT id FROM job_cards WHERE job_number='JC-2026-006'), 'In-Process', 'R. Krishnan', 'passed', 0, 'Gear tooth profile within spec, surface finish Ra 0.8. All 100 gears from first batch passed.', '2026-03-05'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-007'), 'Final', 'S. Venkatesh', 'passed', 0, 'H13 die blocks hardness 45-47 HRC as required. Dimensional inspection on CMM - all within tolerance.', '2026-03-02'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-005'), 'In-Process', 'R. Krishnan', 'passed', 2, 'Minor surface defects on 2 forgings - reworkable. Grain flow direction verified. Chemical composition within AMS 5662 spec.', '2026-03-08'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-010'), 'In-Process', 'M. Chatterjee', 'passed', 1, 'One hook set had minor dimensional deviation - reworked and re-inspected. UT inspection clean.', '2026-03-10'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-011'), 'In-Process', 'S. Venkatesh', 'requires_review', 0, 'Maraging steel hardness after aging: 52-54 HRC. Awaiting customer witness inspection for defense components.', '2026-03-11'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-009'), 'Material Incoming', 'R. Krishnan', 'passed', 0, 'Nimonic 80A raw disc blanks - composition verified by OES. Grain size ASTM 5-7. All 30 blanks accepted.', '2026-03-03'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-013'), 'Final', 'M. Chatterjee', 'passed', 3, '147 out of 150 pump housings passed. 3 units with porosity defects - scrapped. Overall yield 98%.', '2026-03-12'),
((SELECT id FROM job_cards WHERE job_number='JC-2026-006'), 'Material Incoming', 'R. Krishnan', 'passed', 0, '4140 steel bars - hardness, chemistry and UT inspection passed. Mill certificates verified.', '2026-02-20');

-- Insert shipments
INSERT INTO shipments (shipment_id, customer_id, job_card_id, status, priority, shipping_address, tracking_number, carrier, shipping_method, estimated_delivery, actual_delivery, shipping_cost, notes) VALUES
('SHP-2026-001', (SELECT id FROM customers WHERE name='Precision Steel Works' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-007' LIMIT 1), 'delivered', 'high', '45 Industrial Area, Pune, Maharashtra', 'DTDC-IN-78945612', 'DTDC Express', 'Road Transport', '2026-03-05', '2026-03-04', 15000, 'H13 die blocks - 10 sets delivered ahead of schedule'),
('SHP-2026-002', (SELECT id FROM customers WHERE name='Mahindra Forgings' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-006' LIMIT 1), 'shipped', 'standard', '23 MIDC, Chakan, Pune', 'BLU-IN-45678901', 'BlueDart', 'Road Transport', '2026-03-15', NULL, 12000, 'First batch 100 helical gears - in transit'),
('SHP-2026-003', (SELECT id FROM customers WHERE name='Walchandnagar Industries' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-010' LIMIT 1), 'ready', 'standard', '67 Walchandnagar, Pune, Maharashtra', NULL, 'Company Vehicle', 'Road Transport', '2026-03-18', NULL, 5000, 'EN24 crane hooks batch 1 - ready for pickup'),
('SHP-2026-004', (SELECT id FROM customers WHERE name='Kirloskar Brothers' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-013' LIMIT 1), 'shipped', 'standard', '90 Kirloskarwadi, Sangli, Maharashtra', 'GATI-IN-23456789', 'Gati KWE', 'Road Transport', '2026-03-16', NULL, 18000, 'GG25 pump housings - 75 units partial shipment'),
('SHP-2026-005', (SELECT id FROM customers WHERE name='Bharat Heavy Electricals' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-005' LIMIT 1), 'preparing', 'high', '12 BHEL Campus, Haridwar, Uttarakhand', NULL, 'TCI Freight', 'Road Transport', '2026-03-22', NULL, 35000, 'Inconel 718 forgings Batch A - packaging in progress'),
('SHP-2026-006', (SELECT id FROM customers WHERE name='Godrej Precision Engineering' LIMIT 1), (SELECT id FROM job_cards WHERE job_number='JC-2026-011' LIMIT 1), 'preparing', 'urgent', '14 Vikhroli, Mumbai, Maharashtra', NULL, 'Secured Logistics', 'Secured Vehicle', '2026-03-20', NULL, 45000, 'Defense components - requires security clearance for transport');

-- Insert shipment items
INSERT INTO shipment_items (shipment_id, item_name, quantity, description) VALUES
((SELECT id FROM shipments WHERE shipment_id='SHP-2026-001'), 'H13 Die Block Set', 10, 'Heat treated to 44-48 HRC, individually packed'),
((SELECT id FROM shipments WHERE shipment_id='SHP-2026-002'), '4140 Helical Gear', 100, 'CNC machined, heat treated, individually oiled'),
((SELECT id FROM shipments WHERE shipment_id='SHP-2026-003'), 'EN24 Crane Hook Set', 25, 'Forged, machined, with test certificates'),
((SELECT id FROM shipments WHERE shipment_id='SHP-2026-004'), 'GG25 Pump Housing', 75, 'Sand cast and machined, primer coated'),
((SELECT id FROM shipments WHERE shipment_id='SHP-2026-005'), 'Inconel 718 Forging', 125, 'Turbine blade blanks - first 125 of 250'),
((SELECT id FROM shipments WHERE shipment_id='SHP-2026-006'), 'Maraging C300 Component', 5, 'Precision machined missile housing - classified');

-- Insert activity log entries
INSERT INTO activity_log (entity_type, entity_id, action, description, user_name, created_at) VALUES
('job_card', (SELECT id FROM job_cards WHERE job_number='JC-2026-005'), 'status_update', 'Job card moved to In Progress - Inconel 718 forging started', 'Rajiv Menon', '2026-03-01 08:30:00+00'),
('job_card', (SELECT id FROM job_cards WHERE job_number='JC-2026-006'), 'status_update', 'Helical gear production - 100 of 200 completed', 'Suresh Patil', '2026-03-05 14:15:00+00'),
('invoice', (SELECT id FROM invoices WHERE invoice_number='INV-2026-001'), 'payment_received', 'Full payment received for H13 die blocks - ₹9,14,500', 'Accounts Dept', '2026-03-08 10:00:00+00'),
('shipment', (SELECT id FROM shipments WHERE shipment_id='SHP-2026-001'), 'delivered', 'H13 die blocks delivered to Precision Steel Works', 'Logistics Team', '2026-03-04 16:30:00+00'),
('quality_inspection', (SELECT id FROM quality_inspections WHERE inspector_name='S. Venkatesh' AND inspection_type='Final' LIMIT 1), 'inspection_completed', 'Final QC passed for H13 die blocks - all specs met', 'S. Venkatesh', '2026-03-02 11:00:00+00'),
('enquiry', (SELECT id FROM enquiries WHERE enquiry_id='ENQ-2026-014'), 'created', 'New high-value enquiry from Nuclear Power Corp - ₹1.2 Cr', 'Sales Team', '2026-03-11 09:00:00+00'),
('purchase_order', (SELECT id FROM purchase_orders WHERE po_number='PO-2026-003'), 'delivered', 'H13 tool steel blocks received from Uddeholm', 'Store Dept', '2026-03-15 13:00:00+00'),
('job_card', (SELECT id FROM job_cards WHERE job_number='JC-2026-011'), 'status_update', 'Maraging steel components - 80% machining complete, awaiting aging treatment', 'Dr. Rajan Iyer', '2026-03-10 17:00:00+00'),
('invoice', (SELECT id FROM invoices WHERE invoice_number='INV-2026-004'), 'payment_received', 'Advance payment from BHEL for Inconel forgings - ₹12,39,000', 'Accounts Dept', '2026-03-12 09:30:00+00'),
('job_card', (SELECT id FROM job_cards WHERE job_number='JC-2026-013'), 'status_update', 'GG25 pump housings moved to Review - 147/150 passed QC', 'Pramod Sawant', '2026-03-12 15:00:00+00'),
('quotation', (SELECT id FROM quotations WHERE quotation_id='QT-2026-009'), 'created', 'Nuclear grade quotation prepared for SA 508 reactor vessel heads', 'Sales Team', '2026-03-10 11:00:00+00'),
('shipment', (SELECT id FROM shipments WHERE shipment_id='SHP-2026-002'), 'shipped', '100 helical gears dispatched to Mahindra Forgings via BlueDart', 'Logistics Team', '2026-03-13 08:00:00+00');
