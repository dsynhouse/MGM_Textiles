import React, { useState } from 'react';
import { Plus, Search, Edit2, AlertTriangle, Package, X, TrendingDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { InventoryItem } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  yarn:        'var(--color-amber-500)',
  dye:         'var(--color-violet-500)',
  chemical:    'var(--color-blue-500)',
  accessory:   'var(--color-emerald-500)',
  'spare-part':'var(--color-rose-500)',
};

function StockModal({ item, onClose, onSave }: { item?: InventoryItem | null; onClose: () => void; onSave: (i: any) => void }) {
  const [form, setForm] = useState({
    code: item?.code ?? '',
    name: item?.name ?? '',
    category: item?.category ?? 'yarn' as InventoryItem['category'],
    unit: item?.unit ?? 'kg',
    currentStock: item?.currentStock ?? 0,
    minimumStock: item?.minimumStock ?? 0,
    unitCost: item?.unitCost ?? 0,
    location: item?.location ?? '',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{item ? 'Edit Item' : 'Add Inventory Item'}</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Item Code</label>
              <input className="form-control" value={form.code} onChange={e => set('code', e.target.value)} placeholder="YRN-001" />
            </div>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="30s Ne Cotton Combed" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                {['yarn', 'dye', 'chemical', 'accessory', 'spare-part'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-control" value={form.unit} onChange={e => set('unit', e.target.value)}>
                {['kg', 'pcs', 'ltr', 'mtr', 'roll', 'box'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Stock</label>
              <input className="form-control" type="number" value={form.currentStock} onChange={e => set('currentStock', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Stock</label>
              <input className="form-control" type="number" value={form.minimumStock} onChange={e => set('minimumStock', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Cost (₹)</label>
              <input className="form-control" type="number" value={form.unitCost} onChange={e => set('unitCost', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Storage Location</label>
              <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Warehouse A, Bay 1" />
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave({ ...form, id: item?.id, lastUpdated: new Date().toISOString().split('T')[0], supplierId: null })}>
            {item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Inventory() {
  const { inventoryItems, addInventoryItem, updateInventoryItem } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);

  const lowStock = inventoryItems.filter(i => i.currentStock < i.minimumStock);

  const filtered = inventoryItems.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || i.category === filterCat;
    const matchLow = !showLowStock || i.currentStock < i.minimumStock;
    return matchSearch && matchCat && matchLow;
  });

  const totalValue = inventoryItems.reduce((s, i) => s + i.currentStock * i.unitCost, 0);

  function handleSave(data: any) {
    if (data.id) updateInventoryItem(data.id, data);
    else addInventoryItem({ ...data, id: `inv${Date.now()}` });
    setShowModal(false); setEditing(null);
  }

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Inventory</h2>
          <p className="section-subtitle">Stock management, minimum levels, and material tracking</p>
        </div>
        <button className="btn btn--primary" onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="dashboard__alert-banner mb-6">
          <AlertTriangle size={16} />
          <span>
            <strong>{lowStock.length} items</strong> below minimum stock level:&nbsp;
            {lowStock.map(i => i.name).join(', ')}
          </span>
        </div>
      )}

      {/* Summary */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Items', value: inventoryItems.length, color: 'var(--text-primary)' },
          { label: 'Low Stock Alerts', value: lowStock.length, color: 'var(--text-danger)' },
          { label: 'Total Stock Value', value: `₹${(totalValue / 100000).toFixed(2)}L`, color: 'var(--text-accent)' },
          { label: 'Categories', value: new Set(inventoryItems.map(i => i.category)).size, color: 'var(--text-success)' },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-card__value" style={{ color: s.color, fontSize: 'var(--text-2xl)' }}>{s.value}</div>
            <div className="kpi-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." />
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {['yarn', 'dye', 'chemical', 'accessory', 'spare-part'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>)}
        </select>
        <button
          className={`btn ${showLowStock ? 'btn--danger' : 'btn--secondary'}`}
          onClick={() => setShowLowStock(!showLowStock)}
        >
          <AlertTriangle size={15} /> Low Stock Only
        </button>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Code</th><th>Name</th><th>Category</th><th>Current Stock</th><th>Min Stock</th><th>Stock Level</th><th>Unit Cost</th><th>Total Value</th><th>Location</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(i => {
              const pct = i.minimumStock > 0 ? Math.min(100, Math.round((i.currentStock / (i.minimumStock * 3)) * 100)) : 100;
              const isLow = i.currentStock < i.minimumStock;
              const isCritical = i.currentStock < i.minimumStock * 0.5;
              return (
                <tr key={i.id}>
                  <td className="font-mono text-xs text-secondary">{i.code}</td>
                  <td className="fw-medium">{i.name}</td>
                  <td>
                    <span className="badge" style={{ background: CATEGORY_COLORS[i.category] + '22', color: CATEGORY_COLORS[i.category], border: `1px solid ${CATEGORY_COLORS[i.category]}44` }}>
                      {i.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="font-mono fw-bold" style={{ color: isCritical ? 'var(--text-danger)' : isLow ? 'var(--text-warning)' : 'var(--text-success)' }}>
                    {i.currentStock.toLocaleString()} {i.unit}
                    {isLow && <AlertTriangle size={12} style={{ marginLeft: 4, display: 'inline' }} />}
                  </td>
                  <td className="font-mono text-secondary text-sm">{i.minimumStock.toLocaleString()} {i.unit}</td>
                  <td style={{ minWidth: 100 }}>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{
                        width: `${pct}%`,
                        background: isCritical ? 'var(--color-rose-500)' : isLow ? 'var(--color-amber-500)' : 'var(--color-emerald-500)'
                      }} />
                    </div>
                  </td>
                  <td className="font-mono text-sm">₹{i.unitCost.toLocaleString()}</td>
                  <td className="font-mono text-sm">₹{(i.currentStock * i.unitCost).toLocaleString()}</td>
                  <td className="text-xs text-secondary">{i.location}</td>
                  <td>
                    <button className="btn btn--ghost btn--icon" onClick={() => { setEditing(i); setShowModal(true); }}><Edit2 size={15} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center p-8 text-secondary">No items found.</div>}
      </div>

      {showModal && <StockModal item={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
