import React, { useState } from 'react';
import { Plus, Search, Edit2, Wrench, AlertTriangle, CheckCircle, Pause, XCircle, Filter, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Machine, MachineStatus, MachineType } from '../../types';

const STATUS_CONFIG: Record<MachineStatus, { label: string; class: string; icon: React.ElementType }> = {
  running:     { label: 'Running',     class: 'badge--success', icon: CheckCircle },
  idle:        { label: 'Idle',        class: 'badge--neutral', icon: Pause },
  maintenance: { label: 'Maintenance', class: 'badge--warning', icon: Wrench },
  breakdown:   { label: 'Breakdown',   class: 'badge--danger',  icon: XCircle },
};

const MACHINE_TYPES: MachineType[] = ['rapier', 'airjet', 'projectile', 'waterjet', 'gripper', 'dobby'];

function MachineModal({ machine, onClose, onSave }: {
  machine?: Machine | null;
  onClose: () => void;
  onSave: (m: Omit<Machine, 'id' | 'createdAt'> & { id?: string }) => void;
}) {
  const { employees } = useAppStore();
  const [form, setForm] = useState({
    name: machine?.name ?? '',
    type: machine?.type ?? 'rapier' as MachineType,
    brand: machine?.brand ?? '',
    model: machine?.model ?? '',
    year: machine?.year ?? new Date().getFullYear(),
    hall: machine?.hall ?? 'Hall A',
    section: machine?.section ?? 'Section 1',
    status: machine?.status ?? 'idle' as MachineStatus,
    reedCount: machine?.reedCount ?? 120,
    reedWidth: machine?.reedWidth ?? 190,
    picksPerInch: machine?.picksPerInch ?? 60,
    rpmTarget: machine?.rpmTarget ?? 600,
    rpmActual: machine?.rpmActual ?? 0,
    efficiencyTarget: machine?.efficiencyTarget ?? 85,
    efficiencyActual: machine?.efficiencyActual ?? 0,
    lastServiceDate: machine?.lastServiceDate ?? '',
    nextServiceDate: machine?.nextServiceDate ?? '',
    operatorId: machine?.operatorId ?? null,
    currentBeamId: machine?.currentBeamId ?? null,
    notes: machine?.notes ?? '',
  });

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--lg">
        <div className="modal__header">
          <h2 className="modal__title">{machine ? 'Edit Machine' : 'Add New Machine'}</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Machine Name *</label>
              <input className="form-control" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Loom-01" />
            </div>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-control" value={form.type} onChange={e => update('type', e.target.value)}>
                {MACHINE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input className="form-control" value={form.brand} onChange={e => update('brand', e.target.value)} placeholder="Picanol" />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input className="form-control" value={form.model} onChange={e => update('model', e.target.value)} placeholder="GTX-L" />
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-control" type="number" value={form.year} onChange={e => update('year', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => update('status', e.target.value)}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hall</label>
              <select className="form-control" value={form.hall} onChange={e => update('hall', e.target.value)}>
                <option>Hall A</option><option>Hall B</option><option>Hall C</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <select className="form-control" value={form.section} onChange={e => update('section', e.target.value)}>
                <option>Section 1</option><option>Section 2</option><option>Section 3</option>
              </select>
            </div>
          </div>

          <div className="divider" />
          <p className="text-sm fw-semibold mb-4" style={{ color: 'var(--text-accent)' }}>Reed & Weaving Specifications</p>
          <div className="grid-3 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Reed Count (dents/10cm)</label>
              <input className="form-control" type="number" value={form.reedCount} onChange={e => update('reedCount', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Reed Width (cm)</label>
              <input className="form-control" type="number" value={form.reedWidth} onChange={e => update('reedWidth', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Picks Per Inch (PPI)</label>
              <input className="form-control" type="number" value={form.picksPerInch} onChange={e => update('picksPerInch', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Target RPM</label>
              <input className="form-control" type="number" value={form.rpmTarget} onChange={e => update('rpmTarget', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Efficiency Target (%)</label>
              <input className="form-control" type="number" value={form.efficiencyTarget} onChange={e => update('efficiencyTarget', +e.target.value)} />
            </div>
          </div>

          <div className="divider" />
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Last Service Date</label>
              <input className="form-control" type="date" value={form.lastServiceDate} onChange={e => update('lastServiceDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Next Service Date</label>
              <input className="form-control" type="date" value={form.nextServiceDate} onChange={e => update('nextServiceDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave({ ...form, id: machine?.id })}>
            {machine ? 'Save Changes' : 'Add Machine'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MachineRegistry() {
  const { machines, addMachine, updateMachine } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MachineStatus | 'all'>('all');
  const [filterHall, setFilterHall] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);

  const halls = ['all', ...Array.from(new Set(machines.map(m => m.hall)))];

  const filtered = machines.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase()) ||
      m.type.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchHall = filterHall === 'all' || m.hall === filterHall;
    return matchSearch && matchStatus && matchHall;
  });

  function handleSave(data: Omit<Machine, 'id' | 'createdAt'> & { id?: string }) {
    if (data.id) {
      updateMachine(data.id, data);
    } else {
      addMachine({ ...data, id: `m${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] } as Machine);
    }
    setShowModal(false);
    setEditing(null);
  }

  const statusCounts = {
    running: machines.filter(m => m.status === 'running').length,
    idle: machines.filter(m => m.status === 'idle').length,
    maintenance: machines.filter(m => m.status === 'maintenance').length,
    breakdown: machines.filter(m => m.status === 'breakdown').length,
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Machine Registry</h2>
          <p className="section-subtitle">Manage all looms, reed specs, and maintenance schedules</p>
        </div>
        <button className="btn btn--primary" onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus size={16} /> Add Machine
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status as MachineStatus];
          const Icon = cfg.icon;
          const colors: Record<string, string> = { running: 'var(--color-emerald-500)', idle: 'var(--color-navy-400)', maintenance: 'var(--color-amber-500)', breakdown: 'var(--color-rose-500)' };
          return (
            <div key={status} className="kpi-card" onClick={() => setFilterStatus(filterStatus === status as MachineStatus ? 'all' : status as MachineStatus)} style={{ cursor: 'pointer' }}>
              <div className="kpi-card__icon" style={{ background: colors[status] + '22', color: colors[status] }}>
                <Icon size={18} />
              </div>
              <div className="kpi-card__value" style={{ color: colors[status] }}>{count}</div>
              <div className="kpi-card__label">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search machines..." />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value as MachineStatus | 'all')}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="form-control" style={{ width: 'auto' }} value={filterHall} onChange={e => setFilterHall(e.target.value)}>
          {halls.map(h => <option key={h} value={h}>{h === 'all' ? 'All Halls' : h}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Machine</th>
              <th>Type / Brand</th>
              <th>Location</th>
              <th>Reed Spec</th>
              <th>PPI</th>
              <th>RPM Act/Tgt</th>
              <th>Efficiency</th>
              <th>Status</th>
              <th>Next Service</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const cfg = STATUS_CONFIG[m.status];
              const effColor = m.efficiencyActual >= m.efficiencyTarget ? 'var(--text-success)' : m.efficiencyActual > 0 ? 'var(--text-warning)' : 'var(--text-tertiary)';
              return (
                <tr key={m.id}>
                  <td>
                    <span className="fw-semibold">{m.name}</span>
                    <br /><span className="text-xs text-secondary">{m.brand} {m.model}</span>
                  </td>
                  <td className="uppercase text-xs">{m.type}</td>
                  <td className="text-sm">{m.hall} · {m.section}</td>
                  <td className="font-mono text-sm">{m.reedCount} · {m.reedWidth}cm</td>
                  <td className="font-mono text-sm">{m.picksPerInch}</td>
                  <td className="font-mono text-sm">{m.rpmActual} / {m.rpmTarget}</td>
                  <td>
                    <span style={{ color: effColor, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                      {m.efficiencyActual > 0 ? `${m.efficiencyActual}%` : '—'}
                    </span>
                    <span className="text-xs text-secondary"> / {m.efficiencyTarget}%</span>
                  </td>
                  <td><span className={`badge ${cfg.class}`}>{cfg.label}</span></td>
                  <td className="text-xs text-secondary font-mono">{m.nextServiceDate}</td>
                  <td>
                    <button className="btn btn--ghost btn--icon" onClick={() => { setEditing(m); setShowModal(true); }}>
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center p-8 text-secondary">No machines found matching your filters.</div>
        )}
      </div>

      {showModal && (
        <MachineModal
          machine={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
