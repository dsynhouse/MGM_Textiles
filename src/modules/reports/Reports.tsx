import React, { useState } from 'react';
import { FileText, Download, Printer, BarChart2, Users, Package, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { EFFICIENCY_TREND, PRODUCTION_TREND } from '../../data/mockData';

type ReportType = 'daily-production' | 'shift-efficiency' | 'consumption' | 'downtime' | 'attendance' | 'beam-usage';

const REPORT_TYPES: Array<{ id: ReportType; label: string; icon: React.ElementType; description: string }> = [
  { id: 'daily-production',  label: 'Daily Production Report',       icon: Factory2,  description: 'Output, meters produced, machine-wise breakdown' },
  { id: 'shift-efficiency',  label: 'Shift Efficiency Report',        icon: TrendingUp, description: 'Efficiency per shift, downtime, top/bottom performers' },
  { id: 'consumption',       label: 'Consumption vs. Standard',       icon: Package,   description: 'Yarn usage, wastage, variance by order and machine' },
  { id: 'downtime',          label: 'Machine Downtime Report',        icon: Clock,     description: 'Downtime by cause, machine, and category' },
  { id: 'attendance',        label: 'Attendance & Workforce',         icon: Users,     description: 'Daily attendance, overtime, leave records' },
  { id: 'beam-usage',        label: 'Beam Usage Report',             icon: BarChart2, description: 'Beam progress, efficiency, completion status' },
];

// Simple placeholder for factory icon
function Factory2({ size }: { size: number }) {
  return <BarChart2 size={size} />;
}

export function Reports() {
  const { machines, orders, employees, consumptionLogs, beams, downtimeEntries } = useAppStore();
  const [activeReport, setActiveReport] = useState<ReportType>('daily-production');
  const [dateRange, setDateRange] = useState({ from: '2026-06-01', to: '2026-06-09' });

  const handlePrint = () => window.print();

  function renderReport() {
    switch (activeReport) {
      case 'daily-production':
        return <DailyProductionReport machines={machines} orders={orders} />;
      case 'shift-efficiency':
        return <ShiftEfficiencyReport machines={machines} />;
      case 'consumption':
        return <ConsumptionReport logs={consumptionLogs} machines={machines} orders={orders} />;
      case 'downtime':
        return <DowntimeReport entries={downtimeEntries} machines={machines} />;
      case 'attendance':
        return <AttendanceReport employees={employees} />;
      case 'beam-usage':
        return <BeamUsageReport beams={beams} orders={orders} machines={machines} />;
    }
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Reports & Analytics</h2>
          <p className="section-subtitle">Auto-generated operational reports with export capabilities</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn--secondary" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
          <button className="btn btn--primary" onClick={() => alert('CSV export feature — connects to backend for full data export')}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Report type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {REPORT_TYPES.map(r => (
          <button
            key={r.id}
            className={`btn ${activeReport === r.id ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setActiveReport(r.id)}
          >
            <r.icon size={15} /> {r.label}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="card mb-6" style={{ padding: 'var(--space-4)' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm fw-medium flex items-center gap-2"><Calendar size={15} /> Date Range</span>
          <div className="flex items-center gap-2">
            <label className="form-label" style={{ margin: 0 }}>From</label>
            <input className="form-control" type="date" value={dateRange.from} onChange={e => setDateRange(d => ({ ...d, from: e.target.value }))} style={{ width: 'auto' }} />
          </div>
          <div className="flex items-center gap-2">
            <label className="form-label" style={{ margin: 0 }}>To</label>
            <input className="form-control" type="date" value={dateRange.to} onChange={e => setDateRange(d => ({ ...d, to: e.target.value }))} style={{ width: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className="report-content animate-fade-in">
        {renderReport()}
      </div>
    </div>
  );
}

function DailyProductionReport({ machines, orders }: { machines: any[]; orders: any[] }) {
  const machineData = machines.map(m => ({
    name: m.name,
    efficiency: m.efficiencyActual,
    target: m.efficiencyTarget,
    status: m.status,
  }));

  return (
    <div>
      <div className="grid-3 mb-6">
        {[
          { label: 'Total Machines', value: machines.length, sub: `${machines.filter(m => m.status === 'running').length} running` },
          { label: 'Orders Active', value: orders.filter(o => o.status === 'active').length, sub: `${orders.filter(o => o.status === 'completed').length} completed` },
          { label: 'Avg Efficiency', value: `${(machines.filter(m => m.efficiencyActual > 0).reduce((s, m) => s + m.efficiencyActual, 0) / Math.max(1, machines.filter(m => m.efficiencyActual > 0).length)).toFixed(1)}%`, sub: 'vs 85% target' },
        ].map(stat => (
          <div key={stat.label} className="card">
            <div className="fw-bold text-3xl font-mono mb-1">{stat.value}</div>
            <div className="fw-medium">{stat.label}</div>
            <div className="text-sm text-secondary">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <h3 className="fw-semibold mb-4">Machine Efficiency vs. Target</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={machineData.filter(m => m.efficiency > 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
            <Bar dataKey="efficiency" name="Efficiency %" fill="var(--color-amber-500)" radius={[4,4,0,0]} />
            <Bar dataKey="target" name="Target %" fill="var(--border-default)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="fw-semibold mb-4">Order Status Summary</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Fabric</th><th>Produced (m)</th><th>Target (m)</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(o => {
                const pct = o.quantityOrdered > 0 ? Math.round((o.quantityProduced / o.quantityOrdered) * 100) : 0;
                return (
                  <tr key={o.id}>
                    <td className="fw-semibold">{o.orderNumber}</td>
                    <td>{o.customerName}</td>
                    <td className="text-sm text-secondary">{o.fabricType}</td>
                    <td className="font-mono">{o.quantityProduced.toLocaleString()}</td>
                    <td className="font-mono">{o.quantityOrdered.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-bar__fill" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--color-emerald-500)' : 'var(--color-amber-500)' }} />
                        </div>
                        <span className="text-xs font-mono">{pct}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${o.status === 'active' ? 'badge--success' : o.status === 'completed' ? 'badge--info' : 'badge--warning'}`}>{o.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ShiftEfficiencyReport({ machines }: { machines: any[] }) {
  const shiftData = [
    { shift: 'Morning', avgEff: 87.3, machinesRunning: 5, downtime: 30 },
    { shift: 'Afternoon', avgEff: 84.1, machinesRunning: 4, downtime: 40 },
    { shift: 'Night', avgEff: 82.6, machinesRunning: 4, downtime: 60 },
  ];
  return (
    <div>
      <div className="card mb-6">
        <h3 className="fw-semibold mb-4">Efficiency by Shift</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={shiftData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="shift" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[75, 95]} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
            <Bar dataKey="avgEff" name="Avg Efficiency %" fill="var(--color-amber-500)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Shift</th><th>Avg Efficiency</th><th>Machines Running</th><th>Total Downtime</th></tr></thead>
          <tbody>
            {shiftData.map(s => (
              <tr key={s.shift}>
                <td className="fw-semibold">{s.shift}</td>
                <td className="font-mono" style={{ color: s.avgEff >= 85 ? 'var(--text-success)' : 'var(--text-warning)' }}>{s.avgEff}%</td>
                <td className="font-mono">{s.machinesRunning}</td>
                <td className="font-mono">{s.downtime} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConsumptionReport({ logs, machines, orders }: { logs: any[]; machines: any[]; orders: any[] }) {
  const totalWarp = logs.reduce((s, c) => s + c.warpConsumed, 0);
  const totalWeft = logs.reduce((s, c) => s + c.weftConsumed, 0);
  const totalWastage = logs.reduce((s, c) => s + c.wastage, 0);
  const getMachineName = (id: string) => machines.find(m => m.id === id)?.name ?? id;

  return (
    <div>
      <div className="grid-3 mb-6">
        <div className="card"><div className="fw-bold text-2xl font-mono mb-1">{totalWarp.toFixed(1)} kg</div><div className="text-secondary">Total Warp</div></div>
        <div className="card"><div className="fw-bold text-2xl font-mono mb-1">{totalWeft.toFixed(1)} kg</div><div className="text-secondary">Total Weft</div></div>
        <div className="card"><div className="fw-bold text-2xl font-mono mb-1 text-danger">{totalWastage.toFixed(1)} kg</div><div className="text-secondary">Total Wastage</div></div>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Date</th><th>Machine</th><th>Warp (kg)</th><th>Weft (kg)</th><th>Standard (kg)</th><th>Wastage (kg)</th><th>Variance</th></tr></thead>
          <tbody>
            {logs.map(c => {
              const total = c.warpConsumed + c.weftConsumed;
              const variance = total - c.standardConsumption;
              return (
                <tr key={c.id}>
                  <td className="font-mono text-sm">{c.date}</td>
                  <td>{getMachineName(c.machineId)}</td>
                  <td className="font-mono">{c.warpConsumed.toFixed(1)}</td>
                  <td className="font-mono">{c.weftConsumed.toFixed(1)}</td>
                  <td className="font-mono text-secondary">{c.standardConsumption.toFixed(1)}</td>
                  <td className="font-mono" style={{ color: c.wastage > 3 ? 'var(--text-danger)' : 'var(--text-secondary)' }}>{c.wastage.toFixed(1)}</td>
                  <td className="font-mono fw-semibold" style={{ color: variance > 5 ? 'var(--text-danger)' : variance < 0 ? 'var(--text-success)' : 'var(--text-secondary)' }}>
                    {variance > 0 ? '+' : ''}{variance.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DowntimeReport({ entries, machines }: { entries: any[]; machines: any[] }) {
  const totalMinutes = entries.reduce((s, d) => s + d.durationMinutes, 0);
  return (
    <div>
      <div className="grid-3 mb-6">
        <div className="card"><div className="fw-bold text-2xl font-mono mb-1">{entries.length}</div><div className="text-secondary">Total Incidents</div></div>
        <div className="card"><div className="fw-bold text-2xl font-mono mb-1 text-danger">{totalMinutes} min</div><div className="text-secondary">Total Downtime</div></div>
        <div className="card"><div className="fw-bold text-2xl font-mono mb-1">{(totalMinutes / 60).toFixed(1)} hr</div><div className="text-secondary">Hours Lost</div></div>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Date</th><th>Machine</th><th>Category</th><th>Duration</th><th>Cause</th><th>Resolved By</th></tr></thead>
          <tbody>
            {[...entries].sort((a, b) => b.durationMinutes - a.durationMinutes).map(d => (
              <tr key={d.id}>
                <td className="font-mono text-sm">{d.date}</td>
                <td className="fw-medium">{machines.find(m => m.id === d.machineId)?.name ?? d.machineId}</td>
                <td><span className="badge badge--neutral capitalize">{d.category}</span></td>
                <td className="font-mono fw-semibold" style={{ color: d.durationMinutes > 120 ? 'var(--text-danger)' : 'var(--text-primary)' }}>{d.durationMinutes} min</td>
                <td className="text-sm">{d.cause}</td>
                <td className="text-secondary">{d.resolvedBy || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceReport({ employees }: { employees: any[] }) {
  return (
    <div>
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Employees', value: employees.length, color: 'var(--text-primary)' },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: 'var(--text-success)' },
          { label: 'On Leave', value: employees.filter(e => e.status === 'on-leave').length, color: 'var(--text-warning)' },
          { label: 'Inactive', value: employees.filter(e => e.status === 'inactive').length, color: 'var(--text-danger)' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="fw-bold text-2xl font-mono mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-secondary">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Code</th><th>Name</th><th>Role</th><th>Department</th><th>Shift</th><th>Status</th></tr></thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id}>
                <td className="font-mono text-sm">{e.employeeCode}</td>
                <td className="fw-medium">{e.name}</td>
                <td className="capitalize text-secondary text-sm">{e.role}</td>
                <td className="text-sm">{e.department}</td>
                <td><span className="badge badge--neutral">{e.shift}</span></td>
                <td><span className={`badge ${e.status === 'active' ? 'badge--success' : e.status === 'on-leave' ? 'badge--warning' : 'badge--danger'}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BeamUsageReport({ beams, orders, machines }: { beams: any[]; orders: any[]; machines: any[] }) {
  return (
    <div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Beam No.</th><th>Article</th><th>Yarn Count</th><th>Warp Ends</th><th>Theoretical (m)</th><th>Actual (m)</th><th>Efficiency</th><th>Machine</th><th>Status</th></tr></thead>
          <tbody>
            {beams.map(b => {
              const eff = b.theoreticalMeters > 0 ? Math.round((b.actualMeters / b.theoreticalMeters) * 100) : 0;
              const machine = machines.find(m => m.id === b.machineId);
              return (
                <tr key={b.id}>
                  <td className="fw-semibold font-mono text-sm">{b.beamNumber}</td>
                  <td>{b.articleCode}</td>
                  <td className="font-mono text-sm">{b.yarnCount}</td>
                  <td className="font-mono">{b.warpEnds.toLocaleString()}</td>
                  <td className="font-mono">{b.theoreticalMeters.toLocaleString()}</td>
                  <td className="font-mono">{b.actualMeters.toLocaleString()}</td>
                  <td className="font-mono fw-semibold" style={{ color: eff >= 95 ? 'var(--text-success)' : eff > 0 ? 'var(--text-warning)' : 'var(--text-tertiary)' }}>
                    {eff > 0 ? `${eff}%` : '—'}
                  </td>
                  <td className="text-sm">{machine?.name ?? '—'}</td>
                  <td><span className={`badge ${b.status === 'completed' ? 'badge--success' : b.status === 'in-progress' ? 'badge--warning' : 'badge--neutral'}`}>{b.status.replace('-', ' ')}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
