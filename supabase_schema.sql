-- Supabase Schema for MGM Textiles ERP

-- 1. Machines Table
CREATE TABLE public.machines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    "currentOrderId" TEXT,
    "efficiencyActual" NUMERIC DEFAULT 0,
    "efficiencyTarget" NUMERIC DEFAULT 85,
    "rpmActual" INTEGER DEFAULT 0,
    "rpmTarget" INTEGER DEFAULT 600,
    "activePicks" INTEGER DEFAULT 0
);

-- 2. Production Orders Table
CREATE TABLE public.production_orders (
    id TEXT PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "articleCode" TEXT NOT NULL,
    "fabricType" TEXT NOT NULL,
    width INTEGER NOT NULL,
    gsm INTEGER NOT NULL,
    color TEXT NOT NULL,
    "quantityOrdered" NUMERIC NOT NULL,
    "quantityProduced" NUMERIC DEFAULT 0,
    status TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    notes TEXT,
    "assignedMachines" TEXT[] DEFAULT '{}',
    "beamIds" TEXT[] DEFAULT '{}',
    "createdAt" TEXT NOT NULL
);

-- 3. Beams Table
CREATE TABLE public.beams (
    id TEXT PRIMARY KEY,
    "beamNumber" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "machineId" TEXT,
    "yarnType" TEXT NOT NULL,
    "yarnCount" TEXT NOT NULL,
    "warpEnds" INTEGER NOT NULL,
    "theoreticalMeters" NUMERIC NOT NULL,
    "actualMeters" NUMERIC DEFAULT 0,
    "beamWeight" NUMERIC NOT NULL,
    status TEXT NOT NULL
);

-- 4. Downtime Logs Table
CREATE TABLE public.downtime_logs (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    category TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "loggedBy" TEXT NOT NULL,
    reason TEXT
);

-- 5. Consumption Logs Table
CREATE TABLE public.consumption_logs (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "beamId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "warpConsumed" NUMERIC NOT NULL,
    "weftConsumed" NUMERIC NOT NULL,
    "standardConsumption" NUMERIC NOT NULL,
    wastage NUMERIC NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL
);

-- 6. Documents Table (Docs Hub)
CREATE TABLE public.docs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);

-- 7. Plant Targets Table (Configuration)
CREATE TABLE public.plant_targets (
    id TEXT PRIMARY KEY DEFAULT 'global',
    "dailyProductionMeters" NUMERIC NOT NULL,
    "minimumEfficiencyPercent" NUMERIC NOT NULL,
    "maxWastagePercent" NUMERIC NOT NULL
);

-- Insert default plant targets
INSERT INTO public.plant_targets (id, "dailyProductionMeters", "minimumEfficiencyPercent", "maxWastagePercent") 
VALUES ('global', 25000, 85, 3.5)
ON CONFLICT (id) DO NOTHING;

-- Security Policies (Row Level Security)
-- For now, enabling anon read/write for rapid development. We can secure this later.
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downtime_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumption_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for anon" ON public.machines FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.production_orders FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.beams FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.downtime_logs FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.consumption_logs FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.docs FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON public.plant_targets FOR ALL USING (true);
