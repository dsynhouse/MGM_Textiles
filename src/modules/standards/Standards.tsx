import React, { useState, useMemo } from 'react';
import { Calculator, Zap, Package, Scissors, DollarSign, Activity, FileCheck, Layers, DivideCircle, CheckCircle2 } from 'lucide-react';

// --- CALCULATORS ---

function OEECalculator() {
  const [plannedTime, setPlannedTime] = useState(480); // minutes
  const [downtime, setDowntime] = useState(60);
  const [actualOutput, setActualOutput] = useState(800);
  const [theoreticalMax, setTheoreticalMax] = useState(1000);
  const [totalMeters, setTotalMeters] = useState(800);
  const [goodMeters, setGoodMeters] = useState(760);

  const availability = Math.max(0, (plannedTime - downtime) / plannedTime) * 100;
  const performance = Math.min(100, Math.max(0, actualOutput / theoreticalMax) * 100);
  const quality = Math.min(100, Math.max(0, goodMeters / totalMeters) * 100);
  const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} style={{ color: 'var(--color-amber-500)' }} />
        <h3 className="fw-semibold text-lg">OEE Calculator</h3>
      </div>
      <p className="text-sm text-secondary mb-4">Overall Equipment Effectiveness = Availability × Performance × Quality</p>
      
      <div className="grid-3 gap-4 mb-4">
        <div className="form-group">
          <label className="form-label text-xs">Planned Time (min)</label>
          <input className="form-control" type="number" value={plannedTime} onChange={e => setPlannedTime(+e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label text-xs">Downtime (min)</label>
          <input className="form-control" type="number" value={downtime} onChange={e => setDowntime(+e.target.value)} />
        </div>
        <div className="form-group">
          <div className="text-sm text-secondary mt-6">A: {availability.toFixed(1)}%</div>
        </div>
        
        <div className="form-group">
          <label className="form-label text-xs">Actual Output (m)</label>
          <input className="form-control" type="number" value={actualOutput} onChange={e => setActualOutput(+e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label text-xs">Theoretical Max (m)</label>
          <input className="form-control" type="number" value={theoreticalMax} onChange={e => setTheoreticalMax(+e.target.value)} />
        </div>
        <div className="form-group">
          <div className="text-sm text-secondary mt-6">P: {performance.toFixed(1)}%</div>
        </div>

        <div className="form-group">
          <label className="form-label text-xs">Good Meters (m)</label>
          <input className="form-control" type="number" value={goodMeters} onChange={e => setGoodMeters(+e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label text-xs">Total Meters (m)</label>
          <input className="form-control" type="number" value={totalMeters} onChange={e => setTotalMeters(+e.target.value)} />
        </div>
        <div className="form-group">
          <div className="text-sm text-secondary mt-6">Q: {quality.toFixed(1)}%</div>
        </div>
      </div>
      <div className="divider" />
      <div className="flex items-center justify-between mt-4">
        <span className="fw-medium">OEE Score:</span>
        <span className="fw-bold text-2xl font-mono" style={{ color: oee >= 85 ? 'var(--color-emerald-500)' : oee >= 65 ? 'var(--color-amber-500)' : 'var(--color-rose-500)' }}>
          {oee.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function YarnCountConverter() {
  const [value, setValue] = useState<number>(30);
  const [fromType, setFromType] = useState<'Ne' | 'Nm' | 'Tex' | 'Denier'>('Ne');

  const ne = useMemo(() => {
    if (fromType === 'Ne') return value;
    if (fromType === 'Nm') return value / 1.6535;
    if (fromType === 'Tex') return 590.5 / value;
    if (fromType === 'Denier') return 5315 / value;
    return 0;
  }, [value, fromType]);

  const nm = ne * 1.6535;
  const tex = ne ? 590.5 / ne : 0;
  const denier = ne ? 5315 / ne : 0;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <DivideCircle size={20} style={{ color: 'var(--color-blue-500)' }} />
        <h3 className="fw-semibold text-lg">Yarn Count Converter</h3>
      </div>
      <div className="flex gap-2 mb-4">
        <input className="form-control" type="number" value={value} onChange={e => setValue(+e.target.value)} style={{ flex: 1 }} />
        <select className="form-control" value={fromType} onChange={e => setFromType(e.target.value as any)} style={{ width: '100px' }}>
          <option value="Ne">Ne</option>
          <option value="Nm">Nm</option>
          <option value="Tex">Tex</option>
          <option value="Denier">Denier</option>
        </select>
      </div>
      <div className="grid-2 gap-2 font-mono text-sm">
        <div className="p-2 rounded bg-elevated"><strong>Ne:</strong> {ne.toFixed(2)}</div>
        <div className="p-2 rounded bg-elevated"><strong>Nm:</strong> {nm.toFixed(2)}</div>
        <div className="p-2 rounded bg-elevated"><strong>Tex:</strong> {tex.toFixed(2)}</div>
        <div className="p-2 rounded bg-elevated"><strong>Denier:</strong> {denier.toFixed(2)}</div>
      </div>
    </div>
  );
}

function FabricDesigner() {
  const [epi, setEpi] = useState(110);
  const [ppi, setPpi] = useState(70);
  const [warpNe, setWarpNe] = useState(40);
  const [weftNe, setWeftNe] = useState(40);
  const [warpCrimp, setWarpCrimp] = useState(6);
  const [weftCrimp, setWeftCrimp] = useState(4);
  const [width, setWidth] = useState(63); // inches

  const gsm = ((epi * (1 + warpCrimp / 100) / warpNe) + (ppi * (1 + weftCrimp / 100) / weftNe)) * 23.7;
  const kw = epi / Math.sqrt(warpNe);
  const kf = ppi / Math.sqrt(weftNe);
  const totalCover = kw + kf - (kw * kf / 28);
  const linearMeterWeight = (gsm * (width * 2.54)) / 100;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={20} style={{ color: 'var(--color-emerald-500)' }} />
        <h3 className="fw-semibold text-lg">Fabric Designer (GSM)</h3>
      </div>
      <div className="grid-2 gap-4 mb-4">
        <div>
          <label className="form-label text-xs">EPI (Ends/inch)</label>
          <input className="form-control form-control--sm" type="number" value={epi} onChange={e => setEpi(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">PPI (Picks/inch)</label>
          <input className="form-control form-control--sm" type="number" value={ppi} onChange={e => setPpi(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Warp Ne</label>
          <input className="form-control form-control--sm" type="number" value={warpNe} onChange={e => setWarpNe(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Weft Ne</label>
          <input className="form-control form-control--sm" type="number" value={weftNe} onChange={e => setWeftNe(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Warp Crimp (%)</label>
          <input className="form-control form-control--sm" type="number" value={warpCrimp} onChange={e => setWarpCrimp(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Weft Crimp (%)</label>
          <input className="form-control form-control--sm" type="number" value={weftCrimp} onChange={e => setWeftCrimp(+e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="form-label text-xs">Reed Width (inches)</label>
          <input className="form-control form-control--sm" type="number" value={width} onChange={e => setWidth(+e.target.value)} />
        </div>
      </div>
      <div className="p-3 bg-elevated rounded flex justify-between items-center mt-2">
        <div>
          <div className="text-xs text-secondary">Calculated GSM</div>
          <div className="fw-bold text-xl">{gsm.toFixed(1)} g/m²</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-secondary">Cover Factor</div>
          <div className="fw-bold">{totalCover.toFixed(1)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-secondary">Weight/Meter</div>
          <div className="fw-bold">{linearMeterWeight.toFixed(1)} g</div>
        </div>
      </div>
    </div>
  );
}

function BeamCapacity() {
  const [weightKg, setWeightKg] = useState(450);
  const [warpNe, setWarpNe] = useState(30);
  const [ends, setEnds] = useState(6000);

  const meters = (weightKg * 1000 * 1693.6) / (warpNe * ends);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Package size={20} style={{ color: 'var(--color-violet-500)' }} />
        <h3 className="fw-semibold text-lg">Beam Capacity</h3>
      </div>
      <p className="text-sm text-secondary mb-4">Calculate warp length from net beam weight.</p>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm w-24 text-secondary">Net Wt (kg)</span>
          <input className="form-control form-control--sm" type="number" value={weightKg} onChange={e => setWeightKg(+e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm w-24 text-secondary">Warp Ne</span>
          <input className="form-control form-control--sm" type="number" value={warpNe} onChange={e => setWarpNe(+e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm w-24 text-secondary">Total Ends</span>
          <input className="form-control form-control--sm" type="number" value={ends} onChange={e => setEnds(+e.target.value)} />
        </div>
      </div>
      <div className="divider" />
      <div className="flex items-center justify-between mt-4">
        <span className="fw-medium">Est. Length:</span>
        <span className="fw-bold text-2xl font-mono text-accent">{meters.toLocaleString(undefined, {maximumFractionDigits: 0})} m</span>
      </div>
    </div>
  );
}

function ProductionPlanner() {
  const [orderMeters, setOrderMeters] = useState(50000);
  const [rpm, setRpm] = useState(550);
  const [ppi, setPpi] = useState(60);
  const [efficiency, setEfficiency] = useState(85);
  const [looms, setLooms] = useState(4);

  const mPerLoomDay = (rpm * 60 * 24 * (efficiency / 100)) / (ppi * 39.37);
  const totalDays = Math.ceil(orderMeters / (mPerLoomDay * looms));

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} style={{ color: 'var(--color-orange-500)' }} />
        <h3 className="fw-semibold text-lg">Production Planner</h3>
      </div>
      <div className="grid-2 gap-4 mb-4">
        <div>
          <label className="form-label text-xs">Order (m)</label>
          <input className="form-control form-control--sm" type="number" value={orderMeters} onChange={e => setOrderMeters(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Loom RPM</label>
          <input className="form-control form-control--sm" type="number" value={rpm} onChange={e => setRpm(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">PPI</label>
          <input className="form-control form-control--sm" type="number" value={ppi} onChange={e => setPpi(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Efficiency %</label>
          <input className="form-control form-control--sm" type="number" value={efficiency} onChange={e => setEfficiency(+e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="form-label text-xs">Looms Assigned</label>
          <input className="form-control form-control--sm" type="number" value={looms} onChange={e => setLooms(+e.target.value)} />
        </div>
      </div>
      <div className="p-3 bg-elevated rounded">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-secondary">Output per loom/day:</span>
          <span className="font-mono fw-semibold">{mPerLoomDay.toFixed(1)} m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-secondary">Time to complete:</span>
          <span className="font-mono fw-bold text-accent">{totalDays} days</span>
        </div>
      </div>
    </div>
  );
}

function FourPointInspector() {
  const [points1, setPoints1] = useState(2); // <= 3" (1 pt)
  const [points2, setPoints2] = useState(1); // 3-6" (2 pt)
  const [points3, setPoints3] = useState(0); // 6-9" (3 pt)
  const [points4, setPoints4] = useState(0); // > 9" (4 pt)
  const [lengthYards, setLengthYards] = useState(100);
  const [widthInches, setWidthInches] = useState(63);

  const totalPoints = (points1 * 1) + (points2 * 2) + (points3 * 3) + (points4 * 4);
  const score = (totalPoints * 3600) / (lengthYards * widthInches);
  const pass = score <= 40;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <FileCheck size={20} style={{ color: 'var(--color-emerald-500)' }} />
        <h3 className="fw-semibold text-lg">4-Point QC (ASTM D5430)</h3>
      </div>
      <div className="grid-2 gap-4 mb-4">
        <div>
          <label className="form-label text-xs">Defects &le; 3" (1pt)</label>
          <input className="form-control form-control--sm" type="number" value={points1} onChange={e => setPoints1(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Defects 3–6" (2pt)</label>
          <input className="form-control form-control--sm" type="number" value={points2} onChange={e => setPoints2(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Defects 6–9" (3pt)</label>
          <input className="form-control form-control--sm" type="number" value={points3} onChange={e => setPoints3(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Defects &gt; 9" (4pt)</label>
          <input className="form-control form-control--sm" type="number" value={points4} onChange={e => setPoints4(+e.target.value)} />
        </div>
        <div className="col-span-2 divider my-1" />
        <div>
          <label className="form-label text-xs">Roll Length (yards)</label>
          <input className="form-control form-control--sm" type="number" value={lengthYards} onChange={e => setLengthYards(+e.target.value)} />
        </div>
        <div>
          <label className="form-label text-xs">Width (inches)</label>
          <input className="form-control form-control--sm" type="number" value={widthInches} onChange={e => setWidthInches(+e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="text-xs text-secondary">Score / 100 sq.yd</div>
          <div className="fw-bold text-xl">{score.toFixed(1)} pts</div>
        </div>
        <span className="badge" style={{ fontSize: 14, padding: '4px 12px', background: pass ? 'var(--color-emerald-500)' : 'var(--color-rose-500)', color: '#fff', border: 'none' }}>
          {pass ? 'PASS (1st)' : 'REJECT'}
        </span>
      </div>
    </div>
  );
}

function CostCalculator() {
  const [warpG, setWarpG] = useState(150);
  const [weftG, setWeftG] = useState(120);
  const [warpPrice, setWarpPrice] = useState(300); // ₹/kg
  const [weftPrice, setWeftPrice] = useState(250); // ₹/kg
  const [processCost, setProcessCost] = useState(15); // ₹/m
  const [margin, setMargin] = useState(15); // %

  const rmCost = (warpG * warpPrice / 1000) + (weftG * weftPrice / 1000);
  const totalCost = rmCost + processCost;
  const sellPrice = totalCost * (1 + margin / 100);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={20} style={{ color: 'var(--color-emerald-500)' }} />
        <h3 className="fw-semibold text-lg">Cost Per Meter</h3>
      </div>
      <div className="grid-2 gap-4 mb-4">
        <div><label className="form-label text-xs">Warp (g/m)</label><input className="form-control form-control--sm" type="number" value={warpG} onChange={e => setWarpG(+e.target.value)} /></div>
        <div><label className="form-label text-xs">Warp Price (₹/kg)</label><input className="form-control form-control--sm" type="number" value={warpPrice} onChange={e => setWarpPrice(+e.target.value)} /></div>
        <div><label className="form-label text-xs">Weft (g/m)</label><input className="form-control form-control--sm" type="number" value={weftG} onChange={e => setWeftG(+e.target.value)} /></div>
        <div><label className="form-label text-xs">Weft Price (₹/kg)</label><input className="form-control form-control--sm" type="number" value={weftPrice} onChange={e => setWeftPrice(+e.target.value)} /></div>
        <div><label className="form-label text-xs">Process Cost (₹/m)</label><input className="form-control form-control--sm" type="number" value={processCost} onChange={e => setProcessCost(+e.target.value)} /></div>
        <div><label className="form-label text-xs">Margin %</label><input className="form-control form-control--sm" type="number" value={margin} onChange={e => setMargin(+e.target.value)} /></div>
      </div>
      <div className="p-3 bg-elevated rounded">
        <div className="flex justify-between text-sm mb-1"><span className="text-secondary">Yarn Cost:</span> <span>₹{rmCost.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm mb-2"><span className="text-secondary">Total Cost:</span> <span>₹{totalCost.toFixed(2)}</span></div>
        <div className="flex justify-between fw-bold text-lg text-emerald-500"><span>Sell Price:</span> <span>₹{sellPrice.toFixed(2)}</span></div>
      </div>
    </div>
  );
}

function ReedCalculator() {
  const [epi, setEpi] = useState(110);
  const [endsPerDent, setEndsPerDent] = useState(2);

  const reedInches = epi / endsPerDent;
  const reedStockport = reedInches * 2;
  const reedMetric = reedInches * 10 / 2.54;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Scissors size={20} style={{ color: 'var(--color-navy-400)' }} />
        <h3 className="fw-semibold text-lg">Reed Spec</h3>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1"><label className="form-label text-xs">Target EPI</label><input className="form-control" type="number" value={epi} onChange={e => setEpi(+e.target.value)} /></div>
        <div className="flex-1"><label className="form-label text-xs">Ends/Dent</label><input className="form-control" type="number" value={endsPerDent} onChange={e => setEndsPerDent(+e.target.value)} /></div>
      </div>
      <div className="grid-2 gap-2 font-mono text-sm">
        <div className="p-2 rounded bg-elevated text-center">
          <div className="text-xs text-secondary mb-1">Dents/Inch</div>
          <div className="fw-bold">{reedInches.toFixed(1)}</div>
        </div>
        <div className="p-2 rounded bg-elevated text-center">
          <div className="text-xs text-secondary mb-1">Stockport</div>
          <div className="fw-bold">{reedStockport.toFixed(0)}</div>
        </div>
        <div className="col-span-2 p-2 rounded bg-elevated text-center">
          <div className="text-xs text-secondary mb-1">Metric (Dents/10cm)</div>
          <div className="fw-bold text-lg text-accent">{reedMetric.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

export function StandardsEngine() {
  return (
    <div className="page-content" style={{ background: 'var(--bg-base)' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Standards Engine</h2>
          <p className="section-subtitle">Industry-standard formulas, calculators, and operational benchmarks.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
        <OEECalculator />
        <FabricDesigner />
        <ProductionPlanner />
        <FourPointInspector />
        <CostCalculator />
        <BeamCapacity />
        <YarnCountConverter />
        <ReedCalculator />
      </div>
    </div>
  );
}
