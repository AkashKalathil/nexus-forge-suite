-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  contact_person TEXT,
  industry TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job cards table
CREATE TABLE public.job_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
  assigned_to TEXT,
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quality control inspections table
CREATE TABLE public.quality_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_card_id UUID REFERENCES public.job_cards(id),
  inspection_type TEXT NOT NULL,
  inspector_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'requires_review')),
  notes TEXT,
  defects_found INTEGER DEFAULT 0,
  inspection_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create production stages table
CREATE TABLE public.production_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sequence_order INTEGER NOT NULL,
  estimated_duration_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job card stages tracking table
CREATE TABLE public.job_card_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_card_id UUID REFERENCES public.job_cards(id),
  stage_id UUID REFERENCES public.production_stages(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity log table
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  user_name TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_card_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now - will need authentication later)
CREATE POLICY "Enable read access for all users" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.job_cards FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.job_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.job_cards FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.job_cards FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.quality_inspections FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.quality_inspections FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.quality_inspections FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.quality_inspections FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.production_stages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.production_stages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.production_stages FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.production_stages FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.job_card_stages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.job_card_stages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.job_card_stages FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.job_card_stages FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.activity_log FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.activity_log FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_cards_updated_at
  BEFORE UPDATE ON public.job_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quality_inspections_updated_at
  BEFORE UPDATE ON public.quality_inspections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_card_stages_updated_at
  BEFORE UPDATE ON public.job_card_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default production stages
INSERT INTO public.production_stages (name, description, sequence_order, estimated_duration_hours) VALUES
('Design & Planning', 'Initial design and project planning phase', 1, 8),
('Material Procurement', 'Sourcing and acquiring necessary materials', 2, 24),
('Manufacturing', 'Main production and manufacturing process', 3, 40),
('Quality Control', 'Quality inspection and testing', 4, 4),
('Finishing', 'Final touches and finishing work', 5, 8),
('Packaging', 'Product packaging and preparation for delivery', 6, 2);

-- Insert sample data
INSERT INTO public.customers (name, email, phone, contact_person, industry, status) VALUES
('Acme Manufacturing', 'contact@acme-mfg.com', '+1-555-0101', 'John Smith', 'Automotive', 'active'),
('TechCorp Industries', 'procurement@techcorp.com', '+1-555-0102', 'Sarah Johnson', 'Electronics', 'active'),
('Global Solutions Ltd', 'orders@globalsolutions.com', '+1-555-0103', 'Mike Chen', 'Aerospace', 'active'),
('Metro Construction', 'projects@metroconstruction.com', '+1-555-0104', 'Lisa Brown', 'Construction', 'active');

-- Insert sample job cards
INSERT INTO public.job_cards (job_number, customer_id, title, description, priority, status, assigned_to, due_date, estimated_hours) VALUES
('JC-2024-001', (SELECT id FROM public.customers WHERE name = 'Acme Manufacturing'), 'Automotive Parts Production', 'Manufacturing precision automotive components', 'high', 'in_progress', 'Engineering Team A', '2024-02-15', 120),
('JC-2024-002', (SELECT id FROM public.customers WHERE name = 'TechCorp Industries'), 'Circuit Board Assembly', 'PCB assembly and testing for new product line', 'medium', 'pending', 'Electronics Team', '2024-02-20', 80),
('JC-2024-003', (SELECT id FROM public.customers WHERE name = 'Global Solutions Ltd'), 'Aerospace Component Machining', 'Precision machining of titanium aerospace parts', 'urgent', 'review', 'Machining Team B', '2024-01-30', 160),
('JC-2024-004', (SELECT id FROM public.customers WHERE name = 'Metro Construction'), 'Steel Frame Fabrication', 'Custom steel frame construction for building project', 'medium', 'completed', 'Fabrication Team', '2024-01-25', 200);