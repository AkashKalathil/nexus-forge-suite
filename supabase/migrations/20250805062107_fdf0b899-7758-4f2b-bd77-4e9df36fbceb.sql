-- Insert sample production stages to make the dashboard production status functional
INSERT INTO public.production_stages (name, description, sequence_order, estimated_duration_hours) VALUES
('Cutting', 'Material cutting and preparation stage', 1, 8),
('Forging', 'Metal forging and shaping stage', 2, 12),
('Heat Treatment', 'Heat treatment and hardening process', 3, 24),
('Precision Finishing', 'Final machining and quality finishing', 4, 16),
('Quality Control', 'Final inspection and quality assurance', 5, 4),
('Packaging', 'Product packaging and preparation for shipment', 6, 2);