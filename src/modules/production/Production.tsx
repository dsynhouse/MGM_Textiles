import React, { useState } from 'react';
import { Plus, Package, Factory, Layers, Search, Edit2, X, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ProductionOrder, OrderStatus, Beam } from '../../types';

const ORDER_STATUS: Record<OrderStatus, { label: string; badge: string }> = {
  active:    { label: 'Active',    badge: 'badge--success' },
  pending:   { label: 'Pending',   badge: 'badge--warning' },
  completed: { label: 'Completed', badge: 'badge--info' },
  'on-hold': { label: 'On Hold',   badge: 'badge--neutral' },
  cancelled: { label: 'Cancelled', badge: 'badge--danger' },
};

function OrderModal({ order, onClose, onSave }: { order?: ProductionOrder | null; onClose: () => void; onSave: (o: any) => void }) {
  const [form, setForm] = useState({
    orderNumber: order?.orderNumber ?? `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    customerName: order?.customerName ?? '',
    articleCode: order?.articleCode ?? '',
    fabricType: order?.fabricType ?? 'Plain Weave',
    width: order?.width ?? 190,
    gsm: order?.gsm ?? 120,
    color: order?.color ?? '',
    quantityOrdered: order?.quantityOrdered ?? 0,
    status: order?.status ?? 'pending' as OrderStatus,
    startDate: order?.startDate ?? '',
    dueDate: order?.dueDate ?? '',
    notes: order?.notes ?? '',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--lg">
        <div className="modal__header">
          <h2 className="modal__title">{order ? 'Edit Order' : 'New Production Order'}</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Order Number</label>
              <input className="form-control" value={form.orderNumber} onChange={e => set('orderNumber', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input className="form-control" value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Customer name" />
            </div>
            <div className="form-group">
              <label className="form-label">Article Code</label>
              <input className="form-control" value={form.articleCode} onChange={e => set('articleCode', e.target.value)} placeholder="ART-100" />
            </div>
            <div className="form-group">
              <label className="form-label">Fabric Type</label>
              <select className="form-control" value={form.fabricType} onChange={e => set('fabricType', e.target.value)}>
                {['Plain Weave', 'Twill Weave', 'Satin Weave', 'Dobby Weave', 'Rib Weave', 'Oxford Weave'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Width (cm)</label>
              <input className="form-control" type="number" value={form.width} onChange={e => set('width', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">GSM</label>
              <input className="form-control" type="number" value={form.gsm} onChange={e => set('gsm', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <input className="form-control" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Natural White" />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity Ordered (meters)</label>
              <input className="form-control" type="number" value={form.quantityOrdered} onChange={e => set('quantityOrdered', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-control" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-control" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value as OrderStatus)}>
                {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave({ ...form, id: order?.id, quantityProduced: order?.quantityProduced ?? 0, assignedMachines: order?.assignedMachines ?? [], beamIds: order?.beamIds ?? [], createdAt: order?.createdAt ?? new Date().toISOString().split('T')[0] })}>
            {order ? 'Save Changes' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BeamCard({ beam }: { beam: Beam }) {
  const { machines, orders } = useAppStore();
  const machine = machines.find(m => m.id === beam.machineId);
  const order = orders.find(o => o.id === beam.orderId);
  const pct = Math.round((beam.actualMeters / beam.theoreticalMeters) * 100);
  const statusColors: Record<string, string> = {
    'in-progress': 'var(--color-amber-500)',
    completed: 'var(--color-emerald-500)',
    standby: 'var(--color-navy-400)',
    loaded: 'var(--color-blue-500)',
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="fw-semibold text-sm">{beam.beamNumber}</span>
        <span className="badge" style={{ background: statusColors[beam.status] + '22', color: statusColors[beam.status], border: `1px solid ${statusColors[beam.status]}44` }}>
          {beam.status.replace('-', ' ')}
        </span>
      </div>
      <div className="text-xs text-secondary mb-1">{beam.articleCode} · {beam.yarnType}</div>
      <div className="text-xs text-secondary mb-3">
        {beam.yarnCount} · {beam.warpEnds} ends · {beam.beamWeight}kg
      </div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-secondary">Progress</span>
        <span className="font-mono fw-semibold">{beam.actualMeters} / {beam.theoreticalMeters} m</span>
      </div>
      <div className="progress-bar mb-3">
        <div
          className={`progress-bar__fill ${pct >= 100 ? 'progress-bar__fill--success' : ''}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-secondary">
        <span>{machine ? machine.name : 'Unassigned'}</span>
        <span>{order ? order.orderNumber : '—'}</span>
      </div>
    </div>
  );
}

export function Production() {
  const { orders, beams, addOrder, updateOrder, targets } = useAppStore();
  const [tab, setTab] = useState<'orders' | 'beams'>('orders');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ProductionOrder | null>(null);

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.articleCode.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(data: any) {
    if (data.id) updateOrder(data.id, data);
    else addOrder({ ...data, id: `po${Date.now()}` });
    setShowModal(false); setEditing(null);
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Production Management</h2>
          <p className="section-subtitle">Orders, beam assignments, and production tracking</p>
        </div>
        {tab === 'orders' && (
          <button className="btn btn--primary" onClick={() => { setEditing(null); setShowModal(true); }}>
            <Plus size={16} /> New Order
          </button>
        )}
      </div>

      {/* Global Target */}
      <div className="card mb-6" style={{ borderLeft: '4px solid var(--color-blue-500)' }}>
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-xs text-secondary fw-semibold uppercase tracking-wider mb-1">Plant Target</div>
            <div className="fw-bold text-lg">Daily Production Goal</div>
          </div>
          <div className="text-right">
            <span className="fw-bold text-2xl font-mono text-blue-500">
              {beams.reduce((sum, b) => sum + b.actualMeters, 0).toLocaleString()}
            </span>
            <span className="text-secondary text-sm"> / {targets.dailyProductionMeters.toLocaleString()} m</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar__fill" 
            style={{ 
              width: `${Math.min(100, (beams.reduce((s, b) => s + b.actualMeters, 0) / targets.dailyProductionMeters) * 100)}%`,
              background: 'var(--color-blue-500)'
            }} 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ id: 'orders', label: 'Production Orders', icon: Package }, { id: 'beams', label: 'Beam Management', icon: Layers }].map(t => (
          <button
            key={t.id}
            className={`btn ${tab === t.id ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setTab(t.id as 'orders' | 'beams')}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <>
          {/* Order summary */}
          <div className="grid-4 mb-6">
            {Object.entries(ORDER_STATUS).map(([s, cfg]) => (
              <div key={s} className="card" style={{ padding: 'var(--space-4)' }}>
                <div className="fw-bold text-2xl font-mono">{orders.filter(o => o.status === s).length}</div>
                <div className="text-sm text-secondary">{cfg.label}</div>
              </div>
            ))}
          </div>

          <div className="search-box mb-4" style={{ maxWidth: 360 }}>
            <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." />
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order No.</th><th>Customer</th><th>Article / Type</th>
                  <th>Width</th><th>GSM</th><th>Progress</th>
                  <th>Due Date</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => {
                  const pct = o.quantityOrdered > 0 ? Math.round((o.quantityProduced / o.quantityOrdered) * 100) : 0;
                  const cfg = ORDER_STATUS[o.status];
                  const isOverdue = new Date(o.dueDate) < new Date() && o.status !== 'completed';
                  return (
                    <tr key={o.id}>
                      <td className="fw-semibold">{o.orderNumber}</td>
                      <td>{o.customerName}</td>
                      <td><span className="fw-medium">{o.articleCode}</span><br /><span className="text-xs text-secondary">{o.fabricType}</span></td>
                      <td className="font-mono text-sm">{o.width}cm</td>
                      <td className="font-mono text-sm">{o.gsm}</td>
                      <td style={{ minWidth: 160 }}>
                        <div className="flex items-center gap-2">
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className={`progress-bar__fill ${pct >= 100 ? 'progress-bar__fill--success' : ''}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-mono">{pct}%</span>
                        </div>
                        <div className="text-xs text-secondary">{o.quantityProduced.toLocaleString()} / {o.quantityOrdered.toLocaleString()} m</div>
                      </td>
                      <td className={`text-sm font-mono ${isOverdue ? 'text-danger' : 'text-secondary'}`}>{o.dueDate}</td>
                      <td><span className={`badge ${cfg.badge}`}>{cfg.label}</span></td>
                      <td>
                        <button className="btn btn--ghost btn--icon" onClick={() => { setEditing(o); setShowModal(true); }}>
                          <Edit2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'beams' && (
        <>
          <div className="grid-4 mb-6">
            {['in-progress', 'standby', 'loaded', 'completed'].map(s => (
              <div key={s} className="card" style={{ padding: 'var(--space-4)' }}>
                <div className="fw-bold text-2xl font-mono">{beams.filter(b => b.status === s).length}</div>
                <div className="text-sm text-secondary capitalize">{s.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
          <div className="grid-3">
            {beams.map(b => <BeamCard key={b.id} beam={b} />)}
          </div>
        </>
      )}

      {showModal && <OrderModal order={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
