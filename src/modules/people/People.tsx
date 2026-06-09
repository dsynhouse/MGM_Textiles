import React, { useState } from 'react';
import { Plus, Search, Edit2, X, UserCheck, UserX, Clock, Calendar, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Employee, EmployeeRole, EmployeeStatus } from '../../types';

const ROLES: EmployeeRole[] = ['admin', 'supervisor', 'operator', 'helper', 'quality', 'maintenance', 'viewer'];
const ROLE_COLORS: Record<EmployeeRole, string> = {
  admin:       'var(--color-violet-500)',
  supervisor:  'var(--color-amber-500)',
  operator:    'var(--color-blue-500)',
  helper:      'var(--color-navy-400)',
  quality:     'var(--color-emerald-500)',
  maintenance: 'var(--color-orange-500)',
  viewer:      'var(--color-navy-300)',
};

function EmployeeModal({ emp, onClose, onSave }: { emp?: Employee | null; onClose: () => void; onSave: (e: any) => void }) {
  const [form, setForm] = useState({
    employeeCode: emp?.employeeCode ?? `MGM${String(Date.now()).slice(-3)}`,
    name: emp?.name ?? '',
    role: emp?.role ?? 'operator' as EmployeeRole,
    department: emp?.department ?? 'Weaving',
    shift: emp?.shift ?? 'Morning',
    phone: emp?.phone ?? '',
    joiningDate: emp?.joiningDate ?? new Date().toISOString().split('T')[0],
    status: emp?.status ?? 'active' as EmployeeStatus,
    salaryBase: emp?.salaryBase ?? 20000,
    skills: emp?.skills?.join(', ') ?? '',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--lg">
        <div className="modal__header">
          <h2 className="modal__title">{emp ? 'Edit Employee' : 'Add Employee'}</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Employee Code</label>
              <input className="form-control" value={form.employeeCode} onChange={e => set('employeeCode', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-control" value={form.role} onChange={e => set('role', e.target.value as EmployeeRole)}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-control" value={form.department} onChange={e => set('department', e.target.value)}>
                {['Weaving', 'Quality', 'Maintenance', 'Management', 'Admin', 'Finishing'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Shift</label>
              <select className="form-control" value={form.shift} onChange={e => set('shift', e.target.value)}>
                {['Morning', 'Afternoon', 'Night', 'General'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 00000" />
            </div>
            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <input className="form-control" type="date" value={form.joiningDate} onChange={e => set('joiningDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Base Salary (₹)</label>
              <input className="form-control" type="number" value={form.salaryBase} onChange={e => set('salaryBase', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value as EmployeeStatus)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input className="form-control" value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="Rapier Loom, Quality Check" />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => onSave({
            ...form,
            skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
            id: emp?.id,
            assignedMachineId: emp?.assignedMachineId ?? null
          })}>
            {emp ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function People() {
  const { employees, addEmployee, updateEmployee } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<EmployeeRole | 'all'>('all');
  const [filterShift, setFilterShift] = useState('all');
  const [tab, setTab] = useState<'employees' | 'attendance' | 'shifts'>('employees');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeCode.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || e.role === filterRole;
    const matchShift = filterShift === 'all' || e.shift === filterShift;
    return matchSearch && matchRole && matchShift;
  });

  function handleSave(data: any) {
    if (data.id) updateEmployee(data.id, data);
    else addEmployee({ ...data, id: `e${Date.now()}` });
    setShowModal(false); setEditing(null);
  }

  const shiftSummary = [
    { shift: 'Morning', count: employees.filter(e => e.shift === 'Morning' && e.status === 'active').length, time: '06:00 – 14:00' },
    { shift: 'Afternoon', count: employees.filter(e => e.shift === 'Afternoon' && e.status === 'active').length, time: '14:00 – 22:00' },
    { shift: 'Night', count: employees.filter(e => e.shift === 'Night' && e.status === 'active').length, time: '22:00 – 06:00' },
  ];

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">People Management</h2>
          <p className="section-subtitle">Employees, shifts, attendance, and workforce overview</p>
        </div>
        <button className="btn btn--primary" onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Employees', value: employees.length, color: 'var(--text-primary)' },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: 'var(--text-success)' },
          { label: 'On Leave', value: employees.filter(e => e.status === 'on-leave').length, color: 'var(--text-warning)' },
          { label: 'Departments', value: new Set(employees.map(e => e.department)).size, color: 'var(--text-accent)' },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-card__value" style={{ color: s.color, fontSize: 'var(--text-3xl)' }}>{s.value}</div>
            <div className="kpi-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'employees', label: 'Employees' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'shifts', label: 'Shift Roster' },
        ].map(t => (
          <button key={t.id} className={`btn ${tab === t.id ? 'btn--primary' : 'btn--secondary'}`} onClick={() => setTab(t.id as any)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'employees' && (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
              <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." />
            </div>
            <select className="form-control" style={{ width: 'auto' }} value={filterRole} onChange={e => setFilterRole(e.target.value as any)}>
              <option value="all">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
            <select className="form-control" style={{ width: 'auto' }} value={filterShift} onChange={e => setFilterShift(e.target.value)}>
              <option value="all">All Shifts</option>
              {['Morning', 'Afternoon', 'Night', 'General'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Code</th><th>Name</th><th>Role</th><th>Department</th><th>Shift</th><th>Phone</th><th>Joined</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td className="font-mono text-xs text-secondary">{e.employeeCode}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: ROLE_COLORS[e.role] + '33', color: ROLE_COLORS[e.role], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {e.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="fw-medium">{e.name}</span>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background: ROLE_COLORS[e.role] + '22', color: ROLE_COLORS[e.role], border: `1px solid ${ROLE_COLORS[e.role]}44` }}>{e.role}</span></td>
                    <td className="text-sm">{e.department}</td>
                    <td><span className="badge badge--neutral">{e.shift}</span></td>
                    <td className="text-sm text-secondary">{e.phone}</td>
                    <td className="font-mono text-xs text-secondary">{e.joiningDate}</td>
                    <td><span className={`badge ${e.status === 'active' ? 'badge--success' : e.status === 'on-leave' ? 'badge--warning' : 'badge--danger'}`}>{e.status.replace('-', ' ')}</span></td>
                    <td>
                      <button className="btn btn--ghost btn--icon" onClick={() => { setEditing(e); setShowModal(true); }}><Edit2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center p-8 text-secondary">No employees found.</div>}
          </div>
        </>
      )}

      {tab === 'attendance' && (
        <div>
          <div className="grid-3 mb-6">
            {[
              { label: 'Present Today', value: 7, color: 'var(--text-success)' },
              { label: 'Absent', value: 1, color: 'var(--text-danger)' },
              { label: 'Late Arrivals', value: 1, color: 'var(--text-warning)' },
            ].map(s => (
              <div key={s.label} className="kpi-card">
                <div className="kpi-card__value" style={{ color: s.color }}>{s.value}</div>
                <div className="kpi-card__label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Overtime</th></tr></thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.id}>
                    <td className="fw-medium">{e.name}</td>
                    <td className="font-mono text-sm">2026-06-09</td>
                    <td className="font-mono text-sm">{e.status === 'active' && e.shift === 'Morning' ? '06:00' : '—'}</td>
                    <td className="font-mono text-sm">{e.status === 'active' && e.shift === 'Morning' ? '14:00' : '—'}</td>
                    <td>
                      <span className={`badge ${e.status === 'active' ? 'badge--success' : e.status === 'on-leave' ? 'badge--warning' : 'badge--danger'}`}>
                        {e.status === 'active' ? 'Present' : e.status === 'on-leave' ? 'Leave' : 'Absent'}
                      </span>
                    </td>
                    <td className="font-mono text-sm text-secondary">0h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'shifts' && (
        <div className="grid-3">
          {shiftSummary.map(s => (
            <div key={s.shift} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="fw-semibold">{s.shift} Shift</h3>
                <span className="font-mono text-sm text-secondary">{s.time}</span>
              </div>
              <div className="fw-bold text-3xl font-mono mb-2" style={{ color: 'var(--text-accent)' }}>{s.count}</div>
              <div className="text-secondary text-sm mb-4">Active workers</div>
              <div className="divider" />
              <div className="flex flex-col gap-2 mt-4">
                {employees.filter(e => e.shift === s.shift && e.status === 'active').map(e => (
                  <div key={e.id} className="flex items-center gap-2">
                    <span className="status-dot status-dot--online" />
                    <span className="text-sm">{e.name}</span>
                    <span className="text-xs text-secondary ml-auto">{e.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <EmployeeModal emp={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
