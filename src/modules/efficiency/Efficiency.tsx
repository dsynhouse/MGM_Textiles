import React, { useState } from 'react';
import { TrendingUp, Gauge, Clock, Zap, Plus, X, AlertTriangle } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, Legend
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { EFFICIENCY_TREND } from '../../data/mockData';
import type { DowntimeEntry } from '../../types';

const DOWNTIME_CATEGORIES = ['breakdown', 'power', 'material', 'setup', 'planned', 'other'] as const;
const CATEGORY_COLORS: Record<string, string> = {
  breakdown: 'var(--color-rose-500)',
  power:     'var(--color-violet-500)',
  material:  'var(--color-amber-500)',
  setup:     'var(--color-emerald-500)',
  planned:   'var(--color-blue-500)',
  other:     'var(--color-navy-400)',
};

function DowntimeModal({ onClose, onSave }: { onClose: () => void; onSave: (d: Omit<DowntimeEntry, 'id'>) => void }) {
  const { machines } = useAppStore();
  const [form, setForm] = useState({
    machineId: machines[0]?.id ?? '',
    date: new Date().toISOString().split('T')[0],
    shiftId: 'sh1',
    startTime: '06:00',
    endTime: '07:00',
    cause: '',
    category: 'breakdown' as typeof DOWNTIME_CATEGORIES[number],
    resolvedBy: '',
    notes: '',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const duration = (() => {
    const [sh, sm] = form.startTime.split(':').map(Number);
    const [eh, em] = form.endTime.split(':').map(Number);
    return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
  })();

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Log Downtime</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Machine</label>
              <select className="form-control" value={form.machineId} onChange={e => set('machineId', e.target.value)}>
                {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-control" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-control" type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input className="form-control" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
            </div>
          </div>
          {duration > 0 && (
            <div className="text-sm text-secondary mb-4">
              Duration: <strong style={{ color: 'var(--text-accent)' }}>{duration} minutes</strong>
            </div>
          )}
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                {DOWNTIME_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Resolved By</label>
              <input className="form-control" value={form.resolvedBy} onChange={e => set('resolvedBy', e.target.value)} placeholder="Name / ID" />
            </div>
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Cause *</label>
            <input className="form-control" value={form.cause} onChange={e => set('cause', e.target.value)} placeholder="Describe the downtime cause" />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave({ ...form, durationMinutes: duration, shiftId: form.shiftId })}>Save Entry</button>
        </div>
      </div>
    </div>
  );
}

export function Efficiency() {
  const { machines, downtimeEntries, targets } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [downtimes, setDowntimes] = useState(downtimeEntries);

  // Per-machine efficiency data for radar
  const radarData = machines.filter(m => m.status === 'running').map(m => ({
    machine: m.name,
    efficiency: m.efficiencyActual,
    target: m.efficiencyTarget,
    utilization: Math.round((m.rpmActual / m.rpmTarget) * 100),
  }));

  // Downtime by category
  const downtimeByCat = DOWNTIME_CATEGORIES.map(cat => ({
    category: cat,
    minutes: downtimes.filter(d => d.category === cat).reduce((s, d) => s + d.durationMinutes, 0),
  })).filter(d => d.minutes > 0);

  // Machine efficiency sorted
  const machineEff = [...machines]
    .sort((a, b) => b.efficiencyActual - a.efficiencyActual)
    .filter(m => m.efficiencyActual > 0);

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Efficiency Engine</h2>
          <p className="section-subtitle">Performance metrics, downtime analysis, and efficiency formulas</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Log Downtime
        </button>
      </div>

      {/* Efficiency formula cards */}
      <div className="grid-4 mb-8">
        {[
          {
            label: 'Avg Loom Efficiency',
            formula: `Target: ${targets.minimumEfficiencyPercent}%`,
            value: `${(machines.filter(m => m.status === 'running').reduce((s, m) => s + m.efficiencyActual, 0) / Math.max(1, machines.filter(m => m.status === 'running').length)).toFixed(1)}%`,
            icon: Gauge,
            color: (machines.filter(m => m.status === 'running').reduce((s, m) => s + m.efficiencyActual, 0) / Math.max(1, machines.filter(m => m.status === 'running').length)) >= targets.minimumEfficiencyPercent ? 'var(--color-emerald-500)' : 'var(--color-amber-500)',
          },
          {
            label: 'Running Utilization',
            formula: '(Running Machines / Total) × 100',
            value: `${Math.round((machines.filter(m => m.status === 'running').length / machines.length) * 100)}%`,
            icon: TrendingUp,
            color: 'var(--color-emerald-500)',
          },
          {
            label: 'Downtime Today',
            formula: 'Sum of all downtime minutes',
            value: `${downtimes.filter(d => d.date === '2026-06-09').reduce((s, d) => s + d.durationMinutes, 0)} min`,
            icon: Clock,
            color: 'var(--color-rose-500)',
          },
          {
            label: 'Best Machine',
            formula: 'Highest actual efficiency',
            value: machineEff[0] ? `${machineEff[0].name} (${machineEff[0].efficiencyActual}%)` : 'N/A',
            icon: Zap,
            color: 'var(--color-blue-500)',
          },
        ].map(card => (
          <div key={card.label} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="kpi-card__icon" style={{ background: card.color + '22', color: card.color }}>
                <card.icon size={18} />
              </div>
              <span className="text-sm fw-medium">{card.label}</span>
            </div>
            <div className="fw-bold text-2xl font-mono mb-1" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs text-secondary font-mono">{card.formula}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2 mb-6">
        {/* Efficiency trend */}
        <div className="card">
          <h3 className="fw-semibold mb-4">7-Day Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={EFFICIENCY_TREND}>
              <defs>
                <linearGradient id="effGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-amber-500)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-amber-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[78, 95]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
              <Area type="monotone" dataKey="efficiency" name="Efficiency %" stroke="var(--color-amber-500)" strokeWidth={2} fill="url(#effGrad2)" />
              <Area type="monotone" dataKey="target" name="Target %" stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Downtime by category */}
        <div className="card">
          <h3 className="fw-semibold mb-4">Downtime by Category (minutes)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={downtimeByCat} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
              <Bar dataKey="minutes" name="Minutes" radius={[0,4,4,0]}>
                {downtimeByCat.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-machine efficiency ranking */}
      <div className="card mb-6">
        <h3 className="fw-semibold mb-4">Machine Efficiency Ranking</h3>
        <div className="flex flex-col gap-3">
          {machineEff.map((m, i) => {
            const pct = m.efficiencyActual;
            const isAbove = pct >= targets.minimumEfficiencyPercent;
            return (
              <div key={m.id} className="flex items-center gap-4">
                <span className="text-sm text-secondary fw-semibold" style={{ width: 24, textAlign: 'right' }}>#{i + 1}</span>
                <span className="text-sm fw-medium" style={{ minWidth: 80 }}>{m.name}</span>
                <div className="progress-bar flex-1">
                  <div
                    className={`progress-bar__fill ${isAbove ? 'progress-bar__fill--success' : ''}`}
                    style={{ width: `${(pct / 100) * 100}%`, background: isAbove ? 'var(--color-emerald-500)' : 'var(--color-amber-500)' }}
                  />
                </div>
                <span className="font-mono text-sm fw-bold" style={{ minWidth: 52, color: isAbove ? 'var(--text-success)' : 'var(--text-warning)' }}>
                  {pct}%
                </span>
                <span className="text-xs text-secondary">tgt: {targets.minimumEfficiencyPercent}%</span>
                {!isAbove && <AlertTriangle size={14} style={{ color: 'var(--color-amber-500)' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Downtime Log Table */}
      <div className="card">
        <h3 className="fw-semibold mb-4">Downtime Log</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Machine</th><th>Category</th>
                <th>Duration</th><th>Cause</th><th>Resolved By</th>
              </tr>
            </thead>
            <tbody>
              {[...downtimes].sort((a, b) => b.date.localeCompare(a.date)).map(d => {
                const machine = machines.find(m => m.id === d.machineId);
                return (
                  <tr key={d.id}>
                    <td className="font-mono text-sm">{d.date}</td>
                    <td className="fw-medium">{machine?.name ?? d.machineId}</td>
                    <td>
                      <span className="badge" style={{
                        background: CATEGORY_COLORS[d.category] + '22',
                        color: CATEGORY_COLORS[d.category],
                        border: `1px solid ${CATEGORY_COLORS[d.category]}44`
                      }}>
                        {d.category}
                      </span>
                    </td>
                    <td className="font-mono text-sm" style={{ color: d.durationMinutes > 120 ? 'var(--text-danger)' : 'var(--text-primary)' }}>
                      {d.durationMinutes} min
                    </td>
                    <td className="text-sm">{d.cause}</td>
                    <td className="text-sm text-secondary">{d.resolvedBy || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <DowntimeModal
          onClose={() => setShowModal(false)}
          onSave={(d) => { setDowntimes(prev => [...prev, { ...d, id: `dt${Date.now()}` }]); setShowModal(false); }}
        />
      )}
    </div>
  );
}
