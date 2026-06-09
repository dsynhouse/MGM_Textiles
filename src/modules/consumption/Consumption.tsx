import React, { useState } from 'react';
import { Plus, Search, Calendar, X, TrendingDown, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ConsumptionLog } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function ConsumptionModal({ onClose, onSave }: { onClose: () => void; onSave: (log: Omit<ConsumptionLog, 'id' | 'createdAt'>) => void }) {
  const { machines, orders, beams } = useAppStore();
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    machineId: machines[0]?.id ?? '',
    orderId: orders[0]?.id ?? '',
    beamId: beams[0]?.id ?? '',
    shiftId: 'sh1',
    warpConsumed: 0,
    weftConsumed: 0,
    standardConsumption: 0,
    wastage: 0,
    batchNumber: '',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const variance = form.warpConsumed + form.weftConsumed - form.standardConsumption;

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--lg">
        <div className="modal__header">
          <h2 className="modal__title">Log Consumption</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-control" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Shift</label>
              <select className="form-control" value={form.shiftId} onChange={e => set('shiftId', e.target.value)}>
                <option value="sh1">Morning (06:00–14:00)</option>
                <option value="sh2">Afternoon (14:00–22:00)</option>
                <option value="sh3">Night (22:00–06:00)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Machine</label>
              <select className="form-control" value={form.machineId} onChange={e => set('machineId', e.target.value)}>
                {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Production Order</label>
              <select className="form-control" value={form.orderId} onChange={e => set('orderId', e.target.value)}>
                {orders.map(o => <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Batch Number</label>
              <input className="form-control" value={form.batchNumber} onChange={e => set('batchNumber', e.target.value)} placeholder="BATCH-001" />
            </div>
          </div>
          <div className="divider" />
          <p className="text-sm fw-semibold mb-4" style={{ color: 'var(--text-accent)' }}>Yarn Consumption (kg)</p>
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Warp Consumed (kg)</label>
              <input className="form-control" type="number" step="0.1" value={form.warpConsumed} onChange={e => set('warpConsumed', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Weft Consumed (kg)</label>
              <input className="form-control" type="number" step="0.1" value={form.weftConsumed} onChange={e => set('weftConsumed', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Standard Consumption (kg)</label>
              <input className="form-control" type="number" step="0.1" value={form.standardConsumption} onChange={e => set('standardConsumption', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Wastage (kg)</label>
              <input className="form-control" type="number" step="0.1" value={form.wastage} onChange={e => set('wastage', +e.target.value)} />
            </div>
          </div>
          {form.standardConsumption > 0 && (
            <div className={`dashboard__alert-banner ${variance > 0 ? '' : ''}`} style={{
              background: variance > 5 ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
              borderColor: variance > 5 ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)',
              color: variance > 5 ? 'var(--color-rose-400)' : 'var(--color-emerald-400)',
            }}>
              <AlertTriangle size={16} />
              <span>
                Variance: <strong>{variance > 0 ? '+' : ''}{variance.toFixed(1)} kg</strong> vs standard ({form.standardConsumption} kg)
                {variance > 5 ? ' — Above threshold, review wastage' : ' — Within acceptable range'}
              </span>
            </div>
          )}
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave(form as any)}>Save Log</button>
        </div>
      </div>
    </div>
  );
}

export function Consumption() {
  const { consumptionLogs, machines, orders, addConsumptionLog, targets } = useAppStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const getMachineName = (id: string) => machines.find(m => m.id === id)?.name ?? id;
  const getOrderName = (id: string) => orders.find(o => o.id === id)?.orderNumber ?? id;

  const filtered = consumptionLogs.filter(c => {
    const matchDate = !dateFilter || c.date === dateFilter;
    const matchSearch = !search || getMachineName(c.machineId).toLowerCase().includes(search.toLowerCase()) || c.batchNumber.toLowerCase().includes(search.toLowerCase());
    return matchDate && matchSearch;
  });

  // Summary stats
  const totalWarp = filtered.reduce((s, c) => s + c.warpConsumed, 0);
  const totalWeft = filtered.reduce((s, c) => s + c.weftConsumed, 0);
  const totalWastage = filtered.reduce((s, c) => s + c.wastage, 0);
  const totalStd = filtered.reduce((s, c) => s + c.standardConsumption, 0);

  // Chart data by machine
  const machineConsumption = machines.map(m => ({
    name: m.name,
    warp: consumptionLogs.filter(c => c.machineId === m.id).reduce((s, c) => s + c.warpConsumed, 0),
    weft: consumptionLogs.filter(c => c.machineId === m.id).reduce((s, c) => s + c.weftConsumed, 0),
    wastage: consumptionLogs.filter(c => c.machineId === m.id).reduce((s, c) => s + c.wastage, 0),
  })).filter(m => m.warp > 0 || m.weft > 0);

  function handleSave(data: Omit<ConsumptionLog, 'id' | 'createdAt'>) {
    addConsumptionLog({ ...data, id: `cl${Date.now()}`, createdAt: new Date().toISOString() });
    setShowModal(false);
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Consumption Logging</h2>
          <p className="section-subtitle">Track yarn consumption, wastage, and variance by machine and shift</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Consumption
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Warp Used', value: totalWarp.toFixed(1), unit: 'kg', color: 'var(--color-amber-500)' },
          { label: 'Total Weft Used', value: totalWeft.toFixed(1), unit: 'kg', color: 'var(--color-blue-500)' },
          { label: 'Avg Wastage', value: totalStd > 0 ? ((totalWastage / totalStd) * 100).toFixed(1) : '0', unit: `% (Target < ${targets.maxWastagePercent}%)`, color: (totalStd > 0 && (totalWastage / totalStd) * 100 > targets.maxWastagePercent) ? 'var(--color-rose-500)' : 'var(--color-emerald-500)' },
          { label: 'Variance vs Std', value: (totalWarp + totalWeft - totalStd).toFixed(1), unit: 'kg', color: totalWarp + totalWeft > totalStd ? 'var(--color-rose-400)' : 'var(--color-emerald-400)' },
        ].map(stat => (
          <div key={stat.label} className="kpi-card">
            <div className="kpi-card__value" style={{ color: stat.color, fontSize: 'var(--text-2xl)' }}>
              {stat.value}<span style={{ fontSize: '0.6em', opacity: 0.7, marginLeft: 4 }}>{stat.unit}</span>
            </div>
            <div className="kpi-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <h3 className="fw-semibold mb-4">Consumption by Machine (kg)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={machineConsumption} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            <Bar dataKey="warp" name="Warp" fill="var(--color-amber-500)" radius={[3,3,0,0]} />
            <Bar dataKey="weft" name="Weft" fill="var(--color-blue-500)" radius={[3,3,0,0]} />
            <Bar dataKey="wastage" name="Wastage" fill="var(--color-rose-500)" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters + Table */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by machine or batch..." />
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input className="form-control" type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 'auto' }} />
          {dateFilter && <button className="btn btn--ghost btn--icon" onClick={() => setDateFilter('')}><X size={14} /></button>}
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th><th>Machine</th><th>Order</th><th>Shift</th>
              <th>Warp (kg)</th><th>Weft (kg)</th><th>Total (kg)</th>
              <th>Standard (kg)</th><th>Wastage (kg)</th><th>Variance</th><th>Batch</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const total = c.warpConsumed + c.weftConsumed;
              const variance = total - c.standardConsumption;
              const wastagePct = c.standardConsumption > 0 ? (c.wastage / c.standardConsumption) * 100 : 0;
              const isOverTarget = wastagePct > targets.maxWastagePercent;
              const shiftNames: Record<string, string> = { sh1: 'Morning', sh2: 'Afternoon', sh3: 'Night' };
              return (
                <tr key={c.id}>
                  <td className="font-mono text-sm">{c.date}</td>
                  <td className="fw-medium">{getMachineName(c.machineId)}</td>
                  <td className="text-sm">{getOrderName(c.orderId)}</td>
                  <td><span className="badge badge--neutral">{shiftNames[c.shiftId]}</span></td>
                  <td className="font-mono text-sm">{c.warpConsumed.toFixed(1)}</td>
                  <td className="font-mono text-sm">{c.weftConsumed.toFixed(1)}</td>
                  <td className="font-mono text-sm fw-semibold">{total.toFixed(1)}</td>
                  <td className="font-mono text-sm text-secondary">{c.standardConsumption.toFixed(1)}</td>
                  <td className="font-mono text-sm" style={{ color: isOverTarget ? 'var(--text-danger)' : 'var(--text-secondary)' }}>
                    {c.wastage.toFixed(1)} ({wastagePct.toFixed(1)}%)
                  </td>
                  <td className="font-mono text-sm fw-semibold" style={{ color: variance > 5 ? 'var(--text-danger)' : variance < -1 ? 'var(--text-success)' : 'var(--text-secondary)' }}>
                    {variance > 0 ? '+' : ''}{variance.toFixed(1)}
                  </td>
                  <td className="text-xs text-secondary">{c.batchNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center p-8 text-secondary">No logs found.</div>}
      </div>

      {showModal && <ConsumptionModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}
