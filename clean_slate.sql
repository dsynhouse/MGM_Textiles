-- 1. Wipe existing tables
DROP TABLE IF EXISTS public.consumption_logs;
DROP TABLE IF EXISTS public.downtime_logs;
DROP TABLE IF EXISTS public.beams;
DROP TABLE IF EXISTS public.production_orders;
DROP TABLE IF EXISTS public.machines;
DROP TABLE IF EXISTS public.docs;
DROP TABLE IF EXISTS public.plant_targets;

-- 2. Create correct tables with ALL columns
CREATE TABLE public.machines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    year INTEGER,
    hall TEXT,
    section TEXT,
    status TEXT NOT NULL,
    "reedCount" NUMERIC,
    "reedWidth" NUMERIC,
    "picksPerInch" NUMERIC,
    "currentOrderId" TEXT,
    "efficiencyActual" NUMERIC DEFAULT 0,
    "efficiencyTarget" NUMERIC DEFAULT 85,
    "rpmActual" INTEGER DEFAULT 0,
    "rpmTarget" INTEGER DEFAULT 600,
    "activePicks" INTEGER DEFAULT 0,
    "lastServiceDate" TEXT,
    "nextServiceDate" TEXT,
    "operatorId" TEXT,
    "currentBeamId" TEXT,
    notes TEXT,
    "createdAt" TEXT
);

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
    status TEXT NOT NULL,
    "articleCode" TEXT,
    "completedAt" TEXT
);

CREATE TABLE public.downtime_logs (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    category TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "loggedBy" TEXT NOT NULL,
    cause TEXT
);

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

CREATE TABLE public.plant_targets (
    id TEXT PRIMARY KEY DEFAULT 'global',
    "dailyProductionMeters" NUMERIC NOT NULL,
    "minimumEfficiencyPercent" NUMERIC NOT NULL,
    "maxWastagePercent" NUMERIC NOT NULL
);

-- 3. Set Security Policies
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

-- 4. Seed Minimal Data
INSERT INTO public.plant_targets (id, "dailyProductionMeters", "minimumEfficiencyPercent", "maxWastagePercent") 
VALUES ('global', 25000, 85, 3.5);

INSERT INTO public.machines (id, name, type, brand, model, year, hall, section, status, "efficiencyActual", "efficiencyTarget", "rpmActual", "rpmTarget", "activePicks", "createdAt")
VALUES ('m1', 'Loom 01', 'rapier', 'Picanol', 'OptiMax-i', 2022, 'Hall A', 'North', 'running', 92, 85, 580, 600, 1250000, '2026-01-10');

INSERT INTO public.production_orders (id, "orderNumber", "customerName", "articleCode", "fabricType", width, gsm, color, "quantityOrdered", "quantityProduced", status, "startDate", "dueDate", "createdAt")
VALUES ('po1', 'ORD-2026-001', 'Global Brands Ltd', 'ART-101', 'Plain Weave', 190, 140, 'Navy Blue', 50000, 12500, 'active', '2026-06-01', '2026-06-15', '2026-05-28');

INSERT INTO public.beams (id, "beamNumber", "orderId", "machineId", "yarnType", "yarnCount", "warpEnds", "theoreticalMeters", "actualMeters", "beamWeight", status, "articleCode")
VALUES ('b1', 'BM-2401', 'po1', 'm1', 'Cotton', '30s Ne', 5200, 4500, 1200, 450, 'in-progress', 'ART-101');
